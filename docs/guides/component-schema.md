---
title: Component Schema
description: The blueprint of a Weaverse component.
publishedAt: 11-20-2023
updatedAt: 11-20-2023
order: 4
---

Anatomy
-------

In Weaverse, every component's behavior and interactivity within the Weaverse Studio is determined by its schema. This
schema, named **`HydrogenComponentSchema`**, acts as a blueprint for your component, ensuring a consistent and
user-friendly experience.

Before diving into the individual properties, let's get an overview of the full schema structure:

```tsx
interface HydrogenComponentSchema {
  title: string;
  type: string;
  inspector: InspectorGroup[];
  childTypes?: string[];
  presets?: Omit<HydrogenComponentPresets, 'type'>;
  limit?: number;
  enabledOn?: {
    pages?: ('*' | PageType)[];
    groups?: ('*' | 'header' | 'footer' | 'body')[];
  };
  toolbar?: (HydrogenToolbarAction | HydrogenToolbarAction[])[];
}
```

Properties
----------

With that in mind, let's dive deeper into its properties:

#### `title` and `type`

```tsx
title: string;
type: string;
```

* **`title`**: A user-friendly name for the component, displayed within the Weaverse Studio in the **Page Outline**
  section.

<img alt="title_attr_img" src="https://downloads.intercomcdn.com/i/o/852278015/5220dc968e21cc6c7e17453b/image.png" width="300"/>

* **`type`**: A _unique_ identifier for the component, ensuring differentiation between various components.

#### `inspector`

```tsx
inspector: InspectorGroup[]
```

An array of **`InspectorGroup`**, where each group organizes a set of inputs for the **Weaverse Studio Inspector**.

The **`InspectorGroup`** structure is:

```tsx
interface InspectorGroup {
  group: string;
  inputs: BasicInput[];
}
```

* **`group`**: A label categorizing a set of inputs.

* **`inputs`**: An array of input configurations. For an in-depth look into **`BasicInput`**, check out
  the [Input Settings article](/docs/guides/input-settings).

#### `childTypes`

```tsx
childTypes ? : string[]
```

This optional property lists the types of child components that can be nested within the parent component.

#### `presets`

```tsx
presets ? : Omit<HydrogenComponentPresets, 'type'>
```

This optional property defines default configurations for components, determining their initial appearance and behavior.

The structure for **`HydrogenComponentPresets`** is:

```tsx
type HydrogenComponentPresets = {
  type: string;
  children?: HydrogenComponentPresets[];
  [key: string]: any;
}
```

#### `limit`

```tsx
limit ? : number
```

This optional property limits the number of times this component can appear on a page.

#### `enabledOn`

```tsx
enabledOn ? : {
  pages? : ('*' | PageType)[];
  groups? : ('*' | 'header' | 'footer' | 'body')[];
}
```

Defines where the component can be used. The `PageType` can be values like `INDEX`, `PRODUCT`, `COLLECTION`, and more.

```tsx
type PageType =
        "INDEX"
        | "PRODUCT"
        | "ALL_PRODUCTS"
        | "COLLECTION"
        | "COLLECTION_LIST"
        | "PAGE"
        | "BLOG"
        | "ARTICLE"
        | "CUSTOM";
```

#### `toolbar`

```tsx
toolbar ? : (HydrogenToolbarAction | HydrogenToolbarAction[])[]
```

Determines the available actions (like duplicate, delete, general settings) for the component in the studio.

```tsx
type HydrogenToolbarAction =
        | 'general-settings'
        | 'settings-level-2'
        | 'duplicate'
        | 'delete';
```

Example
-------

To make all of this a bit more tangible, let's take a look at a real-world example of a component schema:

```tsx
import type { HydrogenComponentSchema } from '@weaverse/hydrogen';

export let schema: HydrogenComponentSchema = {
  title: 'Product Card',
  type: 'product-card',
  inspector: [
    {
      group: 'Settings',
      inputs: [] // Defining input settings
    }
  ],
  childTypes: ['image', 'product-title', 'price'],
  presets: {
    type: 'product-card',
    children: [
      { type: 'image' },
      { type: 'product-title' },
      { type: 'price' },
    ],
  },
  limit: 3,
  enabledOn: {
    pages: ['INDEX', 'PRODUCT', 'ALL_PRODUCTS'],
    groups: ['body'],
  },
  toolbar: ['general-settings', ['duplicate', 'delete']],
};
```

Remember, this is just an example, the complexity and properties of the schema can vary based on the component's
requirements.

Conclusion
----------

The **`HydrogenComponentSchema`** provides an extensive blueprint for your Weaverse components. By understanding its
structure and properties, developers can ensure a dynamic and consistent experience for users within the **Weaverse
Studio**.

For a detailed look into the intricacies of inputs and their configurations, check out
the [Input Settings article](/docs/guides/input-settings).