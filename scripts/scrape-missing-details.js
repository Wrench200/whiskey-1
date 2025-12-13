const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const DELAY = 2000; // 2 second delay between requests

async function scrapeProductDetails(productUrl) {
  try {
    console.log(`  Fetching product details from ${productUrl}...`);
    
    const response = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    
    const details = {
      description: '',
      highlights: '',
      tastingNotes: '',
      abv: '',
      volume: '',
      distillery: '',
    };

    // Extract all text content
    const bodyText = $('body').text();
    
    // Try to find sections by headings
    $('h1, h2, h3, h4').each((i, el) => {
      const heading = $(el).text().trim();
      const nextText = $(el).nextUntil('h1, h2, h3, h4').text().trim();
      
      if (heading.toLowerCase().includes('introduction') || heading.toLowerCase().includes('about')) {
        if (!details.description && nextText) {
          details.description = nextText.replace(/\s+/g, ' ').substring(0, 500);
        }
      }
      
      if (heading.toLowerCase().includes('highlights') || heading.toLowerCase().includes('feature')) {
        if (!details.highlights && nextText) {
          details.highlights = nextText.replace(/\s+/g, ' ').substring(0, 500);
        }
      }
      
      if (heading.toLowerCase().includes('tasting') || heading.toLowerCase().includes('flavor')) {
        if (!details.tastingNotes && nextText) {
          details.tastingNotes = nextText.replace(/\s+/g, ' ').substring(0, 500);
        }
      }
    });

    // Try to extract from product description sections
    $('[class*="description"], [class*="product-description"], [class*="product__description"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text && !details.description) {
        details.description = text.replace(/\s+/g, ' ').substring(0, 500);
      }
    });

    // Try to extract from product details/tabs
    $('[class*="tab"], [class*="accordion"], [class*="collapsible"]').each((i, el) => {
      const heading = $(el).find('h1, h2, h3, h4, [class*="title"], [class*="heading"]').first().text().trim().toLowerCase();
      const content = $(el).text().trim();
      
      if (heading.includes('description') || heading.includes('about')) {
        if (!details.description && content) {
          details.description = content.replace(/\s+/g, ' ').substring(0, 500);
        }
      }
      
      if (heading.includes('highlights') || heading.includes('feature')) {
        if (!details.highlights && content) {
          details.highlights = content.replace(/\s+/g, ' ').substring(0, 500);
        }
      }
      
      if (heading.includes('tasting') || heading.includes('flavor') || heading.includes('notes')) {
        if (!details.tastingNotes && content) {
          details.tastingNotes = content.replace(/\s+/g, ' ').substring(0, 500);
        }
      }
    });

    // Extract ABV, Volume, and Distillery from product info
    const productInfo = $('[class*="product-info"], [class*="product-meta"], [class*="product__meta"]').text();
    
    // Extract ABV
    const abvMatch = bodyText.match(/(\d+(?:\.\d+)?)\s*%?\s*ABV/i) || 
                     bodyText.match(/ABV[:\s]*(\d+(?:\.\d+)?)\s*%/i) ||
                     bodyText.match(/(\d+(?:\.\d+)?)\s*%?\s*alcohol/i);
    if (abvMatch) {
      details.abv = abvMatch[1] + '%';
    }

    // Extract Volume
    const volumeMatch = bodyText.match(/(\d+(?:\.\d+)?)\s*(ml|ML|L|l)/i) ||
                       bodyText.match(/(\d+)\s*(oz|fl\s*oz)/i);
    if (volumeMatch) {
      details.volume = volumeMatch[1] + volumeMatch[2].toUpperCase();
    }

    // Extract Distillery - look for common patterns
    const distilleryPatterns = [
      /distilled?\s+by\s+([A-Z][A-Za-z\s&.]+)/i,
      /from\s+([A-Z][A-Za-z\s&.]+)\s+distillery/i,
      /produced?\s+by\s+([A-Z][A-Za-z\s&.]+)/i,
      /distillery[:\s]+([A-Z][A-Za-z\s&.]+)/i,
    ];
    
    for (const pattern of distilleryPatterns) {
      const match = bodyText.match(pattern);
      if (match && match[1]) {
        details.distillery = match[1].trim().substring(0, 100);
        break;
      }
    }

    // If still no description, try to get from meta description or first paragraph
    if (!details.description) {
      const metaDesc = $('meta[name="description"]').attr('content');
      if (metaDesc) {
        details.description = metaDesc.substring(0, 500);
      } else {
        // Get first substantial paragraph
        const firstPara = $('p').first().text().trim();
        if (firstPara && firstPara.length > 50) {
          details.description = firstPara.substring(0, 500);
        }
      }
    }

    // If still no highlights, try to extract from bullet points or lists
    if (!details.highlights) {
      const listItems = $('ul li, ol li').map((i, el) => $(el).text().trim()).get();
      if (listItems.length > 0) {
        details.highlights = listItems.slice(0, 3).join(' ').substring(0, 500);
      }
    }

    // If still no tasting notes, look for flavor profile text
    if (!details.tastingNotes) {
      const flavorText = bodyText.match(/(?:flavor|taste|palate|nose|finish)[^.]{20,200}/gi);
      if (flavorText && flavorText.length > 0) {
        details.tastingNotes = flavorText.slice(0, 2).join(' ').substring(0, 500);
      }
    }

    // Clean up extracted text
    Object.keys(details).forEach(key => {
      if (details[key]) {
        details[key] = details[key].replace(/\s+/g, ' ').trim();
      }
    });

    return details;
  } catch (error) {
    console.error(`  Error scraping product details: ${error.message}`);
    return null;
  }
}

async function enhanceMissingProducts() {
  const productsPath = path.join(__dirname, '../data/whiskey-products-enhanced.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  // Find products missing description, highlights, or tasting notes
  const productsNeedingDetails = products.filter(product => {
    return !product.description || !product.highlights || !product.tastingNotes || 
           product.description === '' || product.highlights === '' || product.tastingNotes === '';
  });
  
  console.log(`Found ${productsNeedingDetails.length} products needing details\n`);
  console.log(`Total products: ${products.length}\n`);
  
  let updated = 0;
  let failed = 0;
  
  for (let i = 0; i < productsNeedingDetails.length; i++) {
    const product = productsNeedingDetails[i];
    const index = products.findIndex(p => p.id === product.id);
    
    console.log(`[${i + 1}/${productsNeedingDetails.length}] Processing: ${product.name}`);
    
    if (!product.link) {
      console.log(`  ✗ No product link available`);
      failed++;
      continue;
    }
    
    const details = await scrapeProductDetails(product.link);
    
    if (details) {
      // Update product with new details, only if they're missing
      if (!product.description && details.description) {
        products[index].description = details.description;
      }
      if (!product.highlights && details.highlights) {
        products[index].highlights = details.highlights;
      }
      if (!product.tastingNotes && details.tastingNotes) {
        products[index].tastingNotes = details.tastingNotes;
      }
      if (!product.abv && details.abv) {
        products[index].abv = details.abv;
      }
      if (!product.volume && details.volume) {
        products[index].volume = details.volume;
      }
      if (!product.distillery && details.distillery) {
        products[index].distillery = details.distillery;
      }
      
      updated++;
      console.log(`  ✓ Updated with details`);
    } else {
      failed++;
      console.log(`  ✗ Failed to scrape details`);
    }
    
    // Save progress every 10 products
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      console.log(`  Progress saved (${i + 1}/${productsNeedingDetails.length})`);
    }
    
    // Delay between requests
    if (i < productsNeedingDetails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  }
  
  // Final save
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  
  console.log(`\n=== Summary ===`);
  console.log(`Total products needing details: ${productsNeedingDetails.length}`);
  console.log(`Successfully updated: ${updated}`);
  console.log(`Failed: ${failed}`);
  console.log(`Updated data saved to: ${productsPath}`);
}

enhanceMissingProducts().catch(console.error);

