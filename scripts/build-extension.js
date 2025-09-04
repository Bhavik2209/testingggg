const fs = require('fs');
const path = require('path');

console.log('Building Chrome Extension...');

// Copy manifest.json to build directory
const manifestPath = path.join(__dirname, '..', 'manifest.json');
const buildManifestPath = path.join(__dirname, '..', 'build', 'manifest.json');

if (fs.existsSync(manifestPath)) {
  fs.copyFileSync(manifestPath, buildManifestPath);
  console.log('✓ Manifest.json copied to build directory');
} else {
  console.error('✗ Manifest.json not found in public directory');
}

// Copy logo to build directory
const logoPath = path.join(__dirname, '..', 'src', 'assets', 'logo2.png');
const buildLogoPath = path.join(__dirname, '..', 'build', 'logo2.png');

if (fs.existsSync(logoPath)) {
  fs.copyFileSync(logoPath, buildLogoPath);
  console.log('✓ Logo copied to build directory');
} else {
  console.error('✗ Logo not found in assets directory');
}

console.log('\nChrome Extension build completed!');
console.log('To install:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked" and select the build folder');
console.log('4. The extension should now appear in your extensions list');
