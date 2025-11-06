import type { NitroAppPlugin, RenderResponse } from 'nitropack'

export default defineNitroPlugin(async (nitroApp) => {
    
    nitroApp.hooks.hook('render:response', (response: Partial<RenderResponse>, context) => {
        if (!response.headers) {
            response.headers = {};
        }
        
        // Check if we're in development mode
        const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NITRO_DEV === 'true';
        
        // Completely skip CSP in development mode for Safari compatibility
        if (isDevelopment) {
            return; // Don't set any CSP headers in development
        }
        
        if (!response.headers['content-security-policy']) {
            // Default CSP sources without relying on Pinia store
            const scrptSrc = [
                'https://*.googletagmanager.com',
                'https://www.googletagmanager.com',
                'https://tagmanager.google.com',
                'https://www.googleadservices.com',
                'https://googleads.g.doubleclick.net',
                'https://www.google.com',
                'https://consentcdn.cookiebot.com',
                'https://consent.cookiebot.com',
                'https://assets.adoberesources.net',
                'https://documentcloud.adobe.com',
                'https://www.google-analytics.com',
                'https://ajax.cloudflare.com',
                'https://cdn.cloudflare.com',
                'https://*.europe-west1.firebasedatabase.app',
                'https://*.firebasedatabase.app',
            ];

            const frameSrc = [
                'https://www.googletagmanager.com',
                'https://www.youtube.com',
                'https://youtu.be',
                'https://www.youtube-nocookie.com',
                'https://vimeo.com',
                'https://player.vimeo.com',
                'https://documentcloud.adobe.com',
                'https://consentcdn.cookiebot.com',
                'https://*.europe-west1.firebasedatabase.app',
                'https://*.firebasedatabase.app',
            ];

            const fontSrc = [
                'https://fonts.gstatic.com',
                'https://fonts.googleapis.com',
                'https://*.typekit.net'
            ]

            const styleSrc = [
                'https://fonts.gstatic.com',
                'https://fonts.googleapis.com',
                'https://*.typekit.net'
            ];

            const frameAncestors = [
                'https://app.flowmate.dk',
                'https://*.flowmate.dk',
                'http://localhost:5173',
            ];

            // Production CSP only (development is skipped above)
            response.headers['content-security-policy'] = "upgrade-insecure-requests;";
            // Note - unsafe-inline and unsafe-eval are needed for nuxt or gsap or something.
            response.headers['content-security-policy'] += "script-src 'self' 'unsafe-inline' 'unsafe-eval' "+scrptSrc.join(' ')+";";  // NOTE - unsafe-inline and unsafe-eval is required with greensock.
            response.headers['content-security-policy'] += "style-src 'self' 'unsafe-inline' "+styleSrc.join(' ')+";"; // Specifies valid sources for stylesheets.
            response.headers['content-security-policy'] += "frame-ancestors 'self' " + frameAncestors.join(' ') + ";"; // Specifies valid parents that may embed a page using <frame>, <iframe>, <object>, or <embed>.
            response.headers['content-security-policy'] += "font-src 'self' "+fontSrc.join(' ')+";";
            response.headers['content-security-policy'] += "frame-src 'self' "+frameSrc.join(' ')+";";
            // object-src headers.
            response.headers['content-security-policy'] += "object-src 'none';"; // Specifies valid sources for the <object>, <embed>, and <applet> elements.
        }
    })
});