import { mainContent, blogContent } from './modules/content.js';
import { getTimestamp, createTypeWriter } from './modules/terminal.js';
import { preloaderFrames, initPreloader } from './modules/preloader.js';
import { initHeaderAnimation, initGlitchEffect, initScrollingText } from './modules/header.js';
import { showSection, resetSection, resetAllSections } from './modules/section-manager.js';
import { initBlogToggles } from './modules/blog.js';
import { initImageModal } from './modules/modal.js';
import { initWinampPlayer } from './modules/winamp.js';
import { initHomePosts } from './modules/home.js';
import { initFooter } from './modules/footer.js';
import BackgroundEffects from './modules/background-effects.js';

// Cache DOM elements for better performance
const domCache = {};

// Track which sections have been initialized to avoid re-initialization
const initializedSections = new Set();

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

        // Cache navigation elements first
        const mainNav = getElement('main-nav');
        const contentSections = document.querySelectorAll('.content-section');
        const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

        const preloader = getElement('preloader');
        const siteContainer = document.querySelector('.site-container');
        
        if (preloader && siteContainer) {
            initPreloader(preloader, siteContainer, () => {
                // Start home section immediately when preloader finishes its frames
                // This will begin as the preloader starts its fade out
                const homeLink = mainNav.querySelector('a[data-section="home-content"]');
                if (homeLink) {
                    homeLink.click();
                } else {
                    // Fallback: show section and initialize home posts
                    showSection('home-content', contentSections, navLinks);
                    if (!initializedSections.has('home-content')) {
                        initializedSections.add('home-content');
                        initHomePosts();
                    }
                }
            });
        }

        const asciiHeader = getElement('ascii-header');
        const asciiHeaderRight = getElement('ascii-header-right');
        if (asciiHeader && asciiHeaderRight) {
            initHeaderAnimation(asciiHeader, asciiHeaderRight);
        }

        // Initialize scrolling text LED effect
        initScrollingText();

        // Initialize glitch effect on the main title
        const headerTitle = document.querySelector('header h1');
        if (headerTitle) {
            initGlitchEffect(headerTitle);
        }

        if (mainNav && contentSections.length > 0) {
            
            window.showSection = function(sectionId) {
                showSection(sectionId, contentSections, navLinks);
            };

            // Expose reset functions for debugging
            window.resetSection = resetSection;
            window.resetAllSections = resetAllSections;

            mainNav.addEventListener('click', (e) => {
                const link = e.target.closest('a[data-section]');
                if (!link) return;
                
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                showSection(sectionId, contentSections, navLinks);
                
                // Always initialize home posts when showing home section to ensure effects work
                if (sectionId === 'home-content') {
                    initHomePosts();
                }
                
                // Only initialize content if this section hasn't been initialized before
                if (!initializedSections.has(sectionId)) {
                    initializedSections.add(sectionId);
                    
                    if (sectionId === 'blog-content') {
                        initBlogSection();
                    }
                }
            });

            // Don't auto-click home tab here - it's now handled in preloader callback
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
