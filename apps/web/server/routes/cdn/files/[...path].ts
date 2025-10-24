// Nuxt 4 / Nitro (TypeScript)
import { defineEventHandler, getRequestURL, setHeader, proxyRequest } from 'h3';

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Incoming URL example:
  // https://example.com/cdn/files/<projectId>/<dataset>/<assetId>.<ext>
  //
  // We want to rewrite ONLY the origin/leading segment (`/cdn/files`) and keep the rest (path + query) intact.

  const upstream = new URL(url.toString());
  upstream.protocol = 'https:';
  upstream.hostname = 'cdn.sanity.io';
  upstream.port = '';
  // Remove the /cdn prefix from the path:
  upstream.pathname = upstream.pathname.replace(/^\/cdn/, '');
  
  console.log('Proxying video to:', upstream.toString());

  // Strong caching for edge/CDN; Sanity assets are content-hashed
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
  setHeader(event, 'Access-Control-Allow-Origin', '*');

  // Stream the origin response through (status + body + headers)
  // h3's proxyRequest keeps query string and supports streaming.
  return proxyRequest(upstream.toString(), {
    fetchOptions: {
      // Ensure no cookies leak upward
      headers: { 
        'Accept-Encoding': event.node.req.headers['accept-encoding'] ?? '',
        'Accept': 'video/*'
      },
    },
    onResponse: (res) => {
      // Drop Set-Cookie from origin (shouldn't be present, but be safe)
      res.headers.delete('set-cookie');
      // Optional: normalize content type fallback
      if (!res.headers.get('content-type')) {
        res.headers.set('content-type', 'video/mp4');
      }
    },
  });
});
