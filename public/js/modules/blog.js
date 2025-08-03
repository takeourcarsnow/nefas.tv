
// Utility to format date and time since posted
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
}

function timeSince(dateStr) {
    const now = new Date();
    const posted = new Date(dateStr);
    const seconds = Math.floor((now - posted) / 1000);
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];
    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count > 0) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
}

export const initBlogToggles = (callback = null, targetContainer = null) => {
    const blogContainer = targetContainer || document.getElementById('blog-content');
    console.log('initBlogToggles called with container:', blogContainer);
    if (!blogContainer) return;

    // Get the stored expanded states
    const expandedPosts = new Set(JSON.parse(sessionStorage.getItem('expandedPosts') || '[]'));

    fetch('/blog/posts.json')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(posts => {
            const snippets = posts.map(post => {
                const tags = post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join(' ');
                const isExpanded = expandedPosts.has(post.title);
                return `
                <div class="blog-snippet">
                    <div class="blog-snippet-header">
                        <h3>> ${post.title}</h3>
                        <span class="blog-date">${formatDate(post.date)} (${timeSince(post.date)})</span>
                        <span class="blog-tags">${tags}</span>
                        <span class="blog-toggle">${isExpanded ? '[ ...read less ]' : '[ read more... ]'}</span>
                    </div>
                    <div class="blog-full-content" style="display:${isExpanded ? 'block' : 'none'};">
                        ${post.content.map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>
                `;
            }).join('');
            
            // Check if blog container already has terminal content
            const existingTerminal = blogContainer.querySelector('#blog-terminal-output');
            if (existingTerminal) {
                // Append posts after the terminal output
                const postsDiv = document.createElement('div');
                postsDiv.innerHTML = snippets;
                postsDiv.style.marginTop = '20px';
                blogContainer.appendChild(postsDiv);
            } else {
                // If this is a fresh container or sub-container, add the header
                const content = targetContainer ? 
                    snippets : 
                    `<h2>> the blog</h2>
                    <p>unfiltered thoughts and long-form posting. click titles to expand/collapse.</p>
                    ${snippets}`;
                    
                blogContainer.innerHTML = content;
            }
                
            console.log('Setting content in container:', blogContainer, 'Posts count:', posts.length);

            // Add toggles
            blogContainer.querySelectorAll('.blog-snippet-header').forEach(header => {
                header.addEventListener('click', () => {
                    const fullContent = header.nextElementSibling;
                    const toggleText = header.querySelector('.blog-toggle');
                    const postTitle = header.querySelector('h3').textContent.slice(2); // Remove "> " prefix
                    const isVisible = fullContent.style.display === 'block';
                    
                    // Update display
                    fullContent.style.display = isVisible ? 'none' : 'block';
                    toggleText.textContent = isVisible ? '[ read more... ]' : '[ ...read less ]';
                    
                    // Update stored state
                    if (isVisible) {
                        expandedPosts.delete(postTitle);
                    } else {
                        expandedPosts.add(postTitle);
                    }
                    sessionStorage.setItem('expandedPosts', JSON.stringify([...expandedPosts]));
                });
            });

            // Call callback if provided
            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Error loading blog posts:', error);
            const errorMessage = `<p style="color: #ff0000;">Error loading blog posts: ${error.message}</p>`;
            
            // Check if blog container already has terminal content
            const existingTerminal = blogContainer.querySelector('#blog-terminal-output');
            if (existingTerminal) {
                const errorDiv = document.createElement('div');
                errorDiv.innerHTML = errorMessage;
                errorDiv.style.marginTop = '20px';
                blogContainer.appendChild(errorDiv);
            } else {
                blogContainer.innerHTML = errorMessage;
            }
            
            if (callback) {
                callback();
            }
        });
};
