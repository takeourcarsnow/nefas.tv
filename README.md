# nefas.tv

A vaporwave-inspired personal website with retro aesthetics and interactive elements.

## Project Structure

The project has been split into separate files for better organization and maintainability:

- `index.html` - Main HTML structure
- `styles.css` - All CSS styles and animations
- `script.js` - JavaScript functionality
- `README.md` - This documentation file

## Features

- **Preloader Animation** - ASCII art loading screen with progress bar
- **CRT Effect** - Scanlines overlay for retro monitor feel
- **Navigation** - Single-page application with smooth section transitions
- **Content Sections**:
  - Home with latest posts
  - Video feed with YouTube embeds
  - Photography with Instagram-style grid
  - 3D renders with modal image viewer
  - Web development projects
  - Blog with expandable posts
  - Miscellaneous content
- **Winamp Player** - Draggable audio player with visualizer
- **Modal System** - For viewing 3D images in full size
- **Responsive Design** - Works on various screen sizes

## Usage

1. Open `index.html` in a web browser
2. Navigate between sections using the top navigation
3. Click on 3D images to view them in full size
4. Use the Winamp player to control background music
5. Expand blog posts by clicking on their headers

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --main-color: #00ff9d;
    --glow-color: rgba(0, 255, 157, 0.5);
    --bg-color: #0a0a0a;
    --secondary-color: #ff00ff;
    --secondary-glow: rgba(255, 0, 255, 0.4);
    --border-color: #333;
    --font: 'VT323', monospace;
}
```

### Content
- Update the HTML content in `index.html` for your own projects
- Replace placeholder images with your own
- Add your own audio file for the Winamp player
- Modify the preloader ASCII art in `script.js`

### Audio
Replace the audio source in `index.html`:
```html
<audio id="audio-player" src="your-audio-file.mp3"></audio>
```

## Browser Compatibility

- Modern browsers with CSS Grid and Flexbox support
- JavaScript ES6+ features
- CSS custom properties (variables)

## License

This project is open source and available under the MIT License. 