---
title: Rendering a Weaverse Page
description: Learn how to load and render Weaverse pages using optional parameters and the WeaverseContent component.
publishedAt: 10-11-2023
updatedAt: 10-11-2023
order: 6
published: true
---

Fetching Page Data
------------------

For dynamic and consistent rendering, Weaverse fetches page data server-side, primarily through a Remix route's
**[`loader`](https://remix.run/docs/en/main/route/loader)** function using the **`weaverse.loadPage()`** method.

```tsx
// <root>/app/routes/($locale)._index.tsx

import { json } from '@shopify/remix-oxygen';
import { type RouteLoaderArgs } from '@weaverse/hydrogen';

export async function loader({ context }: RouteLoaderArgs) {
  let { weaverse } = context;

  return json({
    // The key prop for a Weaverse page must always be `weaverseData`
    weaverseData: await weaverse.loadPage(),
    // Additional page data...
  });
}
```

The **`loadPage()`** function takes an optional object as its parameters:

```tsx
async function loadPage(params?: {
  strategy?: AllCacheOptions,
  type?: PageType,
  locale?: string,
  handle?: string,
}) {}
```

* **`strategy`**: Sets the caching strategy for the page data. Defaults to **`CacheShort()`**. Dive deeper into caching
  in the [Data Fetching and Caching](/docs/guides/fetching-and-caching) page.

* **`locale`**: Specifies the page's locale. Default: **`en-us`**.

* **`handle`**: Indicates the handle of the requested page. Default: **`/`**.

* **`type`**: Defines the type of the page to load. The supported types include:

* `INDEX` (Home page)

* `PRODUCT` (Product details page)

* `ALL_PRODUCTS` (All products page)

* `COLLECTION` (Collection details page)

* `COLLECTION_LIST` (All collections page)

* `PAGE` (Regular page)

* `BLOG` (Blog page)

* `ARTICLE` (Article details page)

* `CUSTOM` (Coming soon 🚧)

When no custom parameters are passed to **`context.weaverse.loadPage()`**, Weaverse smartly auto-detects the page type
based on the current route's request URL.

The mapping is similar to a native liquid theme:

| Page Type         | Example URL                                                                                                                                   | Remix's Route Pattern                                  |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------|
| `INDEX`           | [https://example.com/](https://example.com/)                                                                                                  | **`_index.tsx`**                                       |
| `ALL_PRODUCTS`    | [https://example.com/products](https://example.com/products) <br/> [https://example.com/collections/all](https://example.com/collections/all) | **`products._index.tsx`** or **`collections.all.tsx`** |
| `PRODUCT`         | [https://example.com/products/shirt](https://example.com/products/shirt)                                                                      | **`products.$productHandle.tsx`**                      |
| `COLLECTION_LIST` | [https://example.com/collections](https://example.com/collections)                                                                            | **`collections._index.tsx`**                           |
| `COLLECTION`      | [https://example.com/collections/men](https://example.com/collections/men)                                                                    | **`collections.$collectionHandle.tsx`**                |
| `PAGE`            | [https://example.com/page/about-us](https://example.com/page/about-us)                                                                        | **`pages.$pageHandle.tsx`**                            |
| `BLOG`            | [https://example.com/blogs/news](https://example.com/blogs/news)                                                                              | **`blogs.$blogHandle._index.tsx`**                     |
| `ARTICLE`         | [https://example.com/blogs/news/new-arrival](https://example.com/blogs/news/new-arrival)                                                      | **`blogs.$blogHandle.$articleHandle.tsx`**             |

#### Break Free from Static Routes

In a native liquid theme, routes are often rigid and pre-defined, limiting the developer's flexibility in presentation
and data flow. Weaverse shatters this limitation with flexible page loading & Remix's dynamic routing features! By
specifying the desired **`type`** parameter, you can load a particular page at _any_ route of your choice 😎.

**Example**:

Imagine you want to load a collection page, which traditionally resides under **`/collections/some-collection-handle`**.
With Weaverse, you can present this page at a unique URL, such as **`/featured-products`**. Here's a snippet to achieve
this:

```tsx
// <root>/app/routes/($locale).featured-products.tsx

import { json } from '@shopify/remix-oxygen';
import { type RouteLoaderArgs } from '@weaverse/hydrogen';

export async function loader(args: RouteLoaderArgs) {
  let { context } = args;
  return json({
    weaverseData: await context.weaverse.loadPage({ type: "COLLECTION" }),
    // Additional page data...
  });
}
```

Then the page will be available at this URL: https://example.com/featured-products

This freedom in routing & page loading not only enhances the user experience but also empowers developers to structure
content in a way that best serves their e-commerce objectives.

Using the `WeaverseContent` Component
-------------------------------------

Once you've loaded the desired content, the next step is rendering it on the front end. The **`WeaverseContent`**
component is designed for this purpose, ensuring your content is displayed correctly within the Weaverse ecosystem.

```tsx
// <root>/app/routes/($locale)._index.tsx

import { WeaverseContent } from '~/weaverse';

export default function Homepage() {
  return <WeaverseContent />;
}
```

The **`WeaverseContent`** component is essentially a wrapper around the **`WeaverseHydrogenRoot`** component.

Here's how it is typically structured:

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
