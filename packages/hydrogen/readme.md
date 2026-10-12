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

## Image focal points

`WeaverseImage` supports optional metadata for each image input/usage:

```ts
import type { WeaverseImage } from '@weaverse/hydrogen'

let heroImage: WeaverseImage = {
  id: 'hero-image',
  url: '/hero.jpg',
  altText: 'A person holding a product',
  width: 1200,
  height: 800,
  previewSrc: '/hero-preview.jpg',
  focalPoint: { x: 0.8, y: 0.3 },
}
```

Coordinates are finite numbers from `0` to `1`, measured from the original
image's top-left corner. The example identifies a point 80% across and 30% down.
The same file can have different points in separate inputs; this metadata does
not change the Shopify file or generate a cropped asset. The type is also
available through `@weaverse/core` and `@weaverse/react`.

Themes must apply the metadata to their image renderer. For an image filling a
fixed frame with `object-fit: cover`, convert it to CSS percentages:

```tsx
function HeroImage({ image }: { image: WeaverseImage }) {
  let point = image.focalPoint

  return (
    <img
      src={image.url}
      alt={image.altText}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: point ? `${point.x * 100}% ${point.y * 100}%` : undefined,
      }}
    />
  )
}
```

Apply the style to the actual image element, including when using an image
component wrapper. A valid focal point takes precedence over the existing image
position; without it, preserve the theme's current position or default. Reset by
removing `focalPoint`, and discard the old point when selecting a different image.
The percentage position aligns the chosen image point with the same relative
position in its frame; it does not necessarily center the point or keep the
entire subject visible at every aspect ratio.

The SDK preserves image objects through page loading, component props, and theme
settings. It does not interpret these generic content objects as validated image
values. Studio must validate finite coordinates within `[0, 1]` before saving
editor input. `@weaverse/schema` validates an image input's
`defaultValue.focalPoint` when its authoring validators run; legacy string URLs
and image defaults without a focal point remain accepted. `createSchema` reports
authoring problems in development, while `parseSchema` rejects invalid schemas.
This does not validate arbitrary persisted data or component preset values.

Release the updated Schema package and the Core/React/Hydrogen package group
before consumers adopt this contract; update the usual dependency pins as part
of that release. The Studio UI is tracked in
[builder#3043](https://github.com/Weaverse/builder/issues/3043), and Pilot rendering
examples in [pilot#176](https://github.com/Weaverse/pilot/issues/176). Upgrading the
SDK alone does not add editor controls or change theme rendering.

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
