const { scrapeProductDetails } = require('./scrape-product-details');

// Test scraper on one product
const testUrl = 'https://whiskyandwhiskey.com/products/w-l-weller-special-reserve-wheated-bourbon';

scrapeProductDetails(testUrl).then(details => {
  console.log('\n=== Scraped Details ===');
  console.log(JSON.stringify(details, null, 2));
}).catch(console.error);

