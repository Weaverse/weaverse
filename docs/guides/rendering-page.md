---
title: Rendering a Weaverse Page
description: Learn how to load and render Weaverse pages using optional parameters and the WeaverseContent component.
publishedAt: November 10, 2023
updatedAt: April 21, 2025
order: 6
published: true
---

# Rendering Weaverse Pages

This guide covers the complete process of rendering Weaverse pages in your Hydrogen storefront, from data fetching to component rendering, including best practices and advanced patterns.

## Table of Contents
- [Rendering Weaverse Pages](#rendering-weaverse-pages)
  - [Table of Contents](#table-of-contents)
  - [Fetching Page Data](#fetching-page-data)
    - [Basic Implementation](#basic-implementation)
    - [LoadPage Parameters](#loadpage-parameters)
      - [Parameter Details](#parameter-details)
  - [Page Types and Routing](#page-types-and-routing)
    - [Supported Page Types](#supported-page-types)
    - [Custom Routing](#custom-routing)
      - [Examples:](#examples)
  - [Component Rendering](#component-rendering)
    - [Basic Usage](#basic-usage)
    - [Component Structure](#component-structure)
  - [Advanced Patterns](#advanced-patterns)
    - [Parallel Data Loading](#parallel-data-loading)
    - [Dynamic Page Types](#dynamic-page-types)
    - [Error Handling](#error-handling)
  - [Best Practices](#best-practices)
    - [Explicit Parameter Definition](#explicit-parameter-definition)
    - [Locale Handling](#locale-handling)
    - [Complete Implementation Example](#complete-implementation-example)
  - [Common Pitfalls](#common-pitfalls)
  - [Next Steps](#next-steps)

## Fetching Page Data

Weaverse pages are rendered server-side using Remix's loader pattern. The core of this process is the `weaverse.loadPage()` method, which fetches page data and configuration.

### Basic Implementation

```tsx
// <root>/app/routes/($locale)._index.tsx
import { json } from '@shopify/remix-oxygen'
import { type RouteLoaderArgs } from '@weaverse/hydrogen'

export async function loader({ context }: RouteLoaderArgs) {
  let { weaverse } = context

  return json({
    // Required key for Weaverse pages
    weaverseData: await weaverse.loadPage(),
    // Additional page data...
  })
}
```

### LoadPage Parameters

The `loadPage()` function accepts an optional configuration object:

```tsx
interface LoadPageParams {
  type?: PageType;            // Page type
  handle?: string;            // Page handle
  locale?: string;            // Page locale (optional)
  strategy?: AllCacheOptions;  // Caching strategy (rarely needed to change)
}
```

#### Parameter Details

- **`type`**: Defines the page type
  - Required for custom routes
  - Auto-detected for standard routes
  - Examples: `'INDEX'`, `'PRODUCT'`, `'COLLECTION'`, etc.

- **`handle`**: Identifies the specific page
  - Default: `/` (root)
  - Format: URL-friendly string (e.g., product handle, collection handle)

- **`locale`**: Sets the page's locale (optional)
  - Default: Auto-detected from Hydrogen's i18n context
  - Format: `language-country` (e.g., `en-us`, `fr-ca`, `de-de`)

- **`strategy`**: Controls caching behavior
  - Default: `CacheShort()`
  - **Note**: Generally recommended to keep the default caching strategy

## Page Types and Routing

Weaverse supports various page types, each with specific routing patterns and data requirements.

### Supported Page Types

| Type | Description | Traditional URL | Remix Route Pattern |
|------|-------------|-------------|---------------|
| `INDEX` | Home page | `/` | `_index.tsx` |
| `PRODUCT` | Product details | `/products/:handle` | `products.$productHandle.tsx` |
| `ALL_PRODUCTS` | Products listing | `/products` | `products._index.tsx` |
| `COLLECTION` | Collection details | `/collections/:handle` | `collections.$collectionHandle.tsx` |
| `COLLECTION_LIST` | Collections listing | `/collections` | `collections._index.tsx` |
| `PAGE` | Regular page | `/pages/:handle` | `pages.$pageHandle.tsx` |
| `BLOG` | Blog listing | `/blogs/:handle` | `blogs.$blogHandle._index.tsx` |
| `ARTICLE` | Blog article | `/blogs/:blogHandle/:articleHandle` | `blogs.$blogHandle.$articleHandle.tsx` |
| `CUSTOM` | Custom page | Any custom route | Custom route pattern |

### Custom Routing

Weaverse provides exceptional flexibility in URL structures, completely breaking free from Shopify's traditional route patterns. You aren't restricted to default paths like `/products/handle` or `/collections/handle`. 

This freedom allows you to:

1. **Create language-specific routes**: Use `/produit/:handle` for French or `/produkt/:handle` for German
2. **Implement marketing-friendly URLs**: Use `/sale/:handle` or `/new-arrivals/:handle`
3. **Design category-driven navigation**: Use `/electronics/smartphones/:handle`
4. **Support multi-regional sites**: Use `/us/products/:handle` vs `/eu/products/:handle`

The key is explicitly defining the `type` parameter in your `loadPage()` call, which tells Weaverse how to interpret and render the page regardless of its URL.

#### Examples:

**Language-specific product routes:**

```tsx
// <root>/app/routes/($locale).produit.$productHandle.tsx (French)
export async function loader({ params, context }: RouteLoaderArgs) {
  let { productHandle } = params
  
  return json({
    weaverseData: await context.weaverse.loadPage({ 
      type: 'PRODUCT',  // This tells Weaverse it's a product page
      handle: productHandle
    }),
    // Additional data...
  })
}
```

**Marketing-focused collection routes:**

```tsx
// <root>/app/routes/($locale).new-arrivals.$collectionHandle.tsx
export async function loader({ params, context }: RouteLoaderArgs) {
  let { collectionHandle } = params
  
  return json({
    weaverseData: await context.weaverse.loadPage({ 
      type: 'COLLECTION',  // This tells Weaverse it's a collection page
      handle: collectionHandle
    }),
    // Additional data...
  })
}
```

This approach gives you complete control over your URL structure while maintaining all the benefits of Weaverse's page rendering system. It's particularly valuable for multi-language stores, marketing campaigns, and creating intuitive navigation paths for your customers.

## Component Rendering

The `WeaverseContent` component handles the actual rendering of Weaverse pages.

### Basic Usage

```tsx
// <root>/app/routes/($locale)._index.tsx
import { WeaverseContent } from '~/weaverse'

export default function Homepage() {
  return <WeaverseContent />
}
```

### Component Structure

The `WeaverseContent` component is a wrapper around `WeaverseHydrogenRoot`:

```tsx
// <root>/app/weaverse/index.tsx
import { WeaverseHydrogenRoot } from '@weaverse/hydrogen'
import { GenericError } from '~/components/GenericError'
import { components } from './components'

export function WeaverseContent() {
  return (
    <WeaverseHydrogenRoot
      components={components}
      errorComponent={GenericError}
    />
  )
}
```

## Advanced Patterns

### Parallel Data Loading

For optimal performance, load Weaverse data and other API data in parallel:

```tsx
export async function loader(args: RouteLoaderArgs) {
  let { context, params } = args
  let { storefront, weaverse } = context
  
  // Load both Weaverse and Shopify data in parallel
  let [weaverseData, shopifyData] = await Promise.all([
    weaverse.loadPage({ 
      type: 'PRODUCT', 
      handle: params.productHandle 
    }),
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: params.productHandle,
        language: storefront.i18n.language,
        country: storefront.i18n.country
      }
    })
  ])

  return json({
    weaverseData,
    product: shopifyData.product,
    // Additional data...
  })
}
```

### Dynamic Page Types

Determine page type dynamically based on URL or other criteria:

```tsx
export async function loader(args: RouteLoaderArgs) {
  let { context, request } = args
  let url = new URL(request.url)
  
  // Determine page type based on URL or other criteria
  let pageType = determinePageType(url)
  
  return json({
    weaverseData: await context.weaverse.loadPage({ 
      type: pageType 
    }),
    // Additional data...
  })
}
```

### Error Handling

Implement proper error handling for various scenarios:

```tsx
export async function loader(args: RouteLoaderArgs) {
  try {
    let { context, params } = args
    let weaverseData = await context.weaverse.loadPage({
      type: 'PRODUCT',
      handle: params.productHandle
    })
    
    // Check if page exists in Weaverse
    if (!weaverseData?.page?.id || weaverseData.page.id.includes("fallback")) {
      throw new Response(null, { status: 404 })
    }

    return json({
      weaverseData,
      // Additional data...
    })
  } catch (error) {
    console.error('Error loading Weaverse page:', error)
    throw new Response('Page not found', { status: 404 })
  }
}
```

## Best Practices

### Explicit Parameter Definition

While Weaverse can auto-detect page types and handles, it's strongly recommended to explicitly define the essential parameters in your `loadPage()` calls:

```tsx
// Recommended approach - explicitly define core parameters
weaverseData: await weaverse.loadPage({
  type: 'PRODUCT',
  handle: params.productHandle
  // locale is auto-detected and rarely needs to be specified
  // strategy is best left at its default value
})
```

This approach offers several advantages:

1. **Predictability**: Explicit parameters ensure consistent behavior across environments
2. **Maintainability**: Makes code more self-documenting for future developers
3. **Debugging**: Easier to troubleshoot issues when parameters are clearly defined
4. **Performance**: Uses Weaverse's optimized default caching strategy
5. **Flexibility**: Enables custom routing while maintaining clear intent

### Locale Handling

The `locale` parameter follows the format of language-country code pairs such as:

- `en-us` (English - United States)
- `fr-ca` (French - Canada)
- `de-de` (German - Germany)
- `vi-vn` (Vietnamese - Vietnam)
- `ja-jp` (Japanese - Japan)

In most cases, Weaverse automatically detects the locale from Hydrogen's i18n context, so you don't need to specify it explicitly.

### Complete Implementation Example

Here's a comprehensive example of a product page route implementation:

```tsx
// <root>/app/routes/($locale).products.$productHandle.tsx
export async function loader({ params, context }: RouteLoaderArgs) {
  let { storefront, weaverse } = context
  let { productHandle } = params
  
  try {
    // Perform data loading in parallel for better performance
    let [weaverseData, productData] = await Promise.all([
      weaverse.loadPage({
        type: 'PRODUCT',
        handle: productHandle
      }),
      storefront.query(PRODUCT_QUERY, {
        variables: {
          handle: productHandle,
          language: storefront.i18n.language,
          country: storefront.i18n.country
        }
      })
    ])

    // Handle product not found
    if (!productData.product) {
      throw new Response(null, { status: 404 })
    }

    return json({
      weaverseData,
      product: productData.product,
      // Additional data...
    })
  } catch (error) {
    console.error('Error loading product page:', error)
    throw new Response('Product not found', { status: 404 })
  }
}

export default function Product() {
  return <WeaverseContent />
}
```

## Common Pitfalls

1. **Missing weaverseData**
   - Always include `weaverseData` in the loader response
   - Use the exact key name `weaverseData` for Weaverse to work correctly

2. **Incorrect Page Types**
   - Use the correct page type for each route
   - For custom routes, always explicitly set the `type` parameter

3. **Data Synchronization**
   - Ensure data consistency between Weaverse and Shopify
   - Use parallel loading with `Promise.all` for optimal performance

4. **Error Handling**
   - Implement proper error handling for both Weaverse and Shopify data
   - Check for fallback pages to detect when a page doesn't exist in Weaverse

## Next Steps

- Learn about [Data Fetching and Caching](/docs/guides/fetching-and-caching)
- Explore [Component Development](/docs/guides/component-development)
- Review [Performance Optimization](/docs/guides/performance-optimization)
