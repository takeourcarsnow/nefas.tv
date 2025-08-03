const fs = require('fs');
const path = require('path');

/**
 * Auto-generates a playlist.json file by scanning the audio directory for MP3 files
 */
function generatePlaylist() {
    const audioDir = path.join(__dirname, 'public', 'audio');
    const playlistPath = path.join(audioDir, 'playlist.json');
    
    try {
        // Read all files in the audio directory
        const files = fs.readdirSync(audioDir);
        
        // Filter for MP3 files and exclude the playlist.json itself
        const mp3Files = files.filter(file => 
            file.toLowerCase().endsWith('.mp3') && 
            file !== 'playlist.json'
        );
        
        // Generate playlist entries
        const playlist = mp3Files.map(file => {
            const baseName = path.basename(file, '.mp3');
            
            // Convert filename to a readable title
            const title = baseName
                .split(/[-_]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            return {
                id: baseName,
                title: title,
                file: `audio/${file}`
            };
        });
        
        // Sort playlist alphabetically by title
        playlist.sort((a, b) => a.title.localeCompare(b.title));
        
        // Write the playlist to JSON file
        fs.writeFileSync(playlistPath, JSON.stringify(playlist, null, 2), 'utf8');
        
        console.log(`✅ Generated playlist with ${playlist.length} tracks:`);
        playlist.forEach((track, index) => {
            console.log(`   ${index + 1}. ${track.title}`);
        });
        
        return playlist;
        
    } catch (error) {
        console.error('❌ Error generating playlist:', error.message);
        return [];
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    generatePlaylist();
}

module.exports = { generatePlaylist };
