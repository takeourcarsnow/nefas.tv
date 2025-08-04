// Module for loading and displaying 3D renders
export function init3D() {
    const renderGallery = document.getElementById('d3-gallery');
    if (!renderGallery) return;

    // Load 3D renders from JSON
    fetch('/3d/3d.json')
        .then(response => response.json())
        .then(renders => {
            if (renders && renders.length > 0) {
                display3DRenders(renders, renderGallery);
            }
        })
        .catch(error => {
            console.error('Error loading 3D renders:', error);
            renderGallery.innerHTML = '<p style="color: #ff0000;">[ERROR] Failed to load 3D render database</p>';
        });
}

function display3DRenders(renders, container) {
    container.innerHTML = '';
    
    renders.forEach((render, idx) => {
        const renderItem = document.createElement('div');
        renderItem.className = 'grid-item d3-item';
        renderItem.innerHTML = `
            <img src="${render.thumbnail}" 
                 alt="${render.title}" 
                 decoding="async" 
                 style="cursor: pointer; opacity: 1; display: block;"
                 data-full-image="${render.image}"
                 data-title="${render.title}"
                 data-description="${render.description}">
            <p class="d3-caption">> ${render.title}</p>
        `;
        // Add click event to show full image in modal, with navigation
        const img = renderItem.querySelector('img');
        img.addEventListener('click', () => {
            show3DModal(render, renders, idx);
        });
        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
        });
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
        }, 100);
        container.appendChild(renderItem);
    });
}

function show3DModal(render, rendersArr = null, startIndex = null) {
    // Remove any existing modal
    const oldModal = document.querySelector('.render-modal');
    if (oldModal) document.body.removeChild(oldModal);

    let currentIndex = startIndex;
    let itemsArr = Array.isArray(rendersArr) ? rendersArr : null;

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'render-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.92);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
        animation: none !important;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        text-align: center;
        position: relative;
        background: none;
    `;

    // Fallbacks for missing fields
    const image = render.image || render.thumbnail || '';
    const title = render.title || '';
    const description = render.description || '';
    const tags = Array.isArray(render.tags) ? render.tags.map(tag => `#${tag}`).join(' ') : '';

    // Zoom state
    let zoom = 1;
    function updateControlsVisibility() {
        const closeBtn = modalContent.querySelector('.close-photo-modal');
        const prevBtn = modalContent.querySelector('.prev-photo');
        const nextBtn = modalContent.querySelector('.next-photo');
        if (zoom > 1) {
            if (closeBtn) closeBtn.style.display = 'none';
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        } else {
            if (closeBtn) closeBtn.style.display = '';
            if (prevBtn) prevBtn.style.display = '';
            if (nextBtn) nextBtn.style.display = '';
        }
    }

    modalContent.innerHTML = `
        <button class="close-photo-modal" style="position:fixed;top:32px;right:48px;background:none;border:1px solid #fff;color:#fff;font-size:2.2em;padding:6px 18px;border-radius:4px;cursor:pointer;z-index:10001;">✕</button>
        <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            ${itemsArr ? `<button class=\"prev-photo\" style=\"position:absolute;left:-70px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.4);border:none;color:#fff;font-size:3em;cursor:pointer;padding:0 16px 0 8px;border-radius:8px 0 0 8px;z-index:10000;\">&#8592;</button>` : ''}
            <img class="modal-photo-img" src="${image}" alt="${title}"
                style="max-width:100vw;max-height:80vh;object-fit:contain;border-radius:6px;transform:scale(1);transition:transform 0.2s;cursor:zoom-in;">
            ${itemsArr ? `<button class=\"next-photo\" style=\"position:absolute;right:-70px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.4);border:none;color:#fff;font-size:3em;cursor:pointer;padding:0 8px 0 16px;border-radius:0 8px 8px 0;z-index:10000;\">&#8594;</button>` : ''}
        </div>
        <div style="color: white; margin-top: 18px; text-align: center; max-width: 90vw;">
            <h3 style="margin: 0 0 5px 0; color: #00ff9d;">${title}</h3>
            <p style="margin: 0 0 10px 0; color: #ccc; font-size:1.1em; background:rgba(0,0,0,0.5); display:inline-block; padding:4px 16px; border-radius:6px;">${description}</p>
            <div style="font-size: 0.9em; color: #666;">
                ${tags}
            </div>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Prevent modal close on content click
    modalContent.addEventListener('click', e => e.stopPropagation());
    // Close modal on overlay click or close button
    modal.addEventListener('click', () => document.body.removeChild(modal));
    modalContent.querySelector('.close-photo-modal').addEventListener('click', () => document.body.removeChild(modal));

    // Zoom by click/tap only
    const img = modalContent.querySelector('.modal-photo-img');
    // Zoom and pan logic
    let panX = 0, panY = 0, isDragging = false, startX = 0, startY = 0, lastPanX = 0, lastPanY = 0;
    function updateTransform() {
        img.style.transform = `scale(${zoom}) translate(${panX}px, ${panY}px)`;
        img.style.cursor = zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in';
    }
    let wasDragging = false;
    img.addEventListener('mousedown', (e) => {
        if (zoom === 1) return;
        isDragging = true;
        wasDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        lastPanX = panX;
        lastPanY = panY;
        img.style.cursor = 'grabbing';
        e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panX = lastPanX + (e.clientX - startX);
        panY = lastPanY + (e.clientY - startY);
        if (Math.abs(e.clientX - startX) > 2 || Math.abs(e.clientY - startY) > 2) {
            wasDragging = true;
        }
        updateTransform();
    });
    window.addEventListener('mouseup', (e) => {
        if (isDragging && !wasDragging && zoom > 1) {
            // treat as click, do nothing (let click handler run)
        }
        isDragging = false;
        if (zoom > 1) img.style.cursor = 'grab';
    });
    img.addEventListener('click', (e) => {
        if (wasDragging) {
            wasDragging = false;
            return;
        }
        if (zoom === 1) {
            zoom = 2;
        } else {
            zoom = 1;
            panX = 0;
            panY = 0;
        }
        updateTransform();
        updateControlsVisibility();
    });
    img.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoom = Math.min(zoom + 0.1, 3);
        } else {
            zoom = Math.max(zoom - 0.1, 1);
        }
        if (zoom === 1) {
            panX = 0;
            panY = 0;
        }
        updateTransform();
        updateControlsVisibility();
    });
    // Initial controls visibility
    updateControlsVisibility();
    // Mouse drag to pan
    img.addEventListener('mousedown', (e) => {
        if (zoom === 1) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        lastPanX = panX;
        lastPanY = panY;
        img.style.cursor = 'grabbing';
        e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panX = lastPanX + (e.clientX - startX);
        panY = lastPanY + (e.clientY - startY);
        updateTransform();
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
        if (zoom > 1) img.style.cursor = 'grab';
    });
    // Touch drag for mobile
    img.addEventListener('touchstart', (e) => {
        if (zoom === 1) return;
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        lastPanX = panX;
        lastPanY = panY;
        e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging || zoom === 1) return;
        const touch = e.touches[0];
        panX = lastPanX + (touch.clientX - startX);
        panY = lastPanY + (touch.clientY - startY);
        updateTransform();
    }, { passive: false });
    window.addEventListener('touchend', () => {
        isDragging = false;
        if (zoom > 1) img.style.cursor = 'grab';
    });

    // Navigation (if context)
    if (itemsArr && typeof currentIndex === 'number') {
        const showAt = (idx) => {
            // Loop around
            const len = itemsArr.length;
            const newIdx = ((idx % len) + len) % len;
            show3DModal(itemsArr[newIdx], itemsArr, newIdx);
        };
        // Next/Prev buttons
        modalContent.querySelector('.next-photo').addEventListener('click', (e) => {
            e.stopPropagation();
            showAt(currentIndex + 1);
        });
        modalContent.querySelector('.prev-photo').addEventListener('click', (e) => {
            e.stopPropagation();
            showAt(currentIndex - 1);
        });
        // Keyboard navigation
        const handleKey = (e) => {
            if (e.key === 'ArrowRight') {
                showAt(currentIndex + 1);
            } else if (e.key === 'ArrowLeft') {
                showAt(currentIndex - 1);
            } else if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleKey);
            }
        };
        document.addEventListener('keydown', handleKey);
    } else {
        // Escape key for single render
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}
