# Configuring Your n8n Webhook for the Chat Widget

Let's make sure your n8n webhook is properly configured to work with the chat widget.

## Step 1: Check Webhook Configuration

1. Log in to your n8n instance at https://n8n.lucidsro.com
2. Open your chat workflow
3. Select the Webhook node and check these settings:

   - **Authentication**: None (or if you're using authentication, make sure it matches what's in the FloatingChat.js)
   - **HTTP Method**: POST
   - **Response Mode**: Last Node (important!)
   - **Path**: Should match the path in your webhook URL (Rk5qA8T90dH6gy5V)

## Step 2: Verify Response Format

The chat widget expects a specific response format from your n8n workflow. Make sure your "Respond to Webhook" node returns JSON with one of these properties:

```json
{
  "response": "Your message here"
}
```

OR

```json
{
  "text": "Your message here"
}
```

OR

```json
{
  "message": "Your message here"
}
```

## Step 3: Test the Webhook Directly

You can test your webhook directly using curl or Postman:

```bash
curl -X POST https://n8n.lucidsro.com/webhook/Rk5qA8T90dH6gy5V \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from curl test","theme":"light","userId":"test-user","source":"test"}'
```

You should receive a JSON response with one of the properties mentioned above.

## Step 4: Check AI Agent Configuration

If you're using the AI Agent node:

1. Make sure the AI Agent is configured to return a response in the correct format
2. Check that the OpenAI Chat Model is properly connected and has valid API credentials
3. Verify that the Window Buffer Memory is working correctly

## Step 5: Debug Common Issues

If your webhook isn't responding correctly:

1. Check n8n logs for any errors
2. Make sure the workflow is activated
3. Verify that all nodes in the workflow are properly connected
4. Check that the AI model has proper API access 