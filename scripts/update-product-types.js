const fs = require('fs');
const path = require('path');

function extractProductTypeFromName(name) {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('bourbon')) return 'Bourbon';
  if (nameLower.includes('scotch') || nameLower.includes('scotch whisky') || nameLower.includes('single malt')) return 'Scotch';
  if (nameLower.includes('irish')) return 'Irish Whiskey';
  if (nameLower.includes('canadian')) return 'Canadian Whiskey';
  if (nameLower.includes('rye')) return 'Rye';
  if (nameLower.includes('japanese') || nameLower.includes('yamazaki') || nameLower.includes('hibiki') || nameLower.includes('nikka')) return 'Japanese/Foreign';
  if (nameLower.includes('american whiskey')) return 'American Whiskey';
  if (nameLower.includes('gin')) return 'Gin';
  if (nameLower.includes('rum')) return 'Rum';
  if (nameLower.includes('tequila')) return 'Tequila';
  if (nameLower.includes('vodka')) return 'Vodka';
  if (nameLower.includes('wine')) return 'Wine';
  if (nameLower.includes('beer')) return 'Beer';
  if (nameLower.includes('liqueur')) return 'Liqueur';
  if (nameLower.includes('brandy')) return 'Brandy';
  if (nameLower.includes('bitters')) return 'Bitters';
  if (nameLower.includes('moonshine')) return 'Moonshine';
  return 'Whiskey';
}

const productsPath = path.join(__dirname, '../data/whiskey-products-enhanced.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let updated = 0;
const updatedProducts = products.map(product => {
  if (!product.productType) {
    product.productType = extractProductTypeFromName(product.name);
    updated++;
  }
  if (product.inStock === undefined) {
    product.inStock = true;
  }
  return product;
});

fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));
console.log(`Updated ${updated} products with productType`);
console.log(`Total products: ${updatedProducts.length}`);

