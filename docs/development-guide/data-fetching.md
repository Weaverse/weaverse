---
title: Section Data Fetching
description: Learn how to fetch and manage data efficiently in Weaverse section components using loaders.
publishedAt: November 10, 2023
updatedAt: April 21, 2025
order: 7
published: true
---

# Section Data Fetching

## Table of Contents
- [Section Data Fetching](#section-data-fetching)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Core Concepts](#core-concepts)
    - [The Component Loader Pattern](#the-component-loader-pattern)
    - [Type Safety with TypeScript](#type-safety-with-typescript)
  - [Data Sources](#data-sources)
    - [Shopify Storefront API](#shopify-storefront-api)
    - [External APIs](#external-apis)
    - [Component Data and Settings](#component-data-and-settings)
  - [Implementation Patterns](#implementation-patterns)
    - [Basic Data Fetching](#basic-data-fetching)
    - [Conditional Fetching](#conditional-fetching)
    - [Parallel Data Fetching](#parallel-data-fetching)
    - [Error Handling](#error-handling)
    - [Dependent Queries](#dependent-queries)
  - [Data Revalidation](#data-revalidation)
    - [Understanding shouldRevalidate](#understanding-shouldrevalidate)
    - [Auto-Revalidating Inputs](#auto-revalidating-inputs)
    - [Custom Revalidation Rules](#custom-revalidation-rules)
  - [Caching Strategies](#caching-strategies)
    - [Available Caching Options](#available-caching-options)
    - [Custom Caching](#custom-caching)
    - [Caching Best Practices](#caching-best-practices)
  - [Real-World Examples](#real-world-examples)
    - [E-commerce Examples](#e-commerce-examples)
    - [Content Integration](#content-integration)
    - [Third-Party Services](#third-party-services)
  - [Performance Optimization](#performance-optimization)
  - [Troubleshooting](#troubleshooting)
  - [Related Documents](#related-documents)

## Introduction

Weaverse's section components can fetch their own data, which provides several key advantages:

- **Modularity**: Each component manages its own data dependencies
- **Performance**: Only fetch what's needed when it's needed
- **Maintainability**: Data fetching logic lives with the component that uses it
- **Reusability**: Components can be used in multiple contexts with different data

This guide covers everything you need to know about fetching data in Weaverse section components.

## Core Concepts

### The Component Loader Pattern

Weaverse section components use the loader pattern for server-side data fetching:

```tsx
// app/sections/featured-collection/index.tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen'

// Define the expected input data type
type FeaturedCollectionData = {
  collection: { handle: string }
}

// Component implementation...

// Define the loader function to fetch data
export let loader = async (args: ComponentLoaderArgs<FeaturedCollectionData>) => {
  const { weaverse, data } = args
  const { storefront } = weaverse
  
  // Access component settings through the data parameter
  const { collection } = data
  
  // Fetch and return the data
  return await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: collection.handle
    }
  })
}
```

The loader function:
1. Receives arguments via `ComponentLoaderArgs`
2. Accesses the Weaverse client and component data
3. Fetches necessary data from APIs
4. Returns data that will be automatically passed to the component as `props.loaderData`

### Type Safety with TypeScript

Using TypeScript with your component loaders provides several benefits:

```tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen'
import type { CollectionQuery } from 'storefrontapi.generated'

// Define input data shape
type FeaturedCollectionData = {
  collection: { handle: string }
  productsToShow: number
}

// Define what the loader returns (will be available as props.loaderData)
type LoaderReturnType = {
  collection: CollectionQuery['collection']
}

export let loader = async (
  args: ComponentLoaderArgs<FeaturedCollectionData>
): Promise<LoaderReturnType | null> => {
  // Implementation...
}
```

By specifying the input and output types, you get:
- Auto-completion in your IDE
- Type checking during development
- Better documentation for component usage
- Clearer contract between components and their data

## Data Sources

### Shopify Storefront API

The most common data source for Weaverse components is Shopify's Storefront API:

```tsx
export let loader = async ({ weaverse, data }: ComponentLoaderArgs<ProductData>) => {
  const { storefront } = weaverse
  const { product } = data
  
  if (!product?.handle) return null
  
  return await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: product.handle,
      language: storefront.i18n.language,
      country: storefront.i18n.country
    }
  })
}

// GraphQL query defined elsewhere
const PRODUCT_QUERY = `#graphql
  query Product($handle: String!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      id
      title
      description
      # Other fields...
    }
  }
` as const
```

### External APIs

Weaverse components can also fetch data from any external API using the `fetchWithCache` utility:

```tsx
export let loader = async ({ weaverse, data }: ComponentLoaderArgs<WeatherWidgetData>) => {
  const { fetchWithCache, env } = weaverse
  const { location = 'New York' } = data
  
  try {
    return await fetchWithCache(`https://api.weather.example/forecast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': env.WEATHER_API_KEY
      },
      body: JSON.stringify({ location }),
      // Use built-in caching
      strategy: weaverse.storefront.CacheShort()
    })
  } catch (error) {
    console.error('Weather API error:', error)
    return { error: true, forecast: [] }
  }
}
```

The `fetchWithCache` function:
- Works like the standard `fetch` API
- Adds Hydrogen's caching capabilities
- Makes external API calls more efficient
- Provides a consistent interface for all data fetching

### Component Data and Settings

The `data` argument in `ComponentLoaderArgs` contains all the component's settings configured by merchants in the Weaverse editor:

```tsx
type MapComponentData = {
  latitude: number
  longitude: number
  zoom: number
  showTraffic: boolean
  mapStyle: 'standard' | 'satellite' | 'terrain'
}

export let loader = async ({ weaverse, data }: ComponentLoaderArgs<MapComponentData>) => {
  const { fetchWithCache, env } = weaverse
  const { latitude, longitude, zoom, showTraffic, mapStyle } = data
  
  // Use component settings to customize the API request
  return await fetchWithCache(
    `https://api.maps.example/staticmap?lat=${latitude}&lng=${longitude}&zoom=${zoom}&traffic=${showTraffic}&style=${mapStyle}&key=${env.MAPS_API_KEY}`
  )
}
```

## Implementation Patterns

### Basic Data Fetching

The simplest pattern is direct data fetching based on component settings:

```tsx
export let loader = async ({ weaverse, data }: ComponentLoaderArgs<ProductData>) => {
  const { storefront } = weaverse
  const { productHandle } = data
  
  return await storefront.query(PRODUCT_QUERY, {
    variables: { handle: productHandle }
  })
}
```

### Conditional Fetching

Often you'll need to conditionally fetch data based on component settings:

```tsx
export let loader = async ({ weaverse, data }: ComponentLoaderArgs<TestimonialData>) => {
  const { storefront, fetchWithCache, env } = weaverse
  const { source, productHandle, collectionHandle } = data
  
  // Choose data source based on component settings
  switch (source) {
    case 'product-reviews':
      return await fetchWithCache(`https://api.reviews.example/product/${productHandle}`, {
        headers: { 'API-Key': env.REVIEWS_API_KEY }
      })
    
    case 'collection-reviews':
      return await fetchWithCache(`https://api.reviews.example/collection/${collectionHandle}`, {
        headers: { 'API-Key': env.REVIEWS_API_KEY }
      })
    
    case 'store-testimonials':
      return await storefront.query(TESTIMONIALS_QUERY)
      
    default:
      return { testimonials: [] }
  }
}
```

### Parallel Data Fetching

For optimal performance, fetch multiple data sources in parallel:

```tsx
export let loader = async ({ weaverse, data }: ComponentLoaderArgs<ProductDetailData>) => {
  const { storefront, fetchWithCache, env } = weaverse
  const { productHandle } = data
  
  // Fetch from multiple sources simultaneously
  const [productData, reviewsData, inventoryData] = await Promise.all([
    // Product data from Shopify
    storefront.query(PRODUCT_QUERY, {
      variables: { handle: productHandle }
    }),
    
    // Reviews from third-party API
    fetchWithCache(`https://api.reviews.example/products/${productHandle}`, {
      headers: { 'Authorization': `Bearer ${env.REVIEWS_API_KEY}` }
    }),
    
    // Inventory data from ERP system
    fetchWithCache(`https://api.inventory.example/stock-levels`, {
      method: 'POST',
      headers: { 'API-Key': env.INVENTORY_API_KEY },
      body: JSON.stringify({ sku: productHandle })
    })
  ])
  
  // Combine the results
  return {
    product: productData.product,
    reviews: reviewsData.reviews || [],
    inventory: inventoryData.stockLevels || {}
  }
}
```

### Error Handling

Robust error handling ensures your components degrade gracefully when APIs fail:

```tsx
export let loader = async ({ weaverse, data }: ComponentLoaderArgs<NewsData>) => {
  const { fetchWithCache } = weaverse
  const { source, category, count = 3 } = data
  
  try {
    const response = await fetchWithCache(
      `https://api.news.example/${source}?category=${category}&count=${count}`
    )
    
    // Validate the response
    if (!response || !Array.isArray(response.articles)) {
      console.warn('News API returned invalid data format')
      return { articles: [], error: 'invalid_format' }
    }
    
    return { 
      articles: response.articles,
      error: null
    }
  } catch (error) {
    console.error('News API error:', error)
    
    // Return structured error data for the component to handle
    return { 
      articles: [],
      error: error instanceof Error ? error.message : 'unknown_error'
    }
  }
}
```

### Dependent Queries

Sometimes you need to fetch data sequentially, where one request depends on the results of another:

```tsx
export let loader = async ({ weaverse, data }: ComponentLoaderArgs<RelatedProductsData>) => {
  const { storefront } = weaverse
  const { productHandle } = data
  
  // Step 1: Get the main product to find its type
  const { product } = await storefront.query(PRODUCT_BASIC_QUERY, {
    variables: { handle: productHandle }
  })
  
  if (!product) return { relatedProducts: [] }
  
  // Step 2: Use the product type to find related products
  const { products } = await storefront.query(RELATED_PRODUCTS_QUERY, {
    variables: { 
      productType: product.productType,
      excludeId: product.id,
      first: 4
    }
  })
  
  return { relatedProducts: products.nodes }
}
```

## Data Revalidation

Weaverse provides a powerful mechanism to automatically refresh component data when specific settings change. This ensures that the displayed content always reflects the current configuration.

### Understanding shouldRevalidate

The `shouldRevalidate` property, when added to an input in your component schema, tells Weaverse to reload the component's data from its loader function whenever that specific input changes.

```tsx
// In your component schema
settings: [
  {
    group: 'Settings',
    inputs: [
      {
        type: 'select',
        name: 'sortOrder',
        label: 'Sort Products By',
        defaultValue: 'best-selling',
        shouldRevalidate: true, // This triggers data reload when changed
        configs: {
          options: [
            { value: 'best-selling', label: 'Best Selling' },
            { value: 'newest', label: 'Newest' },
            { value: 'price-low-high', label: 'Price: Low to High' },
            { value: 'price-high-low', label: 'Price: High to Low' }
          ]
        }
      }
    ]
  }
]
```

When a merchant changes the `sortOrder` in the editor, Weaverse will:
1. Update the component's data with the new value
2. Re-run the component's loader function
3. Refresh the component with the updated data

This creates a seamless experience where changes in the editor immediately update the displayed content.

### Auto-Revalidating Inputs

Some input types automatically trigger revalidation without needing the `shouldRevalidate` property:

- `product` - When selecting a different product
- `collection` - When selecting a different collection
- `blog` - When selecting a different blog
- `product-list` - When selecting different products
- `collection-list` - When selecting different collections

These inputs deal with Shopify resources that typically require fresh data when changed.

### Custom Revalidation Rules

You can create powerful data-driven components by combining `shouldRevalidate` with component loaders:

```tsx
// app/sections/dynamic-product-grid/schema.ts
export const schema = {
  // ... other schema properties
  settings: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'collection',
          name: 'collection',
          label: 'Collection',
          // No need for shouldRevalidate as collection inputs auto-revalidate
        },
        {
          type: 'select',
          name: 'sortBy',
          label: 'Sort By',
          defaultValue: 'BEST_SELLING',
          shouldRevalidate: true, // Will reload data when changed
          configs: {
            options: [
              { value: 'BEST_SELLING', label: 'Best Selling' },
              { value: 'CREATED_AT', label: 'Newest' },
              { value: 'PRICE', label: 'Price: Low to High' },
              { value: 'PRICE_DESC', label: 'Price: High to Low' }
            ]
          }
        },
        {
          type: 'range',
          name: 'productsToShow',
          label: 'Number of Products',
          defaultValue: 4,
          shouldRevalidate: true, // Will reload data when changed
          configs: {
            min: 2,
            max: 12,
            step: 1
          }
        },
        {
          type: 'select',
          name: 'viewStyle',
          label: 'View Style',
          defaultValue: 'grid',
          shouldRevalidate: false, // UI change only, no data reload needed
          configs: {
            options: [
              { value: 'grid', label: 'Grid' },
              { value: 'slider', label: 'Slider' }
            ]
          }
        }
      ]
    }
  ]
}

// app/sections/dynamic-product-grid/index.ts
import type { ComponentLoaderArgs } from '@weaverse/hydrogen'

type ProductGridData = {
  collection: { handle: string }
  sortBy: 'BEST_SELLING' | 'CREATED_AT' | 'PRICE' | 'PRICE_DESC'
  productsToShow: number
  viewStyle: string
}

export let loader = async ({ weaverse, data }: ComponentLoaderArgs<ProductGridData>) => {
  const { storefront } = weaverse
  const { collection, sortBy, productsToShow } = data
  
  if (!collection?.handle) return { products: [] }
  
  // This query will re-run whenever collection, sortBy, or productsToShow changes
  // because they have shouldRevalidate: true in the schema
  return await storefront.query(COLLECTION_PRODUCTS_QUERY, {
    variables: {
      handle: collection.handle,
      sortKey: sortBy,
      first: productsToShow,
      language: storefront.i18n.language,
      country: storefront.i18n.country
    }
  })
}

// Component implementation...
```

In this example:
- Changing the collection, sort order, or number of products triggers a data reload
- Changing the view style doesn't require new data, so `shouldRevalidate` is set to `false`

This optimizes performance by only reloading data when necessary, while ensuring that content stays fresh and relevant as merchants configure their components.

## Caching Strategies

Weaverse components inherit Hydrogen's powerful caching system, allowing you to optimize performance based on how frequently your data changes.

### Available Caching Options

| Strategy | Cache Control Header | Best Used For |
|----------|---------------------|--------------|
| `CacheShort()` | public, max-age=1, stale-while-revalidate=9 | Frequently changing data (price, inventory) |
| `CacheLong()` | public, max-age=3600, stale-while-revalidate=82800 | Rarely changing data (product details, images) |
| `CacheNone()` | no-store | Personalized or uncacheable data |
| `CacheCustom()` | Custom defined | Special caching requirements |

### Custom Caching

For fine-tuned control over caching behavior:

```tsx
export let loader = async ({ weaverse }: ComponentLoaderArgs<StockTickerData>) => {
  const { fetchWithCache, storefront } = weaverse
  
  // Fast-changing financial data needs custom caching
  return await fetchWithCache('https://api.stocks.example/ticker', {
    strategy: storefront.CacheCustom({
      // Cache for 30 seconds
      maxAge: 30,
      // Allow stale content for up to 2 minutes while revalidating
      staleWhileRevalidate: 120,
      // If revalidation fails, serve stale content for up to 5 minutes
      staleIfError: 300,
      // Cache control mode
      mode: 'public'
    })
  })
}
```

### Caching Best Practices

1. **Match cache duration to data volatility**:
   - Product descriptions: `CacheLong()`
   - Prices and inventory: `CacheShort()`
   - User-specific content: `CacheNone()`

2. **Use stale-while-revalidate** for a balance of freshness and performance

3. **Consider cache hierarchies** when combining multiple data sources

4. **Be mindful of API rate limits** when setting short cache durations

5. **Use cache debugging headers** during development to verify caching behavior

## Real-World Examples

### E-commerce Examples

**Product Recommendations Component**

```tsx
// app/sections/product-recommendations/index.tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen'
import { RECOMMENDATIONS_QUERY } from '~/graphql/queries'

type RecommendationsData = {
  product: { id: string; handle: string }
  recommendationType: 'related' | 'complementary' | 'bestsellers'
  maxProducts: number
}

export let loader = async ({ 
  weaverse, 
  data 
}: ComponentLoaderArgs<RecommendationsData>) => {
  const { storefront } = weaverse
  const { product, recommendationType, maxProducts = 4 } = data
  
  if (!product?.id) return { recommendations: [] }
  
  switch (recommendationType) {
    case 'related':
    case 'complementary':
      return await storefront.query(RECOMMENDATIONS_QUERY, {
        variables: {
          productId: product.id,
          intent: recommendationType.toUpperCase(),
          count: maxProducts
        }
      })
    
    case 'bestsellers':
      return await storefront.query(BESTSELLERS_QUERY, {
        variables: {
          count: maxProducts
        }
      })
  }
}
```

### Content Integration

**Blog Feed with Categories**

```tsx
// app/sections/blog-feed/index.tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen'
import { BLOG_ARTICLES_QUERY } from '~/graphql/queries'

type BlogFeedData = {
  blog: { handle: string }
  category?: string
  tagsToInclude: string[]
  tagsToExclude: string[]
  postsCount: number
  sortBy: 'newest' | 'oldest' | 'title'
}

export let loader = async ({ 
  weaverse, 
  data 
}: ComponentLoaderArgs<BlogFeedData>) => {
  const { storefront } = weaverse
  const { 
    blog, 
    category, 
    tagsToInclude = [], 
    tagsToExclude = [],
    postsCount = 3,
    sortBy = 'newest'
  } = data
  
  if (!blog?.handle) return { articles: [] }
  
  // Get all articles for the blog
  const response = await storefront.query(BLOG_ARTICLES_QUERY, {
    variables: {
      blogHandle: blog.handle,
      first: 250 // Maximum to retrieve
    }
  })
  
  // Client-side filtering and sorting (could be moved to a server query with a custom app extension)
  let articles = response.blog.articles.nodes
  
  // Filter by category if specified
  if (category) {
    articles = articles.filter(article => 
      article.tags.includes(category)
    )
  }
  
  // Filter by tags
  if (tagsToInclude.length > 0) {
    articles = articles.filter(article => 
      tagsToInclude.some(tag => article.tags.includes(tag))
    )
  }
  
  if (tagsToExclude.length > 0) {
    articles = articles.filter(article => 
      !tagsToExclude.some(tag => article.tags.includes(tag))
    )
  }
  
  // Sort articles
  switch (sortBy) {
    case 'newest':
      articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      break
    case 'oldest':
      articles.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
      break
    case 'title':
      articles.sort((a, b) => a.title.localeCompare(b.title))
      break
  }
  
  // Limit to requested count
  articles = articles.slice(0, postsCount)
  
  return { articles }
}
```

### Third-Party Services

**Currency Converter Widget**

```tsx
// app/sections/currency-converter/index.tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen'

type CurrencyConverterData = {
  baseCurrency: string
  targetCurrencies: string[]
  showChart: boolean
}

type ExchangeRateResponse = {
  base: string
  rates: Record<string, number>
  timestamp: number
}

export let loader = async ({ 
  weaverse, 
  data 
}: ComponentLoaderArgs<CurrencyConverterData>) => {
  const { fetchWithCache, env, storefront } = weaverse
  const { 
    baseCurrency = 'USD', 
    targetCurrencies = ['EUR', 'GBP', 'JPY', 'CAD'],
    showChart = false 
  } = data
  
  try {
    // Fetch current exchange rates
    const exchangeRates = await fetchWithCache<ExchangeRateResponse>(
      `https://api.exchangerate.host/latest?base=${baseCurrency}&symbols=${targetCurrencies.join(',')}`,
      {
        // Exchange rates change throughout the day, but we don't need to fetch every request
        strategy: storefront.CacheCustom({
          maxAge: 900, // 15 minutes
          staleWhileRevalidate: 3600 // 1 hour
        })
      }
    )
    
    // Fetch historical data for chart if needed
    let historicalData = null
    if (showChart) {
      const today = new Date()
      const lastMonth = new Date(today.setMonth(today.getMonth() - 1))
      const formattedDate = lastMonth.toISOString().split('T')[0]
      
      historicalData = await fetchWithCache(
        `https://api.exchangerate.host/timeseries?start_date=${formattedDate}&end_date=${new Date().toISOString().split('T')[0]}&base=${baseCurrency}&symbols=${targetCurrencies.join(',')}`,
        {
          // Historical data can be cached longer
          strategy: storefront.CacheLong()
        }
      )
    }
    
    return {
      base: baseCurrency,
      rates: exchangeRates.rates,
      timestamp: exchangeRates.timestamp,
      historicalData: historicalData?.rates || null
    }
  } catch (error) {
    console.error('Currency API error:', error)
    return {
      base: baseCurrency,
      rates: {},
      error: 'Failed to fetch exchange rates'
    }
  }
}
```

## Performance Optimization

To ensure your section components load quickly:

1. **Use parallel fetching** with `Promise.all()` for independent data sources

2. **Implement appropriate caching strategies** based on data freshness requirements

3. **Filter data server-side** whenever possible to reduce payload size

4. **Consider data dependencies** to avoid waterfall requests

5. **Return only what you need** to minimize response size

6. **Handle errors gracefully** with fallback content

7. **Monitor API response times** and optimize slow requests

## Troubleshooting

Common issues and their solutions:

**1. Missing or undefined data**

```tsx
// Problem: Data is sometimes undefined
export let loader = async ({ data }: ComponentLoaderArgs<ProductData>) => {
  // ❌ This might cause an error if data.product is undefined
  return await storefront.query(QUERY, { 
    variables: { handle: data.product.handle }
  })
}

// Solution: Add proper validation
export let loader = async ({ data }: ComponentLoaderArgs<ProductData>) => {
  // ✅ Check for existence before accessing properties
  if (!data?.product?.handle) return null
  
  return await storefront.query(QUERY, { 
    variables: { handle: data.product.handle }
  })
}
```

**2. Type errors in loader data**

Use TypeScript to catch issues early:

```tsx
// Define explicit types for your component data
type ProductCarouselData = {
  products: Array<{ handle: string }>
  autoplay: boolean
  autoplaySpeed: number
}

// Use the type in your loader
export let loader = async ({ 
  data 
}: ComponentLoaderArgs<ProductCarouselData>) => {
  // TypeScript will now validate that data matches the expected structure
}
```

**3. API rate limiting issues**

Implement proper caching and error handling:

```tsx
export let loader = async ({ weaverse }: ComponentLoaderArgs<ApiData>) => {
  const { fetchWithCache, storefront } = weaverse
  
  try {
    return await fetchWithCache('https://rate-limited-api.example/data', {
      // Use longer cache times for rate-limited APIs
      strategy: storefront.CacheCustom({
        maxAge: 600, // 10 minutes
        staleWhileRevalidate: 3600, // 1 hour
        staleIfError: 86400 // 1 day - use stale data on errors for a while
      })
    })
  } catch (error) {
    // Check for rate limit errors
    if (error instanceof Error && error.message.includes('rate limit')) {
      console.warn('API rate limit reached, using fallback data')
      return getFallbackData()
    }
    throw error
  }
}
```

## Related Documents

To further enhance your understanding of Weaverse's data fetching capabilities and component development, explore these related guides:

- [Component Schema](/docs/development-guide/component-schema) - Learn how to define component schemas, including the `shouldRevalidate` property
- [Input Settings](/docs/development-guide/input-settings) - Comprehensive guide to all input types available in Weaverse
- [Rendering a Weaverse Page](/docs/guides/rendering-page) - Understanding how Weaverse pages are rendered
- [Project Structure](/docs/core-concepts/project-structure) - Learn how the project is organized

export let schema = createSchema({
  type: 'featured-collection',
  title: 'Featured Collection',
  settings: [
    {
      group: 'Collection',
      inputs: [
        {
          type: 'collection',
          name: 'collection',
          label: 'Collection',
        },
        {
          type: 'range',
          name: 'productsCount',
          label: 'Number of products',
          defaultValue: 8,
          configs: {
            min: 1,
            max: 12,
            step: 1,
          },
        },
      ],
    },
  ],
});

export let schema = createSchema({
  type: 'single-product',
  title: 'Single Product',
  settings: [
    {
      group: 'Product',
      inputs: [
        {
          type: 'product',
          name: 'product',
          label: 'Product',
        },
      ],
    },
  ],
});
