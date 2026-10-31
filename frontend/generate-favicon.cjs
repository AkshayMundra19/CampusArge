const sharp = require('sharp');
const path = require('path');

const svgPath = path.join(__dirname, 'public', 'favicon.svg');
const publicDir = path.join(__dirname, 'public');

const sizes = [
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'favicon-48x48.png', size: 48 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'android-chrome-192x192.png', size: 192 },
  { file: 'android-chrome-512x512.png', size: 512 },
];

async function generate() {
  for (const { file, size } of sizes) {
    await sharp(svgPath, { density: Math.max(72, Math.round(72 * (size / 32))) })
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, file));
    console.log(`Generated ${file} (${size}x${size})`);
  }

  // Also write 32x32 as favicon.ico if possible, or copy favicon-32x32.png
  await sharp(svgPath, { density: 144 })
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico');

  console.log('All favicons generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
