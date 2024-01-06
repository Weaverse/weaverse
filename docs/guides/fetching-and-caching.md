---
title: Data Fetching and Caching
description: Unveiling the intricacies of fetching data efficiently and caching strategies with Weaverse.
publishedAt: 10-11-2023
updatedAt: 10-11-2023
order: 7
published: true
---

Data Fetching
-------------

With Weaverse, fetching data **server-side** is straightforward. This ease-of-use is attributed to the **`weaverse`**
client which is already injected into
the [application's load context](https://weaverse.io/docs/guides/8321058-project-structure#base-files-explained). Let's
explore the mechanisms and available methods for data fetching.

#### Fetching Page Data

The primary method for fetching a Weaverse page is the **`weaverse.loadPage()`**. This function allows you to
dynamically load your page data in any route's `loader` function. For a comprehensive look into its usage, refer to the
guide
on [Rendering a Weaverse Page](/docs/guides/rendering-page#fetching-page-data).

#### Querying Storefront Data inside Weaverse's Component

Fetching storefront data within a **Weaverse component** is a core feature, and for this, you can rely on the *
*`storefront.query`** function (the **`storefront`** instance is nested within the **`weaverse`** client). This function
enables direct querying from [Shopify's Storefront API](https://shopify.dev/docs/api/storefront).

Let's delve a bit deeper:

* **Dynamic Content Queries**: One of the standout features is the ability to dynamically query content using the *
  *`data`** prop. This prop comes from the component's loader's arguments, allowing for content that responds to changes
  based on the component's data.

* **Typing with `ComponentLoaderArgs`**: You can pass types to **`ComponentLoaderArgs<T>`**, ensuring that you have
  access to correct data types within the component's loader function.

* **Accessing to `env` and `request`**: Sometimes, while crafting your queries or managing data, you might need more
  context about the environment or incoming requests. The **`weaverse`** client has got you covered; it also packs
  information about **`env`** and **`request`**, which you can utilize as required.

Here's a sample to give you an idea:

```tsx
import {
  ComponentLoaderArgs,
  getSelectedProductOptions,
  WeaverseProduct
} from '@weaverse/hydrogen';
import { ProductInfoQuery } from 'storefrontapi.generated';
import { PRODUCT_QUERY } from '~/data/queries';

type MyComponentData = {
  product: WeaverseProduct;
  // more data props...
};

// Component definition...

export let loader = async (args: ComponentLoaderArgs<MyComponentData>) => {
  // Getting `weaverse` client instance and component's `data` from component's loader function's arguments
  let { weaverse, data } = args;
  let { storefront, request, env } = weaverse;

  if (data.product) {
    return await storefront.query<ProductInfoQuery>(PRODUCT_QUERY, {
      variables: {
        // `product.handle` should be a `string` since `MyComponentData` type is passed to `ComponentLoaderArgs<T>`
        handle: data.product.handle,
        // Using `request` or `env` if needed, they are available as `weaverse` instance's properties
        selectedOptions: getSelectedProductOptions(request),
        language: storefront.i18n.language,
        country: storefront.i18n.country,
      }
    })
  }
  return null;
};
```

#### Fetching Data from External APIs

With Weaverse, you're not limited to fetching just storefront data. You can easily pull data from external APIs using
the **`weaverse.fetchWithCache`** method.

Here's a practical example inside a Weaverse's component:

```tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen';

type ExternalData = {
  // Type definition...
}

export let loader = async ({ weaverse }: ComponentLoaderArgs) => {
  let { fetchWithCache, env } = weaverse;
  let API = `https://external-api.endpoint`

  // The component's `props.loaderData` type will be `ExternalData`
  return await fetchWithCache<ExternalData>(API, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': env.POKEMON_API_KEY,
    },
  });
};
```

You can follow a similar approach in the route's loader function by accessing the **`weaverse`** instance from the app's
load context.

```tsx
import { json } from '@shopify/remix-oxygen';
import { type RouteLoaderArgs } from '@weaverse/hydrogen';

export async function loader({ context }: RouteLoaderArgs) {
  let { weaverse } = context;
  // Fetching external data with `weaverse.fetchWithCache` ...

  return json({
    // ... Route's data
  })
}
```

The **`fetchWithCache`** function takes in the following parameters:

1. **`url`** (required): The external API you want to fetch data from.

2. **`options`** (optional): An object that:

* Follows the same structure as the
  standard [JavaScript's fetch function options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options).

* Includes an additional **`strategy`** option introduced by Weaverse, giving you enhanced control over cache headers.

Caching
-------

Weaverse effectively integrates Hydrogen's caching strategies, ensuring that developers have the tools necessary for
optimal performance and up-to-date information delivery.

Here are the caching strategies Weaverse employs from Hydrogen:

| Caching Strategy    | Cache Control Header                               | Cache Duration |
|---------------------|----------------------------------------------------|----------------|
| **`CacheShort()`**  | public, max-age=1, stale-while-revalidate=9        | 10 seconds     |
| **`CacheLong()`**   | public, max-age=3600, stale-while-revalidate=82800 | 1 Day          |
| **`CacheNone()`**   | no-store                                           | No cache       |
| **`CacheCustom()`** | Define your own cache control header               | Custom         |

#### Default Caching Strategy

By default, Weaverse applies the **`CacheShort`** strategy to **`loadPage()`** and **`fetchWithCache()`** methods. If
you'd like to modify this behavior, you can do so with the following:

Inside Weaverse's component `loader`

```tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen';

export let loader = async ({ weaverse }: ComponentLoaderArgs) => {
  let { fetchWithCache, storefront } = weaverse;
  return await fetchWithCache(`https://external-api.endpoint`, {
    strategy: storefront.CacheLong(),
    // request init options...
  });
};
```

or inside Remix's route `loader`

```tsx
import { json } from '@shopify/remix-oxygen';
import { type RouteLoaderArgs } from '@weaverse/hydrogen';

export async function loader({ context }: RouteLoaderArgs) {
  let { weaverse, storefront } = context;

  return json({
    weaverseData: await weaverse.loadPage({
      strategy: storefront.CacheLong()
    }),
    // Additional page data...
  });
}
```

#### Using Custom Cache

For those situations where a custom caching strategy is required:

```tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen';

export let loader = async ({ weaverse }: ComponentLoaderArgs) => {
  let { fetchWithCache, storefront } = weaverse;
  return await fetchWithCache(`https://external-api.endpoint`, {
    strategy: storefront.CacheCustom({
      mode: 'must-revalidate, no-transform',
      maxAge: 30,
    }),
    // request init options...
  });
};
```

#### Custom Cache Properties

If you're looking to get a more fine-tuned caching experience, Weaverse provides a set of properties you can use. Here's
a quick rundown:

```tsx
interface AllCacheOptions {
  mode?: string;                   // Defines caching mode (e.g., "public", "private")
  maxAge?: number;                 // Maximum age of the cache in seconds
  staleWhileRevalidate?: number;   // Duration in which stale data can be served while revalidation is attempted
  sMaxAge?: number;                // Similar to maxAge, but for shared (e.g., CDN) caches
  staleIfError?: number;           // Duration in which stale data can be served if revalidation fails
}
```

For a deeper dive into each of these cache properties, consider
checking [Hydrogen's documentation on cache options](https://shopify.dev/docs/custom-storefronts/hydrogen/data-fetching/cache#cache-options).
This will provide a comprehensive understanding of how to best utilize them for your specific needs.