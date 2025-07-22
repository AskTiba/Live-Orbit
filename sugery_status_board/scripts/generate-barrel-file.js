const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'src', 'components', 'icons');
const outputFile = path.join(iconsDir, 'index.ts');

fs.readdir(iconsDir, (err, files) => {
  if (err) {
    console.error('Error reading icons directory:', err);
    return;
  }

  const exports = files
    .filter(f => f.endsWith('.tsx') && f !== 'index.ts')
    .map(f => `export * from './${path.basename(f, '.tsx')}';`)
    .join('\n');

  fs.writeFile(outputFile, exports, err => {
    if (err) {
      console.error('Error writing barrel file:', err);
      return;
    }
    console.log('Successfully generated src/components/icons/index.ts');
  });
});
