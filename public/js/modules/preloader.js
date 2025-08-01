const loadingMessages = [
    'Initializing system core...',
    'Loading neural networks...',
    'Compiling trash aesthetics...',
    'Synthesizing vaporwave...',
    'Calibrating digital entropy...',
    'Rendering glitch patterns...',
    'Connecting to cybervoid...',
    'Downloading virtual reality...',
    'Processing ASCII art...',
    'Engaging retro protocols...'
];

const generateFrame = (progress) => {
    const width = 24;
    const filled = Math.floor(width * progress);
    const empty = width - filled;
    const percentage = Math.floor(progress * 100);
    const message = loadingMessages[Math.floor(progress * loadingMessages.length)];
    
    return `[${'='.repeat(filled)}>${' '.repeat(empty)}] ${percentage}%

SYSTEM.INIT...OK
NEFAS.TV v1.0
${message}
${progress >= 1 ? '...RENDERING COMPLETE' : ''}`;
};

export const preloaderFrames = Array.from({ length: 50 }, (_, i) => generateFrame(i / 49));

export const initPreloader = (preloader, siteContainer) => {
    if (!preloader) return;
    
    let frameIndex = 0;
    const preloaderFrameCount = preloaderFrames.length;
    
    // Add initial styles
    preloader.style.fontFamily = 'monospace';
    preloader.style.whiteSpace = 'pre';
    
    const preloaderInterval = setInterval(() => {
        preloader.textContent = preloaderFrames[frameIndex];
        frameIndex++;
        
        if (frameIndex >= preloaderFrameCount - 1) {
            clearInterval(preloaderInterval);
            preloader.textContent = preloaderFrames[preloaderFrameCount - 1];
            
            // Add a small delay before fade out
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.transform = 'scale(0.95)';
                preloader.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                
                if (siteContainer) {
                    siteContainer.style.opacity = '1';
                    siteContainer.style.transform = 'scale(1)';
                    siteContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                }
                
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 800);
            }, 500);
        }
    }, 50);
};
