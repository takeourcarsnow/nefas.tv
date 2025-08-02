/**
 * Creates a typing animation effect for terminal-style content
 * @param {HTMLElement} section - The section element to add the terminal to
 * @param {Array} lines - Array of line objects with text, color, and delay properties
 */
export const typeContent = async (section, lines) => {
    // Mark section as currently typing to prevent content from showing prematurely
    section.dataset.typing = 'true';
    
    const terminal = document.createElement('div');
    terminal.className = 'terminal-output';
    terminal.style.marginBottom = '30px';
    
    // Insert terminal at the start of the section content
    section.insertBefore(terminal, section.firstChild);

    for (const line of lines) {
        const lineElement = document.createElement('div');
        lineElement.className = 'terminal-line';
        lineElement.style.color = line.color || '#00ff9d';
        
        if (line.text) {
            const timestamp = document.createElement('span');
            timestamp.style.color = '#666';
            timestamp.textContent = `[${new Date().toTimeString().slice(0, 8)}] `;
            lineElement.appendChild(timestamp);
        }

        terminal.appendChild(lineElement);
        
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
            
            // Special handling for spaces to ensure proper spacing
            if (char === ' ') {
                charSpan.style.whiteSpace = 'pre';
                charSpan.style.display = 'inline';
            }
            
            lineElement.insertBefore(charSpan, cursor);
            
            // Trigger fade-in
            requestAnimationFrame(() => {
                charSpan.style.opacity = '1';
            });
        }

        // Handle cursor for the last line
        if (line === lines[lines.length - 1]) {
            // Keep the existing cursor for the last line
            cursor.dataset.finalCursor = 'true';
        } else {
            // Remove the cursor after the line is complete
            await new Promise(resolve => setTimeout(resolve, line.delay));
            cursor.remove();
        }

        await new Promise(resolve => setTimeout(resolve, line.delay));
    }

    // Mark typing as complete and show content
    section.dataset.typing = 'false';
    
    // Remove the CSS class that hides content - this will make all content visible
    setTimeout(() => {
        section.classList.remove('typing-in-progress');
        
        // Special handling for home section - load posts after content is shown
        if (section.id === 'home-content') {
            setTimeout(() => {
                // Dynamically import and call initHomePosts for the grid
                import('./home.js').then(({ initHomePosts }) => {
                    initHomePosts();
                }).catch(err => {
                    console.error('Error loading home posts:', err);
                });
            }, 100);
        }
    }, 200);
};
