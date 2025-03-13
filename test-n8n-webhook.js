/**
 * Test script for n8n webhook
 * 
 * Run with: node test-n8n-webhook.js
 */

const fetch = require('node-fetch');

// N8N webhook URL
const WEBHOOK_URL = 'https://n8n.lucidsro.com/webhook/d7419ab0-97d5-4493-b58f-3cbf3e2cca25';

// Test message
const testMessage = {
  message: 'Hello from test script'
};

async function testWebhook() {
  console.log(`Testing webhook at: ${WEBHOOK_URL}`);
  console.log(`Sending data: ${JSON.stringify(testMessage)}`);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log('Response headers:', response.headers.raw());
    
    // Check if there's content to parse
    const contentLength = response.headers.get('content-length');
    
    if (!contentLength || parseInt(contentLength) === 0) {
      console.log('⚠️ Empty response received');
      return;
    }
    
    const data = await response.json();
    const responseText = data.response || data.text || data.message;
    if (responseText) {
      console.log('✅ Success! Received response:', responseText);
    } else {
      console.log('⚠️ Response did not contain expected fields:', data);
    }
  } catch (error) {
    console.error('❌ Error testing webhook:', error);
  }
}

// Run the test
testWebhook(); 