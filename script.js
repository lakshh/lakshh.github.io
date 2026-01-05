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

    // Accessibility Functions
    function announceRouteChange(message) {
        const announcer = document.getElementById('route-announcer');
        if (announcer) {
            announcer.textContent = message;
        }
    }

    function focusContentArea() {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.focus();
        }
    }

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function updateMetaTags(post) {
        const description = `Read "${post.title}" - ${post.tags.join(', ')}`;
        const url = `https://lakshh.github.io/?id=${post.id}`;
        const title = `${post.title} | Lakshmikanthan's Blog`;

        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        }

        // Update Open Graph tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);

        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', url);

        // Update Twitter tags
        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) twitterTitle.setAttribute('content', title);

        let twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) twitterDesc.setAttribute('content', description);

        let twitterUrl = document.querySelector('meta[name="twitter:url"]');
        if (twitterUrl) twitterUrl.setAttribute('content', url);

        // Update canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', url);
    }

    function resetMetaTags() {
        const description = "Engineering leadership, software systems, and organizational culture insights from 22 years of software development experience.";
        const url = "https://lakshh.github.io/";
        const title = "Lakshmikanthan's Blog";

        // Reset meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', description);

        // Reset Open Graph tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);

        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', url);

        // Reset Twitter tags
        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) twitterTitle.setAttribute('content', title);

        let twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) twitterDesc.setAttribute('content', description);

        let twitterUrl = document.querySelector('meta[name="twitter:url"]');
        if (twitterUrl) twitterUrl.setAttribute('content', url);

        // Reset canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', url);
    }

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
        // Calculate tag counts
        const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});

        const uniqueTags = [...new Set(allTags)];

        tagsCluster.innerHTML = uniqueTags.map(tag => `
            <button class="sidebar-tag" data-tag="${tag}" aria-pressed="false">
                ${tag} <span class="tag-count">(${tagCounts[tag]})</span>
            </button>
        `).join('');

        // Add Event Listeners to Tags
        document.querySelectorAll('.sidebar-tag').forEach(tagEl => {
            tagEl.addEventListener('click', (e) => {
                const tag = e.currentTarget.dataset.tag;
                const button = e.currentTarget;

                // Toggle active state
                if (currentFilterTag === tag) {
                    currentFilterTag = null; // deselect
                    button.classList.remove('active');
                    button.setAttribute('aria-pressed', 'false');
                } else {
                    // clear currently active class
                    document.querySelectorAll('.sidebar-tag').forEach(t => {
                        t.classList.remove('active');
                        t.setAttribute('aria-pressed', 'false');
                    });
                    currentFilterTag = tag;
                    button.classList.add('active');
                    button.setAttribute('aria-pressed', 'true');
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

        // Ensure sidebar is visible (remove single-view mode)
        document.querySelector('.container').classList.remove('single-view');

        // Reset meta tags to default
        resetMetaTags();

        // Announce to screen readers
        announceRouteChange('Showing blog post list');

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
                    <h2>
                        <a href="?id=${post.id}" class="post-item-title" data-id="${post.id}">
                            ${post.title}
                        </a>
                    </h2>
                    <div class="post-meta">
                        <span class="post-date">${formatDate(post.date)}</span>
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
                e.preventDefault(); // Prevent default link behavior
                const postId = parseInt(e.target.dataset.id);
                renderPost(postId);
            });
        });

        // Only focus if this is a navigation action (not initial load)
        if (shouldPushState) {
            focusContentArea();
        }
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

        // Hide sidebar for single post view
        document.querySelector('.container').classList.add('single-view');

        // Update meta tags for this post
        updateMetaTags(post);

        // Announce to screen readers
        announceRouteChange(`Now reading: ${post.title}`);

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
                <div class="post-navigation-header">
                    <a href="./" class="back-link" id="home-btn">
                        <span>←</span> <span style="text-decoration: underline;">Lakshmikanthan's Blog</span>
                    </a>
                    <div class="post-info-right">
                        <span class="post-date">${formatDate(post.date)}</span>
                        <span style="margin: 0 10px;">•</span>
                        <span class="post-tags-text">${post.tags.join(', ')}</span>
                    </div>
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

        // Focus management and scroll to top
        if (shouldPushState) {
            focusContentArea();
        }
        window.scrollTo(0, 0);
    }
});
