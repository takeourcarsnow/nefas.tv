export const getTimestamp = () => {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
};

export const createTypeWriter = (terminalOutput, terminalLines) => {
    if (!terminalOutput || !Array.isArray(terminalLines)) {
        console.error('Invalid parameters for createTypeWriter');
        return () => Promise.resolve();
    }

    return async () => {
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        for (const line of terminalLines) {
            if (!line.text || line.text.trim() === '') continue; // Skip empty lines

            const lineElement = document.createElement('div');
            lineElement.className = 'terminal-line';
            lineElement.style.color = line.color || '#00ff9d';

            if (line.text) {
                const timestamp = document.createElement('span');
                timestamp.style.color = '#666';
                timestamp.textContent = getTimestamp() + ' ';
                lineElement.appendChild(timestamp);
            }

            // Add to fragment first, then append to DOM for better performance
            fragment.appendChild(lineElement);
            terminalOutput.appendChild(fragment);

            // Create a cursor element that will move with the text
            const cursor = document.createElement('span');
            cursor.textContent = '▋';
            cursor.style.animation = 'cursor-blink 1s infinite';
            cursor.style.marginLeft = '1px';
            lineElement.appendChild(cursor);

            // Remove any previous cursor from last line
            const previousLine = lineElement.previousElementSibling;
            if (previousLine) {
                const previousCursor = previousLine.querySelector('span[data-cursor]');
                if (previousCursor) previousCursor.remove();
            }
            cursor.dataset.cursor = 'true'; // Mark this as a cursor for easy finding

            // Type each character with human-like variations
            const textContent = document.createElement('span');
            lineElement.insertBefore(textContent, cursor);
            
            for (let i = 0; i < line.text.length; i++) {
                const char = line.text[i];
                // Base typing speed with natural variation - optimized for better performance
                let delay = Math.random() * 8 + 8; // Slightly faster: Random delay between 8-16ms

                // Brief pauses for punctuation and spaces
                if ('.!?,'.includes(char)) {
                    delay += 30; // Reduced pause at punctuation
                } else if (' '.includes(char)) {
                    delay += 10; // Reduced pause at spaces
                }

                // Rare brief pauses - reduced frequency for better performance
                if (Math.random() < 0.03) { // 3% chance (reduced from 5%)
                    delay += Math.random() * 50; // 0-50ms pause (reduced from 100ms)
                }

                await new Promise(resolve => setTimeout(resolve, delay));

                // Update text content directly for better performance
                textContent.textContent += char;
            }

            // Handle cursor for the last line
            if (line === terminalLines[terminalLines.length - 1]) {
                // Keep the existing cursor for the last line
                cursor.dataset.finalCursor = 'true';
            } else {
                // Remove the cursor after the line is complete
                await new Promise(resolve => setTimeout(resolve, line.delay));
                cursor.remove();
            }

            await new Promise(resolve => setTimeout(resolve, line.delay));
        }
    };
};
