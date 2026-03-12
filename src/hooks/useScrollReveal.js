import { useEffect } from 'react';

/**
 * Enhanced scroll reveal hook that handles dynamically added elements
 * using IntersectionObserver and MutationObserver.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Add a small staggered delay if many items intersect at once
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    // Initial check
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    // Watch for new elements added to the DOM (e.g. after API fetches)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            if (node.classList.contains('reveal')) {
              observer.observe(node);
            }
            node.querySelectorAll('.reveal').forEach(el => observer.observe(el));
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
