import type { NitroAppPlugin } from 'nitropack'

export default defineNitroPlugin(async (nitroApp) => {
    // Fix for Safari CSS and SVG loading issues
    nitroApp.hooks.hook('render:response', (response: Partial<any>, context) => {
        if (!response.headers) {
            response.headers = {};
        }
        
        if (context?.event?.node?.req?.url) {
            const url = context.event.node.req.url;
            
            // Ensure CSS files have correct MIME type for Safari
            if (url.endsWith('.css') || url.includes('/_nuxt/') && url.includes('.css')) {
                response.headers['Content-Type'] = 'text/css; charset=utf-8';
                // Safari-specific headers
                response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                response.headers['Pragma'] = 'no-cache';
                response.headers['Expires'] = '0';
            }
            
            // Ensure SVG files have correct MIME type and CORS headers for Safari
            if (url.endsWith('.svg') || url.includes('/flags/')) {
                response.headers['Content-Type'] = 'image/svg+xml; charset=utf-8';
                // CORS headers are critical for SVG files loaded via fetch() in Safari
                response.headers['Access-Control-Allow-Origin'] = '*';
                response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type';
                // Safari-specific cache headers
                response.headers['Cache-Control'] = 'public, max-age=31536000, immutable';
            }
        }
        
        // Ensure proper CORS headers for Safari (for all requests in development)
        if (process.env.NODE_ENV === 'development') {
            // Only add if not already set (to avoid overriding SVG-specific headers)
            if (!response.headers['Access-Control-Allow-Origin']) {
                response.headers['Access-Control-Allow-Origin'] = '*';
                response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
            }
        }
    });
});

