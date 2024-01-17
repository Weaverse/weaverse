---
title: Project Structure
description: "Explore the core structure of a Weaverse Hydrogen theme."
publishedAt: November 20, 2023
updatedAt: January 17, 2024
order: 1
published: true
---

Basic Structure Overview
------------------------

Before getting into the finer details, let's get a top-level overview of the project:

```text data-line-numbers=false
🌳 <root>
├── 📁 app
│   ├── 📁 ...
│   ├── 📁 routes
│   ├── 📁 sections
│   ├── 📁 weaverse
│   ├── 📄 entry.client.tsx
│   ├── 📄 entry.server.tsx
│   └── 📄 root.tsx
├── 📁 dist
│   ├── 📁 client
│   └── 📁 worker
├── 📁 public
│   └── 📄 favicon.svg
├── 📄 .editorconfig
├── 📄 .env
├── 📄 package.json
├── 📄 remix.config.js
├── 📄 remix.env.d.ts
├── 📄 server.ts
├── 📄 sync-project.md
└── 📄 tailwind.config.js
└── 📄 ...
```

Base Files Explained
--------------------

* [`server.ts`](https://github.com/Weaverse/pilot/blob/main/server.ts): This is the main server entry point. Among other
  responsibilities, it injects the **`weaverseClient`** into the app load context, ensuring that Weaverse
  functionalities are available throughout your application.

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

* [`.env`](https://github.com/Weaverse/pilot/blob/main/.env): This file holds your project-specific environment
  variables. Always keep this file secure and never expose sensitive data. For a detailed guide on setting up and
  managing environment variables, refer to
  the [Environment Variables article](/docs/guides/environment-variables).

* [`tailwind.config.js`](https://github.com/Weaverse/pilot/blob/main/tailwind.config.js): This file configures *
  *TailwindCSS**, a utility-first CSS framework that developers love 💚. Using TailwindCSS, you can quickly design and
  customize your theme components.

* [`remix.env.d.ts`](https://github.com/Weaverse/pilot/blob/main/remix.env.d.ts): This **TypeScript** definition file is
  where we define global types, including environment variables and additions to the **Remix** loader context

 ```tsx
 // <root>/remix.env.d.ts

import type { WeaverseClient } from '@weaverse/hydrogen';

/**
 * Declare expected Env parameter in fetch handler.
 */
interface Env {
  SESSION_SECRET: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PRIVATE_STOREFRONT_API_TOKEN: string;
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_ID: string;
  /**
   * Include the Weaverse Project's ID - you'll find this in the Weaverse Editor under Project Settings.
   * And the optional Weaverse Host - which value is https://weaverse.io by default.
   */
  WEAVERSE_PROJECT_ID: string;
  WEAVERSE_HOST: string;
}

/**
 * Declare local additions to the Remix loader context.
 */
export interface AppLoadContext {
  waitUntil: ExecutionContext['waitUntil'];
  session: HydrogenSession;
  storefront: Storefront;
  cart: HydrogenCart;
  env: Env;
  // Include the Weaverse Client in the Remix loader context.
  weaverse: WeaverseClient;
}
 ```

* [`remix.config.js`](https://github.com/Weaverse/pilot/blob/main/remix.config.js): This configuration file is central
  to the operation of your **Remix** application. For a comprehensive understanding of its contents and purpose, refer
  to the [Remix documentation](https://remix.run/docs/en/main/file-conventions/remix-config).

* [`sync-project.md`](https://github.com/Weaverse/pilot/blob/main/sync-project.md): If you ever need to sync your
  project with the latest version of Pilot, this markdown file will guide you through the process.

Key Files and Directories within **`app`**
------------------------------------------

* [`root.tsx`](https://github.com/Weaverse/pilot/blob/main/app/entry.client.tsx): This is the root route of any Remix
  application. Within this file, global theme settings are loaded and rendered. Dive deeper into how global theme
  settings are handled in
  the [Global Theme Settings article](/docs/guides/global-theme-settings).

* [`entry.server.tsx`](https://github.com/Weaverse/pilot/blob/main/app/entry.server.tsx): This is the server-side entry
  to your application. Not only does it handle the initial rendering of your app, but it also manages server-side
  functionalities like setting up a custom **Content Security Policy** (CSP). For more details on configuring and
  understanding CSP, refer to the [CSP article](/docs/guides/csp).

* [`/routes`](https://github.com/Weaverse/pilot/tree/main/app/routes): This directory contains your app's routes. Each
  file inside this directory becomes a page in your app that **Remix** will load and render. Learn about the intricate
  details of how Weaverse pages are loaded and rendered in
  the [Rendering a Page article](/docs/guides/rendering-page).

* [`/sections`](https://github.com/Weaverse/pilot/tree/main/app/sections): Here, you write the code for different
  sections of your theme. Once the section code is crafted, you also need to register the section. For a comprehensive
  understanding of section crafting and registration, refer to
  the [Weaverse Hydrogen Component article](/docs/guides/weaverse-component).

* [`/weaverse`](https://github.com/Weaverse/pilot/tree/main/app/weaverse):

```text data-line-numbers=false
📁 weaverse
├── 📄 components.ts
├── 📄 create-weaverse.server.ts
├── 📄 index.tsx
├── 📄 schema.server.ts
└── 📄 style.tsx
```

* [`components.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/components.ts): This file register all the
  Hydrogen components in your theme. Learn more about it
  in [Weaverse Hydrogen Component article](/docs/guides/weaverse-component).

* [`create-weaverse.server.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/create-weaverse.server.ts):
  This file is pivotal for integrating Weaverse's capabilities into your project. It exports the *
  *`createWeaverseClient`** function that sets up the Weaverse client.

```tsx
// <root>/app/weaverse/create-weaverse.server.ts

import { Storefront } from '@shopify/hydrogen';
import { I18nLocale, WeaverseClient } from '@weaverse/hydrogen';
import { countries } from '~/data/countries';
import { components } from '~/weaverse/components';
import { themeSchema } from '~/weaverse/schema.server';

type CreateWeaverseArgs = {
  storefront: Storefront<I18nLocale>;
  request: Request;
  env: Env;
  cache: Cache;
  waitUntil: ExecutionContext['waitUntil'];
};

export function createWeaverseClient(args: CreateWeaverseArgs) {
  return new WeaverseClient({
    ...args,
    countries,
    themeSchema,
    components,
  });
}
```

* [`index.tsx`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/index.tsx): This file export the main Weaverse
  content. Refer to the [Rendering a Page article](/docs/guides/rendering-page) to learn
  more.

* [`schema.server.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/schema.server.ts)
  and [`style.tsx`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/style.tsx): these files define the global
  theme schema and how you render them. See how global settings are handled in
  the [Global Theme Settings article](/docs/guides/global-theme-settings).

* * *

Next Steps
----------

Now that you're familiar with the project structure, it's crucial to understand how to set up and
manage [Environment Variables](/docs/guides/environment-variables).




