const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const inputFile = path.join(__dirname, 'public', 'favicon.png');
  const outputDir = path.join(__dirname, 'public');
  
  console.log('Generating favicon sizes from favicon.png...');
  
  try {
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      console.error('Error: favicon.png not found in public folder');
      return;
    }

    // Generate different sizes
    const sizes = [
      { name: 'favicon-16x16.png', size: 16 },
      { name: 'favicon-32x32.png', size: 32 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'favicon-192x192.png', size: 192 },
      { name: 'favicon-512x512.png', size: 512 }
    ];

    for (const { name, size } of sizes) {
      const outputPath = path.join(outputDir, name);
      await sharp(inputFile)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${name} (${size}x${size})`);
    }

    // Generate ICO file (32x32)
    const icoPath = path.join(outputDir, 'favicon.ico');
    await sharp(inputFile)
      .resize(32, 32)
      .png()
      .toFile(icoPath);
    console.log(`✓ Generated favicon.ico (32x32)`);

    console.log('\n🎉 All favicon sizes generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Refresh your browser to see the new favicon');
    
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();