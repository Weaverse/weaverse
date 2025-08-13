---
title: Getting Started with Hydrogen
description: Complete guide to setting up Weaverse with Shopify Hydrogen, from installation to your first component.
order: 2
---

# Getting Started with Weaverse Hydrogen

This comprehensive guide walks you through setting up Weaverse with Shopify Hydrogen, whether you're starting fresh or adding Weaverse to an existing project.

## What is Weaverse Hydrogen?

Weaverse Hydrogen combines the power of Shopify Hydrogen (React Router v7) with visual page building and theme customization capabilities. It provides:

- **Visual Studio**: Drag-and-drop page builder
- **Component Library**: Pre-built sections and components
- **Developer APIs**: Full control over components and data
- **Performance First**: Zero runtime overhead
- **Type Safety**: Full TypeScript support

## Quick Start Options

### Option 1: Use the Pilot Theme (Recommended)

Start with our complete starter theme:

```bash
# Clone the Pilot theme
git clone https://github.com/Weaverse/pilot.git my-store
cd my-store

# Install dependencies
npm install

# Configure environment (see our Quickstart guide)
cp .env.example .env
# Edit .env with your Shopify store details

# Start development
npm run dev
```

### Option 2: Add to Existing Hydrogen Project

If you have an existing Hydrogen project, follow our [Integration Guide](/docs/hydrogen/integrating-existing-project).

## Key Concepts

### 1. Weaverse Components

Components are the building blocks of your storefront. Each component:

- Has a schema defining its configurable properties
- Can fetch data using Remix-style loaders
- Works in both Studio and production
- Is fully type-safe

Example component structure:
```typescript
// Component implementation
export function MyComponent(props: MyComponentProps) {
  return <div>{props.heading}</div>
}

// Schema definition
export let schema = createSchema({
  type: "my-component",
  title: "My Component", 
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Welcome"
        }
      ]
    }
  ]
});
```

### 2. Weaverse Pages

Pages are built using sections, which are components designed for page-level layout. Common page types:

- **Homepage**: Hero, featured products, testimonials
- **Collection**: Product grid, filtering, pagination  
- **Product**: Product details, recommendations, reviews
- **Article**: Blog content, related articles
- **Custom**: Landing pages, promotional pages

### 3. Theme Settings

Global settings that affect your entire storefront:

- Colors and typography
- Layout preferences
- Logo and branding
- Social media links
- SEO settings

## Development Workflow

### 1. Local Development

```bash
# Start the development server
npm run dev

# Open your storefront
# http://localhost:3000

# Open Weaverse Studio  
# http://localhost:3000/weaverse
```

### 2. Component Development

1. Create component in `app/sections/` or `app/components/`
2. Define schema with `createSchema()`
3. Register in `weaverse.config.ts`
4. Test in Studio and preview

### 3. Data Fetching

Use Remix-style loaders for component-level data fetching:

```typescript
// Component with data fetching
export let loader = async ({request, context}) => {
  let products = await context.storefront.query(PRODUCTS_QUERY)
  return {products}
}

export function ProductGrid({products}: {products: any[]}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

## Architecture Overview

```
my-hydrogen-store/
├── app/
│   ├── components/          # Reusable UI components
│   ├── sections/            # Weaverse page sections  
│   ├── routes/              # React Router pages
│   ├── lib/                 # Utilities and helpers
│   └── weaverse/            # Weaverse configuration
├── public/                  # Static assets
├── weaverse.config.ts       # Theme configuration
└── package.json
```

## Next Steps

1. **Explore Components**: Check out the [Pilot theme sections](/docs/themes-templates/pilot-theme-sections)
2. **Build Custom Components**: Follow our [Component Development Guide](/docs/development-guide/weaverse-component)
3. **Configure Data**: Learn about [Data Fetching](/docs/development-guide/data-fetching)
4. **Deploy**: Use our [Deployment Guide](/docs/deployment) for production

## Need Help?

- 📚 [Complete Tutorial](/docs/resources/tutorials/tutorial) - Step-by-step walkthrough
- ❓ [FAQ](/docs/resources/faq) - Common questions
- 💬 [Community](/docs/community) - Connect with other developers
- 🔧 [Troubleshooting](/docs/resources/troubleshooting) - Solve common issues

Ready to build? Let's start with our [5-minute quickstart](/docs/getting-started/quickstart)!