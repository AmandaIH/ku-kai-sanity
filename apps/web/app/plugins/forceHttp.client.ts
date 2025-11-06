// Run this plugin as early as possible - prefix with 00 to ensure it runs first
export default defineNuxtPlugin({
  name: 'force-http',
  enforce: 'pre', // Run before other plugins
  setup() {
    if (process.env.NODE_ENV === 'development' && process.client) {
    // Force HTTP for all localhost resources in Safari
    console.log('ForceHTTP Plugin: Initializing HTTP enforcement for Safari');
    
    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      if (typeof input === 'string') {
        input = input.replace(/https:\/\/localhost/g, 'http://localhost');
      } else if (input instanceof Request) {
        const url = input.url.replace(/https:\/\/localhost/g, 'http://localhost');
        input = new Request(url, input);
      }
      return originalFetch.call(this, input, init);
    };

    // Intercept XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
      if (typeof url === 'string') {
        url = url.replace(/https:\/\/localhost/g, 'http://localhost');
      }
      return originalOpen.call(this, method, url, ...args);
    };

    // Fix all links and resources to use HTTP
    const fixUrls = () => {
      let fixed = 0;
      
      // Fix stylesheet links
      document.querySelectorAll('link[rel="stylesheet"]').forEach((link: any) => {
        if (link.href && link.href.includes('https://localhost')) {
          const oldHref = link.href;
          link.href = link.href.replace(/https:\/\/localhost/g, 'http://localhost');
          fixed++;
          console.log('ForceHTTP: Fixed stylesheet', oldHref, '->', link.href);
        }
      });

      // Fix script tags
      document.querySelectorAll('script[src]').forEach((script: any) => {
        if (script.src && script.src.includes('https://localhost')) {
          const oldSrc = script.src;
          script.src = script.src.replace(/https:\/\/localhost/g, 'http://localhost');
          fixed++;
          console.log('ForceHTTP: Fixed script', oldSrc, '->', script.src);
        }
      });

      // Fix base tag if it exists
      let baseTag = document.querySelector('base');
      if (baseTag && baseTag.href && baseTag.href.includes('https://localhost')) {
        const oldHref = baseTag.href;
        baseTag.href = baseTag.href.replace(/https:\/\/localhost/g, 'http://localhost');
        fixed++;
        console.log('ForceHTTP: Fixed base tag', oldHref, '->', baseTag.href);
      }
      
      if (fixed > 0) {
        console.log(`ForceHTTP: Fixed ${fixed} URLs`);
      }
    };

    // Run immediately
    fixUrls();
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixUrls);
    }

    // Watch for dynamically added resources
    const observer = new MutationObserver(() => {
      setTimeout(fixUrls, 10); // Small delay to ensure elements are fully added
    });
    observer.observe(document.head, { childList: true, subtree: true });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Also check periodically for any missed resources
    setInterval(fixUrls, 1000);
    
    // Intercept link preloading
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string, options?: ElementCreationOptions) {
      const element = originalCreateElement.call(this, tagName, options);
      if (tagName.toLowerCase() === 'link' && element instanceof HTMLLinkElement) {
        const originalSetAttribute = element.setAttribute.bind(element);
        element.setAttribute = function(name: string, value: string) {
          if (name === 'href' && value && value.includes('https://localhost')) {
            value = value.replace(/https:\/\/localhost/g, 'http://localhost');
            console.log('ForceHTTP: Fixed preload link', value);
          }
          return originalSetAttribute(name, value);
        };
      }
      return element;
    };
    }
  }
});

