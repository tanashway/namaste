const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/webhook',
    createProxyMiddleware({
      target: 'https://n8n.lucidsro.com',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        // Log the request for debugging
        console.log(`Proxying request to: ${req.method} ${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log the response for debugging
        console.log(`Received response from proxy: ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          message: 'Proxy error connecting to n8n server',
          error: err.message
        }));
      }
    })
  );
}; 