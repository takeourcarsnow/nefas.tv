#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const PHOTO_DIR = path.join(__dirname, 'public/images/photos');
const THREED_DIR = path.join(__dirname, 'public/images/3d');
const PHOTO_JSON = path.join(__dirname, 'public/photos/photos.json');
const THREED_JSON = path.join(__dirname, 'public/3d/3d.json');

/**
 * Parse album info from text file
 * Expected format:
 * title: Album Title
 * description: Album description
 * date: 2025-08-03
 * tags: tag1, tag2, tag3
 */
function parseAlbumInfo(infoPath) {
    try {
        const content = fs.readFileSync(infoPath, 'utf8');
        const info = {};
        
        content.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                if (key.trim() === 'tags') {
                    info[key.trim()] = value.split(',').map(tag => tag.trim());
                } else {
                    info[key.trim()] = value;
                }
            }
        });
        
        return info;
    } catch (error) {
        console.warn(`Could not parse info file ${infoPath}:`, error.message);
        return null;
    }
}

/**
 * Get all image files in a directory
 */
function getImageFiles(dir) {
    try {
        return fs.readdirSync(dir)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .sort();
    } catch (error) {
        return [];
    }
}

/**
 * Generate photo albums and singles
 */
function generatePhotoData() {
    const photoData = [];
    
    try {
        const items = fs.readdirSync(PHOTO_DIR, { withFileTypes: true });
        
        items.forEach(item => {
            if (item.isDirectory()) {
                const itemDir = path.join(PHOTO_DIR, item.name);
                
                if (item.name === 'single') {
                    // Handle single photos directory - look for subdirectories
                    try {
                        const singleItems = fs.readdirSync(itemDir, { withFileTypes: true });
                        singleItems.forEach(singleItem => {
                            if (singleItem.isDirectory()) {
                                const singleDir = path.join(itemDir, singleItem.name);
                                const infoFile = path.join(singleDir, 'info.txt');
                                const images = getImageFiles(singleDir);
                                
                                if (images.length === 0) return;
                                
                                const info = parseAlbumInfo(infoFile);
                                if (!info) return;
                                
                                const singlePhoto = {
                                    type: 'single',
                                    id: singleItem.name,
                                    title: info.title || `Captured Moment`,
                                    description: info.description || 'A glimpse through my lens',
                                    image: `images/photos/single/${singleItem.name}/${images[0]}`,
                                    thumbnail: `images/photos/single/${singleItem.name}/${images[0]}`,
                                    date: info.date || new Date().toISOString().split('T')[0],
                                    tags: info.tags || ['photography', 'original', 'nefas']
                                };
                                photoData.push(singlePhoto);
                            }
                        });
                    } catch (error) {
                        console.warn('Error processing single photos:', error.message);
                    }
                } else {
                    // Handle regular album
                    const infoFile = path.join(itemDir, 'info.txt');
                    const images = getImageFiles(itemDir);
                    
                    if (images.length === 0) return;
                    
                    const info = parseAlbumInfo(infoFile);
                    if (!info) return;
                    
                    const albumData = {
                        type: 'album',
                        id: item.name,
                        title: info.title || item.name,
                        description: info.description || 'A collection of photos',
                        coverImage: `images/photos/${item.name}/${images[0]}`,
                        date: info.date || new Date().toISOString().split('T')[0],
                        tags: info.tags || ['photography', 'album', 'nefas'],
                        photos: []
                    };
                    
                    images.forEach((image, index) => {
                        albumData.photos.push({
                            id: `${item.name}_${index + 1}`,
                            title: `${info.title || item.name} #${index + 1}`,
                            description: `Photo ${index + 1} from ${info.title || item.name}`,
                            image: `images/photos/${item.name}/${image}`,
                            thumbnail: `images/photos/${item.name}/${image}`
                        });
                    });
                    
                    photoData.push(albumData);
                }
            }
        });
        
        // Sort by date descending
        photoData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Write to JSON file
        fs.writeFileSync(PHOTO_JSON, JSON.stringify(photoData, null, 2));
        console.log(`✅ Generated photos.json with ${photoData.length} items`);
        
    } catch (error) {
        console.error('Error generating photo data:', error);
    }
}

/**
 * Generate 3D render data
 */
function generate3DData() {
    const renderData = [];
    
    try {
        const items = fs.readdirSync(THREED_DIR, { withFileTypes: true });
        
        items.forEach(item => {
            if (item.isDirectory()) {
                const renderDir = path.join(THREED_DIR, item.name);
                const infoFile = path.join(renderDir, 'info.txt');
                const images = getImageFiles(renderDir);
                
                if (images.length === 0) return;
                
                const info = parseAlbumInfo(infoFile);
                if (!info) return;
                
                // For 3D, each directory is treated as a single render (use first image)
                const renderItem = {
                    id: item.name,
                    title: info.title || item.name,
                    description: info.description || 'Digital sculpture from the void',
                    image: `images/3d/${item.name}/${images[0]}`,
                    thumbnail: `images/3d/${item.name}/${images[0]}`,
                    date: info.date || new Date().toISOString().split('T')[0],
                    tags: info.tags || ['3d', 'render', 'nefas']
                };
                
                renderData.push(renderItem);
            }
        });
        
        // Also handle single 3D images in root directory
        const rootImages = getImageFiles(THREED_DIR);
        rootImages.forEach((image, index) => {
            const renderItem = {
                id: `render_${index + 1}`,
                title: `3D Render #${index + 1}`,
                description: 'Digital sculpture from the void',
                image: `images/3d/${image}`,
                thumbnail: `images/3d/${image}`,
                date: new Date().toISOString().split('T')[0],
                tags: ['3d', 'render', 'nefas']
            };
            renderData.push(renderItem);
        });
        
        // Sort by date descending
        renderData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Write to JSON file
        fs.writeFileSync(THREED_JSON, JSON.stringify(renderData, null, 2));
        console.log(`✅ Generated 3d.json with ${renderData.length} items`);
        
    } catch (error) {
        console.error('Error generating 3D data:', error);
    }
}

/**
 * Main function
 */
function main() {
    console.log('🔄 Scanning for new content...');
    
    generatePhotoData();
    generate3DData();
    
    console.log('✨ Content generation complete!');
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { generatePhotoData, generate3DData, main };
