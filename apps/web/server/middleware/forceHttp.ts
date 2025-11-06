export default defineEventHandler((event) => {
  // In development, ensure all URLs are HTTP, not HTTPS
  if (process.env.NODE_ENV === 'development') {
    const url = event.node.req.url || '';
    
    // If request came via HTTPS, redirect to HTTP
    if (event.node.req.headers['x-forwarded-proto'] === 'https' || 
        event.node.req.headers[':scheme'] === 'https') {
      const host = event.node.req.headers.host || 'localhost:3000';
      const httpUrl = `http://${host}${url}`;
      return sendRedirect(event, httpUrl, 301);
    }
    
    // Ensure response headers don't force HTTPS
    setHeader(event, 'Strict-Transport-Security', '');
    setHeader(event, 'X-Forwarded-Proto', 'http');
  }
});

