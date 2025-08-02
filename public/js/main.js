import { mainContent, blogContent } from './modules/content.js';
import { getTimestamp, createTypeWriter } from './modules/terminal.js';
import { preloaderFrames, initPreloader } from './modules/preloader.js';
import { initHeaderAnimation } from './modules/header.js';
import { showSection } from './modules/section-manager.js';
import { initBlogToggles } from './modules/blog.js';
import { initImageModal } from './modules/modal.js';
import { initWinampPlayer } from './modules/winamp.js';
import { initHomePosts } from './modules/home.js';
import { initFooter } from './modules/footer.js';
import BackgroundEffects from './modules/background-effects.js';

// Cache DOM elements for better performance
const domCache = {};

// Function to get cached DOM elements
const getElement = (id) => {
    if (!domCache[id]) {
        domCache[id] = document.getElementById(id);
    }
    return domCache[id];
};

// Function to clear cache for a specific element (useful for dynamic elements)
const clearElementCache = (id) => {
    delete domCache[id];
};

// Function to handle blog section with terminal text
const initBlogSection = () => {
    const blogContainer = getElement('blog-content');
    if (!blogContainer) return;

    // Add typing class to hide content
    blogContainer.classList.add('typing-in-progress');

    // Clear the container and add terminal output only if needed
    blogContainer.innerHTML = '';
    // Only add the style once
    if (!document.getElementById('blog-terminal-style')) {
        const style = document.createElement('style');
        style.id = 'blog-terminal-style';
        style.innerHTML = `#blog-terminal-output pre, #blog-terminal-output div, #blog-terminal-output span { margin: 0 !important; padding: 0 !important; line-height: 1.1 !important; }`;
        document.head.appendChild(style);
    }
    const blogTerminalOutput = document.createElement('div');
    blogTerminalOutput.id = 'blog-terminal-output';
    blogTerminalOutput.className = 'terminal-output';
    blogTerminalOutput.style.lineHeight = '1.1';
    blogTerminalOutput.style.margin = '0';
    blogTerminalOutput.style.padding = '0';
    blogTerminalOutput.style.display = 'block';
    blogContainer.appendChild(blogTerminalOutput);
    clearElementCache('blog-terminal-output');
    const blogTypeWriter = createTypeWriter(blogTerminalOutput, blogContent);
    blogTypeWriter().then(() => {
        setTimeout(() => {
            console.log('Terminal finished, loading posts');
            initBlogToggles(() => {
                console.log('Posts loaded, removing typing class');
                blogContainer.classList.remove('typing-in-progress');
            }, blogContainer);
        }, 200);
    }).catch(error => {
        console.error('Error in blog typewriter:', error);
        blogContainer.classList.remove('typing-in-progress');
        initBlogToggles(null, blogContainer);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize background effects
        const backgroundEffects = new BackgroundEffects();

        // Only run the typewriter for the terminal output if on the Home section
        // Remove duplicate terminal output by not running this here

        const preloader = getElement('preloader');
        const siteContainer = document.querySelector('.site-container');
        
        if (preloader && siteContainer) {
            initPreloader(preloader, siteContainer, () => {
                // No typewriter here; handled by Home tab logic
            });
        }

        const asciiHeader = getElement('ascii-header');
        if (asciiHeader) {
            initHeaderAnimation(asciiHeader);
        }

        const mainNav = getElement('main-nav');
        const contentSections = document.querySelectorAll('.content-section');
        
        if (mainNav && contentSections.length > 0) {
            const navLinks = mainNav.querySelectorAll('a');
            
            window.showSection = function(sectionId) {
                showSection(sectionId, contentSections, navLinks);
            };

            mainNav.addEventListener('click', (e) => {
                const link = e.target.closest('a[data-section]');
                if (!link) return;
                
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                showSection(sectionId, contentSections, navLinks);
                
                if (sectionId === 'home-content') {
                    initHomePosts();
                } else if (sectionId === 'blog-content') {
                    initBlogSection();
                }
            });

            // Simulate clicking the Home tab on load
            const homeLink = mainNav.querySelector('a[data-section="home-content"]');
            if (homeLink) {
                homeLink.click();
            } else {
                // Fallback: show section and initialize home posts
                showSection('home-content', contentSections, navLinks);
                initHomePosts();
            }
        }

        // Removed duplicate initHomePosts(); now handled above
        initImageModal();
        initWinampPlayer();
        initFooter();
        
        // Handle window resize for background effects
        window.addEventListener('resize', () => {
            backgroundEffects.handleResize();
        });
        
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});
