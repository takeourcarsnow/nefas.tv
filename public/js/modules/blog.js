export const initBlogToggles = () => {
    const blogSnippets = document.querySelectorAll('.blog-snippet-header');
    blogSnippets.forEach(header => {
        header.addEventListener('click', () => {
            const fullContent = header.nextElementSibling;
            const toggleText = header.querySelector('.blog-toggle');
            const isVisible = fullContent.style.display === 'block';

            fullContent.style.display = isVisible ? 'none' : 'block';
            toggleText.textContent = isVisible ? '[ read more... ]' : '[ ...read less ]';
        });
    });
};
