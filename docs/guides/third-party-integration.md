---
title: Third-party Integration
description: Extend the functionality of your Weaverse Hydrogen theme by integrating third-party applications and services.
publishedAt: November 20, 2023
updatedAt: June 30, 2024
order: 11
published: true
---

# Third-party Integration

## Table of Contents
- [Third-party Integration](#third-party-integration)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Integration Methods](#integration-methods)
    - [Using the App's Component Library](#using-the-apps-component-library)
    - [Querying App Data from App's API](#querying-app-data-from-apps-api)
  - [Data Fetching Patterns](#data-fetching-patterns)
    - [Server Component Integration](#server-component-integration)
    - [Client Component Integration](#client-component-integration)
    - [Hybrid Integration](#hybrid-integration)
  - [Real-World Examples](#real-world-examples)
    - [Ali Reviews Integration](#ali-reviews-integration)
    - [Judge.me Reviews Integration](#judgeme-reviews-integration)
  - [Common Integration Challenges](#common-integration-challenges)
    - [Authentication](#authentication)
    - [Rate Limiting](#rate-limiting)
    - [Error Handling](#error-handling)
    - [Data Synchronization](#data-synchronization)
  - [Performance Optimization](#performance-optimization)
    - [Caching Strategies](#caching-strategies)
    - [Selective Loading](#selective-loading)
    - [Lazy Loading](#lazy-loading)
  - [Security Best Practices](#security-best-practices)
  - [Troubleshooting](#troubleshooting)
  - [Conclusion](#conclusion)

## Introduction

Enhancing your Weaverse Hydrogen theme with third-party applications allows you to add specialized functionality such as product reviews, advanced analytics, marketing tools, and content enrichment. Weaverse's flexible architecture makes it possible to integrate with virtually any external service that offers a public API or React component library.

This guide provides a comprehensive approach to integrating third-party services with your Weaverse Hydrogen store, with real-world examples and proven patterns that maintain performance and user experience.

## Integration Methods

Weaverse supports two primary approaches for integrating third-party applications:

### Using the App's Component Library

Many third-party applications provide React components that you can incorporate directly into your Weaverse sections:

1. **Install the Library**

   ```bash
   npm install @third-party-app/react
   # or
   yarn add @third-party-app/react
   ```

2. **Create a Custom Section Component**

   ```tsx
   // app/sections/third-party-widget/index.tsx
   import { ThirdPartyComponent } from '@third-party-app/react'
   import type { SectionProps } from '~/components/section'
   import { Section } from '~/components/section'
   import { forwardRef } from 'react'
   
   export type ThirdPartyWidgetProps = {
     apiKey: string
     widgetId: string
     // Other configuration options
   }
   
   const ThirdPartyWidget = forwardRef<HTMLElement, SectionProps & ThirdPartyWidgetProps>(
     (props, ref) => {
       const { apiKey, widgetId, ...rest } = props
       
       return (
         <Section ref={ref} {...rest}>
           <ThirdPartyComponent 
             apiKey={apiKey} 
             widgetId={widgetId}
           />
         </Section>
       )
     }
   )
   
   export default ThirdPartyWidget
   ```

3. **Define the Schema**

   ```tsx
   // app/sections/third-party-widget/schema.ts
   import type { HydrogenComponentSchema } from '@weaverse/hydrogen'
   
   export const schema: HydrogenComponentSchema = {
     type: 'third-party-widget',
     title: 'Third Party Widget',
     settings: [
       {
         group: 'Widget Settings',
         inputs: [
           {
             type: 'text',
             name: 'apiKey',
             label: 'API Key',
             defaultValue: '',
             helpText: 'Enter your API key from the third-party dashboard',
           },
           {
             type: 'text',
             name: 'widgetId',
             label: 'Widget ID',
             defaultValue: '',
           },
           // Additional configuration inputs
         ]
       }
     ],
     presets: {
       children: [
         // Default children if needed
       ]
     }
   }
   ```

4. **Register the Section in Weaverse**

   Ensure your component is registered in your Weaverse configuration file:

   ```tsx
   // app/weaverse/sections.ts
   import ThirdPartyWidget from '~/sections/third-party-widget'
   import { schema as thirdPartyWidgetSchema } from '~/sections/third-party-widget/schema'
   
   export const sections = {
     // Other sections
     'third-party-widget': {
       Component: ThirdPartyWidget,
       schema: thirdPartyWidgetSchema
     }
   }
   ```

### Querying App Data from App's API

For third-party services that offer a REST or GraphQL API, Weaverse's loader pattern provides an elegant way to fetch and incorporate external data:

1. **Store API Credentials Securely**

   Add your API credentials to your environment variables:

   ```env
   # .env
   THIRD_PARTY_API_KEY=your_secret_key_here
   ```

2. **Implement a Component Loader**

   ```tsx
   // app/sections/api-widget/index.tsx
   import type { ComponentLoaderArgs, HydrogenComponentSchema } from '@weaverse/hydrogen'
   import { forwardRef } from 'react'
   import { Section, type SectionProps } from '~/components/section'
   
   type ApiWidgetData = {
     resourceId: string
     itemsToShow: number
   }
   
   export const loader = async ({ weaverse, data }: ComponentLoaderArgs<ApiWidgetData>) => {
     const { fetchWithCache, env, storefront } = weaverse
     const { resourceId, itemsToShow = 5 } = data
     
     if (!resourceId) return { items: [] }
     
     try {
       return await fetchWithCache(
         `https://api.third-party.com/resources/${resourceId}?limit=${itemsToShow}`,
         {
           headers: {
             'Authorization': `Bearer ${env.THIRD_PARTY_API_KEY}`,
             'Content-Type': 'application/json'
           },
           // Use Hydrogen's caching to optimize performance
           strategy: storefront.CacheShort()
         }
       )
     } catch (error) {
       console.error('Error fetching data:', error)
       return { items: [], error: true }
     }
   }
   
   type ApiWidgetProps = SectionProps<Awaited<ReturnType<typeof loader>>> & ApiWidgetData
   
   const ApiWidget = forwardRef<HTMLElement, ApiWidgetProps>((props, ref) => {
     const { loaderData, resourceId, itemsToShow, ...rest } = props
     const { items, error } = loaderData || { items: [] }
     
     if (error) {
       return (
         <Section ref={ref} {...rest}>
           <div className="p-4 text-center text-red-500">
             Unable to load content from external API
           </div>
         </Section>
       )
     }
     
     return (
       <Section ref={ref} {...rest}>
         <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
           {items.map((item) => (
             <div key={item.id} className="border p-4 rounded">
               <h3>{item.title}</h3>
               <p>{item.description}</p>
             </div>
           ))}
         </div>
       </Section>
     )
   })
   
   export default ApiWidget
   
   export let schema: HydrogenComponentSchema = {
     type: 'api-widget',
     title: 'API Widget',
     settings: [
       {
         group: 'API Settings',
         inputs: [
           {
             type: 'text',
             name: 'resourceId',
             label: 'Resource ID',
             defaultValue: '',
             shouldRevalidate: true, // This triggers data refresh when changed
           },
           {
             type: 'range',
             name: 'itemsToShow',
             label: 'Items to Show',
             defaultValue: 5,
             shouldRevalidate: true,
             configs: {
               min: 1,
               max: 20,
               step: 1
             }
           }
         ]
       }
     ]
   }
   ```

## Data Fetching Patterns

Weaverse provides multiple approaches to fetch data from third-party services, each with its own advantages.

### Server Component Integration

Server-side data fetching is the preferred approach for most integrations as it keeps API keys secure and reduces client-side JavaScript:

```tsx
export const loader = async ({ weaverse, data }: ComponentLoaderArgs<WidgetData>) => {
  const { fetchWithCache, env } = weaverse
  
  return await fetchWithCache('https://api.third-party.com/data', {
    headers: {
      'Authorization': `Bearer ${env.API_KEY}`
    }
  })
}
```

Benefits:
- API keys remain secure on the server
- Reduced JavaScript bundle size
- Better performance for initial page load
- SEO-friendly as content is included in the initial HTML

### Client Component Integration

Some third-party widgets require client-side initialization:

```tsx
// app/sections/analytics-widget/client.tsx
'use client'

import { useEffect } from 'react'

export function AnalyticsClient({ trackingId }) {
  useEffect(() => {
    // Load analytics script
    const script = document.createElement('script')
    script.src = `https://analytics.example.com/script.js?id=${trackingId}`
    script.async = true
    document.head.appendChild(script)
    
    return () => {
      // Clean up on unmount
      const existingScript = document.querySelector(`script[src*="analytics.example.com"]`)
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, [trackingId])
  
  return null // This component doesn't render anything visible
}
```

Use this approach when:
- The integration requires browser-specific APIs
- The third-party service needs to track user interactions
- The widget needs to be initialized after the page loads

### Hybrid Integration

Combine server and client approaches for the best of both worlds:

```tsx
// Server component that fetches data
export const loader = async ({ weaverse, data }: ComponentLoaderArgs<WidgetData>) => {
  // Fetch initial data server-side
  return await weaverse.fetchWithCache('https://api.third-party.com/initial-data')
}

// Main component
const HybridWidget = forwardRef((props, ref) => {
  const { loaderData, settings } = props
  
  return (
    <div ref={ref}>
      {/* Render server-fetched data */}
      <ServerRenderedContent data={loaderData} />
      
      {/* Include client component for interactivity */}
      <ClientInteractivity initialData={loaderData} settings={settings} />
    </div>
  )
})

// Client component for interactive features
'use client'
function ClientInteractivity({ initialData, settings }) {
  const [data, setData] = useState(initialData)
  
  // Client-side interactions and updates
  // ...
  
  return (
    <div className="interactive-elements">
      {/* Interactive UI elements */}
    </div>
  )
}
```

This pattern is ideal for:
- Review systems that need initial content rendered server-side but allow client-side submissions
- Interactive widgets that need to show initial data quickly but then become interactive
- Progressive enhancement scenarios

## Real-World Examples

Let's explore two real implementations: Ali Reviews and Judge.me integrations.

### Ali Reviews Integration

Ali Reviews is a popular Shopify app for collecting and displaying product reviews. Here's how to integrate it with Weaverse:

```tsx
// app/sections/ali-reviews/index.tsx
import type {
  ComponentLoaderArgs,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, type SectionProps } from "~/components/section";
import type { AliReview } from "./review-item";

type AliReviewsData = {
  aliReviewsApiKey: string;
};

type AliReviewsProps = SectionProps<Awaited<ReturnType<typeof loader>>> &
  AliReviewsData;

let AliReviewSection = forwardRef<HTMLElement, AliReviewsProps>(
  (props, ref) => {
    let { children, loaderData, aliReviewsApiKey, ...rest } = props;
    return (
      <Section ref={ref} {...rest} overflow="unset">
        {children}
      </Section>
    );
  },
);

export type AliReviewsLoaderData = Awaited<ReturnType<typeof loader>>;
type AliReviewsAPIPayload = {
  data: { reviews: AliReview[]; cursor: string };
  message: string;
  status: number;
};

export let loader = async ({
  data: { aliReviewsApiKey = "" },
  weaverse,
}: ComponentLoaderArgs<AliReviewsData>) => {
  let res = await weaverse
    .fetchWithCache<AliReviewsAPIPayload>(
      "https://widget-hub-api.alireviews.io/api/public/reviews",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${aliReviewsApiKey}`,
          "Content-Type": "application/json",
        },
      },
    )
    .catch((err) => {
      console.log(err);
      return { data: { reviews: [], cursor: "" }, message: "", status: 0 };
    });
  return res?.data?.reviews;
};

export default AliReviewSection;

export let schema: HydrogenComponentSchema = {
  type: "ali-reviews",
  title: "Ali Reviews box",
  settings: [
    {
      group: "Integration",
      inputs: [
        {
          type: "text",
          name: "aliReviewsApiKey",
          label: "Ali Reviews API key",
          defaultValue: "",
          placeholder: "Your Ali Reviews API key",
          helpText: `Learn how to get your API key from <a href="https://support.fireapps.io/en/article/ali-reviews-learn-more-about-integration-using-api-key-hklfr0/" target="_blank">Ali Reviews app</a>.`,
          shouldRevalidate: true,
        },
      ],
    },
    // Other settings groups...
  ],
  childTypes: [
    "ali-reviews--list",
    "heading",
    "subheading",
    "paragraph",
    "button",
  ],
  // Preset configuration...
};
```

The implementation:
1. Defines a schema with an API key input that triggers revalidation when changed
2. Uses a loader to securely fetch reviews from the Ali Reviews API
3. Structures the component to render Ali Review data
4. Supports child components for customizable review display

### Judge.me Reviews Integration

Judge.me is another popular reviews platform that can be integrated with Weaverse:

```tsx
// app/sections/judgeme-reviews/index.tsx
import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, type SectionProps } from "~/components/section";

let JudgemeReviewSection = forwardRef<HTMLElement, SectionProps>(
  (props, ref) => {
    let { children, loaderData, ...rest } = props;
    return (
      <Section ref={ref} {...rest} overflow="unset">
        {children}
      </Section>
    );
  },
);

export default JudgemeReviewSection;

export let schema: HydrogenComponentSchema = {
  type: "judgeme-reviews",
  title: "Judgeme Reviews",
  enabledOn: {
    pages: ["PRODUCT"], // Only enable on product pages
  },
  // Schema configuration...
  childTypes: ["heading", "paragraph", "judgeme-review--index"],
  // Preset configuration...
};
```

The Judge.me integration leverages Hydrogen's existing product route data by accessing it through the Remix loader:

```tsx
// app/sections/judgeme-reviews/review-index.tsx
import { useLoaderData } from "@remix-run/react";
import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import type { loader as productRouteLoader } from "~/routes/($locale).products.$productHandle";
import ReviewForm from "./review-form";
import { ReviewList } from "./review-list";

let ReviewIndex = forwardRef<HTMLDivElement>((props, ref) => {
  let { productReviews } = useLoaderData<typeof productRouteLoader>();
  return (
    <div
      ref={ref}
      {...props}
      className="flex flex-col md:flex-row md:gap-10 gap-5"
    >
      <ReviewForm reviews={productReviews} />
      {productReviews.reviews.length > 0 ? (
        <ReviewList reviews={productReviews} />
      ) : null}
    </div>
  );
});

export default ReviewIndex;
```

This approach:
1. Leverages existing Hydrogen route data instead of making additional API calls
2. Separates the display components from the data fetching logic
3. Optimizes performance by reusing already fetched data

## Common Integration Challenges

### Authentication

Most third-party APIs require authentication. Here are the common approaches:

1. **API Key Authentication**

   ```tsx
   export let loader = async ({ weaverse }: ComponentLoaderArgs) => {
     const { env } = weaverse
     
     return await weaverse.fetchWithCache('https://api.example.com/data', {
       headers: {
         'Authorization': `Bearer ${env.THIRD_PARTY_API_KEY}`
       }
     })
   }
   ```

2. **OAuth Integration**

   For services using OAuth:

   ```tsx
   export let loader = async ({ weaverse, context }: ComponentLoaderArgs) => {
     const { session } = context
     const accessToken = await session.get('thirdPartyAccessToken')
     
     if (!accessToken) {
       // Handle unauthenticated state
       return { authenticated: false }
     }
     
     return await weaverse.fetchWithCache('https://api.example.com/data', {
       headers: {
         'Authorization': `Bearer ${accessToken}`
       }
     })
   }
   ```

### Rate Limiting

Prevent rate limit issues by implementing proper caching:

```tsx
export let loader = async ({ weaverse }: ComponentLoaderArgs) => {
  const { fetchWithCache, storefront } = weaverse
  
  return await fetchWithCache('https://rate-limited-api.example.com/data', {
    // Use longer cache times for rate-limited APIs
    strategy: storefront.CacheCustom({
      maxAge: 600, // 10 minutes
      staleWhileRevalidate: 3600, // 1 hour
      staleIfError: 86400 // 1 day - use stale data on errors
    })
  })
}
```

### Error Handling

Implement robust error handling for third-party services:

```tsx
export let loader = async ({ weaverse }: ComponentLoaderArgs) => {
  const { fetchWithCache } = weaverse
  
  try {
    const response = await fetchWithCache('https://api.third-party.com/data')
    
    // Validate response structure
    if (!response || !response.data) {
      console.warn('Invalid response format from API')
      return { data: [], error: 'invalid_format' }
    }
    
    return { data: response.data, error: null }
  } catch (error) {
    console.error('API error:', error)
    
    // Different error handling based on error type
    if (error instanceof Response) {
      if (error.status === 429) {
        return { data: [], error: 'rate_limited' }
      } else if (error.status >= 500) {
        return { data: [], error: 'service_unavailable' }
      }
    }
    
    return { data: [], error: 'unknown' }
  }
}
```

### Data Synchronization

For widgets that need to stay in sync with your store data:

```tsx
export let loader = async ({ weaverse, data }: ComponentLoaderArgs<WidgetData>) => {
  const { storefront, fetchWithCache } = weaverse
  const { productId } = data
  
  // First get the product data from Shopify
  const { product } = await storefront.query(`
    query Product($id: ID!) {
      product(id: $id) {
        id
        title
        updatedAt
      }
    }
  `, {
    variables: { id: productId }
  })
  
  // Then get related data from third-party
  const externalData = await fetchWithCache(
    `https://api.third-party.com/products/${productId}`,
    {
      // Include product updated timestamp to maintain consistency
      body: JSON.stringify({ 
        productUpdatedAt: product.updatedAt
      })
    }
  )
  
  return {
    product,
    externalData
  }
}
```

## Performance Optimization

### Caching Strategies

The choice of caching strategy depends on how frequently your third-party data changes:

```tsx
// For rarely changing data (e.g., product descriptions)
strategy: storefront.CacheLong()

// For frequently changing data (e.g., inventory, prices)
strategy: storefront.CacheShort()

// For personalized or dynamic content
strategy: storefront.CacheNone()

// For custom requirements
strategy: storefront.CacheCustom({
  maxAge: 300, // 5 minutes
  staleWhileRevalidate: 1800, // 30 minutes
  staleIfError: 86400, // 1 day
  mode: 'public'
})
```

### Selective Loading

Only load what's needed when it's needed:

```tsx
export let loader = async ({ weaverse, data }: ComponentLoaderArgs<WidgetData>) => {
  const { fetchWithCache, request } = weaverse
  const { widgetType, itemsToShow } = data
  
  // Determine if this is a viewport-visible request
  const url = new URL(request.url)
  const isVisible = url.searchParams.get('visible') === 'true'
  
  // Only fetch data if component is visible
  if (!isVisible) {
    return { deferred: true }
  }
  
  return await fetchWithCache(
    `https://api.third-party.com/widget/${widgetType}?limit=${itemsToShow}`
  )
}
```

### Lazy Loading

Use client components to defer loading of non-critical third-party widgets:

```tsx
'use client'
import { useEffect, useState } from 'react'

export function LazyThirdPartyWidget({ config }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Set up intersection observer
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    })
    
    // Observe the component's container
    const container = document.getElementById('widget-container')
    if (container) {
      observer.observe(container)
    }
    
    return () => observer.disconnect()
  }, [])
  
  useEffect(() => {
    // Load the widget when it becomes visible
    if (isVisible && !isLoaded) {
      const script = document.createElement('script')
      script.src = 'https://third-party.com/widget.js'
      script.onload = () => {
        window.ThirdPartyWidget.initialize(config)
        setIsLoaded(true)
      }
      document.head.appendChild(script)
    }
  }, [isVisible, isLoaded, config])
  
  return (
    <div id="widget-container" className="min-h-[200px]">
      {!isLoaded && <div className="loading-placeholder" />}
      <div id="third-party-widget-target" />
    </div>
  )
}
```

## Security Best Practices

When integrating third-party services, follow these security practices:

1. **Keep API Keys Secure**
   - Never hardcode API keys in your components
   - Use environment variables accessible only on the server
   - Consider using Shopify's app proxy for sensitive operations

2. **Validate All External Data**
   - Validate and sanitize all data from third-party APIs
   - Be defensive against malformed responses
   - Never directly inject external content into your DOM

3. **Implement Content Security Policy (CSP)**
   - Restrict which domains can serve scripts to your site
   - Use nonces or hashes for inline scripts from trusted sources
   - Monitor CSP violations to detect potential issues

4. **Minimize Access and Permissions**
   - Only request the permissions needed for your integration
   - Use read-only access when possible
   - Regularly review and rotate API keys

## Troubleshooting

Common issues and their solutions:

1. **API Returns Errors**
   - Check if your API key is valid and has the correct permissions
   - Verify that you're using the correct API endpoint
   - Look for rate limiting or quota issues

   Solution:
   ```tsx
   try {
     // Make your API call here
   } catch (error) {
     console.error('API Error:', error)
     
     // Check specific error types
     if (error.message.includes('rate limit')) {
       // Handle rate limiting
     } else if (error.message.includes('authentication')) {
       // Handle auth issues
     }
   }
   ```

2. **Component Fails to Render**
   - Check browser console for JavaScript errors
   - Verify that the third-party script loaded successfully
   - Ensure your component handles the absence of data gracefully

   Solution:
   ```tsx
   const Widget = forwardRef((props, ref) => {
     const { loaderData } = props
     
     // Always check if data exists before rendering
     if (!loaderData || loaderData.error) {
       return (
         <div ref={ref} className="error-container">
           <p>Unable to load widget. Please try again later.</p>
         </div>
       )
     }
     
     // Proceed with normal rendering
   })
   ```

3. **Hydration Mismatch Errors**
   - Ensure server and client rendering produce the same output
   - Defer client-specific code to useEffect hooks
   - Use client components with careful boundaries

   Solution:
   ```tsx
   'use client'
   import { useEffect, useState } from 'react'
   
   export function ClientWidget({ initialData }) {
     // Start with initial data from server
     const [data, setData] = useState(initialData)
     
     // Add client-side behavior after mount
     useEffect(() => {
       // Client-only code here
     }, [])
     
     return <div>{/* Render using data */}</div>
   }
   ```

## Conclusion

Third-party integrations can significantly enhance your Weaverse Hydrogen store with specialized functionality that would be time-consuming to build from scratch. By following the patterns and best practices in this guide, you can create seamless integrations that enhance your store without compromising performance or user experience.

Weaverse's flexible architecture allows for integration with virtually any third-party service that offers a public API, making your store infinitely extensible. Whether you're adding product reviews, analytics, marketing tools, or content enrichment, the component-based approach and powerful data fetching capabilities give you everything you need to build a truly custom e-commerce experience.
