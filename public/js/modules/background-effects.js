// Background Effects Module
// Handles subtle CRT glow and ambient background effects

class BackgroundEffects {
    constructor() {
        this.backgroundContainer = document.getElementById('matrix-rain');
        this.init();
    }

    init() {
        this.createCRTGlow();
        this.startAmbientEffects();
    }

    createCRTGlow() {
        if (!this.backgroundContainer) return;

        // Clear any existing content
        this.backgroundContainer.innerHTML = '';
        
        // Add CRT glow overlay
        const crtOverlay = document.createElement('div');
        crtOverlay.className = 'crt-glow-overlay';
        this.backgroundContainer.appendChild(crtOverlay);

        // Add subtle scan lines
        const scanLines = document.createElement('div');
        scanLines.className = 'crt-scan-lines';
        this.backgroundContainer.appendChild(scanLines);

        // Add ambient particles
        this.createAmbientParticles();
    }

    createAmbientParticles() {
        const particleCount = 8; // Keep it subtle
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'ambient-particle';
            
            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (15 + Math.random() * 20) + 's';
            
            this.backgroundContainer.appendChild(particle);
        }
    }

    startAmbientEffects() {
        // Subtle random CRT flicker effect
        setInterval(() => {
            const crtOverlay = document.querySelector('.crt-glow-overlay');
            if (crtOverlay && Math.random() < 0.05) { // 5% chance every interval
                crtOverlay.style.animation = 'crt-flicker 0.1s ease-in-out';
                setTimeout(() => {
                    crtOverlay.style.animation = 'crt-glow 4s ease-in-out infinite alternate';
                }, 100);
            }
        }, 3000); // Check every 3 seconds
    }

    // Adjust effects on window resize
    handleResize() {
        // CRT effect doesn't need resize handling as it uses percentage-based positioning
    }
}

export default BackgroundEffects;
