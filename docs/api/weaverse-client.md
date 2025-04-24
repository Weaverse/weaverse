---
title: WeaverseClient
description: The WeaverseClient class provides server-side methods to interact with Weaverse content and services in a Hydrogen storefront.
publishedAt: October 10, 2023
updatedAt: April 24, 2025
order: 0
published: true
---

# WeaverseClient

The `WeaverseClient` class is a server-side utility that provides methods to interact with Weaverse services, fetch content, manage caching strategies, and load theme settings and page data for your Hydrogen storefront.

## Initialization

The `WeaverseClient` is typically initialized in your `server.ts` file and injected into your app's load context:

```tsx
// Example from templates/pilot/server.ts
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  // ... other context setup

  let hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: getLocaleFromRequest(request),
    cart: { queryFragment: CART_QUERY_FRAGMENT },
  });

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

Refer to the [Project Structure guide](/docs/guides/project-structure#base-files-explained) for a detailed setup walkthrough.

## Type Definition

```typescript
class WeaverseClient {
  constructor(args: WeaverseClientArgs);
  
  // Properties
  public API: string;  // API endpoint path
  public basePageConfigs: Omit<WeaverseProjectConfigs, 'requestInfo'>
  public basePageRequestBody: Omit<FetchProjectRequestBody, 'url'>
  public configs: WeaverseProjectConfigs
  public storefront: HydrogenContext['storefront'];
  public env: HydrogenEnv;
  public cache: Cache;
  public waitUntil: ExecutionContext['waitUntil'];
  public request: Request;
  public components: HydrogenComponent[];
  public themeSchema: HydrogenThemeSchema;
  
  // Methods
  fetchWithCache<T>(url: string, options?: RequestInit & { strategy?: AllCacheOptions }): Promise<T>;
  loadThemeSettings(strategy?: AllCacheOptions): Promise<HydrogenThemeSettings>;
  loadPage(params?: { type?: PageType, locale?: string, handle?: string, strategy?: AllCacheOptions }): Promise<WeaverseLoaderData | null>;
  execComponentLoader(item: HydrogenComponentData): Promise<HydrogenComponentData>;
  generateFallbackPage(message: string): HydrogenPageData;
}

type WeaverseClientArgs = HydrogenContext & {
  components: HydrogenComponent[];
  themeSchema: HydrogenThemeSchema;
  request: Request;
  cache: Cache;
};
```

## Methods

### fetchWithCache

Fetches data from an external API with configurable caching strategies.

```typescript
fetchWithCache<T>(url: string, options?: RequestInit & { strategy?: AllCacheOptions }): Promise<T>
```

**Parameters:**
- `url: string` - The endpoint URL
- `options?: RequestInit & { strategy?: AllCacheOptions }` - Cache and fetch configuration
  - `strategy` - Caching strategy with options like `maxAge`, `staleWhileRevalidate`, etc.
  - Other standard `fetch` options (`headers`, `method`, etc.)

**Returns:**
- `Promise<T>` - A promise that resolves with the fetched data

**Example:**

```typescript
// In a component loader
export async function loader({ data, weaverse }: ComponentLoaderArgs) {
  const apiUrl = 'https://api.example.com/products';
  
  const products = await weaverse.fetchWithCache(apiUrl, {
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`
    },
    cache: {
      maxAge: 60, // Cache for 60 seconds
      staleWhileRevalidate: 600 // Allow stale content for 10 minutes while revalidating
    }
  });
  
  return { products };
}
```

Refer to the [Data Fetching and Caching guide](/docs/guides/fetching-and-caching#fetching-data-from-external-apis) for more details.

### loadThemeSettings

Loads the global theme settings for the current Weaverse project.

```typescript
loadThemeSettings(strategy?: AllCacheOptions): Promise<HydrogenThemeSettings>
```

**Parameters:**
- `strategy?: AllCacheOptions` - Optional caching strategy for the theme settings request

**Returns:**
- `Promise<HydrogenThemeSettings>` - The theme settings object

**Example:**

```typescript
// In a route loader
export async function loader({ context }: LoaderFunctionArgs) {
  const { weaverse } = context;
  const themeSettings = await weaverse.loadThemeSettings();
  
  return json({
    themeSettings,
    // other data
  });
}
```

### loadPage

Loads a page's data from Weaverse, including running component loaders.

```typescript
loadPage(params?: {
  type?: PageType,
  locale?: string,
  handle?: string,
  strategy?: AllCacheOptions
}): Promise<WeaverseLoaderData | null>
```

**Parameters:**
- `params` - Object containing:
  - `type?: PageType` - Type of page ('INDEX', 'PRODUCT', etc.)
  - `locale?: string` - Locale for the page
  - `handle?: string` - Handle/slug for the page
  - `strategy?: AllCacheOptions` - Caching strategy

**Returns:**
- `Promise<WeaverseLoaderData | null>` - Page data object or null if not found

**Example:**

```typescript
// In a route loader
export async function loader({ context, request, params }: LoaderFunctionArgs) {
  const { weaverse } = context;
  
  const pageData = await weaverse.loadPage({
    type: 'PRODUCT',
    handle: params.handle,
    strategy: {
      maxAge: 60,
      staleWhileRevalidate: 600
    }
  });
  
  if (!pageData) {
    throw new Response('Page not found', { status: 404 });
  }
  
  return json({
    weaverseData: pageData,
    // other data
  });
}
```

### execComponentLoader

Executes a component's loader function to fetch its data.

```typescript
execComponentLoader(item: HydrogenComponentData): Promise<HydrogenComponentData>
```

**Parameters:**
- `item: HydrogenComponentData` - Component data object

**Returns:**
- `Promise<HydrogenComponentData>` - Component data with loader data added

**Note:** This method is primarily used internally by `loadPage` to process component loaders.

### generateFallbackPage

Generates a fallback page when the requested page data isn't available.

```typescript
generateFallbackPage(message: string): HydrogenPageData
```

**Parameters:**
- `message: string` - Message to display on the fallback page

**Returns:**
- `HydrogenPageData` - A basic page data object with the message

## Related

- [useWeaverse](/docs/api/use-weaverse) - Hook for accessing Weaverse instance client-side
- [Data Fetching and Caching](/docs/guides/fetching-and-caching) - Advanced guide on data fetching
