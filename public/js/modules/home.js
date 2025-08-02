// Fetch and render the latest posts in the home tab grid
export function initHomePosts() {
    const grid = document.getElementById('home-posts-grid');
    if (!grid) return;
    fetch('/blog/posts.json')
        .then(res => res.json())
        .then(posts => {
            // Sort by date descending
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            // Show up to 6 newest posts
            const latest = posts.slice(0, 6);
            grid.innerHTML = latest.map(post => {
                // Determine type for label
                let type = '[BLOG]';
                if (post.tags && post.tags.includes('video')) type = '[VIDEO]';
                if (post.tags && post.tags.includes('3d')) type = '[3D]';

                // Link to correct tab
                let link = "javascript:showSection('blog-content')";
                if (type === '[VIDEO]') link = "javascript:showSection('video-content')";
                else if (type === '[3D]') link = "javascript:showSection('d3-content')";
                
                return `
                <div class="grid-item home-post-item">
                    <div>
                        <p class="home-post-type">${type}</p>
                        <h4 class="home-post-title">${post.title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(post.date).toLocaleDateString()}</p>
                        <a href="#" onclick="${link}; return false;" class="home-post-link">>> view post</a>
                    </div>
                </div>`;
            }).join('');
        });
}