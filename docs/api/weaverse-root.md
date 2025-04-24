---
title: WeaverseRoot
description: The core rendering component for Weaverse content in React-based applications.
publishedAt: April 24, 2025
updatedAt: April 24, 2025
order: 5
published: true
---

# WeaverseRoot

The `WeaverseRoot` component is the primary renderer for Weaverse content in React applications. It serves as the entry point for rendering dynamic, data-driven Weaverse components based on the provided Weaverse context.

## Import

```tsx
import { WeaverseRoot } from '@weaverse/hydrogen'
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `context` | `Weaverse` | The Weaverse instance containing the project data and component registry. |

## Type Definition

```typescript
interface WeaverseRootPropsType {
  context: Weaverse;
}

const WeaverseRoot: React.FC<WeaverseRootPropsType>;
```

## Usage

```tsx
import { WeaverseRoot, useWeaverse } from '@weaverse/hydrogen'

export function App() {
  const weaverse = useWeaverse()
  
  return (
    <div className="app-container">
      <Header />
      <main>
        <WeaverseRoot context={weaverse} />
      </main>
      <Footer />
    </div>
  )
}
```

## How It Works

The `WeaverseRoot` component:

1. Creates a React context provider that makes the Weaverse instance available throughout the component tree
2. Renders the root component from the Weaverse project data
3. Sets up the necessary DOM structure with data attributes for Weaverse Studio integration
4. Establishes the component tree based on parent-child relationships defined in the project data
5. Passes appropriate props and data to each component in the tree

## Rendering Process

1. The component subscribes to changes in the Weaverse instance using `useSyncExternalStore`
2. It renders a container element with appropriate Weaverse data attributes
3. It finds the root component ID from the Weaverse data
4. It recursively renders each component in the tree using internal `ItemInstance` and `ItemComponent` components
5. Each component receives its data and children components based on the Weaverse project structure

## Example: Full Page Structure

```tsx
import { WeaverseRoot } from '@weaverse/hydrogen'
import { useLoaderData } from '@remix-run/react'

export default function Page() {
  const { weaverseData } = useLoaderData()
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>My Weaverse App</title>
      </head>
      <body>
        <WeaverseRoot context={weaverseData} />
      </body>
    </html>
  )
}
```

## Notes

- Only one `WeaverseRoot` component should be used per page
- The component automatically handles the entire component tree rendering
- No need to manually render children - the component handles parent-child relationships
- The component adds necessary data attributes for Weaverse Studio integration
- Returns `null` if no valid Weaverse context or project ID is provided

## Related

- [useWeaverse](/docs/api/use-weaverse) - Hook to access the Weaverse instance
- [WeaverseHydrogenRoot](/docs/api/weaverse-hydrogen-root) - Hydrogen-specific wrapper around WeaverseRoot
- [useItemInstance](/docs/api/use-item-instance) - Access component instances in the tree
