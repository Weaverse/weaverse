# @weaverse/hydrogen

## Overview

`@weaverse/hydrogen` is a crucial package within the Weaverse ecosystem, designed to facilitate the integration of
Shopify Hydrogen and Remix projects with the Weaverse CMS. It leverages `@weaverse/react` for rendering content and
provides a client for easy setup and data fetching from Weaverse CMS.

## Key Features

- **Weaverse Client Integration**: Enables seamless integration with Weaverse CMS, allowing for efficient data fetching
  and rendering in Hydrogen/Remix projects.
- **Dynamic Data Fetching**: Fetch and render page data and global theme settings server-side, ensuring dynamic and
  consistent content delivery.
- **Component Registration and Rendering**: Register React components with Weaverse and render them using
  the `WeaverseHydrogenRoot` component.
- **Flexible Schema Definition**: Define behavior and interactivity of components within Weaverse Studio through
  the `HydrogenComponentSchema`.
- **Customizable Input Settings**: Specify configurations for merchant-customizable component settings in Weaverse
  Studio.

## Installation

```bash
npm install @weaverse/hydrogen
```

## Setup and Usage

### Weaverse Client Setup

Initialize the Weaverse Client to establish a connection between your Hydrogen project and Weaverse CMS:

```typescript
// <root>/server.ts

import {createWeaverseClient} from '~/weaverse/create-weaverse.server';

const handleRequest = createRequestHandler({
  // ...
  getLoadContext: () => ({
    // Injecting the Weaverse client into the loader context.
    weaverse: createWeaverseClient({
      storefront,
      request,
      env,
      cache,
      waitUntil,
    }),
    // ... more app context properties
  }),
});

```

### Data Fetching and Rendering

Use the Weaverse Client to fetch data such as page content and global theme settings:

```typescript
// <root>/app/routes/($locale)._index.tsx

import { json } from '@shopify/remix-oxygen';
import { type RouteLoaderArgs } from '@weaverse/hydrogen';

export async function loader({context}: RouteLoaderArgs) {
  let {weaverse} = context;

  return json({
    // The key prop for a Weaverse page must always be `weaverseData`
    weaverseData: await weaverse.loadPage(),
    // Additional page data...
  });
}

```

Implement the `WeaverseHydrogenRoot` component to render the fetched content:

```jsx
// <root>/app/weaverse/index.tsx

import {WeaverseHydrogenRoot} from '@weaverse/hydrogen';
import {GenericError} from '~/components/GenericError';
import {components} from './components';

export function WeaverseContent() {
  return (
    <WeaverseHydrogenRoot
      components={components}
      errorComponent={GenericError}
    />
  );
}


// <root>/app/routes/($locale)._index.tsx

import { WeaverseContent } from '~/weaverse';

export default function Homepage() {
  return <WeaverseContent />;
}

```

### Defining Component Schema

Define your component's schema to control its behavior and interactivity within Weaverse Studio:

```typescript
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

### Customizing Input Settings

Customize input settings for merchant-adjustable component configurations in Weaverse Studio:

```typescript
{
  type: "select",
  label: "Image aspect ratio",
  name: "imageAspectRatio",
  configs: {
    options: [
      { value: "auto", label: "Adapt to image" },
      { value: "1/1", label: "1/1" },
      { value: "3/4", label: "3/4" },
      { value: "4/3", label: "4/3" },
    ]
  },
  defaultValue: "auto"
}

```

## Contributing

Contributions to the `@weaverse/hydrogen` package are highly appreciated. Please refer to our contributing guidelines
for more details on how to contribute effectively.

## License

This package is created by The Weaverse Team ([https://weaverse.io](https://weaverse.io)) and is licensed under the MIT
License.

