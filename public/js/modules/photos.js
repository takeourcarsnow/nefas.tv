// Module for loading and displaying photos and albums
export function initPhotos() {
    const photoGallery = document.getElementById('photo-gallery');
    if (!photoGallery) return;

    // Load photos from JSON
    fetch('/photos/photos.json')
        .then(response => response.json())
        .then(items => {
            if (items && items.length > 0) {
                displayPhotoItems(items, photoGallery);
            }
        })
        .catch(error => {
            console.error('Error loading photos:', error);
            photoGallery.innerHTML = '<p style="color: #ff0000;">[ERROR] Failed to load photo database</p>';
        });
}

function displayPhotoItems(items, container) {
    container.innerHTML = '';
    
    // For navigation in single photo view, store all photos in a flat array
    window._allPhotosForNav = [];
    items.forEach(item => {
        if (item.type === 'album') {
            displayAlbum(item, container);
        } else {
            displaySinglePhoto(item, container);
            window._allPhotosForNav.push(item);
        }
    });
}

function displayAlbum(album, container) {
    const albumItem = document.createElement('div');
    albumItem.className = 'grid-item album-item';
    
    albumItem.innerHTML = `
        <div class="album-cover" style="position: relative; cursor: pointer;">
            <img src="${album.coverImage}" 
                 alt="${album.title}" 
                 decoding="async" 
                 style="width:100%;height:200px;object-fit:cover;border-radius:6px;opacity:1;display:block;">
            <div class="album-overlay" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">
                📁 ${album.photos.length} photos
            </div>
        </div>
        <h3 style="margin: 8px 0 4px 0;">${album.title}</h3>
        <p style="margin: 0 0 8px 0; color: #ccc; font-size: 0.9em;">${album.description}</p>
        <div class="photo-meta">
            <span class="photo-date">${formatDate(album.date)}</span>
            <span class="photo-tags">${album.tags.map(tag => `#${tag}`).join(' ')}</span>
        </div>
    `;
    
    // Add click event to show album gallery
    const albumCover = albumItem.querySelector('.album-cover');
    albumCover.addEventListener('click', () => {
        showAlbumModal(album);
    });
    
    // Ensure image is visible when loaded
    const img = albumItem.querySelector('img');
    img.addEventListener('load', () => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
    });
    
    // Fallback to ensure visibility even if load event doesn't fire
    setTimeout(() => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
    }, 100);
    
    container.appendChild(albumItem);
}

function displaySinglePhoto(photo, container) {
    const photoItem = document.createElement('div');
    photoItem.className = 'grid-item photo-item';
    
    photoItem.innerHTML = `
        <img src="${photo.thumbnail}" 
             alt="${photo.title}" 
             decoding="async" 
             style="width:100%;height:200px;object-fit:cover;margin-bottom:8px;border-radius:6px;cursor:pointer;opacity:1;display:block;"
             data-full-image="${photo.image}"
             data-title="${photo.title}"
             data-description="${photo.description}">
        <h3>${photo.title}</h3>
        <p>${photo.description}</p>
        <div class="photo-meta">
            <span class="photo-date">${formatDate(photo.date)}</span>
            <span class="photo-tags">${photo.tags.map(tag => `#${tag}`).join(' ')}</span>
        </div>
    `;
    
    // Add click event to show full image in modal
    const img = photoItem.querySelector('img');
    img.addEventListener('click', () => {
        // If all photos are in a flat list, allow navigation
        if (window._allPhotosForNav && Array.isArray(window._allPhotosForNav)) {
            const idx = window._allPhotosForNav.findIndex(p => p.image === photo.image);
            showPhotoModal(photo, window._allPhotosForNav, idx);
        } else {
            showPhotoModal(photo);
        }
    });
    
    // Ensure image is visible when loaded
    img.addEventListener('load', () => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
    });
    
    // Fallback to ensure visibility even if load event doesn't fire
    setTimeout(() => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
    }, 100);
    
    container.appendChild(photoItem);
}

function showAlbumModal(album) {
    // Create modal overlay for album gallery
    const modal = document.createElement('div');
    modal.className = 'album-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        max-width: 1200px;
        margin: 0 auto;
        color: white;
    `;
    
    // Album header
    const albumHeader = document.createElement('div');
    albumHeader.style.cssText = `
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #333;
    `;
    albumHeader.innerHTML = `
        <h2 style="color: #00ff9d; margin: 0 0 10px 0; font-size: 2em;">${album.title}</h2>
        <p style="color: #ccc; margin: 0 0 10px 0; font-size: 1.1em;">${album.description}</p>
        <div style="color: #666; font-size: 0.9em;">
            ${formatDate(album.date)} • ${album.photos.length} photos • ${album.tags.map(tag => `#${tag}`).join(' ')}
        </div>
        <button id="close-album" style="position: absolute; top: 20px; right: 30px; background: none; border: 1px solid #666; color: white; padding: 8px 16px; cursor: pointer; border-radius: 4px; font-size: 1.2em;">✕ Close</button>
    `;
    
    // Photo grid
    const photoGrid = document.createElement('div');
    photoGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    `;
    
    album.photos.forEach((photo, index) => {
        const photoElement = document.createElement('div');
        photoElement.style.cssText = `
            border: 1px solid #333;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.2s ease;
        `;
        photoElement.innerHTML = `
            <img src="${photo.image}" 
                 alt="${photo.title}"
                 style="width: 100%; height: 250px; object-fit: cover;">
        `;

        // Add hover effect
        photoElement.addEventListener('mouseenter', () => {
            photoElement.style.transform = 'scale(1.02)';
        });
        photoElement.addEventListener('mouseleave', () => {
            photoElement.style.transform = 'scale(1)';
        });

        // Add click to view larger (close album modal first)
        photoElement.addEventListener('click', (e) => {
            // Find and remove the album modal before opening photo modal
            const albumModal = document.querySelector('.album-modal');
            if (albumModal) {
                document.body.removeChild(albumModal);
            }
            showPhotoModal(photo, album.photos, index);
            e.stopPropagation();
        });

        photoGrid.appendChild(photoElement);
    });
    
    modalContent.appendChild(albumHeader);
    modalContent.appendChild(photoGrid);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal events
    const closeBtn = modal.querySelector('#close-album');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Enhanced photo modal with navigation and zoom
function showPhotoModal(photo, albumPhotos = null, startIndex = null) {
    // Remove any existing modal
    const oldModal = document.querySelector('.photo-modal');
    if (oldModal) document.body.removeChild(oldModal);

    // Track current index if album context is provided
    let currentIndex = startIndex;
    let photosArr = Array.isArray(albumPhotos) ? albumPhotos : null;

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
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
        /* Remove fade animation for instant switch */
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
    const image = photo.image || photo.thumbnail || '';
    const title = photo.title || '';
    const description = photo.description || '';
    let date = '';
    try {
        date = photo.date ? formatDate(photo.date) : '';
    } catch (e) {
        date = '';
    }
    const tags = Array.isArray(photo.tags) ? photo.tags.map(tag => `#${tag}`).join(' ') : '';

    // Zoom state
    let zoom = 1;
    // Helper to show/hide controls based on zoom
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

    // Modal HTML
    modalContent.innerHTML = `
        <button class="close-photo-modal" style="position:fixed;top:32px;right:48px;background:none;border:1px solid #fff;color:#fff;font-size:2.2em;padding:6px 18px;border-radius:4px;cursor:pointer;z-index:10001;">✕</button>
        <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            ${photosArr ? `<button class=\"prev-photo\" style=\"position:absolute;left:-70px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.4);border:none;color:#fff;font-size:3em;cursor:pointer;padding:0 16px 0 8px;border-radius:8px 0 0 8px;z-index:10000;\">&#8592;</button>` : ''}
            <img class="modal-photo-img" src="${image}" alt="${title}"
                style="max-width:100vw;max-height:80vh;object-fit:contain;border-radius:6px;transform:scale(1);transition:transform 0.2s;cursor:zoom-in;">
            ${photosArr ? `<button class=\"next-photo\" style=\"position:absolute;right:-70px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.4);border:none;color:#fff;font-size:3em;cursor:pointer;padding:0 8px 0 16px;border-radius:0 8px 8px 0;z-index:10000;\">&#8594;</button>` : ''}
        </div>
        <div style="color: white; margin-top: 18px; text-align: center; max-width: 90vw;">
            <h3 style="margin: 0 0 5px 0; color: #00ff9d;">${title}</h3>
            <p style="margin: 0 0 10px 0; color: #ccc; font-size:1.1em; background:rgba(0,0,0,0.5); display:inline-block; padding:4px 16px; border-radius:6px;">${description}</p>
            <div style="font-size: 0.9em; color: #666;">
                ${date}${tags ? ' • ' + tags : ''}
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

    const img = modalContent.querySelector('.modal-photo-img');
    // Zoom and pan logic
    let panX = 0, panY = 0, isDragging = false, startX = 0, startY = 0, lastPanX = 0, lastPanY = 0;
    function updateTransform() {
        img.style.transform = `scale(${zoom}) translate(${panX}px, ${panY}px)`;
        img.style.cursor = zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in';
    }
    // Only toggle zoom on click if not dragging
    let wasDragging = false;
    let lastTap = 0;
    let pinchStartDist = null;
    let pinchStartZoom = 1;
    let pinchMidpoint = null;

    // Mouse events (desktop)
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

    // Touch events (mobile)
    img.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            // Single finger: drag or double-tap
            const now = Date.now();
            if (now - lastTap < 350) {
                // Double tap: toggle zoom
                if (zoom === 1) {
                    zoom = 2;
                } else {
                    zoom = 1;
                    panX = 0;
                    panY = 0;
                }
                updateTransform();
                updateControlsVisibility();
                lastTap = 0;
                e.preventDefault();
                return;
            }
            lastTap = now;
            if (zoom === 1) return;
            isDragging = true;
            wasDragging = false;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            lastPanX = panX;
            lastPanY = panY;
            e.preventDefault();
        } else if (e.touches.length === 2) {
            // Pinch start
            isDragging = false;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            pinchStartDist = Math.sqrt(dx * dx + dy * dy);
            pinchStartZoom = zoom;
            pinchMidpoint = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2
            };
        }
    }, { passive: false });
    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length === 1 && isDragging && zoom > 1) {
            const touch = e.touches[0];
            panX = lastPanX + (touch.clientX - startX);
            panY = lastPanY + (touch.clientY - startY);
            updateTransform();
        } else if (e.touches && e.touches.length === 2 && pinchStartDist) {
            // Pinch to zoom
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            let newZoom = pinchStartZoom * (dist / pinchStartDist);
            newZoom = Math.max(1, Math.min(newZoom, 3));
            zoom = newZoom;
            if (zoom === 1) {
                panX = 0;
                panY = 0;
            }
            updateTransform();
            updateControlsVisibility();
        }
    }, { passive: false });
    window.addEventListener('touchend', (e) => {
        isDragging = false;
        pinchStartDist = null;
        if (zoom > 1) img.style.cursor = 'grab';
    });

    // Swipe down to close when zoomed out (mobile)
    let swipeStartY = null;
    img.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1 && zoom === 1) {
            swipeStartY = e.touches[0].clientY;
        }
    });
    img.addEventListener('touchend', (e) => {
        if (swipeStartY !== null && zoom === 1 && e.changedTouches.length === 1) {
            const endY = e.changedTouches[0].clientY;
            if (endY - swipeStartY > 80) {
                // Swipe down detected
                document.body.removeChild(modal);
            }
        }
        swipeStartY = null;
    });

    // Initial controls visibility
    updateControlsVisibility();

    // Navigation (if album context)
    if (photosArr && typeof currentIndex === 'number') {
        const showAt = (idx) => {
            // Loop around
            const len = photosArr.length;
            const newIdx = ((idx % len) + len) % len;
            showPhotoModal(photosArr[newIdx], photosArr, newIdx);
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
        // Escape key for single photo
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}
