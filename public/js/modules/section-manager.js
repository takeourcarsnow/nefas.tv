import { sectionContent } from './section-data.js';
import { typeContent } from './typing-animation.js';

/**
 * Shows a specific section and handles navigation state
 * @param {string} sectionId - The ID of the section to show
 * @param {NodeList} contentSections - All content sections
 * @param {NodeList} navLinks - All navigation links
 */
export const showSection = (sectionId, contentSections, navLinks) => {
    contentSections.forEach(section => section.style.display = 'none');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeSection = document.getElementById(sectionId);
    const activeLink = document.querySelector(`nav a[data-section="${sectionId}"]`);
    
    if (activeSection) {
        // Clear previous terminal content only
        const oldTerminal = activeSection.querySelector('.terminal-output');
        if (oldTerminal) {
            oldTerminal.remove();
        }

        // Add CSS class to forcefully hide all content during typing
        activeSection.classList.add('typing-in-progress');
        activeSection.style.display = 'block';

        // Handle different section types
        if (sectionId === 'blog-content') {
            // Blog section is handled specially in main.js initBlogSection function
            // Content will be shown after the special blog typing completes
        } else if (sectionContent[sectionId]) {
            // Sections with terminal typing - content will be shown after typing completes
            typeContent(activeSection, sectionContent[sectionId]);
        } else {
            // Sections without terminal typing - remove class and show immediately
            setTimeout(() => {
                activeSection.classList.remove('typing-in-progress');
            }, 100);
        }
    }
    if (activeLink) activeLink.classList.add('active');
};
