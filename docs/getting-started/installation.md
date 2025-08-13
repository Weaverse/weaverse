---
title: Installation
description: Add Weaverse to a new or existing Shopify Hydrogen project.
order: 2
---

# Installation

Learn how to install Weaverse in your Shopify Hydrogen project. Choose the method that best fits your needs.

## New Project (Recommended)

For new projects, we recommend starting with the Pilot theme template:

### Using the Pilot Theme

```bash
git clone https://github.com/Weaverse/pilot.git my-project
cd my-project
npm install
```

### Using Weaverse CLI

```bash
npx @weaverse/cli create my-project
cd my-project
npm install
```

## Existing Hydrogen Project

To add Weaverse to an existing Hydrogen project:

### 1. Install Weaverse Packages

```bash
npm install @weaverse/hydrogen @weaverse/react @weaverse/core
```

### 2. Configure Weaverse

Create a `weaverse.config.ts` file in your project root:

```typescript
import type { WeaverseConfig } from '@weaverse/hydrogen'

export default {
  shopify: {
    shop: process.env.PUBLIC_STORE_DOMAIN,
    storefrontAccessToken: process.env.PUBLIC_STOREFRONT_API_TOKEN,
  },
  routes: {
    pages: '/pages',
    collections: '/collections',
    products: '/products',
  },
} satisfies WeaverseConfig
```

### 3. Update Your Root Component

Wrap your app with the Weaverse provider:

```typescript
// app/root.tsx
import { WeaverseProvider } from '@weaverse/hydrogen'
import weaverseConfig from '~/weaverse.config'

export default function App() {
  return (
    <WeaverseProvider config={weaverseConfig}>
      {/* Your existing app structure */}
    </WeaverseProvider>
  )
}
```

### 4. Create Your First Component

```typescript
// app/sections/hero.tsx
import type { HydrogenComponentSchema } from '@weaverse/hydrogen'

export function Hero({ 
  heading = 'Welcome to our store',
  description = 'Find amazing products here' 
}) {
  return (
    <section className="py-12 px-4">
      <h1 className="text-4xl font-bold">{heading}</h1>
      <p className="text-lg mt-4">{description}</p>
    </section>
  )
}

export const schema: HydrogenComponentSchema = {
  type: 'hero',
  title: 'Hero Section',
  inspector: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
        },
      ],
    },
  ],
}
```

### 5. Register Components

Create a components registry:

```typescript
// app/weaverse/components.ts
import { Hero } from '~/sections/hero'

export const components = {
  hero: Hero,
}

export const schemas = {
  hero: Hero.schema,
}
```

## Environment Variables

Add these environment variables to your `.env` file:

```bash
# Shopify Configuration
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_storefront_api_token

# Weaverse Configuration (optional)
WEAVERSE_PROJECT_ID=your_project_id
WEAVERSE_API_KEY=your_api_key
```

## Verify Installation

Start your development server:

```bash
npm run dev
```

Visit `http://localhost:3000/weaverse` to access the Weaverse Studio interface.

## Next Steps

- Read [Core Concepts](/docs/core-concepts) to understand how Weaverse works
- Follow the [Development Guide](/docs/development-guide) to create components
- Check out [Example Components](/docs/resources/examples) for inspiration

## Troubleshooting

Common installation issues and solutions can be found in our [Troubleshooting Guide](/docs/resources/troubleshooting).

Need help? Join our [Community Forum](/docs/community) or check the [FAQ](/docs/resources/faq).