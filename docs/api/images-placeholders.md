---
title: IMAGES_PLACEHOLDERS
description: A collection of placeholder images for development in Weaverse Hydrogen themes.
publishedAt: April 24, 2025
updatedAt: April 24, 2025
order: 11
published: true
---

# IMAGES_PLACEHOLDERS

`IMAGES_PLACEHOLDERS` is a constant that provides a collection of placeholder image URLs for use during development in your Weaverse Hydrogen theme. These placeholders are useful for prototyping, default values, and testing before you have real content available.

## Import

```tsx
import { IMAGES_PLACEHOLDERS } from '@weaverse/hydrogen'
```

## Structure

`IMAGES_PLACEHOLDERS` is an object with predefined keys for common image use cases in e-commerce themes:

```typescript
const IMAGES_PLACEHOLDERS = {
  logo_white: string;
  logo_black: string;
  image: string;
  banner_1: string;
  banner_2: string;
  collection_1: string;
  collection_2: string;
  collection_3: string;
  collection_4: string;
  collection_5: string;
  collection_6: string;
  product_1: string;
  product_2: string;
  // ... more product placeholders (up to product_18)
}
```

## Usage

### As default values in a component schema

```tsx
import { createSchema, IMAGES_PLACEHOLDERS } from '@weaverse/hydrogen';

export let schema = createSchema({
  type: 'hero-section',
  title: 'Hero Section',
  settings: [
    {
      group: 'Image',
      inputs: [
        {
          type: 'image',
          name: 'backgroundImage',
          label: 'Background Image',
          defaultValue: IMAGES_PLACEHOLDERS.hero_1,
        },
      ],
    },
  ],
});
```

### In a component for fallback images

```tsx
import { IMAGES_PLACEHOLDERS } from '@weaverse/hydrogen'

export function ProductCard({ data }) {
  const { image = IMAGES_PLACEHOLDERS.product_1 } = data
  
  return (
    <div className="product-card">
      <img src={image} alt="Product" />
      {/* ... rest of component */}
    </div>
  )
}
```

### For populating demo data

```tsx
import { IMAGES_PLACEHOLDERS } from '@weaverse/hydrogen'

export function createDemoProducts() {
  return [
    {
      id: 'demo-1',
      title: 'Demo Product 1',
      image: IMAGES_PLACEHOLDERS.product_1,
      price: 19.99,
    },
    {
      id: 'demo-2',
      title: 'Demo Product 2',
      image: IMAGES_PLACEHOLDERS.product_2,
      price: 29.99,
    },
    // More demo products
  ]
}
```

## Available Placeholders

- **`logo_white`**: White version of a logo placeholder (600×200)
- **`logo_black`**: Black version of a logo placeholder (600×200)
- **`image`**: Generic image placeholder (1024×1024)
- **`banner_1`**, **`banner_2`**: Banner/lifestyle image placeholders (1800×900)
- **`collection_1`** through **`collection_6`**: Collection image placeholders for hats, shoes, glasses, lamps, bags, and watches (1024×1024)
- **`product_1`** through **`product_18`**: Various product image placeholders for watches, bags, shoes, lamps, glasses, and hats (1024×1024)

## Notes

- All placeholders are served from Shopify CDN for reliable performance
- The SVG placeholders are lightweight and load quickly
- These placeholders should be replaced with real content in production

## Related

- [HydrogenComponentSchema](/docs/api/types) - Component schema type definition
