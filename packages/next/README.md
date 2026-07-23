# @weaverse/next

Next.js App Router integration for Weaverse-powered Hydrogen storefronts.

This package lets a Next App Router storefront render Weaverse page data, run server-side section loaders, connect to Weaverse Studio, and refresh loader-backed Studio edits without depending on React Router.

It is the Next equivalent of the useful parts of `@weaverse/hydrogen`, but the app creates the request-scoped server client explicitly because Next does not inject a custom `context` object into every route loader.

## Current status

- Package status: alpha (`0.1.0-alpha.x`).
- Target runtime: Next App Router.
- Peer dependencies: `next >=14`, `react >=19`, `react-dom >=19`.
- Studio bridge: supported through the dedicated Next Studio bridge script (`/static/studio/next/*`) plus Next-native runtime callbacks.
- Resource-picker revalidation: supported through per-item loader revalidation, not full-page `router.refresh()` on the happy path.
- Low-risk Hydrogen parity helpers: custom-page sitemap fetching, Next metadata conversion, and resource-picker type aliases are available.

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
  seo.ts                           # Next Metadata-compatible page SEO helpers
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
- `WeaverseNextStudioConnect` — root client component that loads the Next Studio bridge script in design/preview contexts.
- `WeaverseNextStudio` / `WeaverseNextStudioBridge` — Next-native page-level Studio runtime binding.
- `createWeaverseNextRuntime` / `bindWeaverseNextStudioRuntime` — lower-level runtime helpers.
- `revalidateWeaverseNextItem()` — client-side per-item revalidation helper wired by `WeaverseNextStudio`.
- Hooks: `useThemeSettings`, `useWeaversePageData`, `useWeaverseRootData`, `useWeaverseCommerce`.
- Re-exported migration helpers from `@weaverse/react`: `useWeaverse`, `useParentInstance`, `useItemInstance`, `useChildInstances`.
- Full `@weaverse/schema` surface, including `createSchema`, schema types, validators, and schema helper utilities.
- `generateDataFromSchema(schema)` — framework-neutral default-setting extraction utility shared with component/theme schema flows.
- Public `WeaverseNextThemeSchema` type for root/server theme settings config.

## Server API (`@weaverse/next/server`)

Main exports:

- `createWeaverseNextServerClient(config)` — request-scoped server client.
- `createWeaverseNextRevalidateHandler(config)` — route-handler factory for Studio per-item loader revalidation.
- `getWeaverseNextConfigs(...)` — config/env/query resolution.
- `normalizeNextPageUrl(...)` / `resolveRequestUrl(...)` — stable page URL helpers.
- `getWeaverseNextSeoMetadata(...)` / `formatWeaverseNextSeoMetadata(...)` — convert Weaverse `page.seo` into a Next Metadata-compatible object.

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
| `loadThemeSettings(options?)` | Fetches `/api/public/project_configs`, merges schema defaults under merchant settings, returns theme settings/static content/schema data for design mode. When the theme schema declares `i18n` and `requestContext.i18n` supplies both `language` and `country`, it also fetches locale static-text overrides from `/api/translation/static` in parallel and returns them as `merchantOverrides`. A failed or skipped overrides fetch never fails theme settings. |
| `fetchCustomPages(options?)` | Fetches published custom pages from `/api/public/v1/projects/:projectId/custom-pages` for sitemap generation, paginating automatically and returning partial results if a later page fails. |
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

### SEO metadata

Use the server entry in `generateMetadata()` to map Weaverse `page.seo` into a Next Metadata-compatible object:

```ts
// app/pages/[handle]/page.tsx
import type { Metadata } from 'next'
import { getWeaverseNextSeoMetadata } from '@weaverse/next/server'

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  let { handle } = await props.params
  let weaverse = await getWeaverseServerClient(props.searchParams, `/pages/${handle}`)
  let data = await weaverse.loadPage({ type: 'PAGE', handle })
  return getWeaverseNextSeoMetadata(data)
}
```

The helper is pure and has no runtime dependency on `next`; it only imports the
`Metadata` type. Its return value is directly assignable to Next `Metadata`.

Two Builder-only SEO values are normalized so Next can always render the result:

- Open Graph type `product` falls back to `website` (Next throws on `product`).
  The other Builder types — `website`, `article`, `profile`, `video.other` — are
  passed through unchanged.
- Twitter card types `app` and `player` fall back to `summary`, because Builder
  does not collect the extra descriptors those cards need (Next throws without
  the `app` fields, and a `player` card without a player URL renders empty).

### Custom pages for sitemap generation

`fetchCustomPages()` mirrors Hydrogen's sitemap helper and accepts Next cache knobs:

```ts
let weaverse = await getWeaverseServerClient(Promise.resolve({}), '/')
let pages = await weaverse.fetchCustomPages({
  locale: 'en-us',
  limit: 100,
  revalidate: 3600,
  tags: ['weaverse:custom-pages'],
})
```

It paginates until the API returns `nextCursor: null`; if a later page fails, it returns the pages already fetched instead of throwing.

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

## Root theme provider

Global modules (`Header`, `Footer`, popups, a CSS-var bridge) render once in
`app/layout.tsx`, outside any route's `WeaverseNextProvider`. Mount
`WeaverseNextRootProvider` there so `useThemeSettings()` works for them too,
and so route-level providers share one theme settings store instead of each
creating their own — matching Hydrogen's root-owned `withWeaverse()` store.

```tsx
// app/layout.tsx
import { WeaverseNextRootProvider } from '@weaverse/next'
import { getWeaverseServerClient } from './weaverse-next/server'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let weaverse = await getWeaverseServerClient(Promise.resolve({}), '/')
  let theme = await weaverse.loadThemeSettings()

  return (
    <html lang="en">
      <body>
        <WeaverseNextRootProvider
          initialThemeSettings={theme.theme}
          themeSchema={theme.schema}
        >
          <Header />
          {children}
          <Footer />
        </WeaverseNextRootProvider>
      </body>
    </html>
  )
}
```

A route's `WeaverseNextProvider` automatically adopts the root store when one
is mounted above it, instead of creating a second one — so Studio's live
edits reach both the root modules and the page renderer. The root's initial
theme is authoritative for SSR: routes should not load their own theme
settings in the final starter. If a route still carries
`themeSettings`/`client.themeSettings` (e.g. mid-migration), that data merges
into the root store in a client-only effect after mount, not during render —
so SSR always renders the root's value, with no render-phase mutation of the
shared store. Apps that don't mount `WeaverseNextRootProvider` see no
behavior change: `WeaverseNextProvider` falls back to creating its own store
and still renders `themeSettings`/`client.themeSettings` synchronously on
SSR, same as before.

## Studio setup

Studio has two separate pieces.

### 1. Root-level script connector

Mount `WeaverseNextStudioConnect` once near the app root. It loads the Next Studio bridge script in design/preview/revision contexts and does nothing in published mode.

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

Mounting it in the root layout (rather than per-page) also covers App Router
routes that never render `WeaverseNextRenderer`, such as `not-found.tsx` and
`error.tsx` — Studio needs the bridge script loaded before a page tree
exists, and the root layout still renders around those routes. This is
SSR-safe: `WeaverseNextStudioConnect` only touches `document` inside a
`useEffect`, so it is a no-op during server rendering.

### 2. Page-level runtime binding

`WeaverseNextRenderer` creates and binds the page runtime. Internally, `WeaverseNextStudio` maps Studio internals to Next App Router:

- `internal.navigate(...)` → `router.push(...)` / `router.replace(...)`
- `internal.revalidate()` → `router.refresh()` fallback
- `internal.revalidateItem(draftItem)` → per-item loader revalidation endpoint

The root script connector and page-level renderer are both required for full Studio editing.

## Per-item Studio revalidation

Resource-picker edits should refresh only the affected item's server loader data. The happy path should not call `router.refresh()` because refreshing the whole RSC tree can remount the page and reset scroll.

Mount the route handler in the consuming app. `getClient` receives a second
argument — the validated, same-origin route context reconstructed from the
request body — so the revalidated loader runs with the same pathname, locale,
page type, handle, and ordinary search params as the active storefront route.
The two server-client helpers below are app-level consumer helpers, not exports
from `@weaverse/next`:

```ts
// app/api/weaverse/revalidate/route.ts
import { createWeaverseNextRevalidateHandler } from '@weaverse/next/server'
import {
  createWeaverseServerClientFromContext,
  getWeaverseServerClient,
} from '../../../weaverse-next/server'

export const { POST } = createWeaverseNextRevalidateHandler({
  // `requestContext` is validated browser input for route identity only.
  // Project ID, Studio host, API base/key, and env must still come from
  // server config — never from this context — and it is `undefined` for
  // legacy request bodies that carry no route context.
  getClient: (_request, requestContext) =>
    requestContext
      ? createWeaverseServerClientFromContext(requestContext)
      : getWeaverseServerClient(Promise.resolve({})),
})
```

The existing one-argument callback still works. A handler mounted with a
`(request) => client` callback ignores the optional second argument and keeps
compiling and running, so old wiring needs no change:

```ts
export const { POST } = createWeaverseNextRevalidateHandler({
  getClient: () => getWeaverseServerClient(Promise.resolve({})),
})
```

Flow:

```text
Studio resource picker edit
  -> Builder calls runtime.internal.revalidateItem(draftItem)   (unchanged)
  -> SDK snapshots runtime.requestInfo, strips server-owned/transient controls
  -> SDK POSTs { draftItem, routeContext? } to /api/weaverse/revalidate
  -> handler validates + sanitizes routeContext at the trust boundary
  -> handler reconstructs a same-origin WeaverseNextRequestContext
  -> getClient(request, requestContext) builds the route-aware server client
  -> route handler finds the registered component by draftItem.type
  -> handler runs that component's loader with draft data + client.requestContext
  -> response returns { loaderData } with Cache-Control: no-store
  -> SDK applies loaderData to the live item instance in place
```

If the route is missing or returns an error, Builder falls back to the older
route-refresh path.

### Trust boundary

The revalidation endpoint is public and every JSON field is attacker-controlled.
The SDK sanitizes `routeContext` on the client for clean traffic, but the route
handler is the security boundary and re-validates independently:

- Only `pathname`, sanitized `search`, a narrow i18n subset, a
  `PageTypeSchema`-valid `pageType`, and a bounded `handle` cross the boundary.
  Headers, cookies, auth, env, project ID, Studio host, API base/key, commerce
  clients, the runtime, and the client are never serialized.
- Server-owned controls (`weaverseProjectId`, `weaverseHost`, `weaverseApiKey`,
  `weaverseApiBase`, `weaversePublicApiBase`, `weaverseVersion`, `projectId`) and
  transient transport controls (`weaverseDraftItem`, `__weaverseDraftItem`,
  `_rsc`) are stripped case-insensitively on both sides, so a crafted body cannot
  influence server config resolution.
- The origin is fixed from the endpoint request before assigning any
  browser-provided pathname/search, so input cannot change protocol, host, port,
  or credentials. `pathname` and `url.pathname` share one URL-canonicalized value.
- A malformed present `routeContext` returns `400 { error: 'invalid-route-context' }`
  before `getClient` runs; a missing `routeContext` is valid legacy input and
  passes `undefined` to the callback.
- Route context is routing input, never an authorization decision. A registered
  loader must not treat pathname, handle, page type, locale, or search as proof
  of access; customer/private data still requires independent server-side session
  and authorization checks derived from the actual request.

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

## Alpha migration notes

### After `0.1.0-alpha.9`

- The root `@weaverse/next` entry re-exports the full `@weaverse/schema` surface for Hydrogen migration parity. This includes `createSchema`, schema types, validators, and helper utilities.
- Theme schema fields are now structurally typed with `WeaverseNextThemeSchema` instead of `unknown` across client/root/server theme settings APIs. Most existing schema objects remain assignable, but alpha consumers with very loose local schema types may need to annotate/cast them before the next publish.
- `generateDataFromSchema` is public from the root entry and accepts component schemas or `WeaverseNextThemeSchema`.
- Version bumping still happens in the release flow; do not publish another alpha without bumping `packages/next/package.json` first.

### Bundle note

The Next package build keeps `@weaverse/schema` as an external package re-export. It does not inline Zod/schema validators into `@weaverse/next`'s generated `dist/index.*` bundles. App-level bundle size still depends on what a consuming Next app imports and how its bundler tree-shakes `@weaverse/schema`.

## Current limitations

- This package is still alpha; API names may change before stable.
- Next does not provide Hydrogen's global React Router loader context, so apps should keep a small `getWeaverseServerClient(...)` helper.
- Apps must still wire their App Router route context explicitly for page loads and per-item revalidation; validate product/collection/custom/locale routes in the starter before treating them as production-ready.
- Global sections are Builder-owned; `@weaverse/next` should only need fixes if manual Studio QA finds a rendering/runtime boundary issue.
- Full Shopify request-handler/redirect parity is app-level follow-up work, not owned by this package yet.
