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
  the `createSchema()` function.
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

import { createWeaverseClient } from '~/weaverse/create-weaverse.server'

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
})
```

### Data Fetching and Rendering

Use the Weaverse Client to fetch data such as page content and global theme settings:

```typescript
// <root>/app/routes/($locale)._index.tsx

import { json } from '@shopify/remix-oxygen'
import { type RouteLoaderArgs } from '@weaverse/hydrogen'

export async function loader({ context }: RouteLoaderArgs) {
  let { weaverse } = context

  return json({
    // The key prop for a Weaverse page must always be `weaverseData`
    weaverseData: await weaverse.loadPage(),
    // Additional page data...
  })
}
```

Implement the `WeaverseHydrogenRoot` component to render the fetched content:

```jsx
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

// <root>/app/routes/($locale)._index.tsx

import { WeaverseContent } from '~/weaverse'

export default function Homepage() {
  return <WeaverseContent />
}
```

### Defining Component Schema

Define your component's schema to control its behavior and interactivity within Weaverse Studio:

```tsx
// app/sections/Hero.tsx
import { createSchema } from '@weaverse/hydrogen'

export type HeroProps = {
  heading: string
  description: string
}

export let schema = createSchema({
  type: 'hero',
  title: 'Hero Section',
  settings: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Welcome to our store'
        },
        {
          type: 'textarea',
          name: 'description', 
          label: 'Description',
          defaultValue: 'Discover amazing products'
        }
      ]
    }
  ]
});

export default function Hero({ heading, description }: HeroProps) {
  return (
    <section className="hero">
      <h1>{heading}</h1>
      <p>{description}</p>
    </section>
  )
}
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

### Multi-Project Architecture (v5.7.2+)

Dynamically route different requests to different Weaverse projects based on domain, subdomain, cookies, headers, or any custom logic.

#### Environment Variables Setup

```bash
WEAVERSE_PROJECT_ID=default-project-abc123           # Fallback project
WEAVERSE_PROJECT_SWEDEN=sweden-project-def456
WEAVERSE_PROJECT_FRANCE=france-project-ghi789
```

#### Use Case 1: Domain-Based Routing (Multi-Market)

Serve different content per country domain without changing any route files:

```typescript
// app/weaverse/create-weaverse.server.ts
import { WeaverseClient } from '@weaverse/hydrogen'

const PROJECT_MAP = {
  'mystore.se': process.env.WEAVERSE_PROJECT_SWEDEN!,
  'mystore.fr': process.env.WEAVERSE_PROJECT_FRANCE!,
  'mystore.de': process.env.WEAVERSE_PROJECT_GERMANY!,
}

export function createWeaverseClient(args) {
  return new WeaverseClient({
    ...args,
    components,
    themeSchema,
    projectId: () => {
      const host = new URL(args.request.url).hostname
      return PROJECT_MAP[host] || process.env.WEAVERSE_PROJECT_ID!
    }
  })
}

// Works automatically in all routes:
export async function loader({ context }: LoaderFunctionArgs) {
  const { weaverse } = context
  // Automatically loads from correct project based on domain
  const weaverseData = await weaverse.loadPage({ type: 'HOME' })
  return json({ weaverseData })
}
```

#### Use Case 2: Route-Level Overrides

Override the project for specific routes (e.g., campaign landing pages):

```typescript
// app/routes/campaigns.summer-sale.tsx
export async function loader({ context }: LoaderFunctionArgs) {
  const { weaverse } = context

  // Use special campaign project for this route only
  const weaverseData = await weaverse.loadPage({
    type: 'PAGE',
    handle: 'summer-sale',
    projectId: process.env.WEAVERSE_PROJECT_CAMPAIGN!
  })

  return json({ weaverseData })
}
```

#### Use Case 3: Cookie-Based A/B Testing

Dynamically select project based on user cookies:

```typescript
// app/weaverse/create-weaverse.server.ts
export function createWeaverseClient(args) {
  return new WeaverseClient({
    ...args,
    components,
    themeSchema,
    projectId: () => {
      const cookies = args.request.headers.get('Cookie')
      const experimentVariant = cookies?.includes('experiment=variant-b')

      return experimentVariant
        ? process.env.WEAVERSE_PROJECT_VARIANT_B!
        : process.env.WEAVERSE_PROJECT_ID!
    }
  })
}
```

## Contributing

Contributions to the `@weaverse/hydrogen` package are highly appreciated. Please refer to our contributing guidelines
for more details on how to contribute effectively.

## License

This package is created by The Weaverse Team ([https://weaverse.io](https://weaverse.io)) and is licensed under the MIT
License.