# Development Proxy Solution for n8n Integration

We've implemented a development proxy to bypass CORS issues when connecting to your n8n webhook. This solution allows your chat widget to communicate with your n8n server during local development without requiring changes to your n8n server configuration.

## What We've Done

1. **Added a Proxy Configuration to package.json**:
   ```json
   "proxy": "https://n8n.lucidsro.com"
   ```
   This tells the React development server to proxy requests to your n8n server.

2. **Created a setupProxy.js File**:
   This file provides more advanced proxy configuration with error handling and logging.

3. **Updated the FloatingChat Component**:
   - Added environment-specific webhook URLs
   - In development, we use a relative URL (`/webhook/Rk5qA8T90dH6gy5V`) that gets proxied
   - In production, we use the full URL (`https://n8n.lucidsro.com/webhook/Rk5qA8T90dH6gy5V`)

4. **Installed http-proxy-middleware**:
   This package is required for the proxy configuration.

## How It Works

1. When your React app is running in development mode, requests to `/webhook/...` are intercepted by the development server.

2. Instead of sending these requests directly to your browser (which would cause CORS errors), the development server forwards them to your n8n server.

3. The responses from your n8n server are then relayed back to your browser as if they came from the same origin, avoiding CORS issues.

## Testing the Solution

1. **Start your development server** (which you've already done):
   ```bash
   npm start
   ```

2. **Open your browser** to http://localhost:3000

3. **Open the chat widget** and send a test message

4. **Check the browser console** for logs:
   - You should see logs about proxying the request
   - You should see the response from your n8n server

## Troubleshooting

If you're still having issues:

1. **Check the browser console** for any errors

2. **Check your terminal** for proxy logs:
   - Look for messages like "Proxying request to: POST /webhook/Rk5qA8T90dH6gy5V"
   - Look for response status codes

3. **Verify your n8n workflow**:
   - Make sure your workflow is active
   - Check that the webhook URL is correct
   - Ensure the workflow is returning a proper JSON response

## Production Deployment

For production, we're using the direct URL to your n8n server. This means:

1. You'll still need to configure CORS on your n8n server for production use
2. Follow the instructions in `chat-integration-guide.md` to set up CORS for your n8n server

## Next Steps

1. Test the chat widget thoroughly in development mode
2. Configure CORS on your n8n server for production use
3. Deploy to production and test again 