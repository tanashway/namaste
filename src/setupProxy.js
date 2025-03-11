const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Create a proxy specifically for the n8n webhook
  app.use(
    '/n8n-webhook',
    createProxyMiddleware({
      target: 'https://n8n.lucidsro.com/webhook',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/n8n-webhook': '', // Remove the /n8n-webhook prefix
      },
      onProxyReq: (proxyReq, req, res) => {
        // Log the request for debugging
        console.log(`Proxying request to: ${req.method} ${proxyReq.path}`);
        
        // Log request headers
        console.log('Request headers:', req.headers);
        
        // Log request body if available
        if (req.body) {
          console.log('Request body:', req.body);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log the response for debugging
        console.log(`Received response from proxy: ${proxyRes.statusCode}`);
        console.log('Response headers:', proxyRes.headers);
        
        // Log response body for error status codes
        if (proxyRes.statusCode >= 400) {
          let responseBody = '';
          proxyRes.on('data', chunk => {
            responseBody += chunk;
          });
          
          proxyRes.on('end', () => {
            console.log('Error response body:', responseBody);
          });
        }
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        console.error('Error stack:', err.stack);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          message: 'Proxy error connecting to n8n server',
          error: err.message,
          stack: err.stack
        }));
      }
    })
  );
  
  // Create a proxy for the test webhook
  app.use(
    '/n8n-test-webhook',
    createProxyMiddleware({
      target: 'https://n8n.lucidsro.com/webhook-test',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/n8n-test-webhook': '', // Remove the /n8n-test-webhook prefix
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying test webhook request to: ${req.method} ${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Received test webhook response: ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error('Test webhook proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          message: 'Proxy error connecting to n8n test webhook',
          error: err.message
        }));
      }
    })
  );
}; 