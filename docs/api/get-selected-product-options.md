---
title: getSelectedProductOptions
description: Utility function that extracts selected product options from URL search parameters for product variant selection.
publishedAt: October 10, 2023
updatedAt: April 24, 2025
order: 10
published: true
---

# getSelectedProductOptions

The `getSelectedProductOptions` utility extends [Shopify Hydrogen's utility of the same name](https://shopify.dev/docs/api/hydrogen/2025-01/utilities/getselectedproductoptions) to provide a cleaner implementation for Weaverse applications. It extracts customer-selected product options from URL search parameters, allowing you to fetch the correct product variant based on customer selections.

## Import

```tsx
import { getSelectedProductOptions } from '@weaverse/hydrogen'
```

## Type

```typescript
function getSelectedProductOptions(request: Request): SelectedOptionInput[]
```

## Parameters

- `request: Request` - The incoming request object from a Remix/Hydrogen loader function

## Returns

- `SelectedOptionInput[]` - An array of selected option objects with `name` and `value` properties that can be passed directly to Shopify's Storefront API

## Implementation Details

Weaverse's implementation enhances Shopify's utility by filtering out internal parameters that should not be treated as product options:

```tsx
export function getSelectedProductOptions(
  request: Request,
): SelectedOptionInput[] {
  // First calls Shopify's implementation
  let options = hydrogen_getSelectedProductOptions(request)
  
  // Then filters out Weaverse-specific parameters
  return options.filter(
    ({ name }) => name !== 'isDesignMode' && !name.startsWith('weaverse'),
  )
}
```

This ensures that Weaverse design mode parameters and other internal options don't interfere with product variant selection.

## Common Use Pattern

### In Product Page Loaders

This utility is typically used in a product page's loader function to fetch the correct product variant based on URL parameters:

```tsx
import { getSelectedProductOptions } from "@weaverse/hydrogen";
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import type { ProductQuery } from "storefront-api.generated";

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { productHandle: handle } = params;
  const { storefront } = context;
  
  // Extract selected options from URL search params
  const selectedOptions = getSelectedProductOptions(request);
  
  // Use selected options to fetch the correct product variant
  const { product } = await storefront.query<ProductQuery>(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });
  
  // Rest of your loader logic...
  return { product };
}
```

## How It Works

The function works in two steps:

1. It first leverages Shopify Hydrogen's implementation to extract search parameters from the request URL and convert them to the `SelectedOptionInput` format
2. It then filters the results to exclude any options named 'isDesignMode' or starting with 'weaverse', which are used internally by the Weaverse system

For example, a URL like `/products/t-shirt?option[Color]=Blue&option[Size]=XL&isDesignMode=true` would result in:

```json
[
  { "name": "Color", "value": "Blue" },
  { "name": "Size", "value": "XL" }
]
```

Note that the `isDesignMode` parameter has been automatically filtered out.

## When To Use

- When implementing product pages with variant selection
- When you need to fetch specific product variants based on URL parameters
- In Hydrogen loaders that require selected product options for Storefront API queries

## Related

- [Shopify Hydrogen's getSelectedProductOptions](https://shopify.dev/docs/api/hydrogen/2025-01/utilities/getselectedproductoptions) - Original implementation that this function extends
- [Shopify's Storefront API Product Variants](https://shopify.dev/docs/api/storefront/latest/objects/productvariant)
- [WeaverseHydrogenRoot](/docs/api/weaverse-hydrogen-root) - For rendering product content with the selected variant
