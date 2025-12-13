const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapeProductPrice(productUrl) {
  try {
    const response = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Look for price elements
    const salePrice = $('[class*="sale-price"], [class*="price--sale"], sale-price').first().text().trim();
    const regularPrice = $('[class*="regular-price"], [class*="price--regular"], regular-price').first().text().trim();
    const price = $('[class*="price"], price-list').first().text().trim();
    
    // Extract prices
    let finalPrice = '';
    let finalRegularPrice = null;
    
    if (salePrice) {
      finalPrice = salePrice.replace(/Sale price/i, '').trim();
      if (regularPrice) {
        finalRegularPrice = regularPrice.replace(/Regular price/i, '').trim();
      }
    } else if (price) {
      // Try to extract from price text
      const priceMatch = price.match(/\$[\d,]+\.?\d*/);
      if (priceMatch) {
        finalPrice = priceMatch[0];
      }
    }
    
    return { price: finalPrice, regularPrice: finalRegularPrice };
  } catch (error) {
    console.error(`Error scraping ${productUrl}:`, error.message);
    return null;
  }
}

async function fixAllPrices() {
  const productsPath = path.join(__dirname, '../data/whiskey-products-enhanced.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  const fixedProducts = [];
  
  // Known prices from the original website
  const knownPrices = {
    "10th Mountain Bourbon Whiskey": { price: "$49.99", regularPrice: "$69.99" },
    "Blanton's Single Barrel Bourbon Whiskey": { price: "$149.99", regularPrice: "$169.99" },
    "Four Roses Single Barrel Bourbon Whiskey": { price: "$54.99", regularPrice: "$59.99" },
    "Four Roses Small Batch Select Bourbon Whiskey": { price: "$64.99", regularPrice: "$69.99" },
    "Four Roses Small Batch Bourbon Whiskey": { price: "$39.99", regularPrice: "$44.99" },
    "Rowan's Creek Kentucky Straight Bourbon Whiskey": { price: "$49.99", regularPrice: "$59.99" },
  };
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    // If price is "Save $X.XX", try to fix it
    if (product.price.includes('Save $')) {
      const knownPrice = knownPrices[product.name];
      if (knownPrice) {
        fixedProducts.push({
          ...product,
          price: knownPrice.price,
          regularPrice: knownPrice.regularPrice,
        });
        console.log(`[${i + 1}/${products.length}] Fixed ${product.name}: ${knownPrice.price}`);
        continue;
      }
      
      // Try to scrape from product page
      if (product.link) {
        console.log(`[${i + 1}/${products.length}] Scraping price for ${product.name}...`);
        const priceData = await scrapeProductPrice(product.link);
        if (priceData && priceData.price) {
          fixedProducts.push({
            ...product,
            price: priceData.price,
            regularPrice: priceData.regularPrice,
          });
          console.log(`  ✓ Got price: ${priceData.price}`);
        } else {
          fixedProducts.push(product);
          console.log(`  ✗ Could not get price`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        fixedProducts.push(product);
      }
    } else {
      fixedProducts.push(product);
    }
  }
  
  // Save fixed products
  fs.writeFileSync(productsPath, JSON.stringify(fixedProducts, null, 2));
  console.log(`\nFixed prices saved to ${productsPath}`);
}

fixAllPrices().catch(console.error);

