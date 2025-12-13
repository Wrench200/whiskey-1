const fs = require('fs');
const path = require('path');

// Read the enhanced products
const productsPath = path.join(__dirname, '../data/whiskey-products-enhanced.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Price mapping for products with "Save $X.XX" - extracted from original website
const priceMap = {
  "10th Mountain Bourbon Whiskey": { price: "$49.99", regularPrice: "$69.99" },
  "Blanton's Single Barrel Bourbon Whiskey": { price: "$149.99", regularPrice: "$169.99" },
  "Four Roses Single Barrel Bourbon Whiskey": { price: "$54.99", regularPrice: "$59.99" },
  "Four Roses Small Batch Select Bourbon Whiskey": { price: "$64.99", regularPrice: "$69.99" },
  "Four Roses Small Batch Bourbon Whiskey": { price: "$39.99", regularPrice: "$44.99" },
  "Rowan's Creek Kentucky Straight Bourbon Whiskey": { price: "$49.99", regularPrice: "$59.99" },
};

const fixedProducts = products.map(product => {
  // If price is "Save $X.XX", try to find the actual price
  if (product.price.includes('Save $')) {
    const mappedPrice = priceMap[product.name];
    if (mappedPrice) {
      return {
        ...product,
        price: mappedPrice.price,
        regularPrice: mappedPrice.regularPrice,
      };
    }
    
    // Try to extract price from the link or calculate from discount
    // For now, set a placeholder that we'll need to scrape
    const saveAmount = parseFloat(product.price.match(/Save \$([\d.]+)/)?.[1] || '0');
    if (saveAmount > 0) {
      // Estimate price (this is a fallback - ideally we'd scrape the actual price)
      return {
        ...product,
        price: product.price, // Keep original for now
        regularPrice: null,
      };
    }
  }
  
  return product;
});

// Save fixed products
const outputPath = path.join(__dirname, '../data/whiskey-products-enhanced.json');
fs.writeFileSync(outputPath, JSON.stringify(fixedProducts, null, 2));
console.log(`Fixed prices for ${products.length} products`);

