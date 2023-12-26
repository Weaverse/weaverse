---
title: useWeaverse
description: The useWeaverse hook allows components to access the Weaverse instance specific to each page.
publishedAt: 10-10-2023
updatedAt: 10-10-2023
order: 2
---

The **`useWeaverse`** hook allows components to access the Weaverse instance specific to each page, enabling the retrieval of page data, component instances, and configuration settings within a Weaverse Hydrogen theme.

Usage
-----

Import the hook from `@weaverse/hydrogen` package then call it within a React Component

```tsx
import { useWeaverse } from '@weaverse/hydrogen'

function MyComponent() {
  let { data, itemInstances, elementRegistry } = useWeaverse()

  // Example: Accessing specific component instance data
  let instance = itemInstances['uniqueComponentId']
  // ...

  return (
    // ...
  )
}
```