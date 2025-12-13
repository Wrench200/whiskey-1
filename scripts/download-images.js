const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Sanitize image URLs
function sanitizeImageUrl(url) {
  if (!url) return null;
  let sanitized = url.trim();
  sanitized = sanitized.replace(/^https:https:\/\//, 'https://');
  sanitized = sanitized.replace(/https:\/\/https:\/\//g, 'https://');
  if (!sanitized.startsWith('http')) {
    if (sanitized.startsWith('//')) {
      sanitized = 'https:' + sanitized;
    } else {
      sanitized = 'https://' + sanitized;
    }
  }
  sanitized = sanitized.replace(/https:\/\/\//g, 'https://');
  return sanitized;
}

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url: sanitizeImageUrl(url),
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    return null;
  }
}

function generateImageFilename(product) {
  // Create a safe filename from product name
  const safeName = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100); // Limit length
  
  // Get file extension from URL or default to jpg
  let ext = 'jpg';
  if (product.imageUrl) {
    const match = product.imageUrl.match(/\.(jpg|jpeg|png|webp|gif)/i);
    if (match) {
      ext = match[1].toLowerCase();
    }
  }
  
  return `${product.id}-${safeName}.${ext}`;
}

async function downloadAllImages() {
  const productsPath = path.join(__dirname, '../data/whiskey-products-cleaned.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  const imagesDir = path.join(__dirname, '../public/images/whiskey');
  
  // Create images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  const updatedProducts = [];
  let downloaded = 0;
  let failed = 0;
  
  console.log(`Starting download of ${products.length} product images...\n`);
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    if (!product.imageUrl) {
      console.log(`[${i + 1}/${products.length}] Skipping ${product.name} - no image URL`);
      updatedProducts.push({ ...product, imageUrl: null });
      continue;
    }
    
    const filename = generateImageFilename(product);
    const filepath = path.join(imagesDir, filename);
    const imageUrl = `/images/whiskey/${filename}`;
    
    // Skip if image already exists
    if (fs.existsSync(filepath)) {
      console.log(`[${i + 1}/${products.length}] ✓ ${product.name} - already exists`);
      updatedProducts.push({ ...product, imageUrl });
      downloaded++;
      continue;
    }
    
    console.log(`[${i + 1}/${products.length}] Downloading ${product.name}...`);
    const result = await downloadImage(product.imageUrl, filepath);
    
    if (result !== null) {
      downloaded++;
      updatedProducts.push({ ...product, imageUrl });
      console.log(`  ✓ Saved to ${filename}`);
    } else {
      failed++;
      updatedProducts.push({ ...product, imageUrl: null });
      console.log(`  ✗ Failed to download`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Save updated products with local image paths
  const outputPath = path.join(__dirname, '../data/whiskey-products-local.json');
  fs.writeFileSync(outputPath, JSON.stringify(updatedProducts, null, 2));
  
  console.log(`\n=== Download Summary ===`);
  console.log(`Total products: ${products.length}`);
  console.log(`Successfully downloaded: ${downloaded}`);
  console.log(`Failed: ${failed}`);
  console.log(`Updated data saved to: ${outputPath}`);
}

// Run the download
downloadAllImages().catch(console.error);

