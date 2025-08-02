// This file has been split into smaller modules for better organization:
// - section-data.js: Contains section content data
// - typing-animation.js: Contains the typing animation functionality  
// - section-manager.js: Contains section switching logic

// Re-export for backward compatibility
export { sectionContent } from './section-data.js';
export { typeContent } from './typing-animation.js';
export { showSection } from './section-manager.js';
