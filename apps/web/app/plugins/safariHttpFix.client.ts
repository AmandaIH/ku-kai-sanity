// Aggressive Safari HTTP fix - runs immediately before anything else
export default defineNuxtPlugin({
  name: 'safari-http-fix',
  enforce: 'pre',
  setup() {
    if (process.env.NODE_ENV === 'development' && process.client) {
      // Fix URLs before page even loads
      const fixAllUrls = () => {
        // Fix all link tags
        document.querySelectorAll('link').forEach((link: HTMLLinkElement) => {
          if (link.href && link.href.includes('https://localhost')) {
            link.href = link.href.replace(/https:\/\/localhost/g, 'http://localhost');
          }
        });
        
        // Fix all script tags
        document.querySelectorAll('script[src]').forEach((script: HTMLScriptElement) => {
          if (script.src && script.src.includes('https://localhost')) {
            script.src = script.src.replace(/https:\/\/localhost/g, 'http://localhost');
          }
        });
        
        // Fix base tag
        const base = document.querySelector('base');
        if (base && base.href && base.href.includes('https://localhost')) {
          base.href = base.href.replace(/https:\/\/localhost/g, 'http://localhost');
        }
      };
      
      // Run immediately
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixAllUrls, { once: true });
      } else {
        fixAllUrls();
      }
      
      // Watch for new elements
      const observer = new MutationObserver(fixAllUrls);
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href', 'src']
      });
      
      // Also intercept at the network level
      const originalFetch = window.fetch;
      window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
        if (typeof input === 'string' && input.includes('https://localhost')) {
          input = input.replace(/https:\/\/localhost/g, 'http://localhost');
        } else if (input instanceof Request && input.url.includes('https://localhost')) {
          input = new Request(input.url.replace(/https:\/\/localhost/g, 'http://localhost'), input);
        }
        return originalFetch.call(this, input, init);
      };
    }
  }
});

