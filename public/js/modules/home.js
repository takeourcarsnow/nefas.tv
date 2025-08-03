// Fetch and render the latest content in different categories on the home tab
import { addDecryptingTextEffect, addTypewriterToStaticText } from './terminal.js';

export function initHomePosts() {
    // Apply effects to all headers and captions
    applyTextEffects();
    
    // Load content for each category
    loadLatestBlogs();
    loadLatestVideos();
    loadLatestPhotos();
    loadLatest3D();
    loadLatestWebdev();
}

function applyTextEffects() {
    const headerElements = document.querySelectorAll('#home-content .decrypt-text');
    const captionElements = document.querySelectorAll('#home-content .typewriter-text');
    
    // Apply decrypt effects to headers with staggered timing
    headerElements.forEach((element, index) => {
        element.textContent = '';
        element.style.visibility = 'hidden';
        setTimeout(() => {
            addDecryptingTextEffect(element, 0);
        }, 100 + (index * 200));
    });
    
    // Apply typewriter effects to captions with staggered timing
    captionElements.forEach((element, index) => {
        element.textContent = '';
        element.style.visibility = 'hidden';
        setTimeout(() => {
            addTypewriterToStaticText(element, 0);
        }, 800 + (index * 200));
    });
}

function loadLatestBlogs() {
    const grid = document.getElementById('home-blogs-grid');
    if (!grid || grid.children.length > 0) return;
    
    fetch('/blog/posts.json')
        .then(res => res.json())
        .then(posts => {
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = posts.slice(0, 3);
            grid.innerHTML = latest.map(post => `
                <div class="grid-item home-post-item">
                    <div>
                        <p class="home-post-type">[BLOG]</p>
                        <h4 class="home-post-title">${post.title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(post.date).toLocaleDateString()}</p>
                        <a href="#" onclick="showSection('blog-content'); return false;" class="home-post-link">>> read post</a>
                    </div>
                </div>`).join('');
        })
        .catch(err => console.error('Failed to load blog posts:', err));
}

function loadLatestVideos() {
    const grid = document.getElementById('home-videos-grid');
    if (!grid || grid.children.length > 0) return;
    
    fetch('/videos/videos.json')
        .then(res => res.json())
        .then(videos => {
            videos.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = videos.slice(0, 3);
            grid.innerHTML = latest.map(video => `
                <div class="grid-item home-post-item">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" decoding="async" style="width:100%;height:120px;object-fit:cover;margin-bottom:12px;border-radius:6px;">
                    <div>
                        <p class="home-post-type">[VIDEO]</p>
                        <h4 class="home-post-title">${video.title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(video.date).toLocaleDateString()}</p>
                        <a href="#" onclick="showSection('video-content'); return false;" class="home-post-link">>> watch video</a>
                    </div>
                </div>`).join('');
        })
        .catch(err => console.error('Failed to load videos:', err));
}

function loadLatestPhotos() {
    const grid = document.getElementById('home-photos-grid');
    if (!grid || grid.children.length > 0) return;
    
    fetch('/photos/photos.json')
        .then(res => res.json())
        .then(items => {
            // Sort by date descending
            items.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = items.slice(0, 3);
            grid.innerHTML = latest.map(item => {
                // Handle both albums and single photos
                const thumbnail = item.type === 'album' ? item.coverImage : item.thumbnail;
                const title = item.title;
                const typeLabel = item.type === 'album' ? '[ALBUM]' : '[PHOTO]';
                
                return `
                <div class="grid-item home-post-item">
                    <img src="${thumbnail}" alt="${title}" loading="lazy" decoding="async" style="width:100%;height:120px;object-fit:cover;margin-bottom:12px;border-radius:6px;">
                    <div>
                        <p class="home-post-type">${typeLabel}</p>
                        <h4 class="home-post-title">${title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(item.date).toLocaleDateString()}</p>
                        <a href="#" onclick="showSection('photo-content'); return false;" class="home-post-link">>> view ${item.type === 'album' ? 'album' : 'photo'}</a>
                    </div>
                </div>`;
            }).join('');
        })
        .catch(err => console.error('Failed to load photos:', err));
}

function loadLatest3D() {
    const grid = document.getElementById('home-3d-grid');
    if (!grid || grid.children.length > 0) return;
    
    fetch('/3d/3d.json')
        .then(res => res.json())
        .then(renders => {
            renders.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = renders.slice(0, 3);
            grid.innerHTML = latest.map(render => `
                <div class="grid-item home-post-item">
                    <img src="${render.thumbnail}" alt="${render.title}" loading="lazy" decoding="async" style="width:100%;height:120px;object-fit:cover;margin-bottom:12px;border-radius:6px;">
                    <div>
                        <p class="home-post-type">[3D]</p>
                        <h4 class="home-post-title">${render.title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(render.date).toLocaleDateString()}</p>
                        <a href="#" onclick="showSection('d3-content'); return false;" class="home-post-link">>> view render</a>
                    </div>
                </div>`).join('');
        })
        .catch(err => console.error('Failed to load 3D renders:', err));
}

function loadLatestWebdev() {
    const grid = document.getElementById('home-webdev-grid');
    if (!grid || grid.children.length > 0) return;
    
    fetch('/webdev/webdev.json')
        .then(res => res.json())
        .then(projects => {
            projects.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = projects.slice(0, 3);
            grid.innerHTML = latest.map(project => `
                <div class="grid-item home-post-item">
                    <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" decoding="async" style="width:100%;height:120px;object-fit:cover;margin-bottom:12px;border-radius:6px;">
                    <div>
                        <p class="home-post-type">[WEBDEV]</p>
                        <h4 class="home-post-title">${project.title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(project.date).toLocaleDateString()}</p>
                        <a href="#" onclick="showSection('webdev-content'); return false;" class="home-post-link">>> view project</a>
                    </div>
                </div>`).join('');
        })
        .catch(err => console.error('Failed to load webdev projects:', err));
}