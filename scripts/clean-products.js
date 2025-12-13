const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../data/whiskey-products.json');
const outputPath = path.join(__dirname, '../data/whiskey-products-cleaned.json');

const products = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Clean and deduplicate products
const cleanedProducts = [];
const seenNames = new Set();

products.forEach((product, index) => {
  // Clean price - remove "Sale price" prefix and extract actual price
  let cleanPrice = product.price;
  let regularPrice = product.regularPrice;
  
  if (cleanPrice.includes('Sale price')) {
    cleanPrice = cleanPrice.replace('Sale price', '').trim();
  }
  if (cleanPrice.includes('Save $')) {
    // For "Save $X.XX" format, we'll keep it as is for now
    cleanPrice = cleanPrice;
  }
  
  // Fix image URLs that have double domain or malformed URLs
  let imageUrl = product.imageUrl;
  if (imageUrl) {
    // Fix the specific pattern: https:https:// -> https://
    imageUrl = imageUrl.replace(/^https:https:\/\//, 'https://');
    // Fix other double https patterns
    imageUrl = imageUrl.replace(/https:\/\/https:\/\//g, 'https://');
    // Fix double domain
    if (imageUrl.includes('//whiskyandwhiskey.com//whiskyandwhiskey.com')) {
      imageUrl = imageUrl.replace('//whiskyandwhiskey.com//whiskyandwhiskey.com', 'https://whiskyandwhiskey.com');
    }
    // Ensure it starts with https://
    if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl;
    }
    // Remove any remaining double slashes after https:
    imageUrl = imageUrl.replace(/https:\/\/\//g, 'https://');
    // Final check: if it still starts with "https:https", fix it
    if (imageUrl.startsWith('https:https')) {
      imageUrl = imageUrl.replace(/^https:https/, 'https');
    }
  }
  
  // Extract brand better - use first few words before common whiskey terms
  let brand = product.brand;
  if (brand.length < 3 || brand === 'The' || brand === 'W.L.' || brand === 'Four' || brand === 'Angel\'s' || brand === '10th') {
    const nameParts = product.name.split(' ');
    brand = nameParts.slice(0, 2).join(' ');
  }
  
  // Only add if we haven't seen this exact name before, or if this one has an image
  const nameKey = product.name.toLowerCase().trim();
  
  if (!seenNames.has(nameKey)) {
    seenNames.add(nameKey);
    cleanedProducts.push({
      id: `whiskey-${cleanedProducts.length + 1}`,
      name: product.name.trim(),
      brand: brand.trim(),
      price: cleanPrice,
      regularPrice: regularPrice,
      imageUrl: imageUrl,
      link: product.link,
    });
  } else {
    // If we've seen it but this one has an image and the previous didn't, replace it
    const existingIndex = cleanedProducts.findIndex(p => p.name.toLowerCase().trim() === nameKey);
    if (existingIndex !== -1 && imageUrl && !cleanedProducts[existingIndex].imageUrl) {
      cleanedProducts[existingIndex] = {
        id: cleanedProducts[existingIndex].id,
        name: product.name.trim(),
        brand: brand.trim(),
        price: cleanPrice,
        regularPrice: regularPrice,
        imageUrl: imageUrl,
        link: product.link,
      };
    }
  }
});

// Sort by name
cleanedProducts.sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(outputPath, JSON.stringify(cleanedProducts, null, 2));
console.log(`Cleaned ${products.length} products down to ${cleanedProducts.length} unique products`);
console.log(`Saved to ${outputPath}`);

