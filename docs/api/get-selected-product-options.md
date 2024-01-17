---
title: getSelectedProductOptions
description: The getSelectedProductOption returns the selected product options from the request's search parameters.
publishedAt: October 10, 2023
updatedAt: January 17, 2024
order: 4
published: true
---

In a Weaverse Hydrogen Theme, **`getSelectedProductOptions`** serves as an essential utility for capturing customer
selections on product pages. This function simplifies the process of extracting and handling user-selected product
variants.

Usage
-----

This utility is intended for **server-side** use, such as within a route's loader or a component's loader function, and
is specifically tailored for use on product pages.

```tsx
// <root>/app/routes/($locale).products.$productHandle.tsx

import { LoaderArgs } from '@shopify/remix-oxygen'
import { getSelectedProductOptions } from '@weaverse/hydrogen'

export async function loader({ params, request, context }: LoaderArgs) {
  let { shop, product } = await context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: params.productHandle,
        // Use the utility to get selected product options from the request
        selectedOptions: getSelectedProductOptions(request),
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language
      }
    })


  // Fetch and return the product data based on the selected options
  // ...
}
```

Return Value
------------

The **`getSelectedProductOptions`** utility returns an object where the keys are option names (such as "**Color**" or "
**Size**") and the values are the selected options by the customer as indicated in the request's search parameters.

Scope of Use
------------

This utility is specifically designed for use on the **product page only** within the Weaverse Hydrogen theme. It is
**NOT** intended for non-product pages as it relies on the context of a product and its selectable options.