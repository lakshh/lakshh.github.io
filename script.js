document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const tagsCluster = document.getElementById('tags-cluster');
    const baseTitle = "Lakshmikanthan's Blog";

    // State
    let currentFilterTag = null;

    // Initial Render
    renderTags();
    handleRouting();

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', handleRouting);

    // Functions
    function handleRouting() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        if (postId) {
            renderPost(postId, false); // false = don't push state again
        } else {
            renderPostList(false);
        }
    }

    function renderTags() {
        const allTags = BLOG_POSTS.flatMap(post => post.tags);
        const uniqueTags = [...new Set(allTags)];

        tagsCluster.innerHTML = uniqueTags.map(tag => `
            <button class="sidebar-tag" data-tag="${tag}">${tag}</button>
        `).join('');

        // Add Event Listeners to Tags
        document.querySelectorAll('.sidebar-tag').forEach(tagEl => {
            tagEl.addEventListener('click', (e) => {
                const tag = e.target.dataset.tag;

                // Toggle active state
                if (currentFilterTag === tag) {
                    currentFilterTag = null; // deselect
                    e.target.classList.remove('active');
                } else {
                    // clear currently active class
                    document.querySelectorAll('.sidebar-tag').forEach(t => t.classList.remove('active'));
                    currentFilterTag = tag;
                    e.target.classList.add('active');
                }

                // When filtering, always go to list view
                if (window.location.search.includes('id=')) {
                    history.pushState({}, '', window.location.pathname);
                }
                renderPostList(false);
            });
        });
    }

    function renderPostList(shouldPushState = true) {
        // Reset URL if requested (e.g. clicking 'Back' manually)
        if (shouldPushState) {
            history.pushState({}, '', window.location.pathname);
        }
        document.title = baseTitle;
        document.querySelector('.site-header h1').textContent = baseTitle;

        const filteredPosts = currentFilterTag
            ? BLOG_POSTS.filter(post => post.tags.includes(currentFilterTag))
            : BLOG_POSTS;

        if (filteredPosts.length === 0) {
            contentArea.innerHTML = '<p>No posts found.</p>';
            return;
        }

        contentArea.innerHTML = filteredPosts.map(post => `
            <article class="post-item">
                <div class="post-item-header">
                    <h2 class="post-item-title" data-id="${post.id}">${post.title}</h2>
                    <div class="post-meta">
                        <span class="post-date">${post.date}</span>
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </article>
        `).join('');

        // Add Click Listeners to Titles
        document.querySelectorAll('.post-item-title').forEach(titleEl => {
            titleEl.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.id);
                renderPost(postId);
            });
        });

        window.scrollTo(0, 0);
    }

    async function renderPost(id, shouldPushState = true) {
        // Robustness: Use loose equality (==) to handle mixed types (string from URL vs number from data)
        const post = BLOG_POSTS.find(p => p.id == id);

        if (!post) {
            // 404 Handling: If post not found, revert to list view
            console.warn(`Post with id ${id} not found.`);
            renderPostList(false); // Can also show a specific 404 message here if desired
            return;
        }

        // Update URL and Title
        if (shouldPushState) {
            const newUrl = `${window.location.pathname}?id=${id}`;
            history.pushState({ id: id }, '', newUrl);
        }
        document.title = `${post.title} | ${baseTitle}`;
        document.querySelector('.site-header h1').textContent = post.title;

        // Fetch Content
        let contentHtml = '<p>Loading...</p>';
        try {
            const response = await fetch(post.contentPath);
            if (!response.ok) throw new Error('Network response was not ok');
            contentHtml = await response.text();
        } catch (error) {
            console.error('Failed to load post content:', error);
            contentHtml = '<p>Error loading content. Please try again later.</p>';
        }

        contentArea.innerHTML = `
            <div class="single-post-view">
                <a href="./" class="back-link" id="home-btn">
                    <span>←</span> <span style="text-decoration: underline;">Lakshmikanthan's Blog</span>
                </a>
                <!-- Removing the duplicate H1 since it is now in the header -->
                <div class="single-post-meta" style="margin-top: 0;">
                    <span class="post-date">${post.date}</span>
                    <span style="margin: 0 10px;">•</span>
                    <span class="post-tags-text">${post.tags.join(', ')}</span>
                </div>
                <div class="single-post-content">
                    ${contentHtml}
                </div>
            </div>
        `;

        // Home Button Listener
        document.getElementById('home-btn').addEventListener('click', (e) => {
            e.preventDefault(); // Prevent full page reload
            renderPostList(true); // Go back to list and update URL
        });

        // Scroll to top of content area
        window.scrollTo(0, 0);
    }
});
