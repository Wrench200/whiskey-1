const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeProductCard() {
  try {
    const response = await axios.get('https://whiskyandwhiskey.com/collections/whiskey', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('=== Product Card Structure ===\n');
    
    // Find product cards
    $('[class*="product"], [class*="card"], [class*="item"]').each((i, el) => {
      if (i < 3) { // First 3 products
        const $el = $(el);
        console.log(`Product ${i + 1}:`);
        console.log(`  Classes: ${$el.attr('class')}`);
        
        // Find image
        const img = $el.find('img').first();
        if (img.length) {
          console.log(`  Image: ${img.attr('src')?.substring(0, 50)}...`);
        }
        
        // Find title
        const title = $el.find('h1, h2, h3, h4, [class*="title"], [class*="name"]').first();
        if (title.length) {
          console.log(`  Title: ${title.text().trim().substring(0, 50)}`);
        }
        
        // Find price
        const price = $el.find('[class*="price"], [class*="money"]').first();
        if (price.length) {
          console.log(`  Price: ${price.text().trim()}`);
        }
        
        // Find brand/vendor
        const brand = $el.find('[class*="vendor"], [class*="brand"]').first();
        if (brand.length) {
          console.log(`  Brand: ${brand.text().trim()}`);
        }
        
        // Find add to cart button
        const button = $el.find('button, [class*="cart"], [class*="add"]').first();
        if (button.length) {
          console.log(`  Button: ${button.text().trim()}`);
        }
        
        console.log('');
      }
    });
    
    // Check for grid layout
    console.log('=== Grid Container ===');
    $('[class*="grid"], [class*="collection"]').each((i, el) => {
      if (i < 2) {
        console.log(`  ${i + 1}. ${$(el).attr('class')}`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

analyzeProductCard();

