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
    
    renders.forEach(render => {
        const renderItem = document.createElement('div');
        renderItem.className = 'grid-item d3-item';
        
        renderItem.innerHTML = `
            <img src="${render.thumbnail}" 
                 alt="${render.title}" 
                 loading="lazy" 
                 decoding="async" 
                 style="cursor: pointer;"
                 data-full-image="${render.image}"
                 data-title="${render.title}"
                 data-description="${render.description}">
            <p class="d3-caption">> ${render.title}</p>
        `;
        
        // Add click event to show full image in modal
        const img = renderItem.querySelector('img');
        img.addEventListener('click', () => {
            show3DModal(render);
        });
        
        container.appendChild(renderItem);
    });
}

function show3DModal(render) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'render-modal';
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
        <img src="${render.image}" 
             alt="${render.title}"
             style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 6px;">
        <div style="color: white; margin-top: 15px;">
            <h3 style="margin: 0 0 5px 0; color: #00ff9d;">${render.title}</h3>
            <p style="margin: 0 0 10px 0; color: #ccc;">${render.description}</p>
            <div style="font-size: 0.9em; color: #666;">
                ${render.tags.map(tag => `#${tag}`).join(' ')}
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
