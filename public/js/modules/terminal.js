export const getTimestamp = () => {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
};

export const createTypeWriter = (terminalOutput, terminalLines) => {
    return async () => {
        for (const line of terminalLines) {
            const lineElement = document.createElement('div');
            lineElement.style.color = line.color || '#00ff9d';
            
            if (line.text) {
                const timestamp = document.createElement('span');
                timestamp.style.color = '#666';
                timestamp.textContent = getTimestamp() + ' ';
                lineElement.appendChild(timestamp);
            }

            terminalOutput.appendChild(lineElement);
            
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
            for (let i = 0; i < line.text.length; i++) {
                const char = line.text[i];
                // Base typing speed with natural variation
                let delay = Math.random() * 10 + 10; // Random delay between 10-20ms
                
                // Brief pauses for punctuation and spaces
                if ('.!?,'.includes(char)) {
                    delay += 50; // Short pause at punctuation
                } else if (' '.includes(char)) {
                    delay += 15; // Tiny pause at spaces
                }
                
                // Very rare brief pauses
                if (Math.random() < 0.05) { // 5% chance
                    delay += Math.random() * 100; // 0-100ms pause
                }
                
                await new Promise(resolve => setTimeout(resolve, delay));
                
                // Create character span with fade-in effect
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.style.opacity = '0';
                charSpan.style.transition = 'opacity 0.15s';
                lineElement.insertBefore(charSpan, cursor);
                
                // Trigger fade-in
                requestAnimationFrame(() => {
                    charSpan.style.opacity = '1';
                });
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
