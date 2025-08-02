export const initWinampPlayer = () => {
    const winamp = document.getElementById('winamp');
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const timeDisplay = document.getElementById('winamp-time');
    const visualizer = document.getElementById('winamp-visualizer');
    
    // Create visualizer bars
    for (let i = 0; i < 30; i++) {
        const bar = document.createElement('div');
        bar.classList.add('vis-bar');
        visualizer.appendChild(bar);
    }
    const visBars = document.querySelectorAll('.vis-bar');

    playBtn.addEventListener('click', () => {
        // Ensure audio is not muted and has a source
        audio.muted = false;
        if (!audio.src) {
            alert('Audio source missing!');
            return;
        }
        audio.play().catch(err => {
            console.error('Audio play failed:', err);
            alert('Audio playback failed. See console for details.');
        });
    });
    pauseBtn.addEventListener('click', () => audio.pause());
    stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
    });

    audio.addEventListener('timeupdate', () => {
        const minutes = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60);
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Fake visualizer logic
        if (!audio.paused) {
            visBars.forEach(bar => {
                bar.style.height = `${Math.random() * 100}%`;
            });
        }
    });

    // Make Winamp draggable
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    const titleBar = document.querySelector('.winamp-title-bar');

    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offset.x = e.clientX - winamp.offsetLeft;
        offset.y = e.clientY - winamp.offsetTop;
        winamp.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        winamp.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            winamp.style.left = `${e.clientX - offset.x}px`;
            winamp.style.top = `${e.clientY - offset.y}px`;
        }
    });
};
