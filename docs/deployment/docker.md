---
title: Deploy with Docker
description: Learn how to deploy your Weaverse theme using Docker, with a specific example for Fly.io deployment
publishedAt: April 18, 2025
updatedAt: April 21, 2025
order: 3
published: true
---

# Deploying Weaverse Themes with Docker

> **Important**: For production deployments, use [Shopify Oxygen](/docs/deployment/oxygen). Docker deployment is recommended only for development and testing.
>
> Note: mini-oxygen in Docker simulates the Workers environment and requires environment variables to be set via `.env` file, not through cloud platform settings.
>
> For a complete working example, check out our [Naturelle Demo Repository](https://github.com/Weaverse/naturelle-demo) which demonstrates Docker deployment configuration in a real Weaverse theme project.

## Understanding Docker Deployment

Docker deployment for Weaverse themes uses mini-oxygen, a Node.js-based simulation of the Shopify Workers environment. This approach has several important characteristics:

1. **Environment Simulation**:
   - Runs in Node.js instead of actual Workers runtime
   - Some Worker-specific features might behave differently
   - Useful for development and testing, but not ideal for production

2. **Network Binding**:
   - Requires special handling for host binding (localhost → 0.0.0.0)
   - Enables access from outside the container
   - Essential for cloud deployment scenarios

3. **Environment Variables**:
   - Must use `.env` file approach
   - Cloud platform environment settings won't work
   - Simulates Worker environment variable access

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (latest stable version)
- [Node.js](https://nodejs.org/) (LTS version)
- [Fly.io CLI](https://fly.io/docs/hands-on/install-flyctl/) (for Fly.io deployment)
- A Weaverse theme project

## Configuration Files

### 1. Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:lts-bookworm-slim as base

# Install essential SSL and security certificates
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Build stage for compiling and preparing the application
FROM base as build
WORKDIR /myapp

# Install dependencies using package files
COPY package*.json .npmrc ./
RUN npm ci

# Copy all source files
COPY . .

# Patch the workerd configuration for container compatibility
# This is necessary because:
# 1. Default localhost binding doesn't work in containers
# 2. External access requires 0.0.0.0 binding
# 3. Both Shopify CLI and Hydrogen files need patching
RUN set -e && \
    WORKERD_FILE=$(find node_modules/@shopify/cli/dist -type f -name "workerd-*.js") && \
    if [ -f "$WORKERD_FILE" ]; then \
        sed -i -e 's|host: "localhost"|host: "0.0.0.0"|' "$WORKERD_FILE"; \
    else \
        echo "workerd file not found" && exit 1; \
    fi && \
    HYDROGEN_WORKERD_FILE="node_modules/@shopify/cli-hydrogen/dist/lib/mini-oxygen/workerd.js" && \
    if [ -f "$HYDROGEN_WORKERD_FILE" ]; then \
        sed -i -e 's|host: "localhost"|host: "0.0.0.0"|' "$HYDROGEN_WORKERD_FILE"; \
    else \
        echo "hydrogen workerd file not found" && exit 1; \
    fi

# Build the application
RUN npm run build

# Production stage with minimal footprint
FROM base as production
WORKDIR /myapp

# Set runtime environment
ENV NODE_ENV=production
ENV FLY="true"
ENV PORT="3000"

# Copy only necessary files from build stage
COPY --from=build /myapp/dist /myapp/dist
COPY --from=build /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/.env /myapp/.env

EXPOSE 3000
CMD ["npm", "run", "start"]
```

### 2. .dockerignore

Create a `.dockerignore` to optimize build context and improve security:

```plaintext
# Dependencies
/node_modules

# Logs and temporary files
*.log
.DS_Store
/.cache

# Version control
.git

# Build outputs
/dist

# Shopify specific
/.shopify
```

### 3. Environment Configuration

Create a `.env` file in your project root:

```plaintext
# Shopify Configuration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN=your-token

# Additional configurations as needed
# PUBLIC_STORE_DOMAIN=your-public-domain.com
# SESSION_SECRET=your-session-secret
```

## Cloud Deployment (Fly.io)

### 1. Fly.io Configuration

Create `fly.toml`:

```toml
# Application Configuration
app = 'your-app-name'
primary_region = 'sin'

# HTTP Service Configuration
[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

# Virtual Machine Configuration
[[vm]]
  memory = '1024mb'
  cpu_kind = 'shared'
  cpus = 1
```

### 2. Deployment Steps

1. Initialize deployment:
```bash
fly launch
```

2. Deploy the application:
```bash
fly deploy
```

3. Monitor deployment:
```bash
# Check status
fly status

# View logs
fly logs
```

## Troubleshooting Guide

### Common Issues and Solutions

1. **Build Failures**:
   - Verify Node.js version compatibility
   - Check for missing dependencies
   - Ensure Docker has enough resources

2. **Runtime Errors**:
   - Check container logs: `fly logs`
   - Verify environment variables
   - Confirm port configurations

3. **Performance Issues**:
   - Monitor resource usage
   - Check for memory leaks
   - Verify network connectivity

## Limitations and Considerations

1. **Worker Environment Simulation**:
   - Not all Worker features are available
   - Performance characteristics differ
   - Some APIs might behave differently

2. **Environment Variables**:
   - Must use `.env` file approach
   - No support for cloud platform env settings
   - Careful management of sensitive data required

3. **Production Readiness**:
   - Consider using Shopify Oxygen for production
   - Docker deployment best for development/testing
   - Monitor resource usage and performance 