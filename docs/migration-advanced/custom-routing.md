---
title: Custom Routing
description: Learn how to create custom URL structures for your Hydrogen storefront with Weaverse, mapping them to specific content types.
publishedAt: April 24, 2025
updatedAt: April 24, 2025
order: 2 # Assuming it comes after Custom Templates
published: true
---

# Custom Routing with Weaverse

This guide explains how to implement custom URL structures in your Shopify Hydrogen storefront using Weaverse, allowing you to move beyond the standard `/products/:handle`, `/collections/:handle`, or `/pages/:handle` paths provided by default.

## Overview

While Hydrogen and Remix provide powerful routing capabilities, you might want URLs that are more SEO-friendly, aligned with marketing campaigns, localized, or simply structured differently from Shopify's defaults. Examples include:

*   `/sale/:campaignName` (for a marketing landing page)
*   `/fr/produits/:productHandle` (for a localized product page)
*   `/lookbooks/:collectionHandle` (for a themed collection page)
*   `/guides/:pageHandle` (for content pages using Weaverse's "Custom Page" feature)

Weaverse enables this by decoupling the URL structure from the content rendering mechanism.

## Core Concept: `loadPage` Drives Content

The key principle is that the content Weaverse renders is determined by the parameters you pass to the `context.weaverse.loadPage()` function within your Remix route's `loader`, specifically the `type` and `handle` arguments.

-   **`type`**: Tells Weaverse *what kind* of content to load (e.g., `'PRODUCT'`, `'COLLECTION'`, `'PAGE'`). See [Rendering Weaverse Pages](/docs/guides/rendering-page#supported-page-types) for a full list of types.
-   **`handle`**: Tells Weaverse *which specific instance* of that content type to load (e.g., the handle of a specific product, collection, or Weaverse custom page).

Custom routing, therefore, involves:
1.  Creating a new Remix route file that matches your desired URL pattern.
2.  Implementing a `loader` function in that file.
3.  Inside the `loader`, extracting the necessary identifier (like a handle) from the URL parameters.
4.  Calling `context.weaverse.loadPage()` with the **explicit `type`** corresponding to the content you want to display and the extracted `handle`.

Weaverse then fetches the appropriate page data based on these parameters, regardless of the actual URL structure.

## Relationship to Custom Pages & Templates

-   **Custom Pages:** Custom Routing is often used to provide user-friendly URLs for [Custom Pages](/docs/advanced/custom-page) created in Weaverse. You'd create a custom route (e.g., `/guides/$handle.tsx`) and call `loadPage({ type: 'PAGE', handle })` in the loader.
-   **Custom Templates:** Custom Routing works seamlessly with [Custom Templates](/docs/advanced/custom-template). If a resource (like a product) fetched via a custom route has a custom template assigned, `loadPage` automatically uses it. You don't need extra logic in your custom route's loader for this.

---

## Implementation Steps

Let's walk through creating a custom route to display a product page at `/item/:productHandle` instead of the standard `/products/:productHandle`.

### Step 1: Create the Route File

Create a new file in your Hydrogen project at `app/routes/($locale).item.$productHandle.tsx`.

-   `($locale)`: Optional, includes standard localization if your project uses it.
-   `item`: This is our custom URL segment, replacing `products`.
-   `$productHandle`: This is the dynamic segment Remix captures from the URL (e.g., `classic-varsity-jacket`).

### Step 2: Implement the Loader Function

Inside `app/routes/($locale).item.$productHandle.tsx`, implement the `loader` function:

```tsx
// app/routes/($locale).item.$productHandle.tsx
import { json, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { getSeoMeta } from "@shopify/hydrogen";
import { WeaverseContent } from "~/weaverse";

// Import your product query (ensure it fetches necessary data)
import { PRODUCT_QUERY } from "~/graphql/queries"; // Example path
import { seoPayload } from "~/utils/seo.server"; // Example path

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  const { language, country } = context.storefront.i18n;

  // 1. Extract the handle from the custom route's parameters
  const { productHandle } = params;

  if (!productHandle) {
    throw new Response("Missing product handle", { status: 400 });
  }

  const { storefront, weaverse } = context;

  // 2. Fetch Weaverse page data AND necessary Shopify data in parallel
  try {
    const [weaverseData, shopifyProductData] = await Promise.all([
      // 3. Call loadPage with EXPLICIT type 'PRODUCT' and the extracted handle
      weaverse.loadPage({
        type: "PRODUCT", // <- Explicitly state the content type
        handle: productHandle,
      }),
      // Fetch the actual product data needed for SEO, analytics, etc.
      storefront.query(PRODUCT_QUERY, {
        variables: {
          handle: productHandle,
          country: country,
          language: language,
          // Ensure selectedOptions are handled if your query uses them
        },
      }),
      // Add other parallel fetches if needed (e.g., reviews)
    ]);

    // Handle product not found in Shopify
    if (!shopifyProductData?.product) {
      throw new Response("Product data not found", { status: 404 });
    }

    // Handle page not found in Weaverse (check for fallback or missing ID)
    // A missing Weaverse page might still be okay if you have fallback rendering,
    // but often indicates a configuration issue.
    if (!weaverseData?.page?.id || weaverseData.page.id.includes("fallback")) {
       console.warn(`Weaverse page data not found for product handle: ${productHandle} at custom route /item/${productHandle}. Verify configuration.`);
      // Decide if this should be a 404 or if you want to proceed.
      // Throwing 404 might be safer if Weaverse layout is essential.
      // throw new Response("Page layout not found", { status: 404 });
    }

    // 4. Prepare SEO data using the fetched Shopify product
    const seo = seoPayload.product({
      product: shopifyProductData.product,
      url: request.url, // Use the current request URL for SEO context
    });

    // 5. Return all data needed by the component
    return json({
      weaverseData,
      product: shopifyProductData.product,
      seo,
      // Add other data as needed
    });

  } catch (error) {
    console.error(`Error loading data for custom route /item/${productHandle}:`, error);
    if (error instanceof Response) {
      throw error; // Re-throw existing Response errors (like 404s)
    }
    throw new Response("Error loading page data", { status: 500 });
  }
}

// Standard meta function for SEO using the prepared seo object
export const meta = ({ data }: { data?: { seo: any } }) => {
  return getSeoMeta(data?.seo);
};
```

**Key Points in the Loader:**
-   **Explicit `type: "PRODUCT"`:** This is critical. It tells Weaverse to load the content configured for a product page, even though the URL is `/item/...`.
-   **Extract `productHandle`:** Get the handle from `params`.
-   **Fetch Shopify Data:** You still need to fetch the corresponding Shopify product data for SEO, potentially for component data binding (though Weaverse handles much of this), and analytics. Use `Promise.all` for efficiency.
-   **Error Handling:** Check for both missing Shopify data and missing/fallback Weaverse page data. Log warnings or throw errors as appropriate for your application's needs.

### Step 3: Render the Weaverse Content

The component itself remains simple, primarily rendering `<WeaverseContent />` which uses the `weaverseData` fetched in the loader.

```tsx
// app/routes/($locale).item.$productHandle.tsx (continued)

import { useLoaderData } from "@remix-run/react";
import { Analytics } from "@shopify/hydrogen"; // For analytics

export default function CustomProductRoute() {
  // Use optional chaining in case loader data is unexpectedly missing
  const { product, weaverseData } = useLoaderData<typeof loader>();

  // WeaverseContent will render the layout based on weaverseData
  // which corresponds to the PRODUCT type due to the loader config
  return (
    <>
      <WeaverseContent />
      {/* Optional: Add analytics specific to product view */}
      {product?.selectedVariant && (
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: product.selectedVariant?.price.amount || "0",
                vendor: product.vendor,
                variantId: product.selectedVariant?.id || "",
                variantTitle: product.selectedVariant?.title || "",
                quantity: 1,
              },
            ],
          }}
        />
      )}
    </>
  );
}
```

Now, visiting `/item/your-product-handle` will render the Weaverse product page associated with `your-product-handle`.

---

## More Examples

### Localized Collection Route

-   **Desired URL:** `/fr/collections-en-vedette/:collectionHandle`
-   **Route File:** `app/routes/($locale).collections-en-vedette.$collectionHandle.tsx`
-   **Loader `loadPage` Call:** `weaverse.loadPage({ type: 'COLLECTION', handle: params.collectionHandle })`
-   **Loader Shopify Data Fetch:** Query for the specific collection data using `params.collectionHandle`.

### Marketing Campaign Page (using Weaverse Custom Page)

-   **Assumption:** You created a "Custom Page" in Weaverse Studio with the handle `summer-sale-2025`.
-   **Desired URL:** `/promo/summer-sale-2025`
-   **Route File:** `app/routes/promo.$campaignHandle.tsx`
-   **Loader `loadPage` Call:** `weaverse.loadPage({ type: 'PAGE', handle: params.campaignHandle })`
-   **Loader Shopify Data Fetch:** Likely none needed unless the page displays specific dynamic products/collections queried separately.

---

## Important Considerations

-   **Choose the Correct `type`:** Always ensure the `type` parameter in `loadPage` matches the *kind* of content you intend to display (PRODUCT, COLLECTION, PAGE, BLOG, ARTICLE, etc.). Refer to the [Supported Page Types](/docs/guides/rendering-page#supported-page-types).
-   **Fetch Necessary Shopify Data:** If your custom route replaces a standard route (like product or collection), remember to fetch the corresponding Shopify data in your loader for SEO, analytics, or any components that might need it directly.
-   **Generating Links:** Linking to these custom routes from within your application (e.g., in navigation or product grids) will require using the correct path (`/item/...`, `/fr/collections-en-vedette/...`) instead of the default Shopify paths. You might need custom link-building logic or helper functions.
-   **SEO & Sitemaps:** Standard sitemap generation might not automatically include these custom routes. You may need to manually add them to your `sitemap.xml` logic. Ensure canonical URLs are correctly set (perhaps pointing to the standard Shopify URL if preferred, or self-referencing the custom URL if it's the primary one). Consult SEO best practices.

---

This approach provides significant flexibility in structuring your Hydrogen storefront's URLs while leveraging Weaverse for visual page building and content management.
