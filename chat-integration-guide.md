# Complete Guide: Integrating the Chat Widget with n8n

This guide will walk you through the entire process of integrating the floating chat widget with your n8n workflow, step by step.

## Step 1: Enable CORS on Your n8n Server

CORS (Cross-Origin Resource Sharing) is a security feature that prevents websites from making requests to different domains. We need to enable it for your n8n server to accept requests from your website.

1. **Update your Docker Compose file**:
   - Open your Docker Compose file where n8n is configured
   - Add these environment variables to the n8n service:
     ```yaml
     - N8N_CORS_ENABLED=true
     - 'N8N_CORS_ALLOW_ORIGIN=http://localhost:3000,https://namaste-token.netlify.app'
     ```

2. **Apply the changes**:
   ```bash
   # Navigate to your Docker Compose directory
   cd /path/to/your/docker-compose
   
   # Update the container
   docker-compose up -d --no-deps n8n
   ```

3. **Verify CORS is enabled**:
   ```bash
   # Check if CORS headers are being returned
   curl -X OPTIONS https://n8n.lucidsro.com/webhook/Rk5qA8T90dH6gy5V \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -v
   ```

## Step 2: Configure Your n8n Workflow

1. **Log in to your n8n instance** at https://n8n.lucidsro.com

2. **Open your chat workflow** (the one with the webhook URL: `Rk5qA8T90dH6gy5V`)

3. **Configure the Webhook node**:
   - Make sure HTTP Method is set to POST
   - Response Mode should be set to "Last Node"
   - Authentication should be set to "None" (or match what's in your FloatingChat.js)
   - The path should match what's in your webhook URL

4. **Configure the Code node** (if you have one):
   - Make sure it properly processes the incoming message
   - It should extract the message from the request body

5. **Configure the AI Agent node**:
   - Ensure it has valid OpenAI API credentials
   - Check that the Window Buffer Memory is properly connected
   - Make sure it's configured to return responses in the correct format

6. **Configure the Respond to Webhook node**:
   - This node should return a JSON object with one of these properties:
     - `response`: The message text
     - `text`: The message text
     - `message`: The message text

7. **Activate the workflow** if it's not already active

## Step 3: Test the n8n Webhook Directly

Before testing with your website, let's make sure the webhook works directly:

1. **Install Node.js dependencies** (if you haven't already):
   ```bash
   npm install node-fetch
   ```

2. **Run the test script**:
   ```bash
   node test-n8n-webhook.js
   ```

3. **Check the output**:
   - If successful, you should see a response from your n8n webhook
   - If there's an error, check the error message for clues

## Step 4: Test the Chat Widget Locally

1. **Start your local development server**:
   ```bash
   npm start
   ```

2. **Open your browser** to http://localhost:3000

3. **Open the chat widget** and send a test message

4. **Check the browser console** for any errors or logs

5. **If you see CORS errors**:
   - Make sure your n8n server has restarted with the CORS configuration
   - Check that the webhook URL in FloatingChat.js is correct
   - Verify that your n8n instance is accessible from your local machine

## Step 5: Deploy to Production

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Add floating chat widget with n8n integration"
   git push
   ```

2. **Wait for Netlify to deploy** your changes

3. **Test the chat widget on your live site**

## Troubleshooting

### CORS Issues

If you're still seeing CORS errors:

1. **Check n8n logs**:
   ```bash
   docker-compose logs n8n | grep -i cors
   ```

2. **Verify CORS configuration**:
   - Make sure the environment variables are correctly set
   - Check that your website domain is in the allowed origins

3. **Try a different approach**:
   - If Docker environment variables don't work, you can try using a reverse proxy like Nginx to add CORS headers

### Webhook Not Responding

If the webhook isn't responding:

1. **Check if the workflow is active** in n8n

2. **Verify the webhook URL** is correct in your FloatingChat.js

3. **Check n8n logs** for any errors:
   ```bash
   docker-compose logs n8n | tail -n 100
   ```

4. **Test the webhook directly** using curl:
   ```bash
   curl -X POST https://n8n.lucidsro.com/webhook/Rk5qA8T90dH6gy5V \
     -H "Content-Type: application/json" \
     -d '{"message":"Test message"}'
   ```

### AI Model Issues

If the AI model isn't generating responses:

1. **Check OpenAI API credentials** in your n8n workflow

2. **Verify the AI Agent configuration** in n8n

3. **Look for error messages** in the n8n execution history

## Need More Help?

If you're still having issues, here are some additional resources:

- [n8n Documentation on CORS](https://docs.n8n.io/hosting/configuration/#cors)
- [n8n Community Forum](https://community.n8n.io/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference) 