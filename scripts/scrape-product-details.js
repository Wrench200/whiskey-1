const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapeProductDetails(productUrl) {
  try {
    console.log(`Fetching product details from ${productUrl}...`);
    
    const response = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
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
    
    // Fallback: Extract from paragraphs and divs
    if (!details.description) {
      const introMatch = bodyText.match(/Introduction\s*(.*?)(?=Highlights|Tasting Notes|Shipping|$)/is);
      if (introMatch) {
        details.description = introMatch[1].trim().replace(/\s+/g, ' ').substring(0, 500);
      } else {
        // Try to get first meaningful paragraph
        const firstPara = $('p').first().text().trim();
        if (firstPara && firstPara.length > 50) {
          details.description = firstPara.substring(0, 500);
        }
      }
    }
    
    if (!details.highlights) {
      const highlightsMatch = bodyText.match(/Highlights\s*(.*?)(?=Tasting Notes|Shipping|$)/is);
      if (highlightsMatch) {
        details.highlights = highlightsMatch[1].trim().replace(/\s+/g, ' ').substring(0, 500);
      }
    }
    
    if (!details.tastingNotes) {
      const tastingMatch = bodyText.match(/Tasting Notes\s*(.*?)(?=Shipping|Proposition|$)/is);
      if (tastingMatch) {
        details.tastingNotes = tastingMatch[1].trim().replace(/\s+/g, ' ').substring(0, 500);
      }
    }

    // Extract ABV and volume from text
    const abvMatch = bodyText.match(/(\d+(?:\.\d+)?)\s*%?\s*ABV/i) || bodyText.match(/(\d+(?:\.\d+)?)\s*%/);
    if (abvMatch) {
      details.abv = abvMatch[1] + '%';
    }

    const volumeMatch = bodyText.match(/(\d+)\s*ML/i) || bodyText.match(/(\d+)\s*ml/i);
    if (volumeMatch) {
      details.volume = volumeMatch[1] + 'ML';
    }

    // Extract distillery/brand from product info or text
    const distilleryMatch = bodyText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+Distillery/i) ||
                          bodyText.match(/Distillery[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
    if (distilleryMatch) {
      let distillery = distilleryMatch[1].trim();
      // Clean up common artifacts
      distillery = distillery.replace(/\s+/g, ' ').replace(/picture|zoom|image/gi, '').trim();
      if (distillery && distillery.length > 2) {
        details.distillery = distillery + ' Distillery';
      }
    }

    return details;
  } catch (error) {
    console.error(`Error scraping ${productUrl}:`, error.message);
    return null;
  }
}

async function enhanceProductData() {
  const productsPath = path.join(__dirname, '../data/whiskey-products-local.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  const enhancedProducts = [];
  
  console.log(`Enhancing ${products.length} products with detailed information...\n`);
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] Processing ${product.name}...`);
    
    if (product.link) {
      const details = await scrapeProductDetails(product.link);
      if (details) {
        enhancedProducts.push({
          ...product,
          ...details
        });
        console.log(`  ✓ Added details`);
      } else {
        enhancedProducts.push(product);
        console.log(`  ✗ No details found`);
      }
    } else {
      enhancedProducts.push(product);
      console.log(`  - No product link available`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save enhanced products
  const outputPath = path.join(__dirname, '../data/whiskey-products-enhanced.json');
  fs.writeFileSync(outputPath, JSON.stringify(enhancedProducts, null, 2));
  
  console.log(`\nEnhanced products saved to ${outputPath}`);
  return enhancedProducts;
}

// Run if called directly
if (require.main === module) {
  enhanceProductData().catch(console.error);
}

module.exports = { scrapeProductDetails, enhanceProductData };

