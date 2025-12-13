const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function analyzePageStructure(productUrl) {
  try {
    console.log(`Analyzing page structure from ${productUrl}...`);
    
    const response = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('\n=== Page Structure ===\n');
    
    // Find main product container
    const productContainer = $('[class*="product"], [id*="product"], main, [class*="main"]').first();
    
    console.log('Main container classes:', productContainer.attr('class'));
    
    // Find product gallery/image section
    console.log('\n=== Product Image/Gallery Section ===');
    $('[class*="gallery"], [class*="image"], [class*="photo"], [class*="product-image"]').each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).attr('class')}`);
    });
    
    // Find product info section
    console.log('\n=== Product Info Section ===');
    $('[class*="product-info"], [class*="product-details"], [class*="product-form"]').each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).attr('class')}`);
      console.log(`     Content preview: ${$(el).text().trim().substring(0, 100)}`);
    });
    
    // Find form elements and options
    console.log('\n=== Form Structure ===');
    $('form').each((i, form) => {
      console.log(`\nForm ${i + 1}:`);
      const formClass = $(form).attr('class');
      const formId = $(form).attr('id');
      console.log(`  Class: ${formClass || 'none'}`);
      console.log(`  ID: ${formId || 'none'}`);
      
      // Check for variant selectors
      const variants = $(form).find('[name*="variant"], [name*="option"], select[name*="id"]');
      if (variants.length > 0) {
        console.log(`  Variants found: ${variants.length}`);
        variants.each((j, v) => {
          console.log(`    - ${$(v).attr('name')}: ${$(v).find('option').length} options`);
        });
      }
      
      // Check for quantity input
      const quantity = $(form).find('input[name*="quantity"], input[type="number"]');
      if (quantity.length > 0) {
        console.log(`  Quantity input: ${quantity.attr('name') || 'found'}`);
      }
      
      // Check for add to cart button
      const addToCart = $(form).find('button[type="submit"], [class*="add-to-cart"], [class*="cart-button"]');
      if (addToCart.length > 0) {
        console.log(`  Add to cart button: ${addToCart.text().trim()}`);
      }
    });
    
    // Find product options/checkboxes
    console.log('\n=== Product Options/Add-ons ===');
    $('[class*="option"], [class*="addon"], [class*="gift"], [class*="engrave"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 0 && text.length < 200) {
        console.log(`  ${i + 1}. ${text.substring(0, 150)}`);
      }
    });
    
    // Find tabs or sections
    console.log('\n=== Content Sections/Tabs ===');
    $('[class*="tab"], [class*="section"], [class*="accordion"], [role="tabpanel"]').each((i, el) => {
      const heading = $(el).find('h1, h2, h3, h4, [class*="heading"], [class*="title"]').first().text().trim();
      if (heading) {
        console.log(`  ${i + 1}. ${heading}`);
      }
    });
    
    // Find related products section
    console.log('\n=== Related/Recommended Products ===');
    $('[class*="related"], [class*="recommend"], [class*="similar"], [class*="also-bought"]').each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).attr('class')}`);
      const heading = $(el).find('h1, h2, h3, h4').first().text().trim();
      if (heading) {
        console.log(`     Heading: ${heading}`);
      }
    });
    
    // Save HTML structure for inspection
    const structure = {
      mainContainer: productContainer.attr('class'),
      forms: [],
      sections: []
    };
    
    $('form').each((i, form) => {
      structure.forms.push({
        class: $(form).attr('class'),
        id: $(form).attr('id'),
        hasVariants: $(form).find('[name*="variant"]').length > 0,
        hasQuantity: $(form).find('input[name*="quantity"]').length > 0
      });
    });
    
    fs.writeFileSync('page-structure.json', JSON.stringify(structure, null, 2));
    console.log('\n=== Structure saved to page-structure.json ===');
    
    // Save a cleaned HTML sample
    const sampleHTML = $('body').html();
    fs.writeFileSync('page-sample.html', sampleHTML.substring(0, 50000)); // First 50KB
    console.log('=== HTML sample saved to page-sample.html ===');
    
  } catch (error) {
    console.error(`Error:`, error.message);
  }
}

// Analyze the W.L. Weller product page
analyzePageStructure('https://whiskyandwhiskey.com/products/w-l-weller-special-reserve-wheated-bourbon');

