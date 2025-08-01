export const sectionContent = {
    'video-content': [
        { text: '> Loading video feed...', color: '#00ff9d', delay: 300 },
        { text: '[INFO] Establishing connection to video servers', color: '#00ff9d', delay: 200 },
        { text: '[SUCCESS] Connection established', color: '#00ff00', delay: 200 },
        { text: '=============================================', color: '#666', delay: 100 },
        { text: 'a collection of moving pictures to rot your brain.', color: '#ff00ff', delay: 50 },
        { text: "i'll replace these with my own stuff eventually. probably.", color: '#fff', delay: 50 },
        { text: '=============================================', color: '#666', delay: 100 }
    ],
    'photo-content': [
        { text: '> Initializing image processor...', color: '#00ff9d', delay: 300 },
        { text: '[INFO] Loading photography database', color: '#00ff9d', delay: 200 },
        { text: '[STATUS] Processing image data', color: '#ffff00', delay: 200 },
        { text: '=============================================', color: '#666', delay: 100 },
        { text: 'i point my camera at things. mostly at night.', color: '#ff00ff', delay: 50 },
        { text: "here's my instagram feed. go give me validation.", color: '#fff', delay: 50 },
        { text: '=============================================', color: '#666', delay: 100 }
    ],
    'd3-content': [
        { text: '> Loading 3D rendering engine...', color: '#00ff9d', delay: 300 },
        { text: '[WARNING] GPU temperature critical', color: '#ff0000', delay: 200 },
        { text: '[INFO] Initializing particle systems', color: '#00ff9d', delay: 200 },
        { text: '=============================================', color: '#666', delay: 100 },
        { text: 'some abstract garbage i cooked up in blender, c4d, and houdini.', color: '#ff00ff', delay: 50 },
        { text: "it's mostly shiny spheres and particle nonsense.", color: '#fff', delay: 50 },
        { text: 'click to embiggen.', color: '#00ff9d', delay: 50 },
        { text: '=============================================', color: '#666', delay: 100 }
    ],
    'webdev-content': [
        { text: '> npm install depression', color: '#00ff9d', delay: 300 },
        { text: '[INFO] Installing 69,420 dependencies...', color: '#ffff00', delay: 200 },
        { text: '[WARNING] Memory leak detected', color: '#ff0000', delay: 200 },
        { text: '[STATUS] Bundle size: TOO_DAMN_BIG', color: '#ff0000', delay: 200 },
        { text: '=============================================', color: '#666', delay: 100 },
        { text: 'i occasionally write code that gets deployed to the internet.', color: '#ff00ff', delay: 50 },
        { text: 'here are some examples of me wage-cucking for big tech', color: '#fff', delay: 50 },
        { text: 'or just making dumb shit for fun.', color: '#00ff9d', delay: 50 },
        { text: '=============================================', color: '#666', delay: 100 }
    ],
    'blog-content': [
        { text: '> Accessing thought database...', color: '#00ff9d', delay: 300 },
        { text: '[WARNING] Unfiltered content detected', color: '#ff0000', delay: 200 },
        { text: '[INFO] Loading brain dump sequence', color: '#00ff9d', delay: 200 },
        { text: '=============================================', color: '#666', delay: 100 },
        { text: 'unfiltered thoughts and long-form posting.', color: '#ff00ff', delay: 50 },
        { text: 'click titles to expand/collapse.', color: '#fff', delay: 50 },
        { text: '=============================================', color: '#666', delay: 100 }
    ],
    'misc-content': [
        { text: '> Loading miscellaneous data...', color: '#00ff9d', delay: 300 },
        { text: '[INFO] Searching for random content', color: '#00ff9d', delay: 200 },
        { text: '[WARNING] Digital chaos detected', color: '#ff0000', delay: 200 },
        { text: '=============================================', color: '#666', delay: 100 },
        { text: 'a digital shoebox for things that don\'t fit anywhere else.', color: '#ff00ff', delay: 50 },
        { text: 'links, files, random thoughts.', color: '#fff', delay: 50 },
        { text: "check back later, or don't. i'm not your dad.", color: '#00ff9d', delay: 50 },
        { text: '=============================================', color: '#666', delay: 100 }
    ]
};

export const typeContent = async (section, lines) => {
    const terminal = document.createElement('div');
    terminal.className = 'terminal-output';
    terminal.style.marginBottom = '30px';
    
    // Insert terminal at the start of the section content
    section.insertBefore(terminal, section.firstChild);

    for (const line of lines) {
        const lineElement = document.createElement('div');
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

    // Show the rest of the section content
    Array.from(section.children).forEach(child => {
        if (child !== terminal) {
            child.style.opacity = '0';
            child.style.display = 'block';
            setTimeout(() => {
                child.style.transition = 'opacity 0.5s ease';
                child.style.opacity = '1';
            }, 100);
        }
    });
};

export const showSection = (sectionId, contentSections, navLinks) => {
    contentSections.forEach(section => section.style.display = 'none');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeSection = document.getElementById(sectionId);
    const activeLink = document.querySelector(`nav a[data-section="${sectionId}"]`);
    
    if (activeSection) {
        // Clear previous content
        const oldTerminal = activeSection.querySelector('.terminal-output');
        if (oldTerminal) {
            oldTerminal.remove();
        }

        // Hide all children initially
        Array.from(activeSection.children).forEach(child => {
            child.style.opacity = '0';
            child.style.display = 'none';
        });

        activeSection.style.display = 'block';

        // Type new content if available
        if (sectionContent[sectionId]) {
            typeContent(activeSection, sectionContent[sectionId]);
        } else {
            // If no terminal content, just show the section normally
            Array.from(activeSection.children).forEach(child => {
                child.style.display = 'block';
                child.style.opacity = '1';
            });
        }
    }
    if (activeLink) activeLink.classList.add('active');
};
