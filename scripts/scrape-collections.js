const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const COLLECTIONS_URL = 'https://whiskyandwhiskey.com/collections/whiskey';
const DELAY = 1000; // 1 second delay between requests

async function scrapeCollectionsPage(page = 1) {
  try {
    const url = page === 1 ? COLLECTIONS_URL : `${COLLECTIONS_URL}?page=${page}`;
    console.log(`Scraping page ${page}: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Find product cards - adjust selector based on actual HTML structure
    $('.product-card, .product-item, [class*="product"]').each((index, element) => {
      try {
        const $el = $(element);
        
        // Extract product name
        const name = $el.find('a[href*="/products/"]').first().text().trim() ||
                     $el.find('.product-title, .product-name, h2, h3').first().text().trim();
        
        if (!name) return;

        // Extract product link
        const link = $el.find('a[href*="/products/"]').first().attr('href');
        const fullLink = link ? (link.startsWith('http') ? link : `https://whiskyandwhiskey.com${link}`) : null;

        // Extract brand
        const brand = $el.find('.product-brand, .vendor, [class*="brand"]').first().text().trim() ||
                      name.split(' ')[0]; // Fallback to first word

        // Extract price
        const priceText = $el.find('.price, .product-price, [class*="price"]').first().text().trim();
        const priceMatch = priceText.match(/\$[\d,]+\.?\d*/);
        const price = priceMatch ? priceMatch[0] : priceText;

        // Extract regular price (for discounts)
        const regularPriceText = $el.find('.regular-price, .compare-at-price, [class*="regular"]').first().text().trim();
        const regularPriceMatch = regularPriceText.match(/\$[\d,]+\.?\d*/);
        const regularPrice = regularPriceMatch ? regularPriceMatch[0] : null;

        // Extract image - try multiple methods
        let imageUrl = $el.find('img').first().attr('src') || 
                       $el.find('img').first().attr('data-src') ||
                       $el.find('img').first().attr('data-original');
        
        // If no image found in the element, try to get it from link attribute or other sources
        if (!imageUrl && link) {
          // For collections page, images are often lazy-loaded
          imageUrl = $el.find('[class*="image"] img, [class*="photo"] img').first().attr('src') ||
                     $el.find('[class*="image"] img, [class*="photo"] img').first().attr('data-src');
        }
        
        let fullImageUrl = null;
        if (imageUrl) {
          // Clean up the URL
          imageUrl = imageUrl.trim();
          if (imageUrl.startsWith('//')) {
            fullImageUrl = 'https:' + imageUrl;
          } else if (imageUrl.startsWith('http')) {
            fullImageUrl = imageUrl;
          } else if (imageUrl.startsWith('/')) {
            fullImageUrl = 'https://whiskyandwhiskey.com' + imageUrl;
          } else {
            fullImageUrl = 'https://whiskyandwhiskey.com/' + imageUrl;
          }
          // Remove any size parameters and get full resolution
          fullImageUrl = fullImageUrl.replace(/width=\d+/, 'width=2048').replace(/&width=\d+/, '');
        }

        // Extract product type from category/breadcrumb
        const productType = $el.find('[class*="type"], [class*="category"]').first().text().trim() ||
                           extractProductTypeFromName(name);

        // Generate ID from name
        const id = `whiskey-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}-${index}`;

        if (name && price) {
          products.push({
            id,
            name,
            brand: brand || 'Unknown',
            price,
            regularPrice,
            imageUrl: fullImageUrl,
            link: fullLink,
            productType: productType || 'Whiskey',
            inStock: true,
          });
        }
      } catch (error) {
        console.error(`Error parsing product ${index}:`, error.message);
      }
    });

    // Alternative: Try to find products in JSON-LD or data attributes
    if (products.length === 0) {
      // Look for JSON-LD structured data
      $('script[type="application/ld+json"]').each((index, element) => {
        try {
          const json = JSON.parse($(element).html());
          if (json['@type'] === 'ItemList' && json.itemListElement) {
            json.itemListElement.forEach(item => {
              if (item.item && item.item.name) {
                products.push({
                  id: `whiskey-${item.item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}-${index}`,
                  name: item.item.name,
                  brand: item.item.brand?.name || 'Unknown',
                  price: item.item.offers?.price ? `$${item.item.offers.price}` : 'N/A',
                  regularPrice: null,
                  imageUrl: item.item.image,
                  link: item.item.url,
                  productType: 'Whiskey',
                  inStock: true,
                });
              }
            });
          }
        } catch (e) {
          // Not valid JSON, skip
        }
      });
    }

    console.log(`Found ${products.length} products on page ${page}`);
    return products;
  } catch (error) {
    console.error(`Error scraping page ${page}:`, error.message);
    return [];
  }
}

function extractProductTypeFromName(name) {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('bourbon')) return 'Bourbon';
  if (nameLower.includes('scotch') || nameLower.includes('scotch whisky')) return 'Scotch';
  if (nameLower.includes('irish')) return 'Irish Whiskey';
  if (nameLower.includes('canadian')) return 'Canadian Whiskey';
  if (nameLower.includes('rye')) return 'Rye';
  if (nameLower.includes('japanese') || nameLower.includes('yamazaki') || nameLower.includes('hibiki')) return 'Japanese/Foreign';
  if (nameLower.includes('american')) return 'American Whiskey';
  return 'Whiskey';
}

async function scrapeAllPages(maxPages = 10) {
  const allProducts = [];
  
  for (let page = 1; page <= maxPages; page++) {
    const products = await scrapeCollectionsPage(page);
    if (products.length === 0) break; // No more products
    allProducts.push(...products);
    
    if (page < maxPages) {
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  }

  return allProducts;
}

async function mergeWithExisting() {
  const existingPath = path.join(__dirname, '../data/whiskey-products-enhanced.json');
  let existingProducts = [];
  
  if (fs.existsSync(existingPath)) {
    existingProducts = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  }

  console.log(`\nExisting products: ${existingProducts.length}`);
  
  // Scrape new products
  console.log('Scraping collections page...');
  const newProducts = await scrapeAllPages(5); // Scrape first 5 pages
  console.log(`Scraped ${newProducts.length} new products`);

  // Merge products, avoiding duplicates by name
  const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase()));
  const uniqueNewProducts = newProducts.filter(p => !existingNames.has(p.name.toLowerCase()));

  const mergedProducts = [...existingProducts, ...uniqueNewProducts];
  
  // Update product types for existing products that don't have it
  mergedProducts.forEach(product => {
    if (!product.productType) {
      product.productType = extractProductTypeFromName(product.name);
    }
    if (product.inStock === undefined) {
      product.inStock = true;
    }
  });

  // Save merged products
  fs.writeFileSync(existingPath, JSON.stringify(mergedProducts, null, 2));
  console.log(`\nTotal products: ${mergedProducts.length}`);
  console.log(`Added ${uniqueNewProducts.length} new products`);
}

mergeWithExisting().catch(console.error);

