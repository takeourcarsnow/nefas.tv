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
    const messageIndex = Math.min(Math.floor(progress * loadingMessages.length), loadingMessages.length - 1);
    const message = loadingMessages[messageIndex];
    
    return `[${'='.repeat(filled)}>${' '.repeat(empty)}] ${percentage}%

SYSTEM.INIT...OK
NEFAS.TV v1.0
${message}
${progress >= 1 ? '...RENDERING COMPLETE' : ''}`;
};

// Pre-generate frames for better performance
export const preloaderFrames = Array.from({ length: 50 }, (_, i) => generateFrame(i / 49));

export const initPreloader = (preloader, siteContainer, onComplete) => {
    if (!preloader) {
        console.warn('Preloader element not found');
        return;
    }
    
    let frameIndex = 0;
    const preloaderFrameCount = preloaderFrames.length;
    
    // Add initial styles with hardware acceleration
    preloader.style.fontFamily = 'monospace';
    preloader.style.whiteSpace = 'pre';
    preloader.style.willChange = 'opacity, transform';
    
    // Use requestAnimationFrame for smoother animation
    const animatePreloader = () => {
        preloader.textContent = preloaderFrames[frameIndex];
        frameIndex++;
        
        if (frameIndex >= preloaderFrameCount - 1) {
            preloader.textContent = preloaderFrames[preloaderFrameCount - 1];
            
            // Start typing animation immediately
            if (onComplete) {
                onComplete();
            }
            
            // Add a small delay before fade out
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.transform = 'scale(0.95)';
                preloader.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                
                if (siteContainer) {
                    siteContainer.style.opacity = '1';
                    siteContainer.style.transform = 'scale(1)';
                    siteContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    siteContainer.style.willChange = 'opacity, transform';
                }
                
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    preloader.style.willChange = 'auto';
                    if (siteContainer) {
                        siteContainer.style.willChange = 'auto';
                    }
                }, 800);
            }, 500);
            return;
        }
        
        setTimeout(() => requestAnimationFrame(animatePreloader), 50);
    };
    
    animatePreloader();
};
