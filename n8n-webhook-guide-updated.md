# Using the Correct n8n Webhook for Your Chat Widget

We've discovered that the webhook URL we were using was incorrect. The correct webhook path is `chat-handler` instead of `Rk5qA8T90dH6gy5V`. This guide will help you understand the different types of n8n webhooks and how to use them.

## Understanding n8n Webhook Types

n8n provides two types of webhook URLs:

### 1. Test Webhook URL

- **URL Format**: `https://n8n.lucidsro.com/webhook-test/chat-handler`
- **Purpose**: For testing during development
- **Behavior**: 
  - Only works after clicking "Test workflow" in the n8n editor
  - Only works for one call after clicking the button
  - Shows execution directly on the canvas

### 2. Production Webhook URL

- **URL Format**: `https://n8n.lucidsro.com/webhook/chat-handler`
- **Purpose**: For production use
- **Behavior**:
  - Requires the workflow to be activated
  - Works continuously without needing to click any buttons
  - Executions are only shown in the executions list, not on the canvas

## Testing the Webhook

### Option 1: Using the Test Script

1. **For the test webhook**:
   - Open your n8n workflow
   - Click the "Test workflow" button
   - Immediately run:
     ```bash
     node test-direct-webhook.js
     ```

2. **For the production webhook**:
   - Activate your workflow using the toggle in the top-right corner
   - Edit `test-direct-webhook.js` to use `PRODUCTION_WEBHOOK_URL`
   - Run:
     ```bash
     node test-direct-webhook.js
     ```

### Option 2: Using curl

1. **For the test webhook**:
   - Open your n8n workflow
   - Click the "Test workflow" button
   - Immediately run:
     ```bash
     curl -X POST https://n8n.lucidsro.com/webhook-test/chat-handler \
       -H "Content-Type: application/json" \
       -d '{"message":"Hello from curl"}'
     ```

2. **For the production webhook**:
   - Activate your workflow
   - Run:
     ```bash
     curl -X POST https://n8n.lucidsro.com/webhook/chat-handler \
       -H "Content-Type: application/json" \
       -d '{"message":"Hello from curl"}'
     ```

## Configuring Your Chat Widget

We've updated the FloatingChat component to use the correct webhook URL:

- **Production**: `https://n8n.lucidsro.com/webhook/chat-handler`
- **Development**: `/n8n-webhook/chat-handler` (proxied)

While you're setting up the webhook, you can use simulated responses by keeping `useSimulatedResponsesInDev = true` in the FloatingChat component.

## Activating Your Workflow

For the production webhook to work, you must activate your workflow:

1. Log in to your n8n instance at https://n8n.lucidsro.com
2. Open your chat workflow
3. Click the activation toggle in the top-right corner
4. Verify that the workflow is active (the toggle should be blue)

## Troubleshooting

### "Webhook not registered" Error

If you see this error:
```
The requested webhook "POST chat-handler" is not registered.
```

This means either:
- You're using the production URL but the workflow is not activated
- The webhook path in your workflow doesn't match the URL you're using

### Test Webhook Not Working

If the test webhook doesn't work:
- Make sure you click "Test workflow" immediately before making the request
- Remember that it only works for one call after clicking the button
- Check that the webhook path in your workflow matches the URL

### Production Webhook Not Working

If the production webhook doesn't work:
- Make sure the workflow is activated
- Check that the webhook path in your workflow matches the URL
- Verify that all nodes in your workflow are properly connected

## Next Steps

1. Test both webhook types to see which one works best for your needs
2. Update your chat widget configuration accordingly
3. When everything is working, set `useSimulatedResponsesInDev = false` to use the real webhook
4. Deploy to production 