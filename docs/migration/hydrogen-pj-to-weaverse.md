---
title: Migrating Hydrogen Project to Weaverse
description: Enhance your Hydrogen project by integrating Weaverse SDKs and Theme Customizer.
publishedAt: 11-20-2023
updatedAt: 11-20-2023
order: 0
published: true
---

This guide focuses on integrating the Weaverse SDKs and Theme Customizer into your existing Hydrogen project, providing
detailed steps to enhance your theme with Weaverse’s powerful features.

Installing the Weaverse SDK
---------------------------

Begin by installing the Weaverse SDKs:

```shell
npm install @weaverse/hydrogen@latest
```

Adding the Weaverse Directory
-----------------------------

Create a **`weaverse`** directory within your Hydrogen app folder. This will house essential files to establish a
Weaverse Client Provider, register Section Components, and define theme schema settings.

```txt
📁 weaverse
├── 📄 components.ts
├── 📄 create-weaverse.server.ts
├── 📄 index.tsx
├── 📄 schema.server.ts
└── 📄 style.tsx
```

Simply copy the following files into your **`app/weaverse`** directory:

* [`components.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/components.ts)

* [`create-weaverse.server.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/create-weaverse.server.ts)

* [`index.tsx`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/index.tsx)

* [`schema.server.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/schema.server.ts)

* [`style.tsx`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/style.tsx)

Injecting Weaverse Client into App's Load Context
-------------------------------------------------

Modify your **`server.ts`** file to inject the weaverse client into the **`getLoadContext`** function as illustrated
below:

```tsx
// <root>/server.ts

import { createWeaverseClient } from '~/weaverse/create-weaverse.server';

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

Wrapping the app with `withWeaverse` HoC
----------------------------------------

Ensure your main application component is wrapped with the **`withWeaverse`** Higher-Order Component (HoC). Learn more
in the [withWeaverse article](/docs/api/with-weaverse).

```tsx
import { withWeaverse } from '@weaverse/hydrogen';

function App() {
  // Your component logic
}

export default withWeaverse(App);
```

Global Theme Settings
---------------------

Manage theme settings effortlessly by loading them server-side and accessing client-side via the **`useThemeSettings`**
hook. Discover more about this process in
the [Global Theme Settings article](/docs/guides/global-theme-settings).

Rendering Weaverse Pages
------------------------

Configure your routes to load Weaverse page data server-side and utilize the **`<WeaverseContent />`** component to
render pages, prioritizing Weaverse configurations and customizations.

```tsx
// <root>/app/routes/($locale)._index.tsx

import { json } from '@shopify/remix-oxygen';
import { type RouteLoaderArgs } from '@weaverse/hydrogen';

export async function loader({ context }: RouteLoaderArgs) {
  let { weaverse } = context;

  return json({
    // The key prop for a Weaverse page must always be `weaverseData`
    weaverseData: await weaverse.loadPage(),
    // Additional page data...
  });
}
```

Rendering Weaverse page:

```tsx
// <root>/app/routes/($locale)._index.tsx

import { WeaverseContent } from '~/weaverse';

export default function Homepage() {
  return <WeaverseContent />;
}
```

💡 **Key Takeaway**: While it's possible to render the **`<WeaverseContent />`** component alongside other components,
it's recommended to position the **`WeaverseContent`** at the topmost level of the route hierarchy. This ensures that
Weaverse's configurations and customizations are prioritized and rendered accurately throughout your project.

Creating the Section/Component
------------------------------

Structure your components and sections within the **`sections`** directory and register them in the
**`weaverse/components.ts`** file, maintaining organization and clarity in your project structure.

```tsx
let MyComponent = forwardRef<HTMLElement, MyComponentProps>((props, ref) => {
  let { loaderData, ...rest } = props;
  return <section ref={ref} {...rest} />;
});

export default MyComponent
```

Dive deeper into this topic in
the [Weaverse Component article](/docs/guides/weaverse-component).
