---
title: Rendering Weaverse Pages
description: Complete guide to rendering different page types in Weaverse with loadPage() and WeaverseContent components.
publishedAt: August 15, 2025
updatedAt: August 15, 2025
order: 1
published: true
---

# Rendering Weaverse Pages

This guide covers everything you need to know about rendering different page types in Weaverse, from basic concepts to advanced implementation patterns.

## Table of Contents

- [Core Concepts](#core-concepts)
- [Supported Page Types](#supported-page-types)
- [Basic Implementation](#basic-implementation)
- [Page Type Examples](#page-type-examples)
- [Custom Pages](#custom-pages)
- [Error Handling](#error-handling)
- [Performance Best Practices](#performance-best-practices)
- [Troubleshooting](#troubleshooting)

## Core Concepts

Weaverse page rendering revolves around two key elements:

1. **`loadPage()` function**: Loads page data based on type and handle
2. **`WeaverseContent` component**: Renders the loaded page content

### The loadPage() Function

The `loadPage()` function is called in your route loaders to fetch page data:

```typescript
// In your route loader
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { weaverse } = context;
  
  const weaverseData = await weaverse.loadPage({
    type: "PRODUCT",     // Page type - determines content structure
    handle: handle,      // Page handle - identifies specific page
  });
  
  return { weaverseData };
}
```

### The WeaverseContent Component

The `WeaverseContent` component renders the loaded page data. It automatically gets the `weaverseData` from your loader through the `<WeaverseHydrogenRoot>` wrapper:

```tsx
import { WeaverseContent } from "~/weaverse";

export default function ProductPage() {
  // No need to pass weaverseData explicitly - WeaverseHydrogenRoot handles it
  return <WeaverseContent />;
}
```

**How it works**: The `<WeaverseHydrogenRoot>` component (typically in your root layout) automatically extracts `weaverseData` from the current route's loader data and provides it to all child `<WeaverseContent>` components through React context. This eliminates the need to manually pass the data prop.

## Supported Page Types

Weaverse supports the following page types:

#### E-commerce Pages
- **`PRODUCT`** - Individual product pages
- **`COLLECTION`** - Collection/category listing pages  

#### Content Pages
- **`PAGE`** - Custom pages created in Weaverse Studio
- **`BLOG`** - Blog listing pages
- **`ARTICLE`** - Individual blog post pages

#### Special Pages
- **`INDEX`** - Homepage  
- **`CUSTOM`** - Custom pages created in Weaverse Studio (no specific handle needed)

### Routes Without Weaverse Integration

Some routes in your Hydrogen theme may not use Weaverse's page system at all. These typically include functional pages that rely heavily on Shopify's built-in components and APIs:

- **Search pages** - Use Shopify's search API directly
- **Cart pages** - Use Shopify's cart components and forms  
- **Account pages** - Use Shopify's customer account API
- **Policy pages** - Often render Shopify's policy content directly

### Custom Page Approach

Weaverse provides two ways to create custom pages:

#### Option 1: PAGE Type with Handle
For specific custom pages with defined handles:

```typescript
// Example: About page with specific handle
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { weaverse } = context;
  
  const weaverseData = await weaverse.loadPage({
    type: "PAGE",
    handle: "about", // Specific page handle created in Studio
  });
  
  return data({ weaverseData });
}
```

#### Option 2: CUSTOM Type for Dynamic Routing  
For catch-all routing where URL determines the page content:

```typescript
// Example: Dynamic custom page routing
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { weaverse } = context;
  
  const weaverseData = await weaverse.loadPage({
    type: "CUSTOM", // No handle needed - URL determines content
  });
  
  return data({ weaverseData });
}
```

This approach allows you to create visually customizable pages using Weaverse's editor while maintaining functional pages that use Shopify's native components.

### Real-World Example: Pilot Template Pattern

The official Pilot template demonstrates this mixed approach. Here are examples from actual implementation:

```typescript
// Homepage with dynamic routing (from Pilot template)
// app/routes/($locale)._index.tsx
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { pathPrefix } = context.storefront.i18n;
  const locale = pathPrefix.slice(1);
  let type: PageType = "INDEX";

  if (params.locale && params.locale.toLowerCase() !== locale) {
    // Update for Weaverse: if it's not locale, it's probably a custom page handle
    type = "CUSTOM";
  }

  const [weaverseData, { shop }] = await Promise.all([
    context.weaverse.loadPage({ type }),
    context.storefront.query<ShopQuery>(SHOP_QUERY),
  ]);

  return { shop, weaverseData };
}
```

```typescript
// Catch-all route for custom pages (from Pilot template)
// app/routes/($locale).$.tsx
export async function loader({ context }: LoaderFunctionArgs) {
  const weaverseData = await context.weaverse.loadPage({
    type: "CUSTOM",
  });

  // Validate that the custom page exists
  validateWeaverseData(weaverseData);

  return { weaverseData };
}

export default function CustomPage() {
  return <WeaverseContent />;
}
```

This pattern shows how Pilot handles custom pages:
1. **Homepage route** (`_index.tsx`) detects when a URL parameter isn't a locale and switches to `"CUSTOM"` type
2. **Catch-all route** (`$.tsx`) handles any remaining unmatched routes as custom Weaverse pages
3. Both routes use `validateWeaverseData()` to ensure the page exists before rendering

```typescript
// Search page without Weaverse (from Pilot template) 
// app/routes/($locale).search.tsx
export default function Search() {
  const { searchTerm, products } = useLoaderData<typeof loader>();
  
  // No WeaverseContent component - uses native Shopify search functionality
  return (
    <Section width="fixed" verticalPadding="medium">
      <Form method="get">
        <input name="q" placeholder="Search our store..." />
      </Form>
      <Pagination connection={products}>
        {/* Native Shopify components */}
      </Pagination>
    </Section>
  );
}
```

```typescript
// Account page without Weaverse (from Pilot template)
// app/routes/($locale).account.tsx  
export default function Account() {
  const { customer } = useLoaderData<typeof loader>();
  
  // No WeaverseContent - uses Shopify's customer account components
  return (
    <Section>
      <AccountDetails customer={customer} />
      <AccountOrderHistory orders={orders} />
      <AccountAddressBook addresses={addresses} />
    </Section>
  );
}
```

## Basic Implementation

Here's the standard pattern for implementing Weaverse page rendering in a React Router v7 route:

### 1. Route Loader

```typescript
// app/routes/products.$productHandle.tsx
import type { LoaderFunctionArgs } from "react-router";
import { data } from "@shopify/remix-oxygen";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { productHandle } = params;
  const { storefront, weaverse } = context;
  
  // Load both Shopify data and Weaverse page data in parallel
  const [productData, weaverseData] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle: productHandle }
    }),
    weaverse.loadPage({
      type: "PRODUCT",
      handle: productHandle,
    }),
  ]);
  
  if (!productData.product) {
    throw new Response("Product not found", { status: 404 });
  }
  
  return data({
    product: productData.product,
    weaverseData,
  });
}
```

### 2. Route Component

```tsx
import { useLoaderData } from "react-router";
import { WeaverseContent } from "~/weaverse";

export default function ProductPage() {
  // WeaverseHydrogenRoot automatically provides weaverseData to WeaverseContent
  return <WeaverseContent />;
}
```

## Page Type Examples

### Product Page

```typescript
// app/routes/products.$productHandle.tsx
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { productHandle } = params;
  const { storefront, weaverse } = context;
  
  const [{ product }, weaverseData] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle: productHandle }
    }),
    weaverse.loadPage({
      type: "PRODUCT",
      handle: productHandle,
    }),
  ]);
  
  return data({ product, weaverseData });
}
```

### Collection Page

```typescript
// app/routes/collections.$collectionHandle.tsx
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { collectionHandle } = params;
  const { storefront, weaverse } = context;
  
  const [{ collection }, weaverseData] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: { handle: collectionHandle }
    }),
    weaverse.loadPage({
      type: "COLLECTION",
      handle: collectionHandle,
    }),
  ]);
  
  return data({ collection, weaverseData });
}
```

### Custom Page

```typescript
// app/routes/pages.$pageHandle.tsx
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { pageHandle } = params;
  const { storefront, weaverse } = context;
  
  const [{ page }, weaverseData] = await Promise.all([
    storefront.query(PAGE_QUERY, {
      variables: { handle: pageHandle }
    }),
    weaverse.loadPage({
      type: "PAGE",
      handle: pageHandle,
    }),
  ]);
  
  return data({ page, weaverseData });
}
```

### Blog Page

```typescript
// app/routes/blogs.$blogHandle._index.tsx
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { blogHandle } = params;
  const { storefront, weaverse } = context;
  
  const [{ blog }, weaverseData] = await Promise.all([
    storefront.query(BLOG_QUERY, {
      variables: { handle: blogHandle }
    }),
    weaverse.loadPage({
      type: "BLOG",
      handle: blogHandle,
    }),
  ]);
  
  return data({ blog, weaverseData });
}
```

### Homepage

```typescript
// app/routes/($locale)._index.tsx
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront, weaverse } = context;
  const { pathPrefix } = context.storefront.i18n;
  const locale = pathPrefix.slice(1);
  
  let type: PageType = "INDEX";
  
  // Handle locale-based routing and custom pages
  if (params.locale && params.locale.toLowerCase() !== locale) {
    // If it's not a locale, it's probably a custom page handle
    type = "CUSTOM";
  }
  
  const [{ shop }, weaverseData] = await Promise.all([
    storefront.query(SHOP_QUERY),
    weaverse.loadPage({ type }),
  ]);
  
  return data({ shop, weaverseData });
}
```

## Custom Pages

Custom pages are created in Weaverse Studio and can be rendered using the `PAGE` type:

### Creating Custom Routes

For user-friendly URLs, create custom routes that map to Weaverse pages:

```typescript
// app/routes/($locale).about.tsx - Maps /about to a Weaverse page
export async function loader({ context }: LoaderFunctionArgs) {
  const { weaverse } = context;
  
  const weaverseData = await weaverse.loadPage({
    type: "PAGE",
    handle: "about", // This should match the page handle in Weaverse Studio
  });
  
  return data({ weaverseData });
}

export default function AboutPage() {
  return <WeaverseContent />;
}
```

### Dynamic Custom Pages

Create a catch-all route for dynamic custom pages:

```typescript
// app/routes/($locale).pages.$pageHandle.tsx
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { pageHandle } = params;
  const { storefront, weaverse } = context;
  
  // Load both Shopify page data and Weaverse page data in parallel
  const [{ page }, weaverseData] = await Promise.all([
    storefront.query(PAGE_QUERY, {
      variables: { handle: pageHandle }
    }),
    weaverse.loadPage({
      type: "PAGE",
      handle: pageHandle,
    }),
  ]);
  
  // Handle page not found (neither Shopify nor Weaverse page exists)
  if (!page && !weaverseData) {
    throw new Response("Page not found", { status: 404 });
  }
  
  return data({ page, weaverseData });
}
```

## Error Handling

### 404 Error Handling

Always check if the page data exists and handle 404 cases:

```typescript
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { weaverse } = context;
  
  const weaverseData = await weaverse.loadPage({
    type: "PRODUCT",
    handle,
  });
  
  // Check if Weaverse page exists
  if (!weaverseData) {
    throw new Response("Page not found", { status: 404 });
  }
  
  return data({ weaverseData });
}
```

### Fallback Rendering

Provide fallback content when Weaverse data is unavailable:

```tsx
export default function ProductPage() {
  const { product, weaverseData } = useLoaderData<typeof loader>();
  
  return (
    <div>
      {weaverseData ? (
        <WeaverseContent />
      ) : (
        <div>
          {/* Fallback content when Weaverse page doesn't exist */}
          <h1>{product.title}</h1>
          <p>{product.description}</p>
        </div>
      )}
    </div>
  );
}
```

### Error Boundaries

Use error boundaries for graceful error handling:

```tsx
import { ErrorBoundary } from "~/components/ErrorBoundary";

export default function ProductPage() {
  return (
    <ErrorBoundary>
      <WeaverseContent />
    </ErrorBoundary>
  );
}
```

## Performance Best Practices

### Parallel Data Loading

Always load Weaverse data in parallel with other API calls:

```typescript
// ✅ Good: Parallel loading
const [shopifyData, weaverseData, reviewsData] = await Promise.all([
  storefront.query(PRODUCT_QUERY, { variables }),
  weaverse.loadPage({ type: "PRODUCT", handle }),
  getProductReviews(handle),
]);

// ❌ Bad: Sequential loading
const shopifyData = await storefront.query(PRODUCT_QUERY, { variables });
const weaverseData = await weaverse.loadPage({ type: "PRODUCT", handle });
const reviewsData = await getProductReviews(handle);
```

### Caching

Use proper cache headers for Weaverse pages:

```typescript
import { routeHeaders } from "~/utils/cache";

export const headers = routeHeaders;

export async function loader({ context }: LoaderFunctionArgs) {
  // Your loader implementation
}
```

### Preloading

Consider preloading critical page data:

```typescript
// Preload homepage data
export function preload({ context }: LoaderFunctionArgs) {
  return context.weaverse.loadPage({ type: "INDEX" });
}
```

## Troubleshooting

### Common Issues

#### 1. Page Type Mismatch

**Problem**: Wrong page type specified in `loadPage()`
```typescript
// ❌ Wrong: Using PRODUCT type for a collection page
weaverse.loadPage({ type: "PRODUCT", handle: collectionHandle })
```

**Solution**: Use the correct supported page type
```typescript
// ✅ Correct: Using COLLECTION type for a collection page
weaverse.loadPage({ type: "COLLECTION", handle: collectionHandle })
```

**Problem**: Using unsupported page types
```typescript
// ❌ Wrong: These page types are not supported
weaverse.loadPage({ type: "SEARCH", handle: "search" })
weaverse.loadPage({ type: "CART", handle: "cart" })
weaverse.loadPage({ type: "ACCOUNT", handle: "account" })
```

**Solution**: Many functional pages don't need Weaverse integration - use native Shopify components instead
```typescript
// ✅ Correct: Search, cart, and account pages often don't use Weaverse at all
// These routes use Shopify's native components directly:

// Search page - uses Shopify's search API and components
export default function SearchPage() {
  // Uses native Shopify search components, no WeaverseContent needed
}

// Cart page - uses Shopify's cart components and forms  
export default function CartPage() {
  // Uses native Shopify cart components, no WeaverseContent needed
}

// Account page - uses Shopify's customer account components
export default function AccountPage() {
  // Uses native Shopify account components, no WeaverseContent needed
}
```

**Alternative**: If you want to customize these pages visually, create custom Weaverse pages
```typescript
// ✅ Alternative: Use PAGE type with custom page created in Studio (optional)
weaverse.loadPage({ type: "PAGE", handle: "custom-search-page" })
weaverse.loadPage({ type: "PAGE", handle: "custom-cart-page" })
weaverse.loadPage({ type: "PAGE", handle: "custom-account-page" })
```

#### 2. Missing Handle Parameter

**Problem**: Handle not provided or undefined
```typescript
// ❌ Wrong: Handle is undefined
weaverse.loadPage({ type: "PRODUCT", handle: undefined })
```

**Solution**: Always validate handle exists
```typescript
// ✅ Correct: Validate handle before using
invariant(handle, "Missing product handle");
weaverse.loadPage({ type: "PRODUCT", handle })
```

#### 3. Component Not Rendering

**Problem**: Weaverse components not registered properly

**Solution**: Ensure components are registered in `~/weaverse/components.ts` (or `~/app/weaverse/components.ts` in Pilot template):
```typescript
import type { HydrogenComponent } from "@weaverse/hydrogen";
import * as ProductInfo from "~/sections/product-info";
import * as Hero from "~/sections/hero";

export const components: HydrogenComponent[] = [
  ProductInfo,
  Hero,
  // Add all your components here
];
```

**Important**: Always use namespace imports (`* as ComponentName`) and restart your dev server after registration.

#### 4. TypeScript Errors

**Problem**: Type errors with `WeaverseContent`

**Solution**: Ensure proper type imports:
```typescript
import type { WeaverseLoaderData } from "@weaverse/hydrogen";

export async function loader({ context }: LoaderFunctionArgs) {
  const weaverseData: WeaverseLoaderData = await context.weaverse.loadPage({
    type: "PRODUCT",
    handle,
  });
  
  return data({ weaverseData });
}
```

### Debug Mode

Enable debug mode to troubleshoot page loading issues:

```typescript
// In your weaverse.config.ts
export default defineConfig({
  debug: process.env.NODE_ENV === "development",
  // ... other config
});
```

## Next Steps

- Learn about [Custom Component Development](/docs/development-guide/weaverse-component)
- Explore [Data Fetching Patterns](/docs/development-guide/data-fetching)
- Master [Component Schemas](/docs/development-guide/component-schema)
- Review [API Reference](/docs/api)

For more advanced use cases, see the [Migration Guide](/docs/migration-advanced) and [Custom Routing](/docs/migration-advanced/custom-routing) documentation.