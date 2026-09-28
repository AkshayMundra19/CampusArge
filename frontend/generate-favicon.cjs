const sharp = require('sharp');
sharp('public/favicon.svg').resize(32, 32).toFile('public/favicon-32x32.png')
  .then(() => sharp('public/favicon.svg').resize(16, 16).toFile('public/favicon-16x16.png'))
  .then(() => console.log('Done'))
  .catch(console.error);
