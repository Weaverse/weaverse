# @weaverse/next

Next.js App Router integration for Weaverse-powered Hydrogen storefronts.

This package lets a Next App Router storefront render Weaverse page data, run server-side section loaders, connect to Weaverse Studio, and refresh loader-backed Studio edits without depending on React Router.

It is the Next equivalent of the useful parts of `@weaverse/hydrogen`, but the app creates the request-scoped server client explicitly because Next does not inject a custom `context` object into every route loader.

## Current status

- Package status: alpha (`0.1.0-alpha.x`).
- Target runtime: Next App Router.
- Peer dependencies: `next >=14`, `react >=19`, `react-dom >=19`.
- Studio bridge: supported through the existing Studio bridge script plus Next-native runtime callbacks.
- Resource-picker revalidation: supported through per-item loader revalidation, not full-page `router.refresh()` on the happy path.

## Quick answers for the team

### 1. What is this package?

`@weaverse/next` is the Weaverse adapter for Next App Router storefronts. It provides:

- a server client that fetches Weaverse page/theme data from the Weaverse public API;
- a component registry and renderer for Weaverse page trees;
- hooks and provider equivalents for theme settings, page data, commerce context, and Weaverse runtime access;
- Studio script connection and runtime binding;
- a per-item loader revalidation route handler for resource-picker/live-preview edits.

### 2. Are `loadPage` / `loadThemeSettings` implemented or only typed?

They are implemented in `@weaverse/next/server`.

Use `createWeaverseNextServerClient()` to create a request-scoped client, then call:

- `weaverse.loadPage({ type: 'INDEX' | 'PRODUCT' | 'COLLECTION', handle? })`
- `weaverse.loadThemeSettings()`

Implementation lives in [`src/server/server-client.ts`](./src/server/server-client.ts). It:

- resolves `projectId` from Studio query params, config, or env;
- POSTs page requests to `/api/public/project`;
- POSTs theme settings requests to `/api/public/project_configs`;
- runs registered component loaders and attaches `loaderData`;
- forces `no-store` for design/revision preview reads;
- returns safe client-facing configs including `requestInfo`.

### 3. Is the POC bootstrapped from Shopify's Hydrogen preview docs?

Yes. The POC started as a Next App Router app plus Shopify Hydrogen preview setup:

```bash
npx create-next-app@latest weaverse-hydrogen-next-poc --ts --app --eslint --tailwind --no-src-dir --import-alias "@/*" --use-npm --yes
npx @shopify/hydrogen@preview setup
```

See the POC findings doc:

- https://github.com/Weaverse/weaverse-hydrogen-next-poc/blob/main/findings.md

### 4. Where does the POC load page + Weaverse data?

Reference POC files:

- Server client helper: https://github.com/Weaverse/weaverse-hydrogen-next-poc/blob/main/app/weaverse-next/server.ts
- Home route load: https://github.com/Weaverse/weaverse-hydrogen-next-poc/blob/main/app/page.tsx
- Product route load: https://github.com/Weaverse/weaverse-hydrogen-next-poc/blob/main/app/products/%5Bhandle%5D/page.tsx
- Collection route load: https://github.com/Weaverse/weaverse-hydrogen-next-poc/blob/main/app/collections/%5Bhandle%5D/page.tsx
- Client wrapper/renderer: https://github.com/Weaverse/weaverse-hydrogen-next-poc/blob/main/app/weaverse-next/wrapper.tsx
- Studio script connector: https://github.com/Weaverse/weaverse-hydrogen-next-poc/blob/main/app/weaverse-next/studio-connect.tsx
- Per-item revalidation route: https://github.com/Weaverse/weaverse-hydrogen-next-poc/blob/main/app/api/weaverse/revalidate/route.ts

The route pattern is:

```tsx
// app/page.tsx
import { loadWeaverseHomePage } from './weaverse-next/server'
import { WeaverseHome } from './weaverse-next/wrapper'

export default async function Home(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  let weaverseData = await loadWeaverseHomePage(props.searchParams)
  return <WeaverseHome data={weaverseData} />
}
```

### 5. Is there a global app load context like Hydrogen/Pilot?

Not automatically from the framework.

Hydrogen/React Router injects `context.weaverse` into route loaders. Next App Router does not have that loader-context mechanism. The Next equivalent is a small app-owned server helper that creates the request-scoped Weaverse server client at the route boundary.

In the POC that helper is `getWeaverseServerClient(...)` in `app/weaverse-next/server.ts`. It plays the same role as Hydrogen's global load context, but explicitly:

```ts
let weaverse = await getWeaverseServerClient(searchParams, pathname)
let page = await weaverse.loadPage({ type: 'INDEX' })
```

So the mental model is still `weaverse.loadPage(...)`; only the injection mechanism changes.

## Entrypoints

| Import | Use in | Purpose |
| --- | --- | --- |
| `@weaverse/next` | Client and shared code | Component registry, provider, renderer, hooks, Studio runtime/bind components, schema re-exports. |
| `@weaverse/next/server` | Server only | Real Weaverse API client, config resolution, page URL normalization, per-item revalidation route handler. |

The server API lives under `@weaverse/next/server` so client components can safely import the root entry without pulling server-only fetch code into the client bundle.

## Package structure

```text
packages/next/src/
  index.ts                         # root public exports
  server.ts                        # server public exports
  client.ts                        # createWeaverseNextClient for client/runtime state
  loader.ts                        # runWeaverseComponentLoaders
  registry.ts                      # component registration for @weaverse/react
  renderer.tsx                     # WeaverseNextRenderer
  provider.tsx                     # WeaverseNextProvider
  hooks.ts                         # Next adapter hooks
  runtime.ts                       # WeaverseNextRuntime + Studio binding
  studio-connect.tsx               # root Studio script loader
  studio-bridge.tsx                # page-level Studio runtime binder
  studio-router.ts                 # Next router -> Studio internal callbacks
  use-weaverse-next-studio.tsx     # Next-native Studio binder using next/navigation
  revalidate-item.ts               # client per-item loader revalidation
  request-info.ts                  # Studio-compatible request info
  theme-settings-store.ts          # Studio-compatible theme settings store
  types.ts                         # shared public types
  server/
    server-client.ts               # createWeaverseNextServerClient
    revalidate-handler.ts          # createWeaverseNextRevalidateHandler
    configs.ts                     # host/api/env/design-mode config resolution
    normalize-page-url.ts          # stable page URL normalization
```

## Root API (`@weaverse/next`)

Main exports:

- `createWeaverseNextClient(config)` — client/runtime state holder. It registers client render components and carries request/page/theme context.
- `WeaverseNextProvider` — React provider for the client runtime.
- `WeaverseNextRenderer` — renders a Weaverse page tree into React and binds the Studio runtime.
- `runWeaverseComponentLoaders(args)` — walks a page tree and runs component `loader` functions server-side.
- `WeaverseNextStudioConnect` — root client component that loads the Studio bridge script in design/preview contexts.
- `WeaverseNextStudio` / `WeaverseNextStudioBridge` — Next-native page-level Studio runtime binding.
- `createWeaverseNextRuntime` / `bindWeaverseNextStudioRuntime` — lower-level runtime helpers.
- `revalidateWeaverseNextItem()` — client-side per-item revalidation helper wired by `WeaverseNextStudio`.
- Hooks: `useThemeSettings`, `useWeaversePageData`, `useWeaverseRootData`, `useWeaverseCommerce`.
- Re-exported migration helpers from `@weaverse/react`: `useWeaverse`, `useParentInstance`, `useItemInstance`, `useChildInstances`.
- `createSchema` and schema types from `@weaverse/schema`.

## Server API (`@weaverse/next/server`)

Main exports:

- `createWeaverseNextServerClient(config)` — request-scoped server client.
- `createWeaverseNextRevalidateHandler(config)` — route-handler factory for Studio per-item loader revalidation.
- `getWeaverseNextConfigs(...)` — config/env/query resolution.
- `normalizeNextPageUrl(...)` / `resolveRequestUrl(...)` — stable page URL helpers.

### `createWeaverseNextServerClient`

Example helper for a Next route/server component boundary:

```ts
import { createWeaverseNextServerClient } from '@weaverse/next/server'
import { headers } from 'next/headers'
import { serverComponents } from './server-components'
import { getStaticStorefrontClient } from './storefront'

export async function getWeaverseServerClient(
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>,
  pathname = '/'
) {
  let [headersList, rawSearchParams] = await Promise.all([
    headers(),
    searchParamsPromise,
  ])
  let requestHeaders = new Headers(Object.fromEntries(headersList.entries()))
  let searchParams = new URLSearchParams()

  for (let [key, value] of Object.entries(rawSearchParams)) {
    if (Array.isArray(value)) {
      for (let item of value) searchParams.append(key, item)
    } else if (value !== undefined) {
      searchParams.set(key, value)
    }
  }

  let url = new URL(
    `${pathname}?${searchParams}`,
    `${requestHeaders.get('x-forwarded-proto') ?? 'https'}://${
      requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
    }`
  )

  let storefront = getStaticStorefrontClient()

  return createWeaverseNextServerClient({
    components: serverComponents,
    projectId: process.env.WEAVERSE_PROJECT_ID,
    weaverseHost: process.env.WEAVERSE_HOST,
    env: process.env,
    commerce: storefront
      ? {
          storefront: {
            i18n: { country: 'US', language: 'EN' },
            query: async (query, options) => {
              let response = await storefront.graphql(query, options as never)
              return response.data
            },
          },
        }
      : undefined,
    requestContext: {
      url,
      headers: requestHeaders,
      searchParams,
      pathname,
      i18n: { country: 'US', language: 'EN', locale: 'en-US' },
    },
    cache: { revalidate: 60, tags: ['weaverse'] },
  })
}
```

Then each route can stay close to the Hydrogen mental model:

```ts
let weaverse = await getWeaverseServerClient(props.searchParams, '/')
let data = await weaverse.loadPage({ type: 'INDEX' })
let theme = await weaverse.loadThemeSettings()
```

### Server client members

| Member | Description |
| --- | --- |
| `loadPage(input?)` | Fetches the page from `/api/public/project`, builds `WeaverseNextLoaderData`, runs component loaders, and returns page/project/config data. In section preview mode it can synthesize a single-section preview page. |
| `loadThemeSettings(options?)` | Fetches `/api/public/project_configs`, merges schema defaults under merchant settings, returns theme settings/static content/schema data for design mode. |
| `fetchWithCache<T>(url, options?)` | Next-aware fetch helper. Uses `cache: 'no-store'` in design/revision preview and `next: { revalidate, tags }` in published mode. |
| `resolveProjectId()` / `projectId` | Resolves project id from Studio query, config function/string, or env. |
| `components` | Server component registry. Components may include `schema` and optional `loader`. |
| `commerce` / `storefront` | Commerce context. `storefront` is a compatibility alias for Pilot-style loaders. |
| `requestContext` | URL, headers, search params, i18n, and design/preview flags. |

### Component loaders

A registered component may expose a server-side `loader`:

```ts
export let productHero = {
  schema: productHeroSchema,
  loader: async ({ data, commerce, weaverse }) => {
    let handle = data.product?.handle
    if (!handle) return null

    return commerce?.storefront?.query(PRODUCT_QUERY, {
      variables: { handle },
    })
  },
}
```

Loader args match the page-load and revalidation paths:

- `data` — schema defaults merged under item data.
- `commerce` — explicit commerce context.
- `weaverse` — server/client object with `weaverse.storefront` compatibility alias.
- `context` — request context.

## Rendering in a Next route

Typical shape:

```tsx
// app/page.tsx
export default async function Home(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  let data = await loadWeaverseHomePage(props.searchParams)
  return <WeaversePage data={data} />
}
```

```tsx
// app/weaverse-page.tsx
'use client'

import {
  createWeaverseNextClient,
  WeaverseNextProvider,
  WeaverseNextRenderer,
} from '@weaverse/next'
import type { WeaverseNextLoaderData } from '@weaverse/next'
import { components } from './components'

export function WeaversePage({ data }: { data: WeaverseNextLoaderData }) {
  let requestInfo = data.configs?.requestInfo as
    | {
        i18n?: { country?: string; language?: string; locale?: string }
        pathname?: string
        search?: string
      }
    | undefined
  let projectId =
    (data.configs?.projectId as string | undefined) ?? data.project?.id
  if (!projectId) throw new Error('Missing Weaverse project id')

  let client = createWeaverseNextClient({
    projectId,
    components,
    requestContext: {
      pathname: requestInfo?.pathname ?? '/',
      searchParams: new URLSearchParams(requestInfo?.search ?? ''),
      isDesignMode: Boolean(data.configs?.isDesignMode),
      isPreviewMode: Boolean(data.configs?.isPreviewMode),
      isRevisionPreview: Boolean(data.configs?.isRevisionPreview),
      i18n: requestInfo?.i18n,
    },
  })

  return (
    <WeaverseNextProvider client={client}>
      <WeaverseNextRenderer data={data} />
    </WeaverseNextProvider>
  )
}
```

## Studio setup

Studio has two separate pieces.

### 1. Root-level script connector

Mount `WeaverseNextStudioConnect` once near the app root. It loads the Studio bridge script in design/preview/revision contexts and does nothing in published mode.

```tsx
// app/weaverse-next/studio-connect.tsx
'use client'

import { WeaverseNextStudioConnect } from '@weaverse/next'

export function StudioConnect() {
  return <WeaverseNextStudioConnect />
}
```

```tsx
// app/layout.tsx
import { StudioConnect } from './weaverse-next/studio-connect'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StudioConnect />
        {children}
      </body>
    </html>
  )
}
```

### 2. Page-level runtime binding

`WeaverseNextRenderer` creates and binds the page runtime. Internally, `WeaverseNextStudio` maps Studio internals to Next App Router:

- `internal.navigate(...)` → `router.push(...)` / `router.replace(...)`
- `internal.revalidate()` → `router.refresh()` fallback
- `internal.revalidateItem(draftItem)` → per-item loader revalidation endpoint

The root script connector and page-level renderer are both required for full Studio editing.

## Per-item Studio revalidation

Resource-picker edits should refresh only the affected item's server loader data. The happy path should not call `router.refresh()` because refreshing the whole RSC tree can remount the page and reset scroll.

Mount the route handler in the consuming app:

```ts
// app/api/weaverse/revalidate/route.ts
import { createWeaverseNextRevalidateHandler } from '@weaverse/next/server'
import { getWeaverseServerClient } from '../../../weaverse-next/server'

export const { POST } = createWeaverseNextRevalidateHandler({
  getClient: () => getWeaverseServerClient(Promise.resolve({})),
})
```

Flow:

```text
Studio resource picker edit
  -> Builder calls runtime.internal.revalidateItem(draftItem)
  -> SDK POSTs { draftItem } to /api/weaverse/revalidate
  -> route handler finds the registered component by draftItem.type
  -> handler runs that component's loader with draft item data
  -> response returns { loaderData }
  -> SDK applies loaderData to the live item instance in place
```

If the route is missing or returns an error, Builder falls back to the older route-refresh path.

## Config resolution

Server config resolution intentionally mirrors Hydrogen where possible:

- `projectId`: `?weaverseProjectId=` → config function → config string → `WEAVERSE_PROJECT_ID`.
- `weaverseHost`: trusted `?weaverseHost=` over `https://*.weaverse.io` / `https://*.weaverse.dev` → `WEAVERSE_HOST` → `https://studio.weaverse.io`.
- API base: trusted request host → `WEAVERSE_PUBLIC_API_BASE` → non-production `WEAVERSE_HOST` → `https://api.weaverse.io`.
- public env: `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`.

`WEAVERSE_API_KEY` may be read into internal base configs but is not attached to page/theme API requests and is never serialized into client-facing loader data.

## POC reference

Live POC:

- https://weaverse-hydrogen-next-poc.vercel.app

Repo:

- https://github.com/Weaverse/weaverse-hydrogen-next-poc

Important POC paths:

```text
app/weaverse-next/server.ts                  # explicit Next server context helper
app/weaverse-next/wrapper.tsx                # client provider + renderer
app/weaverse-next/studio-connect.tsx         # root Studio script connector
app/api/weaverse/revalidate/route.ts         # per-item loader revalidation route
app/page.tsx                                 # home page Weaverse load
app/products/[handle]/page.tsx               # product route Weaverse load
app/collections/[handle]/page.tsx            # collection route Weaverse load
```

## Current limitations

- This package is still alpha; API names may change before stable.
- Next does not provide Hydrogen's global React Router loader context, so apps should keep a small `getWeaverseServerClient(...)` helper.
- Full Shopify request-handler/redirect parity is app-level follow-up work, not owned by this package yet.
- Translation/static-text sidecar parity, multiple Weaverse runtimes on one URL, and 404/error-route Studio connection are later hardening items.
- The Studio bridge currently reuses the existing Studio bridge bundle until a Next-specific bundle is proven necessary.
