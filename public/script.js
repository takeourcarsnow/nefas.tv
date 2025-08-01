document.addEventListener('DOMContentLoaded', () => {

    // --- [ TERMINAL OUTPUT LOGIC ] ---
    const terminalOutput = document.getElementById('terminal-output');
    const terminalLines = [
        { text: '> Initializing nefas.tv...', color: '#00ff9d', delay: 500 },
        { text: '> Running system diagnostics...', color: '#00ff9d', delay: 800 },
        { text: '[SUCCESS] Connection established', color: '#00ff00', delay: 300 },
        { text: '[INFO] Loading user profile...', color: '#00ff9d', delay: 500 },
        { text: '=============================================', color: '#666', delay: 100 },
        { text: "you've reached nefas.tv", color: '#ff00ff', delay: 100 },
        { text: 'the digital containment zone for my various projects,', color: '#fff', delay: 50 },
        { text: 'brain-dumps, and autistic screeching.', color: '#fff', delay: 50 },
        { text: '', delay: 300 },
        { text: 'i make things.', color: '#00ff9d', delay: 100 },
        { text: 'sometimes they\'re videos,', color: '#ff00ff', delay: 50 },
        { text: 'sometimes they\'re photos,', color: '#00ff9d', delay: 50 },
        { text: 'sometimes it\'s just code that barely works.', color: '#ff0000', delay: 50 },
        { text: '', delay: 300 },
        { text: 'it\'s all garbage, but it\'s my garbage.', color: '#ffff00', delay: 100 },
        { text: 'click around, don\'t stay too long.', color: '#ff00ff', delay: 50 },
        { text: '', delay: 300 },
        { text: '[WARNING] this site is a monument to bad taste', color: '#ff0000', delay: 100 },
        { text: '[WARNING] if your eyes bleed, that\'s a feature, not a bug', color: '#ff0000', delay: 100 },
        { text: '=============================================', color: '#666', delay: 100 }
    ];

    const getTimestamp = () => {
        const now = new Date();
        return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    };

    const typeWriter = async () => {
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

    // Start typing after preloader
    setTimeout(() => {
        typeWriter();
    }, 2600);

    // --- [ PRELOADER LOGIC ] ---
    const preloader = document.getElementById('preloader');
    const siteContainer = document.querySelector('.site-container');
    const preloaderAsciiFrames = [
`[>                        ]`,
`[=>                       ]`,
`[==>                      ]`,
`[===>                     ]`,
`[====>                    ]`,
`[=====>                   ]`,
`[======>                  ]`,
`[=======>                 ]`,
`[========>                ]`,
`[=========>               ]`,
`[==========>              ]`,
`[===========>             ]`,
`[============>            ]`,
`[=============>           ]`,
`[==============>          ]`,
`[===============>         ]`,
`[================>        ]`,
`[=================>       ]`,
`[==================>      ]`,
`[===================>     ]`,
`[====================>    ]`,
`[=====================>   ]`,
`[======================>  ]`,
`[=======================> ]`,
`[========================>]`,
`
SYSTEM.INIT...OK
NEFAS.TV v1.0
LOADING INTERFACE...
`,
`
SYSTEM.INIT...OK
NEFAS.TV v1.0
LOADING INTERFACE...
...RENDERING TRASH
`
    ];
    let frameIndex = 0;
    const preloaderFrameCount = preloaderAsciiFrames.length;
    const preloaderInterval = setInterval(() => {
        if (preloader) {
            preloader.textContent = preloaderAsciiFrames[frameIndex];
            frameIndex++;
            if (frameIndex >= preloaderFrameCount - 1) {
                clearInterval(preloaderInterval);
                // Show only the last frame (the final text)
                preloader.textContent = preloaderAsciiFrames[preloaderFrameCount - 1];
            }
        }
    }, 80);

    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                preloader.style.display = 'none';
                preloader.textContent = '';
            }, 500);
        }
        document.body.style.overflow = 'auto'; // Restore scroll
        if(siteContainer) siteContainer.style.opacity = '1';
    }, 2500);


    // --- [ ASCII HEADER ANIMATION ] ---
    const asciiHeader = document.getElementById('ascii-header');
    const headerFrames = ['[><]', '[> <]', '[><]', '[>  <]'];
    let headerFrameIndex = 0;
    setInterval(() => {
        if (asciiHeader) asciiHeader.textContent = headerFrames[headerFrameIndex];
        headerFrameIndex = (headerFrameIndex + 1) % headerFrames.length;
    }, 500);

    // --- [ NAVIGATION (SPA-like behavior) ] ---
    const navLinks = document.querySelectorAll('#main-nav a');
    const contentSections = document.querySelectorAll('.content-section');

    // Terminal content for each section
    const sectionContent = {
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

    const typeContent = async (section, lines) => {
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

    window.showSection = function(sectionId) {
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
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // --- [ BLOG SNIPPET TOGGLE ] ---
    const blogSnippets = document.querySelectorAll('.blog-snippet-header');
    blogSnippets.forEach(header => {
        header.addEventListener('click', () => {
            const fullContent = header.nextElementSibling;
            const toggleText = header.querySelector('.blog-toggle');
            const isVisible = fullContent.style.display === 'block';

            fullContent.style.display = isVisible ? 'none' : 'block';
            toggleText.textContent = isVisible ? '[ read more... ]' : '[ ...read less ]';
        });
    });

    // --- [ 3D IMAGE MODAL ] ---
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');

    document.querySelectorAll('.d3-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-src');
            const captionText = item.getAttribute('data-caption');
            modalImg.src = imgSrc;
            modalCaption.textContent = `> ${captionText}`;
            modal.style.display = 'flex';
            // Hide CRT scanlines when modal is open
            const scanlines = document.querySelector('.scanlines');
            if (scanlines) scanlines.style.display = 'none';
        });
    });
    
    const hideModal = () => {
        modal.style.display = 'none';
        // Restore CRT scanlines when modal is closed
        const scanlines = document.querySelector('.scanlines');
        if (scanlines) scanlines.style.display = '';
    };

    closeModal.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // --- [ WINAMP PLAYER LOGIC ] ---
    const winamp = document.getElementById('winamp');
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const timeDisplay = document.getElementById('winamp-time');
    const visualizer = document.getElementById('winamp-visualizer');
    
    // Create visualizer bars
    for (let i = 0; i < 30; i++) {
        const bar = document.createElement('div');
        bar.classList.add('vis-bar');
        visualizer.appendChild(bar);
    }
    const visBars = document.querySelectorAll('.vis-bar');

    playBtn.addEventListener('click', () => {
        // Ensure audio is not muted and has a source
        audio.muted = false;
        if (!audio.src) {
            alert('Audio source missing!');
            return;
        }
        audio.play().catch(err => {
            console.error('Audio play failed:', err);
            alert('Audio playback failed. See console for details.');
        });
    });
    pauseBtn.addEventListener('click', () => audio.pause());
    stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
    });

    audio.addEventListener('timeupdate', () => {
        const minutes = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60);
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Fake visualizer logic
        if (!audio.paused) {
            visBars.forEach(bar => {
                bar.style.height = `${Math.random() * 100}%`;
            });
        }
    });

    // Make Winamp draggable
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    const titleBar = document.querySelector('.winamp-title-bar');

    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offset.x = e.clientX - winamp.offsetLeft;
        offset.y = e.clientY - winamp.offsetTop;
        winamp.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        winamp.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            winamp.style.left = `${e.clientX - offset.x}px`;
            winamp.style.top = `${e.clientY - offset.y}px`;
        }
    });

}); 