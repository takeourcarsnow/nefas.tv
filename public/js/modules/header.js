export const headerFrames = ['[><]', '[> <]', '[><]', '[>  <]'];

export const initHeaderAnimation = (asciiHeader) => {
    let headerFrameIndex = 0;
    setInterval(() => {
        if (asciiHeader) asciiHeader.textContent = headerFrames[headerFrameIndex];
        headerFrameIndex = (headerFrameIndex + 1) % headerFrames.length;
    }, 500);
};
