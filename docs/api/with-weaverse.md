---
title: withWeaverse
description: The withWeaverse HOC enhances your root component, allowing it to access Weaverse-specific properties and methods.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
order: 9
published: true
---

**`withWeaverse`** HOC is a crucial part of the architecture. It wraps the root component and any error boundaries to
ensure that Weaverse functionalities are available throughout the application.

## Usage

Implement **`withWeaverse`** in your root component and error boundary components to provide them with Weaverse
integration. This process allows the components to access the loaded Weaverse theme settings and other context-specific
data provided by Weaverse.

Here's a basic example of how to wrap your root component with **`withWeaverse`**:

```tsx
import { withWeaverse } from '@weaverse/hydrogen'

function App() {
  // Your component logic
}

export default withWeaverse(App)
```

Similarly, for an error boundary component:

```tsx
export const ErrorBoundary = withWeaverse(ErrorBoundaryComponent)
```

## How It Works

By wrapping a component with **`withWeaverse`**, the component gains access to the Weaverse context, which includes
theme settings, page configurations, and other essential data loaded via the Weaverse client. This allows for consistent
use of Weaverse features across the entire app.
