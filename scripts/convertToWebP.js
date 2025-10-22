/**
 * Image to WebP Converter Script
 *
 * Converts all PNG/JPG/JPEG images in public/images to WebP format
 * Preserves original files and creates .webp versions alongside them
 *
 * Usage: node scripts/convertToWebP.js
 *
 * Requirements:
 * - npm install sharp --save-dev
 *
 * Features:
 * - Batch conversion of all images
 * - Quality optimization (80% default)
 * - Preserves directory structure
 * - Generates responsive sizes (400w, 640w, 768w, 1024w, 1280w, 1536w)
 * - Progress logging
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if sharp is installed
let sharp;
try {
  const sharpModule = await import('sharp');
  sharp = sharpModule.default;
} catch (err) {
  console.error('❌ Error: sharp is not installed');
  console.log('\n📦 Please install sharp:');
  console.log('   npm install sharp --save-dev');
  console.log('\n   Then run this script again.\n');
  process.exit(1);
}

// Configuration
const CONFIG = {
  sourceDir: path.join(__dirname, '../public/images'),
  quality: 80, // WebP quality (0-100)
  responsiveSizes: [400, 640, 768, 1024, 1280, 1536],
  skipExtensions: ['.svg', '.gif', '.webp'], // Don't convert these
  allowedExtensions: ['.jpg', '.jpeg', '.png'],
};

/**
 * Get all image files recursively from a directory
 */
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (CONFIG.allowedExtensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Convert an image to WebP format
 */
async function convertToWebP(inputPath) {
  try {
    const ext = path.extname(inputPath);
    const baseName = inputPath.replace(ext, '');
    const outputPath = `${baseName}.webp`;

    // Skip if WebP already exists and is newer than source
    if (fs.existsSync(outputPath)) {
      const sourceStats = fs.statSync(inputPath);
      const webpStats = fs.statSync(outputPath);

      if (webpStats.mtime > sourceStats.mtime) {
        console.log(`⏭️  Skipping ${path.basename(inputPath)} (WebP already exists)`);
        return { skipped: true };
      }
    }

    // Convert to WebP
    await sharp(inputPath).webp({ quality: CONFIG.quality }).toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    console.log(
      `✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% smaller)`
    );

    return { success: true, savings: parseFloat(savings), originalSize, webpSize };
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return { error: true };
  }
}

/**
 * Generate responsive sizes for an image
 */
async function generateResponsiveSizes(inputPath) {
  try {
    const ext = path.extname(inputPath);
    const baseName = inputPath.replace(ext, '');
    const metadata = await sharp(inputPath).metadata();
    const originalWidth = metadata.width;

    let generated = 0;

    for (const width of CONFIG.responsiveSizes) {
      // Skip if width is larger than original image
      if (width > originalWidth) continue;

      const outputPath = `${baseName}-${width}w${ext}`;
      const webpOutputPath = `${baseName}-${width}w.webp`;

      // Generate standard format
      await sharp(inputPath).resize(width).toFile(outputPath);

      // Generate WebP format
      await sharp(inputPath).resize(width).webp({ quality: CONFIG.quality }).toFile(webpOutputPath);

      generated += 2;
    }

    if (generated > 0) {
      console.log(`   📐 Generated ${generated} responsive variants`);
    }

    return { responsiveGenerated: generated };
  } catch (error) {
    console.error(`❌ Error generating responsive sizes for ${inputPath}:`, error.message);
    return { error: true };
  }
}

/**
 * Main conversion function
 */
async function convertImages(options = {}) {
  const { generateResponsive = false } = options;

  console.log('🖼️  Starting image conversion to WebP...\n');
  console.log(`📁 Source directory: ${CONFIG.sourceDir}`);
  console.log(`⚙️  Quality: ${CONFIG.quality}%`);
  console.log(`📐 Generate responsive: ${generateResponsive ? 'Yes' : 'No'}\n`);

  // Check if source directory exists
  if (!fs.existsSync(CONFIG.sourceDir)) {
    console.error(`❌ Error: Source directory not found: ${CONFIG.sourceDir}`);
    console.log('\n💡 Make sure you have a public/images directory with images to convert.\n');
    return;
  }

  const imageFiles = getImageFiles(CONFIG.sourceDir);

  if (imageFiles.length === 0) {
    console.log('⚠️  No images found to convert.');
    console.log('   Place .jpg, .jpeg, or .png files in public/images/\n');
    return;
  }

  console.log(`📋 Found ${imageFiles.length} images to process\n`);

  let stats = {
    converted: 0,
    skipped: 0,
    errors: 0,
    totalOriginalSize: 0,
    totalWebPSize: 0,
  };

  for (const imagePath of imageFiles) {
    console.log(`\n🔄 Processing: ${path.relative(CONFIG.sourceDir, imagePath)}`);

    const result = await convertToWebP(imagePath);

    if (result.skipped) {
      stats.skipped++;
    } else if (result.error) {
      stats.errors++;
    } else if (result.success) {
      stats.converted++;
      stats.totalOriginalSize += result.originalSize;
      stats.totalWebPSize += result.webpSize;

      // Generate responsive sizes if requested
      if (generateResponsive) {
        await generateResponsiveSizes(imagePath);
      }
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Conversion Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully converted: ${stats.converted}`);
  console.log(`⏭️  Skipped (up-to-date): ${stats.skipped}`);
  console.log(`❌ Errors: ${stats.errors}`);

  if (stats.converted > 0) {
    const totalSavings = ((1 - stats.totalWebPSize / stats.totalOriginalSize) * 100).toFixed(1);
    const savedBytes = stats.totalOriginalSize - stats.totalWebPSize;
    const savedKB = (savedBytes / 1024).toFixed(1);

    console.log(`\n💾 Total size reduction: ${totalSavings}% (~${savedKB} KB saved)`);
  }

  console.log('='.repeat(60) + '\n');
}

// CLI argument parsing
const args = process.argv.slice(2);
const generateResponsive = args.includes('--responsive') || args.includes('-r');

// Run conversion
convertImages({ generateResponsive }).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
