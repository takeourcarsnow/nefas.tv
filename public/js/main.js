import { mainContent } from './modules/content.js';
import { getTimestamp, createTypeWriter } from './modules/terminal.js';
import { preloaderFrames, initPreloader } from './modules/preloader.js';
import { initHeaderAnimation } from './modules/header.js';
import { showSection } from './modules/navigation.js';
import { initBlogToggles } from './modules/blog.js';
import { initImageModal } from './modules/modal.js';
import { initWinampPlayer } from './modules/winamp.js';

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
        });
    });

    // Initialize blog toggles
    initBlogToggles();

    // Initialize image modal
    initImageModal();

    // Initialize Winamp player
    initWinampPlayer();

    // Start typing after preloader
    setTimeout(() => {
        typeWriter();
    }, 2600);
});
