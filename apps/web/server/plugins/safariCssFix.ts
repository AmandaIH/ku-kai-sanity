import type { NitroAppPlugin } from 'nitropack'

export default defineNitroPlugin(async (nitroApp) => {
    // Fix for Safari CSS loading issues on localhost
    nitroApp.hooks.hook('render:response', (response: Partial<any>, context) => {
        if (!response.headers) {
            response.headers = {};
        }
        
        // Ensure CSS files have correct MIME type for Safari
        if (context?.event?.node?.req?.url) {
            const url = context.event.node.req.url;
            
            // Check if it's a CSS file
            if (url.endsWith('.css') || url.includes('/_nuxt/') && url.includes('.css')) {
                response.headers['Content-Type'] = 'text/css; charset=utf-8';
                // Safari-specific headers
                response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                response.headers['Pragma'] = 'no-cache';
                response.headers['Expires'] = '0';
            }
        }
        
        // Ensure proper CORS headers for Safari
        if (process.env.NODE_ENV === 'development') {
            response.headers['Access-Control-Allow-Origin'] = '*';
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        }
    });
});

