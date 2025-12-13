const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const DELAY = 2000; // 2 second delay between requests

// Sanitize image URLs
function sanitizeImageUrl(url) {
  if (!url) return null;
  let sanitized = url.trim();
  sanitized = sanitized.replace(/^https:https:\/\//, 'https://');
  sanitized = sanitized.replace(/https:\/\/https:\/\//g, 'https://');
  if (!sanitized.startsWith('http')) {
    if (sanitized.startsWith('//')) {
      sanitized = 'https:' + sanitized;
    } else if (sanitized.startsWith('/')) {
      sanitized = 'https://whiskyandwhiskey.com' + sanitized;
    } else {
      sanitized = 'https://' + sanitized;
    }
  }
  sanitized = sanitized.replace(/https:\/\/\//g, 'https://');
  return sanitized;
}

async function getImageUrlFromProductPage(productLink) {
  try {
    if (!productLink) return null;
    
    console.log(`  Fetching product page: ${productLink}`);
    const response = await axios.get(productLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    
    // Try multiple selectors to find the main product image
    let imageUrl = null;
    
    // Method 1: Look for product image in meta tags
    imageUrl = $('meta[property="og:image"]').attr('content') ||
               $('meta[name="twitter:image"]').attr('content');
    
    // Method 2: Look for product image in img tags with specific classes
    if (!imageUrl) {
      imageUrl = $('.product__media img, .product-image img, .product-photo img, img[src*="/products/"]').first().attr('src') ||
                 $('.product__media img, .product-image img, .product-photo img, img[src*="/products/"]').first().attr('data-src');
    }
    
    // Method 3: Look in product gallery
    if (!imageUrl) {
      imageUrl = $('[class*="product"] [class*="image"] img, [class*="product"] [class*="photo"] img').first().attr('src') ||
                 $('[class*="product"] [class*="image"] img, [class*="product"] [class*="photo"] img').first().attr('data-src');
    }
    
    // Method 4: Any image in the main content area
    if (!imageUrl) {
      imageUrl = $('main img, .main-content img, [role="main"] img').first().attr('src') ||
                 $('main img, .main-content img, [role="main"] img').first().attr('data-src');
    }
    
    if (imageUrl) {
      return sanitizeImageUrl(imageUrl);
    }
    
    return null;
  } catch (error) {
    console.error(`  Error fetching product page: ${error.message}`);
    return null;
  }
}

async function downloadImage(url, filepath) {
  try {
    const sanitizedUrl = sanitizeImageUrl(url);
    if (!sanitizedUrl) return null;

    const response = await axios({
      url: sanitizedUrl,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://whiskyandwhiskey.com/'
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
    console.error(`  Error downloading image: ${error.message}`);
    return null;
  }
}

function generateImageFilename(product) {
  const safeName = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
  
  let ext = 'jpg';
  if (product.imageUrl && product.imageUrl.match(/\.(jpg|jpeg|png|webp|gif)/i)) {
    const match = product.imageUrl.match(/\.(jpg|jpeg|png|webp|gif)/i);
    if (match) {
      ext = match[1].toLowerCase();
    }
  }
  
  return `${product.id}-${safeName}.${ext}`;
}

async function fixProductImages() {
  const productsPath = path.join(__dirname, '../data/whiskey-products-enhanced.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  const imagesDir = path.join(__dirname, '../public/images/whiskey');
  
  // Create images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // Find products that have local image URLs but the file doesn't exist
  const productsNeedingImages = products.filter(product => {
    if (!product.imageUrl) return false;
    
    // Check if it's a local path
    const isLocalPath = product.imageUrl.startsWith('/images/whiskey/');
    
    if (isLocalPath) {
      const filename = path.basename(product.imageUrl);
      const filepath = path.join(imagesDir, filename);
      return !fs.existsSync(filepath);
    }
    
    // Also check if it's a remote URL that we should download
    const isRemoteUrl = product.imageUrl.startsWith('http');
    if (isRemoteUrl && product.link) {
      // We'll try to get a better image URL from the product page
      return true;
    }
    
    return false;
  });
  
  console.log(`Found ${productsNeedingImages.length} products needing images\n`);
  
  const updatedProducts = products.map(p => ({ ...p }));
  let downloaded = 0;
  let failed = 0;
  
  for (let i = 0; i < productsNeedingImages.length; i++) {
    const product = productsNeedingImages[i];
    const index = updatedProducts.findIndex(p => p.id === product.id);
    
    console.log(`[${i + 1}/${productsNeedingImages.length}] Processing: ${product.name}`);
    
    let imageUrl = null;
    let remoteImageUrl = null;
    
    // If product has a link, try to get image from product page
    if (product.link) {
      remoteImageUrl = await getImageUrlFromProductPage(product.link);
      if (remoteImageUrl) {
        imageUrl = remoteImageUrl;
        console.log(`  Found image URL: ${imageUrl}`);
      }
    }
    
    // If we still don't have an image URL, try to use the existing imageUrl if it's remote
    if (!imageUrl && product.imageUrl && product.imageUrl.startsWith('http')) {
      imageUrl = product.imageUrl;
    }
    
    if (!imageUrl) {
      console.log(`  ✗ No image URL found`);
      failed++;
      continue;
    }
    
    // Generate filename and download
    const filename = generateImageFilename(product);
    const filepath = path.join(imagesDir, filename);
    const localImageUrl = `/images/whiskey/${filename}`;
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`  ✓ Image already exists: ${filename}`);
      updatedProducts[index].imageUrl = localImageUrl;
      downloaded++;
      continue;
    }
    
    // Download the image
    console.log(`  Downloading to ${filename}...`);
    const downloadResult = await downloadImage(imageUrl, filepath);
    
    if (downloadResult !== null) {
      downloaded++;
      updatedProducts[index].imageUrl = localImageUrl;
      console.log(`  ✓ Successfully downloaded`);
    } else {
      failed++;
      console.log(`  ✗ Failed to download`);
    }
    
    // Delay between requests
    if (i < productsNeedingImages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  }
  
  // Save updated products
  fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));
  
  console.log(`\n=== Summary ===`);
  console.log(`Total products needing images: ${productsNeedingImages.length}`);
  console.log(`Successfully downloaded: ${downloaded}`);
  console.log(`Failed: ${failed}`);
  console.log(`Updated data saved to: ${productsPath}`);
}

fixProductImages().catch(console.error);

