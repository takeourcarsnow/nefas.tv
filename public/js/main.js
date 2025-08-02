import { mainContent, blogContent } from './modules/content.js';
import { getTimestamp, createTypeWriter } from './modules/terminal.js';
import { preloaderFrames, initPreloader } from './modules/preloader.js';
import { initHeaderAnimation } from './modules/header.js';
import { showSection } from './modules/navigation.js';
import { initBlogToggles } from './modules/blog.js';
import { initImageModal } from './modules/modal.js';
import { initWinampPlayer } from './modules/winamp.js';
import { initHomePosts } from './modules/home.js';

// Function to handle blog section with terminal text
const initBlogSection = () => {
    const blogContainer = document.getElementById('blog-content');
    if (!blogContainer) return;

    // Clear the container and add terminal output and posts container
    blogContainer.innerHTML = `
        <div id="blog-terminal-output"></div>
        <div id="blog-posts-container" style="display: none; margin-top: 20px;"></div>
    `;
    
    const blogTerminalOutput = document.getElementById('blog-terminal-output');
    const blogPostsContainer = document.getElementById('blog-posts-container');
    const blogTypeWriter = createTypeWriter(blogTerminalOutput, blogContent);
    
    // Start typing the blog terminal text
    blogTypeWriter().then(() => {
        // After terminal text is finished, load the blog posts in the separate container
        console.log('Terminal finished, loading posts into:', blogPostsContainer);
        initBlogToggles(() => {
            console.log('Posts loaded, showing container');
            // Show the blog posts container after posts are loaded
            blogPostsContainer.style.display = 'block';
            blogPostsContainer.style.opacity = '0';
            setTimeout(() => {
                blogPostsContainer.style.transition = 'opacity 0.5s ease';
                blogPostsContainer.style.opacity = '1';
            }, 100);
        }, blogPostsContainer);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize terminal output
    const terminalOutput = document.getElementById('terminal-output');
    const typeWriter = createTypeWriter(terminalOutput, mainContent);

    // Initialize preloader
    const preloader = document.getElementById('preloader');
    const siteContainer = document.querySelector('.site-container');
    initPreloader(preloader, siteContainer);

    // Initialize header animation
    const asciiHeader = document.getElementById('ascii-header');
    initHeaderAnimation(asciiHeader);

    // Initialize navigation
    const navLinks = document.querySelectorAll('#main-nav a');
    const contentSections = document.querySelectorAll('.content-section');
    window.showSection = function(sectionId) {
        showSection(sectionId, contentSections, navLinks);
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId, contentSections, navLinks);
            if (sectionId === 'home-content') {
                initHomePosts();
            } else if (sectionId === 'blog-content') {
                initBlogSection();
            }
        });
    });

    // Initialize blog toggles (for initial load, but won't be called for blog section)
    // initBlogToggles();
    // Initialize home posts
    initHomePosts();

    // Initialize image modal
    initImageModal();

    // Initialize Winamp player
    initWinampPlayer();

    // Start typing after preloader
    setTimeout(() => {
        typeWriter();
    }, 2600);
});
