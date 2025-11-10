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

  // Strong caching for edge/CDN; Sanity assets are content-hashed
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
  
  // Safari-specific CORS headers for video streaming
  setHeader(event, 'Access-Control-Allow-Origin', '*');
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
  setHeader(event, 'Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  
  // Handle OPTIONS preflight request for Safari
  if (event.node.req.method === 'OPTIONS') {
    setHeader(event, 'Content-Length', '0');
    return new Response(null, { status: 204 });
  }

  // Stream the origin response through (status + body + headers)
  // h3's proxyRequest keeps query string and supports streaming.
  return proxyRequest(event, upstream.toString(), {
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
      
      // Ensure proper Content-Type for Safari
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('video')) {
        res.headers.set('content-type', 'video/mp4');
      }
      
      // Safari needs Accept-Ranges header for video streaming
      if (!res.headers.get('accept-ranges')) {
        res.headers.set('accept-ranges', 'bytes');
      }
      
      // Ensure CORS headers are present in response
      res.headers.set('Access-Control-Allow-Origin', '*');
      res.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.headers.set('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
      res.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
    },
    onError: (error) => {
      console.error('Proxy request error:', error);
      console.error('Failed URL:', upstream.toString());
    },
  });
});
