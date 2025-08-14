---
title: Project Structure
description: 'Essential guide to Weaverse Hydrogen theme structure'
publishedAt: August 14, 2025
updatedAt: August 14, 2025
order: 1
published: true
---

## Overview

The Weaverse Hydrogen theme follows a modern Shopify Hydrogen structure, optimized for performance and developer experience. Let's explore the key components of your theme.

## Core Structure

```text
🌳 my-theme
├── 📁 app/
│   ├── 📁 components/     # Reusable UI components
│   ├── 📁 graphql/       # GraphQL queries and fragments
│   ├── 📁 hooks/         # Custom React hooks
│   ├── 📁 routes/        # Application routes
│   ├── 📁 sections/      # Theme sections
│   ├── 📁 styles/        # Global styles and Tailwind
│   ├── 📁 types/         # TypeScript definitions
│   ├── 📁 utils/         # Helper functions
│   ├── 📁 weaverse/      # Weaverse configuration
│   ├── 📄 entry.client.tsx
│   ├── 📄 entry.server.tsx
│   └── 📄 root.tsx
├── 📁 public/            # Static assets
├── 📄 server.ts          # Server configuration
├── 📄 vite.config.ts     # Build configuration
├── 📄 tailwind.config.js # Tailwind settings
└── 📄 .env              # Environment variables
```

## Key Directories

### `/app/components`
Reusable UI components:
```tsx
// Example: app/components/Button.tsx
export function Button({ children, className = '', ...props }) {
  return (
    <button 
      className={`px-4 py-2 bg-primary text-white ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
```

### `/app/sections`
Theme sections for Weaverse Studio:
```tsx
// Example: app/sections/Hero.tsx
import { forwardRef } from 'react';

export type HeroProps = {
  heading: string;
  description: string;
  className?: string;
};

export let schema = {
  title: 'Hero',
  type: 'hero',
  settings: [
    {
      group: 'Content',
      inputs: [
        { type: 'text', name: 'heading', label: 'Heading' },
        { type: 'textarea', name: 'description', label: 'Description' }
      ]
    }
  ]
};

export let Hero = forwardRef<HTMLElement, HeroProps>((props, ref) => {
  let { heading, description, className = '' } = props;
  
  return (
    <section 
      ref={ref}
      className={`py-12 px-4 max-w-7xl mx-auto ${className}`}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {heading}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {description}
        </p>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
```

### `/app/weaverse`
Core Weaverse configuration files:
- `components.ts` - Component registry
- `schema.server.ts` - Theme schema
- `create-weaverse.server.ts` - Client setup

## Essential Files

### `server.ts`
Server configuration and Weaverse client integration:
```ts
import { WeaverseClient } from '@weaverse/hydrogen';
import { components } from '~/weaverse/components';
import { themeSchema } from '~/weaverse/schema.server';

export async function createAppLoadContext(request, env, executionContext) {
  // Initialize Hydrogen context
  let hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: getLocaleFromRequest(request),
    cart: { queryFragment: CART_QUERY_FRAGMENT },
  });

  // Initialize Weaverse client
  return {
    ...hydrogenContext,
    weaverse: new WeaverseClient({
      ...hydrogenContext,
      request,
      cache,
      themeSchema,
      components,
    }),
  };
}
```

### `entry.server.tsx`
Server-side rendering setup with React Router v7:
```tsx
import { ServerRouter } from "react-router";
import { createContentSecurityPolicy } from "@shopify/hydrogen";
import type { AppLoadContext, EntryContext } from "@shopify/remix-oxygen";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { getWeaverseCsp } from "~/weaverse/csp";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  context: AppLoadContext,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    ...getWeaverseCsp(request, context),
    shop: {
      checkoutDomain: context.env?.PUBLIC_CHECKOUT_DOMAIN || context.env?.PUBLIC_STORE_DOMAIN,
      storeDomain: context.env?.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter context={routerContext} url={request.url} nonce={nonce} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get("user-agent"))) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set("Content-Security-Policy-Report-Only", header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
```

### `.env`
Required environment variables:
```bash
# Core Configuration
SESSION_SECRET="foobar"

# Shopify Configuration
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your-token
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=your-client-id
SHOP_ID=your-shop-id
PUBLIC_CHECKOUT_DOMAIN=your-checkout-domain

# Optional Shopify Configuration
PUBLIC_STOREFRONT_ID=your-storefront-id
# PRIVATE_STOREFRONT_API_TOKEN=your-private-token

# Weaverse Configuration
WEAVERSE_PROJECT_ID=your-project-id
# WEAVERSE_API_KEY=your-api-key

# Additional Services (Optional)
# PUBLIC_GOOGLE_GTM_ID=your-gtm-id
# JUDGEME_PRIVATE_API_TOKEN=your-judgeme-token
# ALI_REVIEWS_API_KEY=your-ali-reviews-key

# Custom Metafields & Metaobjects
METAOBJECT_COLORS_TYPE=shopify--color-pattern
CUSTOM_COLLECTION_BANNER_METAFIELD=custom.collection_banner

# Shopify Inbox (Optional)
# PUBLIC_SHOPIFY_INBOX_SHOP_ID=your-inbox-shop-id
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Next Steps

- [Development Guide](/docs/development-guide) - Build custom components and sections
- [API Reference](/docs/api) - Learn about Weaverse APIs and utilities
- [Deployment](/docs/deployment) - Deploy your theme to production

Need help? Check our [Community](/docs/community) or [FAQ](/docs/resources/faq).

---
