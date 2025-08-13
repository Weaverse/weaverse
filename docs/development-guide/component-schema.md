---
title: Component Schema
description: The blueprint of a Weaverse component.
publishedAt: November 20, 2023
updatedAt: April 21, 2025
order: 4
published: true
---

# Component Schema: The Complete Guide

## Introduction

In the Weaverse ecosystem, a component's schema is the critical link between code and the visual editor. The schema defines how components appear in the Weaverse Studio, what customization options are available, and how components interact with each other. Think of it as both a blueprint and an interface that empowers developers and merchants alike.

### Component Registration Method

Weaverse components are registered using static exports and configuration.

**Static Export Pattern**

```tsx
// components.ts
import type { HydrogenComponent } from '@weaverse/hydrogen';
import * as RelatedProducts from './sections/related-products';

export let components: HydrogenComponent[] = [
  RelatedProducts,
  // Other components...
];
```

Each section component should be structured like this:

```tsx
// sections/related-products.tsx
import { forwardRef } from 'react';
import { createSchema } from '@weaverse/hydrogen';
import { Section } from '~/components/section';

let RelatedProducts = forwardRef<HTMLElement, RelatedProductsProps>(
  (props, ref) => {
    // Component implementation
    return <Section ref={ref} {...props} />;
  }
);

export default RelatedProducts;

export let schema = createSchema({
  type: 'related-products',
  title: 'Related products',
  limit: 1,
  enabledOn: {
    pages: ['PRODUCT'],
  },
  settings: [
    {
      group: 'Layout',
      inputs: layoutInputs,
    },
  ],
  presets: {
    gap: 32,
    content: 'You may also like',
  },
});
```

This pattern centralizes component registration in one file and makes it easier to manage and maintain components.

## The createSchema() Function

Weaverse provides the `createSchema()` function as the modern, recommended way to define component schemas. This function offers several advantages over the traditional manual type definition approach:

### Why Use createSchema()?

1. **Runtime Validation**: Validates your schema configuration at build time using Zod, catching errors before they reach production
2. **Type Safety**: Provides excellent TypeScript inference and autocompletion
3. **Consistent Standards**: Ensures all schemas follow the same validation rules
4. **Future-Proof**: Ready for new schema features and validation rules

### Basic Usage

```tsx
import { createSchema } from '@weaverse/hydrogen';

export let schema = createSchema({
  type: 'my-component',
  title: 'My Component',
  settings: [
    // Your settings configuration
  ],
});
```

The `createSchema()` function takes a schema object and returns a validated schema that Weaverse can use. If your schema has any validation errors, you'll get clear error messages at build time.

### Import Options

You can import `createSchema` from either package:

```tsx
// From @weaverse/hydrogen (recommended for Hydrogen projects)
import { createSchema } from '@weaverse/hydrogen';

// Or directly from @weaverse/schema (for advanced use cases)
import { createSchema } from '@weaverse/schema';
```

## Anatomy

The `HydrogenComponentSchema` acts as a comprehensive definition for your component, specifying everything from its appearance in the editor to its behavior within the theme. This schema-driven approach ensures consistency, predictability, and a seamless user experience.

### Core Schema Structure

The modern way to define component schemas is using the `createSchema()` function, which provides runtime validation and type safety:

```tsx
import { createSchema } from '@weaverse/hydrogen';

export let schema = createSchema({
  title: string
  type: string
  settings: InspectorGroup[]
  inspector?: InspectorGroup[] // Deprecated: use 'settings' instead
  childTypes?: string[]
  presets?: Omit<HydrogenComponentPresets, 'type'>
  limit?: number
  enabledOn?: {
    pages?: ('*' | PageType)[]
    groups?: ('*' | 'header' | 'footer' | 'body')[]
  }
});
```

The `createSchema()` function:
- **Validates your schema at build time** using Zod validation
- **Provides better TypeScript inference** and error messages
- **Catches configuration errors early** before they reach the editor
- **Ensures consistency** across all component schemas

> **⚠️ Migration Notice**: The `inspector` property has been deprecated in favor of `settings`. While `inspector` is still supported for backward compatibility, new components should use `settings`. The Weaverse system automatically handles both properties during the transition period.

Each property serves a specific purpose in defining how your component behaves in the Weaverse ecosystem. Let's explore each in detail.

## Essential Properties

### `title` and `type`

```tsx
title: string
type: string
```

#### `title`

The `title` property defines the human-readable name for your component. This name appears in the Weaverse Studio's **Page Outline** section and component browser, making it crucial for discoverability and usability.

**Best Practices:**
- Keep titles concise but descriptive (generally 1-3 words)
- Use Title Case for consistency
- Reflect the component's purpose or functionality
- Avoid technical jargon that merchants might not understand

![Page outline](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/tittle-and-type.webp?v=1743409496)

#### `type`

The `type` property serves as a unique identifier for your component within the Weaverse ecosystem. This property is used internally to differentiate between components and must be unique across your entire theme.

**Under the Hood:**
When components are registered with Weaverse, they're stored in a registry using this `type` as the key. The `WeaverseHydrogen.registerElement()` method uses this key to map components to their schemas and loaders.

**Best Practices:**
- Use kebab-case (e.g., `product-card`, `hero-banner`)
- Make it descriptive of the component's function
- Keep it concise but clear
- Ensure uniqueness across all components

**Example:**
```tsx
export let schema = createSchema({
  title: "Featured Collection",
  type: "featured-collection",
  // other properties...
});
```

### `settings`

```tsx
settings: InspectorGroup[]
```

The `settings` property defines what customization options are available to users in the Weaverse Studio. It's organized into groups that appear as collapsible sections in the editor interface.

> **Note**: This property was previously called `inspector` and that name is still supported for backward compatibility. However, new components should use `settings` as the canonical property name.

#### Settings Group Structure

```tsx
interface InspectorGroup {
  group: string
  inputs: (BasicInput | HeadingInput)[]
}
```

- **`group`**: A label that categorizes a set of related inputs. Common groups include "Content", "Style", "Settings", etc.

- **`inputs`**: An array of input configurations that determine the UI controls available for customization.

**Under the Hood:**
The `settings` property is used by the Weaverse Studio to generate the UI controls. When a user changes a value in the settings panel, the Weaverse Studio updates the component's data, which triggers a re-render with the new values.

The schema also influences data initialization. The `generateDataFromSchema` utility function extracts default values from your schema to create the initial state of a component when it's added to a page.

**Best Practices:**
- Organize inputs logically by grouping related controls
- Keep group names consistent across components
- Place frequently used settings in the most accessible groups
- Follow a consistent order (e.g., Content → Style → Settings → Advanced)

**Example:**
```tsx
export let schema = createSchema({
  // other properties...
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Featured Products"
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue: "Shop our most popular items"
        }
      ]
    },
    {
      group: "Style",
      inputs: [
        {
          type: "select",
          name: "textAlignment",
          label: "Text Alignment",
          defaultValue: "center",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" }
            ]
          }
        }
      ]
    }
  ]
});
```

For a complete reference on input types and configurations, refer to the [Input Settings guide](/docs/guides/input-settings).

## Component Relationships

### `childTypes`

```tsx
childTypes?: string[]
```

The `childTypes` property determines which components can be nested inside the current component. This creates a parent-child relationship that affects both the component hierarchy and the user interface in Weaverse Studio.

When a user tries to add a child component through the editor, only components with types listed in `childTypes` will be available as options. If `childTypes` is not specified, the component won't accept any children.

**Under the Hood:**
The Weaverse engine uses the `childTypes` array to filter the available components when a user tries to add a child component. This relationship also influences how data is structured and how components are rendered in the DOM.

**Best Practices:**
- Only include child types that make logical sense for your component
- Consider the layout and design implications of nested components
- Keep the list focused to avoid overwhelming users with too many options
- Ensure all specified child types exist in your component library

**Example:**
```tsx
export let schema = createSchema({
  title: "Product Grid",
  type: "product-grid",
  childTypes: ["product-card", "loading-indicator", "empty-state"],
  // other properties...
});
```

### `presets`

```tsx
presets?: Omit<HydrogenComponentPresets, 'type'>
```

The `presets` property defines the default configuration and child components when a component is first added to a page. This ensures a polished, ready-to-use experience for users and reduces setup time.

#### HydrogenComponentPresets Structure

```tsx
type HydrogenComponentPresets = {
  type: string
  children?: HydrogenComponentPresets[]
  [key: string]: any  // Additional properties mapped to input names
}
```

**Under the Hood:**
When a component is added to a page, the Weaverse engine uses the `presets` property to initialize the component's data. This includes creating any child components specified in the `children` array. The data is then passed to the component as props at render time.

**Best Practices:**
- Design presets with real-world usage in mind
- Include sensible defaults for all important properties
- Pre-configure child components for a complete experience
- Test presets in various contexts to ensure they're versatile

**Example:**
```tsx
export let schema = createSchema({
  // other properties...
  presets: {
    heading: "Featured Products",
    description: "Shop our most popular items this season",
    showViewAllButton: true,
    viewAllButtonText: 'View All Products',
    layout: 'grid',
    productsPerRow: 3,
    backgroundColor: '#f7f7f7',
    productLimit: 4,
    sortBy: 'BEST_SELLING',
    children: [
      { type: "product-card" },
      { type: "product-card" },
      { type: "product-card" },
      { type: "product-card" }
    ]
  }
});
```

## Component Limitations and Placement

### `limit`

```tsx
limit?: number
```

The `limit` property restricts how many instances of a component can exist within its parent container. If no parent exists, the limit applies to the entire page. This is useful for components that should appear only once or a few times for design or performance reasons.

**Under the Hood:**
When a user tries to add a component, the Weaverse Studio checks the current count of instances against the `limit` property. If the limit is reached, the component is disabled in the add component UI.

**Common Use Cases:**
- Limiting header/footer components to one per section
- Restricting promotional banners to prevent overwhelming users
- Controlling resource-intensive components for performance
- Maintaining design coherence by limiting competing elements

**Example:**
```tsx
export let schema = createSchema({
  title: "Store Announcement",
  type: "announcement-bar",
  limit: 1,  // Only one announcement bar allowed
  // other properties...
});
```

### `enabledOn`

```tsx
enabledOn?: {
  pages?: ('*' | PageType)[]
  groups?: ('*' | 'header' | 'footer' | 'body')[]
}
```

The `enabledOn` property controls where components can be used within a theme.

> **Note to users:** The `groups` feature for managing components in header/footer sections is not available yet. Currently, only the `pages` property is functional. The `groups` feature will be implemented in a future release.

#### Page Types

The `pages` array specifies which page types can include this component. Use `'*'` to allow the component on all page types.

```tsx
type PageType =
  | 'INDEX'
  | 'PRODUCT'
  | 'ALL_PRODUCTS'
  | 'COLLECTION'
  | 'COLLECTION_LIST'
  | 'PAGE'
  | 'BLOG'
  | 'ARTICLE'
  | 'CUSTOM'
```

## Data Flow and Component Lifecycle

Understanding how data flows through the component schema system is crucial for effective component development.

### Schema to Component Data Flow

1. **Schema Registration**: When you define a component's schema, you're creating a blueprint for both its UI representation and data structure.

2. **Data Initialization**: When a component is added to a page, the `generateDataFromSchema` utility extracts default values from your schema to create the initial data state.

3. **Preset Application**: If presets are defined, they're applied on top of the default schema values.

4. **User Customization**: When a user changes settings in the settings panel, those values are saved to the component's data.

5. **Component Rendering**: The component receives its data as props when rendered, allowing it to display the appropriate UI based on user customizations.

```tsx
// From WeaverseHydrogenItem constructor in WeaverseHydrogenRoot.tsx
constructor(initialData: HydrogenComponentData, weaverse: WeaverseHydrogen) {
  super(initialData, weaverse)
  let { data, ...rest } = initialData
  let schemaData = generateDataFromSchema(this.Element.schema)
  Object.assign(this._store, schemaData, data, rest)
}
```

### Dynamic Inputs with Conditions

The `condition` property in inputs allows you to create dynamic UIs that respond to user choices. The Weaverse engine supports two types of conditions:

1. **String-based conditions** using the format `bindingName.operator.value` (Deprecated)
2. **Function-based conditions** that can perform more complex logic (Recommended)

> **Note to users:** String-based conditions are deprecated. For new components, we strongly recommend using function-based conditions which offer more flexibility and better type safety.

```tsx
// Deprecated string-based condition (not recommended for new components)
{
  type: "text",
  name: "buttonText",
  label: "Button Text",
  condition: "showButton.eq.true"
}

// Recommended function-based condition
{
  type: "text",
  name: "buttonText",
  label: "Button Text",
  condition: (data) => data.showButton === true
}

// Full condition type definition
condition?: string | ((data: ElementData, weaverse: WeaverseHydrogen) => boolean)
```

Function-based conditions receive the component's current data and the Weaverse instance, allowing for more complex conditional logic that can reference multiple fields or perform calculations.

## Complete Example

Let's look at a comprehensive, real-world example of a component schema:

```tsx
import { createSchema } from '@weaverse/hydrogen'

export let schema = createSchema({
  title: 'Product Showcase',
  type: 'product-showcase',
  settings: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Featured Products'
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
          defaultValue: 'Shop our most popular items this season'
        },
        {
          type: 'switch',
          name: 'showViewAllButton',
          label: 'Show "View All" Button',
          defaultValue: true
        },
        {
          type: 'text',
          name: 'viewAllButtonText',
          label: 'Button Text',
          defaultValue: 'View All Products',
          condition: (data) => data.showViewAllButton === true
        }
      ]
    },
    {
      group: 'Style',
      inputs: [
        {
          type: 'select',
          name: 'layout',
          label: 'Layout Style',
          defaultValue: 'grid',
          configs: {
            options: [
              { value: 'grid', label: 'Grid' },
              { value: 'carousel', label: 'Carousel' },
              { value: 'featured', label: 'Featured' }
            ]
          }
        },
        {
          type: 'range',
          name: 'productsPerRow',
          label: 'Products Per Row',
          defaultValue: 3,
          condition: (data) => data.layout === 'grid',
          configs: {
            min: 2,
            max: 5,
            step: 1
          }
        },
        {
          type: 'color',
          name: 'backgroundColor',
          label: 'Background Color',
          defaultValue: '#ffffff'
        }
      ]
    },
    {
      group: 'Settings',
      inputs: [
        {
          type: 'collection',
          name: 'collection',
          label: 'Choose Collection',
          helpText: 'Products will be pulled from this collection'
        },
        {
          type: 'range',
          name: 'productLimit',
          label: 'Number of Products',
          defaultValue: 4,
          configs: {
            min: 2,
            max: 12,
            step: 1
          }
        },
        {
          type: 'select',
          name: 'sortBy',
          label: 'Sort Products By',
          defaultValue: 'BEST_SELLING',
          configs: {
            options: [
              { value: 'BEST_SELLING', label: 'Best Selling' },
              { value: 'CREATED_AT', label: 'Newest First' },
              { value: 'PRICE', label: 'Price: Low to High' },
              { value: 'PRICE_DESC', label: 'Price: High to Low' }
            ]
          }
        },
        {
          type: 'switch',
          name: 'shouldRevalidate',
          label: 'Refresh Data on Change',
          defaultValue: false,
          helpText: 'When enabled, changing settings will trigger a new data fetch'
        }
      ]
    }
  ],
  childTypes: ['product-card', 'loading-indicator', 'empty-state'],
  presets: {
    heading: 'Featured Products',
    description: 'Shop our most popular items this season',
    showViewAllButton: true,
    viewAllButtonText: 'View All Products',
    layout: 'grid',
    productsPerRow: 3,
    backgroundColor: '#f7f7f7',
    productLimit: 4,
    sortBy: 'BEST_SELLING',
    children: [
      { type: 'product-card' },
      { type: 'product-card' },
      { type: 'product-card' },
      { type: 'product-card' }
    ]
  },
  limit: 3,
  enabledOn: {
    pages: ['INDEX', 'COLLECTION', 'PRODUCT']
  }
});
```

## Advanced Features

### Data Revalidation

The `shouldRevalidate` property on input settings allows you to trigger data reloading when certain inputs change. This is useful for inputs that affect the data fetched by a component's loader function.

```tsx
{
  type: 'collection',
  name: 'collection',
  label: 'Collection',
  shouldRevalidate: true  // Will trigger data refetch when changed
}
```

### Custom Heading Inputs

The schema system supports special heading inputs that don't represent data, but help organize the settings UI with section titles.

```tsx
// HeadingInput type from source code
export type HeadingInput = {
  type: 'heading'
  label: string
  [key: string]: any
}
```

**Example:**
```tsx
{
  type: 'heading',
  label: 'Typography Settings'
}
```

## Common Patterns and Best Practices

### Organizing Settings Groups

A consistent approach to settings groups improves usability:

1. **Content**: Text, images, and other primary content
2. **Style**: Visual presentation, colors, typography, layouts
3. **Settings**: Configuration options, functional settings
4. **Advanced**: Technical options, performance settings

### Conditional Logic

Use the `condition` property in inputs to create dynamic UI that responds to user choices:

```tsx
{
  type: 'select',
  name: 'imageSource',
  label: 'Image Source',
  defaultValue: 'upload',
  configs: {
    options: [
      { value: 'upload', label: 'Upload Image' },
      { value: 'product', label: 'Product Image' },
      { value: 'collection', label: 'Collection Image' }
    ]
  }
},
{
  type: 'image',
  name: 'customImage',
  label: 'Custom Image',
  condition: (data) => data.imageSource === 'upload'
},
{
  type: 'product',
  name: 'selectedProduct',
  label: 'Select Product',
  condition: (data) => data.imageSource === 'product'
},
{
  type: 'collection',
  name: 'selectedCollection',
  label: 'Select Collection',
  condition: (data) => data.imageSource === 'collection'
}
```

You can also create more complex conditions that combine multiple fields:

```tsx
{
  type: 'checkbox',
  name: 'enableAdvancedOptions',
  label: 'Enable Advanced Options',
  defaultValue: false
},
{
  type: 'range',
  name: 'maxItems',
  label: 'Maximum Items to Display',
  defaultValue: 10,
  condition: (data) => data.enableAdvancedOptions === true && data.imageSource !== 'upload'
}
```

### Schema Composition

For complex components, consider decomposing schemas:

```tsx
// Common inputs used across multiple components
const typographyInputs = [
  {
    type: 'select',
    name: 'fontFamily',
    label: 'Font Family',
    // configs...
  },
  {
    type: 'range',
    name: 'fontSize',
    label: 'Font Size',
    // configs...
  }
];

export const schema: HydrogenComponentSchema = {
  // ...
  settings: [
    {
      group: 'Typography',
      inputs: typographyInputs
    },
    // other groups...
  ]
}
```

## Migration Guide

### Migration from Inspector to Settings

If you have existing components using the `inspector` property, here's how to migrate them:

#### 1. Simple Rename

```tsx
// Before (deprecated)
export const schema: HydrogenComponentSchema = {
  type: 'my-component',
  title: 'My Component',
  inspector: [
    {
      group: 'Content',
      inputs: [/* ... */]
    }
  ]
}

// After (recommended)
export let schema = createSchema({
  type: 'my-component',
  title: 'My Component',
  settings: [
    {
      group: 'Content',
      inputs: [/* ... */]
    }
  ]
});
```

### Migration to createSchema()

The modern approach uses the `createSchema()` function instead of manual type definitions:

#### 1. Update Imports

```tsx
// Before (old approach)
import type { HydrogenComponentSchema } from '@weaverse/hydrogen';

// After (new approach)
import { createSchema } from '@weaverse/hydrogen';
```

#### 2. Wrap Schema with createSchema()

```tsx
// Before (old approach)
export const schema: HydrogenComponentSchema = {
  type: 'my-component',
  title: 'My Component',
  // ... rest of schema
};

// After (new approach)
export let schema = createSchema({
  type: 'my-component',
  title: 'My Component',
  // ... rest of schema
});
```

**Benefits of the new approach:**
- ✅ **Runtime validation** catches errors early
- ✅ **Better TypeScript inference** and autocomplete
- ✅ **Consistent validation** across all schemas
- ✅ **Future-proof** for new schema features

#### 3. Gradual Migration

During the transition period, you can keep both properties. The system will use `settings` as the primary source and fall back to `inspector` if `settings` is not available:

```tsx
// Transition approach (will show deprecation warning)
export let schema = createSchema({
  type: 'my-component',
  title: 'My Component',
  settings: [
    {
      group: 'Content',
      inputs: [/* new inputs */]
    }
  ],
  inspector: [
    {
      group: 'Legacy',
      inputs: [/* legacy inputs for backward compatibility */]
    }
  ]
});
```

**Note**: When both properties exist, only `settings` will be used. The `inspector` property is ignored to prevent duplication.

## Troubleshooting

### Common Schema Issues

1. **Schema Validation Errors**: When using `createSchema()`, you may encounter validation errors at build time. These errors provide clear messages about what's wrong with your schema configuration. Common validation issues include:
   - Missing required fields (`title`, `type`)
   - Invalid input types
   - Malformed configuration objects

2. **Duplicate Type Error**: Each component must have a unique `type`. Check for duplicates across your entire theme.

3. **Missing Required Properties**: Ensure all required properties (`title`, `type`) are defined. The `createSchema()` function will catch these at build time.

4. **Invalid Input Types**: Verify that all input `type` values match those supported by Weaverse. The validation will show allowed types if you use an invalid one.

5. **Child Component Not Available**: If a child component doesn't appear in the editor, check that its type is included in the parent's `childTypes` array.

6. **Component Not Appearing on Specific Pages**: Verify that the `enabledOn.pages` array includes the intended page types.

7. **Data Not Refreshing**: For components with loaders, check if relevant inputs have `shouldRevalidate: true` set to trigger data refetching.

8. **Schema Changes Not Reflecting**: Remember that schema changes require a server restart to take effect in development mode.

9. **Deprecation Warnings**: If you see warnings about the `inspector` property, update your schema to use `settings` instead.

10. **Type Errors with createSchema()**: If you're getting TypeScript errors, ensure you're importing `createSchema` correctly and that your schema object matches the expected structure.

## Related Resources

- [Input Settings Guide](/docs/guides/input-settings): Detailed information on all available input types
- [Weaverse Component Guide](/docs/guides/weaverse-component): Comprehensive guide to creating components
- [Example Components](/docs/guides/example-components): Collection of sample components for reference

## Conclusion

The `HydrogenComponentSchema` is the foundation of your component's interaction with the Weaverse ecosystem. A well-designed schema creates an intuitive editing experience, ensures components are used appropriately, and provides the flexibility merchants need.

By understanding the properties and patterns described in this guide, you can create components that are both powerful for developers and accessible to merchants. Remember to use `settings` for new components and migrate existing `inspector` properties when convenient.
