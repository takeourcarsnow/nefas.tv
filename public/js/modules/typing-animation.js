/**
 * Creates a typing animation effect for terminal-style content
 * @param {HTMLElement} section - The section element to add the terminal to
 * @param {Array} lines - Array of line objects with text, color, and delay properties
 * @returns {Promise} Promise that resolves when typing is complete
 */
export const typeContent = async (section, lines) => {
    // Mark section as currently typing to prevent content from showing prematurely
    section.dataset.typing = 'true';
    
    const terminal = document.createElement('div');
    terminal.className = 'terminal-output';
    terminal.style.marginBottom = '30px';
    
    // Insert terminal at the start of the section content
    section.insertBefore(terminal, section.firstChild);

    // Track when 'decrypt' and 'write on caption' lines are finished
    let decryptDone = false;
    let captionDone = false;
    let contentRevealed = false;
    let revealContent = () => {
        if (contentRevealed) return;
        contentRevealed = true;
        section.dataset.typing = 'false';
        setTimeout(() => {
            section.classList.remove('typing-in-progress');
            if (section.id === 'home-content') {
                setTimeout(() => {
                    import('./home.js').then(({ initHomePosts }) => {
                        initHomePosts();
                    }).catch(err => {
                        console.error('Error loading home posts:', err);
                    });
                }, 100);
            }
        }, 200);
    };

    // Pre-scan for presence of 'decrypt' and 'write on caption' lines
    const hasDecrypt = lines.some(line => line.text && typeof line.text === 'string' && /decrypt/i.test(line.text));
    const hasCaption = lines.some(line => line.text && typeof line.text === 'string' && /write on caption/i.test(line.text));

    for (const [idx, line] of lines.entries()) {
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
            // Base typing speed with natural variation - much faster
            let delay = Math.random() * 3 + 3; // Much faster: Random delay between 3-6ms

            // Brief pauses for punctuation and spaces
            if ('.!?,'.includes(char)) {
                delay += 15; // Reduced pause at punctuation
            } else if (' '.includes(char)) {
                delay += 5; // Reduced pause at spaces
            }

            // Very rare brief pauses
            if (Math.random() < 0.02) { // 2% chance (reduced from 5%)
                delay += Math.random() * 30; // 0-30ms pause (reduced from 100ms)
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

        // Check if this line is 'decrypt' or 'write on caption'
        if (line.text && typeof line.text === 'string') {
            if (/decrypt/i.test(line.text)) decryptDone = true;
            if (/write on caption/i.test(line.text)) captionDone = true;
        }

        // If both are done, reveal content (only once)
        if (decryptDone && captionDone && !contentRevealed) {
            revealContent();
        }
    }

    // Only fallback if neither 'decrypt' nor 'write on caption' are present in the lines
    if (!hasDecrypt && !hasCaption && !contentRevealed) {
        revealContent();
    }
    return Promise.resolve();
};
