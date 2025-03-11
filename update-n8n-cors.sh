#!/bin/bash

# Script to update n8n container with CORS settings
# Usage: ./update-n8n-cors.sh

echo "Updating n8n container with CORS settings..."

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is not installed."
    exit 1
fi

# Check if the container exists
if ! docker ps | grep -q n8n; then
    echo "Error: n8n container not found."
    exit 1
fi

# Create a backup of the current environment variables
echo "Creating backup of current environment variables..."
docker inspect n8n | grep -A 50 "Env" > n8n-env-backup.txt

# Add CORS environment variables
echo "Adding CORS environment variables to n8n container..."
docker exec n8n sh -c 'echo "N8N_CORS_ENABLED=true" >> /home/node/.n8n/.env'
docker exec n8n sh -c 'echo "N8N_CORS_ALLOW_ORIGIN=http://localhost:3000,https://namaste-token.netlify.app" >> /home/node/.n8n/.env'

# Restart the container
echo "Restarting n8n container..."
docker-compose restart n8n

# Wait for the container to start
echo "Waiting for n8n to start..."
sleep 10

# Check if n8n is running
if docker ps | grep -q n8n; then
    echo "✅ n8n container restarted successfully."
else
    echo "❌ Error: n8n container failed to restart."
    exit 1
fi

# Test CORS configuration
echo "Testing CORS configuration..."
curl -X OPTIONS https://n8n.lucidsro.com/webhook/Rk5qA8T90dH6gy5V \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v 2>&1 | grep -i "access-control"

echo ""
echo "If you see Access-Control headers above, CORS is configured correctly."
echo "If not, you may need to update your Docker Compose file manually."
echo ""
echo "Next steps:"
echo "1. Test your webhook directly: node test-n8n-webhook.js"
echo "2. Test the chat widget on your local development server"
echo "3. Deploy to production" 