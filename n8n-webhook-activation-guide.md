# Activating Your n8n Workflow for the Chat Widget

We've discovered that the n8n webhook is returning a 404 error with the message:

> "The requested webhook \"POST Rk5qA8T90dH6gy5V\" is not registered."
> 
> "The workflow must be active for a production URL to run successfully. You can activate the workflow using the toggle in the top-right of the editor."

This guide will help you activate your n8n workflow and ensure the webhook is properly registered.

## Step 1: Log in to Your n8n Instance

1. Open your browser and navigate to https://n8n.lucidsro.com
2. Log in with your credentials

## Step 2: Find Your Chat Workflow

1. In the n8n dashboard, locate the workflow you created for the chat widget
2. Click on it to open the workflow editor

## Step 3: Activate the Workflow

1. In the workflow editor, look for the activation toggle in the top-right corner
2. If the toggle is off (gray), click it to turn it on (it should turn blue)
3. You should see a confirmation message that the workflow is now active

## Step 4: Verify the Webhook URL

1. Click on the Webhook node in your workflow
2. Check the webhook path - it should be `Rk5qA8T90dH6gy5V`
3. If the path is different, update the `PRODUCTION_WEBHOOK_URL` and `DEVELOPMENT_WEBHOOK_URL` constants in the `FloatingChat.js` file

## Step 5: Test the Webhook

1. With the workflow activated, run this command in your terminal:
   ```bash
   node test-direct-webhook.js
   ```
2. If successful, you should see a response from the webhook
3. If you still see an error, check the error message for additional clues

## Step 6: Update the Chat Widget Configuration

If you needed to change the webhook URL:

1. Update the `FloatingChat.js` file with the correct URL
2. Restart your development server
3. Test the chat widget again

## Troubleshooting

### Workflow Not Activating

If you can't activate the workflow:

1. Check if there are any errors in the workflow
2. Make sure all nodes are properly connected
3. Verify that the AI Agent has valid API credentials

### Webhook Still Not Working

If the webhook is still not working after activation:

1. Try creating a new webhook node with a simpler configuration
2. Make sure the Response Mode is set to "Last Node"
3. Check that the workflow is properly saving the activation state

### Testing in Development Mode

While you're fixing the n8n webhook, you can use the simulated responses in development mode:

1. In `FloatingChat.js`, make sure `useSimulatedResponsesInDev` is set to `true`
2. This will allow you to test the chat widget UI without needing the n8n webhook

## Next Steps

Once you've activated the workflow and verified that the webhook is working:

1. Set `useSimulatedResponsesInDev` back to `false` in `FloatingChat.js`
2. Test the chat widget with the real n8n webhook
3. Deploy to production when everything is working correctly 