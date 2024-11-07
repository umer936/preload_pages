document.addEventListener("DOMContentLoaded", function() {
    const preloadedUrls = new Set(); // Track URLs that have already been preloaded

    // IntersectionObserver callback function to handle visibility detection
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const link = entry.target;

            if (entry.isIntersecting) {
                // Only add mouseover if the link is in view and hasn't been preloaded
                if (!preloadedUrls.has(link.href)) {
                    link.addEventListener("mouseover", preloadLink);
                }
            } else {
                link.removeEventListener("mouseover", preloadLink);
            }
        });
    }, {
        threshold: 0.1
    });

    // Function to handle link preloading
    function preloadLink(event) {
        const url = event.currentTarget.href;
        if (!preloadedUrls.has(url)) {
            const preloadLink = document.createElement("link");
            preloadLink.rel = "preload";
            preloadLink.href = url;

            // Set the 'as' attribute based on the type of resource
            preloadLink.as = getResourceType(url);

            // Add the preload link to the head
            document.head.appendChild(preloadLink);

            // Mark the URL as preloaded
            preloadedUrls.add(url);

            // Remove the mouseover listener after preloading to avoid redundant actions
            event.currentTarget.removeEventListener("mouseover", preloadLink);
        }
    }

    // Determine the type of resource based on the URL or its extension
    function getResourceType(url) {
        if (url.endsWith('.css')) {
            return 'style';
        } else if (url.endsWith('.js')) {
            return 'script';
        } else if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif')) {
            return 'image';
        } else if (url.endsWith('.html')) {
            return 'document';
        } else {
            return 'fetch'; // Fallback for non-specific resources
        }
    }

    // Observe all links with an href attribute, excluding anchor links
    document.querySelectorAll("a[href]:not([href^='#'])").forEach(link => observer.observe(link));
});
