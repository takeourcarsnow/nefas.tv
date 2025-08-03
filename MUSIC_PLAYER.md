# Music Player - User Guide

## Overview
The enhanced music player now supports multiple tracks with automatic playlist generation and navigation controls.

## Features
- **Auto-detection**: Automatically scans the `public/audio/` folder for MP3 files
- **Playlist Navigation**: Previous and Next track buttons
- **Song Display**: Shows the current song name
- **Auto-advance**: Automatically plays the next track when current track ends
- **Visual Player**: Retro-style visualizer with vaporwave aesthetics

## Controls
- **⏮ Previous**: Go to previous track in playlist
- **▶ Play**: Start playing current track
- **⏸ Pause**: Pause current track
- **⏹ Stop**: Stop and reset current track to beginning
- **⏭ Next**: Go to next track in playlist

## Adding New Music

### Method 1: Manual Addition
1. Copy your MP3 files to the `public/audio/` directory
2. Run the playlist generator: `npm run playlist`
3. Refresh your website

### Method 2: Direct File Addition
1. Add MP3 files to `public/audio/`
2. The filename will be automatically converted to a readable title:
   - `synthwave-dreams.mp3` → "Synthwave Dreams"
   - `neon_nights.mp3` → "Neon Nights"
   - `digital-horizon.mp3` → "Digital Horizon"

## Playlist Management

### Auto-Generation Script
The `generate-playlist.cjs` script automatically:
- Scans the `public/audio/` directory for MP3 files
- Converts filenames to readable titles
- Sorts tracks alphabetically
- Generates `public/audio/playlist.json`

### Manual Playlist Editing
You can manually edit `public/audio/playlist.json` to:
- Change track titles
- Reorder tracks
- Add metadata

Example playlist entry:
```json
{
  "id": "track-id",
  "title": "Display Name",
  "file": "audio/filename.mp3"
}
```

## File Naming Conventions
For best results, name your MP3 files using:
- Hyphens or underscores to separate words: `cyber-void.mp3` or `cyber_void.mp3`
- Lowercase letters
- No special characters (except hyphens and underscores)

## Supported Formats
- **Audio**: MP3 files only
- **Browser compatibility**: All modern browsers with HTML5 audio support

## Troubleshooting

### "No tracks available"
- Ensure MP3 files are in the `public/audio/` directory
- Run `npm run playlist` to regenerate the playlist
- Check browser console for errors

### "Failed to load playlist"
- Verify `public/audio/playlist.json` exists and is valid JSON
- Check network connectivity
- Ensure the server can serve static files

### Audio won't play
- Check browser audio permissions
- Ensure MP3 files are not corrupted
- Verify file paths in playlist.json are correct

## Commands
- `npm run playlist` - Generate/update playlist from MP3 files in audio directory
- `npm run dev` - Start development server
- `npm run start` - Start production server
