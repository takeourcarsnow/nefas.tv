export const leftFrames = ['[>', '[>', '[ >', '[>'];
export const rightFrames = ['<]', ' <]', '< ]', '<]'];

// Glitch characters for the cryptic effect
const glitchChars = ['#', '@', '$', '%', '&', '*', '!', '?', '0', '1', 'X', 'Z', 'Q'];
const originalText = 'nefas.tv';

export const initHeaderAnimation = (asciiHeader, asciiHeaderRight) => {
    let headerFrameIndex = 0;
    setInterval(() => {
        if (asciiHeader) asciiHeader.textContent = leftFrames[headerFrameIndex];
        if (asciiHeaderRight) asciiHeaderRight.textContent = rightFrames[headerFrameIndex];
        headerFrameIndex = (headerFrameIndex + 1) % leftFrames.length;
    }, 800);
};

export const initGlitchEffect = (titleElement) => {
    if (!titleElement) return;
    
    // Store references to the ASCII elements so we don't lose them
    const asciiHeader = titleElement.querySelector('#ascii-header');
    const asciiHeaderRight = titleElement.querySelector('#ascii-header-right');
    
    setInterval(() => {
        // Glitch much more often (70% chance)
        if (Math.random() < 0.7) {
            const textArray = originalText.split('');
            const numCharsToGlitch = Math.floor(Math.random() * 4) + 2; // 2-5 characters
            
            // Select random positions to glitch
            for (let i = 0; i < numCharsToGlitch; i++) {
                const randomIndex = Math.floor(Math.random() * textArray.length);
                textArray[randomIndex] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            
            // Apply glitched text while preserving the ASCII brackets
            const glitchedText = textArray.join('');
            // Create a temporary text node to replace just the site name
            const textNodes = titleElement.childNodes;
            for (let node of textNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    node.textContent = ` ${glitchedText} `;
                    break;
                }
            }
            titleElement.classList.add('glitching');
            
            // Restore original text after a short time
            setTimeout(() => {
                // Restore original text while keeping ASCII brackets
                for (let node of titleElement.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                        node.textContent = ` ${originalText} `;
                        break;
                    }
                }
                titleElement.classList.remove('glitching');
            }, 200 + Math.random() * 300); // 200-500ms glitch duration (longer)
        }
    }, 800 + Math.random() * 1200); // Random interval between 0.8-2 seconds (much more frequent)
};
