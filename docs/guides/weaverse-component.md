---
title: Weaverse Hydrogen Component
description: Weaverse Components are the foundational elements of your theme.
publishedAt: 11-20-2023
updatedAt: 11-20-2023
order: 3
---


Anatomy
-------

A Weaverse Component file typically comprises these parts:

1. **Component Definition**: Where the markup of the component is crafted.

2. **Type Definitions**: The contract to which the component must adhere, thanks to TypeScript 💚.

3. **Component Schema**: Configurations ensuring smooth interaction with Weaverse Studio.

4. **Loaders**: Mechanisms tasked with data retrieval.

An abbreviated glance at each part:

```tsx
import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef } from 'react';

type MyComponentData = {
  heading: string
  // More type definitions...
};

type MyComponentProps = HydrogenComponentProps<
        Awaited<ReturnType<typeof loader>>
> &
        MyComponentData;

let MyComponent = forwardRef<HTMLElement, MyComponentProps>((props, ref) => {
  let { heading, loaderData, ...rest } = props;
  // More component logic...

  return (
          <section ref={ref} {...rest}>
            {/*    Component markup...    */}
          </section>
  );
});

export let loader = async (args: ComponentLoaderArgs<MyComponentData>) => {
  // Data fetching logic, the code will be run on the server-side ...
};

export let schema: HydrogenComponentSchema = {
  type: 'unique-type-string',
  title: 'My Component',
  // More schema definitions...
};

export default MyComponent
```

Guides
------

#### Defining The Component

The visual representation of your component comes to life in this step. Here are a few key principles to note:

1. Always use **`forwardRef`** to define your component.

2. Ensure the component accepts and forwards both **`ref`** and the rest (**`...rest`**) of the props. This guarantees
   proper rendering and interaction within **Weaverse Studio**.

Example:

```tsx
let MyComponent = forwardRef<HTMLElement, MyComponentProps>((props, ref) => {
  let { loaderData, ...rest } = props;
  return <section ref={ref} {...rest} />;
});

export default MyComponent
```

#### Registering the Component

Remember to include your component in the main components export. This allows it to be recognized and usable within *
*Weaverse Studio**:

```tsx
// <root>/app/weaverse/components.ts

import type { HydrogenComponent } from '@weaverse/hydrogen';
import * as MySectionComponent from '~/sections/my-comp';

export let components: HydrogenComponent[] = [
  // ... more components
  MySectionComponent,
];
```

#### Defining Types

Types enhance the predictability of your component. Once defined, you can utilize these types in your component,
ensuring expected data shapes and enhancing stability.

Example:

```tsx
import type { HydrogenComponentProps } from '@weaverse/hydrogen';

type MyComponentData = {
  heading: string;
  height: number;
  // More type definitions...
};

type MyComponentProps = HydrogenComponentProps & MyComponentData;

let MyComponent = forwardRef<HTMLElement, MyComponentProps>((props, ref) => {
  // Get the data from props
  let { heading, height, ...rest } = props;

  return <section ref={ref} {...rest} />;
});
```

#### Defining Schema

The schema is an object that assists in determining how your component is presented and interacted with within *
*Weaverse Studio**:

```tsx
import type { HydrogenComponentSchema } from '@weaverse/hydrogen';

export let schema: HydrogenComponentSchema = {
  type: 'unique-type-string',
  title: 'Component Name',
  inspector: [
    // Inspector Configurations...
  ],
  toolbar: ['general-settings', ['duplicate', 'delete']],
};
```

For further details, delve into
the [Component Schema article](/docs/guides/component-schema).

#### Input Settings in Schema

The `inspector` key within your schema provides configurations to allow non-developers to modify your component within *
*Weaverse Studio**:

```txt
{
  inspector: [
    {
      group: 'Hero',
      inputs: [
        {
          type: 'select',
          name: 'height',
          label: 'Height',
          configs: {
            options: [
              { label: 'Auto', value: 'auto' },
              { label: 'Fullscreen', value: 'full' },
            ],
          },
          defaultValue: 'auto',
        },
        // More input settings...
      ],
    },
  ]
}
```

Explore the crafting of settings in
the [Input Settings article](/docs/guides/input-settings).

#### The Power of Loader Function

Component's `loader` function have the unique ability to run on the **server-side** 😎, a standout feature in **Weaverse
**, allowing your components to dynamically respond to data:

```tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen';

export let loader = async (args: ComponentLoaderArgs<MyComponentData>) => {
  let { weaverse, data } = args;

  // Data fetching logic...

  return {
    // ... loader data
  }
};
```

Unlock the potential of loaders with
the [Data Fetching & Caching article](/docs/guides/fetching-and-caching).

Conclusion
----------

Components, with their multifaceted capabilities, are vital in crafting a powerful, efficient, and user-friendly theme
on Weaverse.

To dive deeper into how component schemas work, check out our next article
on [Component Schema](/docs/guides/component-schema).