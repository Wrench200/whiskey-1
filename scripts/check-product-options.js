const axios = require('axios');
const cheerio = require('cheerio');

async function checkProductOptions(productUrl) {
  try {
    console.log(`Checking product options from ${productUrl}...`);
    
    const response = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('\n=== Form Elements ===');
    $('form').each((i, form) => {
      console.log(`\nForm ${i + 1}:`);
      $(form).find('input[type="checkbox"], input[type="radio"]').each((j, input) => {
        const label = $(input).next('label').text() || $(input).closest('label').text() || $(input).attr('value');
        console.log(`  - ${$(input).attr('type')}: ${label || $(input).attr('name')}`);
      });
    });
    
    console.log('\n=== Checkboxes ===');
    $('input[type="checkbox"]').each((i, el) => {
      const $el = $(el);
      const label = $el.next('label').text() || $el.closest('label').text() || $el.attr('value') || $el.attr('name');
      console.log(`  ${i + 1}. ${label} (name: ${$el.attr('name')}, value: ${$el.attr('value')})`);
    });
    
    console.log('\n=== Radio Buttons ===');
    $('input[type="radio"]').each((i, el) => {
      const $el = $(el);
      const label = $el.next('label').text() || $el.closest('label').text() || $el.attr('value') || $el.attr('name');
      console.log(`  ${i + 1}. ${label} (name: ${$el.attr('name')}, value: ${$el.attr('value')})`);
    });
    
    console.log('\n=== Select Options ===');
    $('select').each((i, select) => {
      const $select = $(select);
      console.log(`\nSelect ${i + 1} (name: ${$select.attr('name')}):`);
      $select.find('option').each((j, option) => {
        console.log(`  - ${$(option).text()} (value: ${$(option).attr('value')})`);
      });
    });
    
    console.log('\n=== Product Variants (if any) ===');
    $('[data-variant], [class*="variant"], [class*="option"]').each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).text().trim().substring(0, 100)}`);
    });
    
    console.log('\n=== All Input Elements ===');
    $('input').each((i, el) => {
      const $el = $(el);
      console.log(`  ${i + 1}. Type: ${$el.attr('type')}, Name: ${$el.attr('name')}, Value: ${$el.attr('value')}, ID: ${$el.attr('id')}`);
    });
    
    console.log('\n=== Text containing "option", "add-on", "gift", "engrave" ===');
    $('*').each((i, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes('option') || text.includes('add-on') || text.includes('gift') || text.includes('engrave')) {
        console.log(`  ${$(el).text().trim().substring(0, 150)}`);
      }
    });
    
    // Save HTML to file for inspection
    const fs = require('fs');
    fs.writeFileSync('product-page.html', response.data);
    console.log('\n=== Full HTML saved to product-page.html for inspection ===');
    
  } catch (error) {
    console.error(`Error:`, error.message);
  }
}

// Test with the W.L. Weller product
checkProductOptions('https://whiskyandwhiskey.com/products/w-l-weller-special-reserve-wheated-bourbon');

