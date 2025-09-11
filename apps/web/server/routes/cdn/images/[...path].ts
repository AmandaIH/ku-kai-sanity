// Nuxt 4 / Nitro (TypeScript)
import { defineEventHandler, getRequestURL, setHeader, proxyRequest } from 'h3';

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Incoming URL example:
  // https://example.com/cdn/images/images/<projectId>/<dataset>/<assetId>.<ext>?w=1200&h=800&fit=crop&auto=format
  //
  // We want to rewrite ONLY the origin/leading segment (`/media/images`) and keep the rest (path + query) intact.

  const upstream = new URL(url.toString());
  upstream.protocol = 'https:';
  upstream.hostname = 'cdn.sanity.io';
  upstream.port = '';
  // Remove the /cdn/images prefix from the path:
  upstream.pathname = upstream.pathname.replace(/^\/cdn/, '');
  
//   console.log('Proxying to:', upstream.toString());

  // Strong caching for edge/CDN; Sanity assets are content-hashed
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
  setHeader(event, 'Access-Control-Allow-Origin', '*');
  // If you rely on auto=format, vary on Accept so the edge can keep webp/avif/jpg separately
  if (upstream.searchParams.get('auto') === 'format') {
    setHeader(event, 'Vary', 'Accept');
    // console.log('Auto format enabled - Original Accept header:', event.node.req.headers['accept']);
  }

  // Stream the origin response through (status + body + headers)
  // h3's proxyRequest keeps query string and supports streaming.
  return proxyRequest(event, upstream.toString(), {
    fetchOptions: {
      // Ensure no cookies leak upward
      headers: { 
        'Accept-Encoding': event.node.req.headers['accept-encoding'] ?? '',
        // For auto=format, always send proper image Accept header to prioritize AVIF
        'Accept': upstream.searchParams.get('auto') === 'format' 
          ? 'image/avif,image/webp,image/*' 
          : (event.node.req.headers['accept'] ?? 'image/*')
      },
    },
    onResponse: (res) => {
      // Drop Set-Cookie from origin (shouldn't be present, but be safe)
      res.headers.delete('set-cookie');
      // Optional: normalize content type fallback
      if (!res.headers.get('content-type')) {
        res.headers.set('content-type', 'image/jpeg');
      }
    },
  });
});
