export const initWinampPlayer = () => {
    const winamp = document.getElementById('winamp');
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const timeDisplay = document.getElementById('winamp-time');
    const visualizer = document.getElementById('winamp-visualizer');
    
    // Early return if elements don't exist
    if (!winamp || !audio || !playBtn || !pauseBtn || !stopBtn || !timeDisplay || !visualizer) {
        console.warn('Winamp player elements not found');
        return;
    }
    
    // Create visualizer bars with optimized DOM manipulation
    const barCount = 30;
    const fragment = document.createDocumentFragment();
    const visBars = [];
    
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.classList.add('vis-bar');
        bar.style.height = '0%';
        fragment.appendChild(bar);
        visBars.push(bar);
    }
    visualizer.appendChild(fragment);

    // Optimized visualizer update with requestAnimationFrame
    let animationFrameId = null;
    let isPlaying = false;
    
    const updateVisualizer = () => {
        if (!isPlaying) return;
        
        // Batch DOM updates for better performance
        visBars.forEach(bar => {
            bar.style.height = `${Math.random() * 100}%`;
        });
        
        animationFrameId = requestAnimationFrame(updateVisualizer);
    };

    playBtn.addEventListener('click', async () => {
        try {
            // Ensure audio is not muted and has a source
            audio.muted = false;
            if (!audio.src) {
                alert('Audio source missing!');
                return;
            }
            await audio.play();
            isPlaying = true;
            updateVisualizer();
        } catch (err) {
            console.error('Audio play failed:', err);
            alert('Audio playback failed. See console for details.');
        }
    });
    
    pauseBtn.addEventListener('click', () => {
        audio.pause();
        isPlaying = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
    
    stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        // Reset visualizer bars
        visBars.forEach(bar => {
            bar.style.height = '0%';
        });
    });

    // Throttled time update for better performance
    let timeUpdateTimeout = null;
    audio.addEventListener('timeupdate', () => {
        if (timeUpdateTimeout) return;
        
        timeUpdateTimeout = setTimeout(() => {
            const minutes = Math.floor(audio.currentTime / 60);
            const seconds = Math.floor(audio.currentTime % 60);
            timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            timeUpdateTimeout = null;
        }, 100); // Update every 100ms instead of every frame
    });

    // Handle play/pause events
    audio.addEventListener('play', () => {
        isPlaying = true;
        updateVisualizer();
    });
    
    audio.addEventListener('pause', () => {
        isPlaying = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });

    // Add some visual feedback when audio ends
    audio.addEventListener('ended', () => {
        isPlaying = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        // Reset visualizer bars
        visBars.forEach(bar => {
            bar.style.height = '0%';
        });
        // Reset time display
        timeDisplay.textContent = '00:00';
    });
};
