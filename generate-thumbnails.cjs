// generate-thumbnails.cjs
// Usage: node generate-thumbnails.cjs
// Requires: npm install sharp

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = path.join(__dirname, 'public', 'images', 'photos');
const THUMB_DIR = path.join(SOURCE_DIR, 'thumbnails');
const THUMB_SIZE = 200; // px

function isImage(file) {
    return /\.(jpe?g|png|webp)$/i.test(file);
}

function ensureDirSync(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function processDir(dir, rel = '') {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(rel, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== 'thumbnails') {
                processDir(fullPath, relPath);
            }
        } else if (isImage(entry.name)) {
            const thumbOutDir = path.join(THUMB_DIR, rel);
            ensureDirSync(thumbOutDir);
            const thumbOutPath = path.join(thumbOutDir, entry.name);
            sharp(fullPath)
                .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover' })
                .toFile(thumbOutPath)
                .then(() => console.log('Created thumbnail:', thumbOutPath))
                .catch(err => console.error('Error creating thumbnail for', fullPath, err));
        }
    });
}

ensureDirSync(THUMB_DIR);
processDir(SOURCE_DIR);
console.log('Thumbnail generation started.');
