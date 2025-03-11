# Setting Up Your N8N Workflow for Namaste Chat

This guide will help you set up an n8n workflow to handle messages from your website's floating chat widget.

## Prerequisites

1. An n8n instance (self-hosted or cloud)
2. Basic understanding of n8n workflows

## Step 1: Create a New Workflow

1. Log in to your n8n instance
2. Click on "Workflows" in the sidebar
3. Click "Create new workflow"
4. Name it "Namaste Chat Handler"

## Step 2: Add a Webhook Trigger

1. Add a new node by clicking the "+" button
2. Search for "Webhook" and select it
3. Configure the webhook:
   - Method: POST
   - Path: chat-handler (or any path you prefer)
   - Authentication: None (or add authentication if needed)
   - Response Mode: Last Node
4. Click "Execute Node" to activate the webhook
5. Copy the webhook URL (you'll need to update the `N8N_WORKFLOW_URL` constant in your `FloatingChat.js` component)

## Step 3: Add a Function Node to Process Messages

1. Add a new node after the webhook
2. Search for "Function" and select it
3. Use this code as a starting point:

```javascript
// Process incoming message
const incomingData = items[0].json;
const message = incomingData.message;
const theme = incomingData.theme || 'light';
const timestamp = incomingData.timestamp;

// Simple response logic - customize as needed
let response;

// Check for keywords in the message
if (message.toLowerCase().includes('buy') || message.toLowerCase().includes('purchase')) {
  response = "You can buy Namaste tokens on our partner exchanges. Check our website for the latest listing information!";
} 
else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('worth')) {
  response = "The price of Namaste token fluctuates based on market conditions. Check our Linktr.ee for current price information.";
}
else if (message.toLowerCase().includes('tokenomics')) {
  response = "Namaste token has a fair distribution model with no team allocation. Check our tokenomics section for more details!";
}
else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
  response = theme === 'namaste' ? "Meow! How can I help you today?" : "Namaste! How can I assist you with our token?";
}
else {
  response = "Thanks for reaching out! If you have specific questions about Namaste token, feel free to ask about buying, price, or tokenomics.";
}

// Return the response
return {
  json: {
    response,
    received: message,
    timestamp: new Date().toISOString()
  }
};
```

## Step 4: Add a Respond to Webhook Node

1. Add a final node after the Function node
2. Search for "Respond to Webhook" and select it
3. Keep the default settings (it will return the data from the previous node)

## Step 5: Activate and Test the Workflow

1. Click "Save" to save your workflow
2. Make sure the workflow is active
3. Test by sending a message from your website's chat widget

## Advanced Options

### Connect to External Services

You can enhance your chat by connecting to external services:

- **Database Node**: Store chat conversations
- **HTTP Request Node**: Fetch token prices or other data
- **Telegram/Discord Node**: Forward important messages to your team
- **OpenAI Node**: Use AI to generate more sophisticated responses

### Add Authentication

For production use, consider adding authentication to your webhook:

1. In the Webhook node settings, change Authentication to "Header Auth"
2. Set a custom header name (e.g., "x-api-key") and value
3. Update your `FloatingChat.js` component to include this header in the fetch request

## Updating Your Website

Don't forget to update the `N8N_WORKFLOW_URL` constant in your `FloatingChat.js` component with the webhook URL from Step 2.

```javascript
// Replace this with your actual webhook URL
const N8N_WORKFLOW_URL = 'https://your-n8n-instance.com/webhook/chat-handler';
```

## Troubleshooting

- If messages aren't reaching n8n, check browser console for CORS errors
- If you get CORS errors, configure your n8n instance to allow requests from your website domain
- Test your webhook directly using a tool like Postman before integrating with your website 