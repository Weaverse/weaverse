---
title: Installation
description: Install Weaverse for your Shopify Hydrogen project using our app-based workflow or manual methods.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
published: true
order: 2
---

# Installation

Get Weaverse installed and running in your Shopify Hydrogen project quickly and easily.

> **🚀 New to Weaverse?** Try our [5-Minute Quickstart](/docs/getting-started/quickstart) for the fastest setup experience.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **A Shopify store** - Development store or paid plan
- **Basic terminal knowledge** - For running commands

## Installation Methods

### Method A: Via Weaverse App (Recommended)

**Best for**: New users, quick setup, guided experience

1. **Install Weaverse App**: Visit https://apps.shopify.com/weaverse
2. **Create Project**: Open app → "Get Started" → Choose theme (Pilot recommended)
3. **Run Generated Command**: Copy and run the custom CLI command provided

Example command:
```bash
npx @weaverse/cli@latest create --template=pilot --project-id=abc123 --project-name=my-store
```

This automatically downloads the theme, installs dependencies, configures environment, and starts development server.

---

### Method B: Direct CLI Installation

If you have a Weaverse Project ID:

```bash
# Create project
npx @weaverse/cli@latest create --template=pilot --project-id=your-project-id --project-name=my-store

# Start development
cd my-store && npm run dev
```

**Available templates**: `pilot`, `naturelle`, `minimal`

---

### Method C: GitHub Clone

For developers who want git history:

```bash
git clone https://github.com/Weaverse/pilot.git my-store
cd my-store && npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

## Configuration

### Required Environment Variables

```bash
# Your Shopify store domain (without https://)
PUBLIC_STORE_DOMAIN=your-store.myshopify.com

# Storefront API token
PUBLIC_STOREFRONT_API_TOKEN=your_storefront_api_token

# Weaverse project ID
WEAVERSE_PROJECT_ID=your-weaverse-project-id

# Session secret
SESSION_SECRET=your-random-session-secret
```

### Getting API Tokens

**For paid stores**: Install Hydrogen app (https://apps.shopify.com/hydrogen) then run `npx shopify hydrogen env pull`

**For development stores**: Use Headless app (https://apps.shopify.com/headless) or create a custom app with Storefront API access

**Session Secret**: Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Verification

After installation:

1. **Start server**: `npm run dev`
2. **Check storefront**: Visit `http://localhost:3456`
3. **Access Studio**: Go to `https://studio.weaverse.io/projects/your-project-id`
4. **Test editing**: Make changes in Studio and verify they appear

## Common Issues

### CLI Command Fails
- Ensure Node.js 18+ installed: `node --version`
- Clear npm cache: `npm cache clean --force`

### Studio Preview Not Loading
- Verify dev server runs on port 3456
- Check browser console for errors
- Ensure no firewall blocks the port

### Environment Variables Not Working
- Ensure `.env` file is in project root
- Restart dev server after changes
- Check variable names are exact (case-sensitive)

## Component Development Basics

After installation, you can start building custom sections. Here's a simple example:

```typescript
// app/sections/Hero.tsx
import { forwardRef } from 'react';

export type HeroProps = {
  heading: string;
  description: string;
  className?: string;
};

export let schema = {
  title: 'Hero Section',
  type: 'hero',
  settings: [
    {
      group: 'Content',
      inputs: [
        { type: 'text', name: 'heading', label: 'Heading', defaultValue: 'Welcome' },
        { type: 'textarea', name: 'description', label: 'Description' }
      ]
    }
  ]
};

export let Hero = forwardRef<HTMLElement, HeroProps>((props, ref) => {
  let { heading, description, className = '' } = props;
  
  return (
    <section ref={ref} className={`py-12 px-4 max-w-7xl mx-auto ${className}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold">{heading}</h1>
        <p className="mt-6 text-lg text-gray-600">{description}</p>
      </div>
    </section>
  );
});
```

## Development Workflow

1. **Create component** in `app/sections/` or `app/components/`
2. **Define schema** with configurable properties
3. **Register in** `weaverse.config.ts`
4. **Test in Studio** at `https://studio.weaverse.io/projects/your-project-id`

## Next Steps

1. **[Core Concepts](/docs/core-concepts)** - Understand how Weaverse works
2. **[Development Guide](/docs/development-guide)** - Build custom sections
3. **[API Reference](/docs/api)** - Complete API documentation

Need help? Check our [FAQ](/docs/resources/faq) or [Community](/docs/community).