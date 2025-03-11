/**
 * Test script for directly accessing the n8n webhook
 * 
 * Run with: node test-direct-webhook.js
 */

const fetch = require('node-fetch');

// Production webhook URL
const PRODUCTION_WEBHOOK_URL = 'https://n8n.lucidsro.com/webhook/d7419ab0-97d5-4493-b58f-3cbf3e2cca25';

// Test webhook URL - only works after clicking "Test workflow" in n8n
const TEST_WEBHOOK_URL = 'https://n8n.lucidsro.com/webhook-test/d7419ab0-97d5-4493-b58f-3cbf3e2cca25';

// Choose which URL to test
const WEBHOOK_URL_TO_TEST = PRODUCTION_WEBHOOK_URL; // Change to TEST_WEBHOOK_URL to test the test webhook

async function testWebhook() {
  console.log('Testing n8n webhook directly...');
  console.log(`URL: ${WEBHOOK_URL_TO_TEST}`);
  console.log('Note: If using test webhook, make sure to click "Test workflow" in n8n first');
  
  try {
    // Test with a more complete message that matches what the chat widget sends
    const response = await fetch(WEBHOOK_URL_TO_TEST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello from direct test script',
        sessionId: 'test-session-123',
        userId: 'test-user-456',
        timestamp: new Date().toISOString(),
        theme: 'light',
        source: 'test-script'
      }),
    });
    
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    // Log response headers
    console.log('Response headers:');
    response.headers.forEach((value, name) => {
      console.log(`  ${name}: ${value}`);
    });
    
    if (response.ok) {
      try {
        // Check if there's content to parse
        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 0) {
          const data = await response.json();
          console.log('Response data:', data);
        } else {
          console.log('Response is empty (no content)');
          console.log('This is OK! The webhook accepted our request but returned an empty response.');
          console.log('You may need to configure the "Respond to Webhook" node in n8n to return data.');
        }
      } catch (parseError) {
        console.log('Could not parse response as JSON:', parseError.message);
        const text = await response.text();
        console.log('Raw response text:', text || '(empty)');
      }
    } else {
      console.error('Error: Server responded with status', response.status);
      try {
        const errorText = await response.text();
        console.error('Error response:', errorText);
      } catch (e) {
        console.error('Could not parse error response');
      }
    }
  } catch (error) {
    console.error('Error connecting to webhook:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testWebhook(); 