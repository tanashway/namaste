# Updating Your n8n Docker Configuration

Based on the environment variables you shared earlier, you're running n8n in Docker. Here's how to update your configuration to enable CORS:

## Step 1: Locate Your Docker Compose File

First, find the Docker Compose file that defines your n8n service. This is typically named `docker-compose.yml` or similar.

## Step 2: Add CORS Environment Variables

Add these environment variables to your n8n service definition:

```yaml
services:
  n8n:
    # ... existing configuration ...
    environment:
      # Existing environment variables
      DB_POSTGRESDB_PASSWORD: ${SERVICE_PASSWORD_POSTGRES}
      DB_POSTGRESDB_USER: ${SERVICE_USER_POSTGRES}
      GENERIC_TIMEZONE: Europe/Berlin
      POSTGRES_DB: n8n
      POSTGRES_PASSWORD: ${SERVICE_PASSWORD_POSTGRES}
      POSTGRES_USER: ${SERVICE_USER_POSTGRES}
      SERVICE_FQDN_N8N: https://n8n.lucidsro.com
      SERVICE_URL_N8N: n8n.lucidsro.com
      TZ: Europe/Berlin
      
      # Add these new CORS configuration variables
      N8N_CORS_ENABLED: true
      N8N_CORS_ALLOW_ORIGIN: "http://localhost:3000,https://namaste-token.netlify.app"
```

## Step 3: Restart Your n8n Container

After updating the Docker Compose file, restart your n8n container:

```bash
docker-compose up -d --no-deps n8n
```

Or if you're using a different Docker management tool, use the appropriate restart command.

## Step 4: Verify CORS Configuration

To verify that CORS is properly configured, you can use a tool like curl to send a preflight request:

```bash
curl -X OPTIONS https://n8n.lucidsro.com/webhook/Rk5qA8T90dH6gy5V \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Look for the `Access-Control-Allow-Origin` header in the response. It should include `http://localhost:3000`. 