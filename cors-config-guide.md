# Configuring CORS for Your n8n Instance

To fix the CORS error you're experiencing, you need to configure your n8n instance to accept requests from your website domains.

## Option 1: Using Environment Variables

If you're running n8n in Docker (which appears to be the case based on your configuration), you can add these environment variables to your Docker Compose file or your container configuration:

```yaml
environment:
  # Existing environment variables
  # ...
  
  # CORS configuration
  N8N_CORS_ENABLED: true
  N8N_CORS_ALLOW_ORIGIN: "http://localhost:3000,https://namaste-token.netlify.app"
```

## Option 2: Using n8n Configuration File

If you have access to the n8n configuration file, you can add these settings:

```js
module.exports = {
  // ... other settings
  cors: {
    enabled: true,
    allowOrigin: [
      'http://localhost:3000',
      'https://namaste-token.netlify.app'
    ]
  }
};
```

## Option 3: Using a Reverse Proxy

If you're using Nginx or another reverse proxy in front of n8n, you can configure CORS headers there:

```nginx
location /webhook/ {
    proxy_pass http://your-n8n-service:5678;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' 'http://localhost:3000' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept' always;
    
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'http://localhost:3000' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept' always;
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        add_header 'Content-Length' 0;
        return 204;
    }
}
```

## Restarting n8n

After making these changes, you'll need to restart your n8n instance for the changes to take effect.

```bash
# If using Docker Compose
docker-compose restart n8n

# If using Docker directly
docker restart your-n8n-container
```

## Testing the Configuration

After restarting, test your chat widget again from your local development server. The CORS error should be resolved. 