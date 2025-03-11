/**
 * Test script for n8n webhook
 * 
 * Run with: node test-n8n-webhook.js
 */

const fetch = require('node-fetch');

const N8N_WEBHOOK_URL = 'https://n8n.lucidsro.com/webhook/Rk5qA8T90dH6gy5V';

async function testWebhook() {
  console.log('Testing n8n webhook...');
  console.log(`URL: ${N8N_WEBHOOK_URL}`);
  
  try {
    // First, test with a simple message
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello from test script',
        timestamp: new Date().toISOString(),
        theme: 'light',
        userId: 'test-script',
        source: 'test-script'
      }),
    });
    
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    // Log response headers (useful for CORS debugging)
    console.log('Response headers:');
    response.headers.forEach((value, name) => {
      console.log(`  ${name}: ${value}`);
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
      
      // Check if the response has the expected format
      const responseText = data.response || data.text || data.message;
      if (responseText) {
        console.log('✅ Success! Received response:', responseText);
      } else {
        console.warn('⚠️ Warning: Response does not contain expected fields');
        console.log('Full response:', data);
      }
    } else {
      console.error('❌ Error: Server responded with status', response.status);
      try {
        const errorText = await response.text();
        console.error('Error response:', errorText);
      } catch (e) {
        console.error('Could not parse error response');
      }
    }
  } catch (error) {
    console.error('❌ Error connecting to webhook:', error.message);
  }
}

testWebhook(); 