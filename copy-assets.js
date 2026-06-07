const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'dist');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

let count = 0;
files.forEach(file => {
  const ext = path.extname(file).toLowerCase();
  // We want to copy JPGs and MOVs
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.mov' || ext === '.mp4') {
    if (file.startsWith('photo_') || file.startsWith('IMG_')) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);
      
      // Copy file (using copyFileSync for speed)
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
});

console.log(`Successfully copied ${count} media assets to dist/ directory`);
