import type { NitroAppPlugin } from 'nitropack'

export default defineNitroPlugin(async (nitroApp) => {
  // Fix HTTPS URLs in HTML responses for Safari - run early
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    if (process.env.NODE_ENV === 'development') {
      const fixUrl = (str: string): string => {
        if (!str || typeof str !== 'string') return str;
        return str
          .replace(/https:\/\/localhost:3000/gi, 'http://localhost:3000')
          .replace(/https:\/\/localhost/gi, 'http://localhost')
          .replace(/href=["']https:\/\/localhost/gi, (match) => match.replace('https://', 'http://'))
          .replace(/src=["']https:\/\/localhost/gi, (match) => match.replace('https://', 'http://'))
          .replace(/url\(https:\/\/localhost/gi, (match) => match.replace('https://', 'http://'))
          .replace(/['"]https:\/\/localhost/gi, (match) => match.replace('https://', 'http://'));
      };
      
      // Replace all https://localhost with http://localhost in the HTML
      if (html.head) {
        html.head = html.head.map((item: any) => {
          if (typeof item === 'string') {
            return fixUrl(item);
          } else if (item && typeof item === 'object' && item.tag) {
            // Handle tag objects
            if (item.href && typeof item.href === 'string') {
              item.href = fixUrl(item.href);
            }
            if (item.src && typeof item.src === 'string') {
              item.src = fixUrl(item.src);
            }
          }
          return item;
        });
      }
      
      if (html.body) {
        html.body = html.body.map((item: any) => {
          if (typeof item === 'string') {
            return fixUrl(item);
          } else if (item && typeof item === 'object' && item.tag) {
            if (item.href && typeof item.href === 'string') {
              item.href = fixUrl(item.href);
            }
            if (item.src && typeof item.src === 'string') {
              item.src = fixUrl(item.src);
            }
          }
          return item;
        });
      }
      
      if (html.bodyAppend) {
        html.bodyAppend = html.bodyAppend.map((item: any) => {
          if (typeof item === 'string') {
            return fixUrl(item);
          }
          return item;
        });
      }
      
      if (html.bodyPrepend) {
        html.bodyPrepend = html.bodyPrepend.map((item: any) => {
          if (typeof item === 'string') {
            return fixUrl(item);
          }
          return item;
        });
      }
    }
  });
  
  // Also fix response body as a string
  nitroApp.hooks.hook('render:response', (response: any, { event }) => {
    if (process.env.NODE_ENV === 'development' && response.body) {
      if (typeof response.body === 'string') {
        response.body = response.body
          .replace(/https:\/\/localhost:3000/gi, 'http://localhost:3000')
          .replace(/https:\/\/localhost/gi, 'http://localhost');
      }
    }
  });
});

