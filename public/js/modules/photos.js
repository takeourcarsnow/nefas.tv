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
    
    items.forEach(item => {
        if (item.type === 'album') {
            displayAlbum(item, container);
        } else {
            displaySinglePhoto(item, container);
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
                 loading="lazy" 
                 decoding="async" 
                 style="width:100%;height:200px;object-fit:cover;border-radius:6px;">
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
    
    container.appendChild(albumItem);
}

function displaySinglePhoto(photo, container) {
    const photoItem = document.createElement('div');
    photoItem.className = 'grid-item photo-item';
    
    photoItem.innerHTML = `
        <img src="${photo.thumbnail}" 
             alt="${photo.title}" 
             loading="lazy" 
             decoding="async" 
             style="width:100%;height:200px;object-fit:cover;margin-bottom:8px;border-radius:6px;cursor:pointer;"
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
        showPhotoModal(photo);
    });
    
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
            <div style="padding: 15px;">
                <h4 style="margin: 0 0 8px 0; color: #00ff9d;">${photo.title}</h4>
                <p style="margin: 0; color: #ccc; font-size: 0.9em;">${photo.description}</p>
            </div>
        `;
        
        // Add hover effect
        photoElement.addEventListener('mouseenter', () => {
            photoElement.style.transform = 'scale(1.02)';
        });
        photoElement.addEventListener('mouseleave', () => {
            photoElement.style.transform = 'scale(1)';
        });
        
        // Add click to view larger
        photoElement.addEventListener('click', () => {
            showPhotoModal(photo);
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

function showPhotoModal(photo) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        text-align: center;
    `;
    
    modalContent.innerHTML = `
        <img src="${photo.image}" 
             alt="${photo.title}"
             style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 6px;">
        <div style="color: white; margin-top: 15px;">
            <h3 style="margin: 0 0 5px 0; color: #00ff9d;">${photo.title}</h3>
            <p style="margin: 0 0 10px 0; color: #ccc;">${photo.description}</p>
            <div style="font-size: 0.9em; color: #666;">
                ${formatDate(photo.date)} • ${photo.tags.map(tag => `#${tag}`).join(' ')}
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicked
    modal.addEventListener('click', () => {
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
