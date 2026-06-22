# @weaverse/next

Next.js App Router integration for building Weaverse-powered storefronts.

This package adapts the Weaverse runtime (component registry, page-tree
rendering, Studio bridge) to Next.js without depending on React Router or
Hydrogen. It mirrors the `@weaverse/hydrogen` contract where it makes sense, but
takes plain, framework-neutral inputs (URL, headers, search params) instead of a
React Router `Request`/`LoaderFunctionArgs`.

## Entrypoints

| Import | Use in | Purpose |
| --- | --- | --- |
| `@weaverse/next` | Client & server | Registry, renderer, provider, hooks, Studio runtime/bridge. |
| `@weaverse/next/server` | Server only | Server-side Weaverse client that fetches page/theme data from the Weaverse API. |

> The server-side data-loading API lives under **`@weaverse/next/server`** so the
> root entry stays free of server-only fetch assumptions and safe to import from
> client components.

## Package structure

```text
packages/next/src/
  index.ts              # root (@weaverse/next) public exports
  server.ts             # server (@weaverse/next/server) public exports
  client.ts             # createWeaverseNextClient (injected-fetcher client)
  loader.ts             # runWeaverseComponentLoaders (server-side section loaders)
  registry.ts           # register components with the Weaverse element registry
  renderer.tsx          # WeaverseNextRenderer (page-tree → React)
  provider.tsx          # WeaverseNextProvider (client context for hooks)
  hooks.ts              # useThemeSettings / useWeaversePageData / ...
  runtime.ts            # WeaverseNextRuntime + Studio binding
  studio-bridge.tsx     # Studio script injection / connect
  request-info.ts       # buildWeaverseNextRequestInfo (Studio-compatible)
  theme-settings-store.ts
  types.ts              # shared types (root + server)
  server/
    server-client.ts    # createWeaverseNextServerClient
    configs.ts          # getWeaverseNextConfigs (host/api-base/flags/env)
    normalize-page-url.ts
```

## Root API (`@weaverse/next`)

- `createWeaverseNextClient(config)` — request-safe client that delegates network
  I/O to injected `fetchPage` / `fetchThemeSettings`.
- `WeaverseNextProvider` / `WeaverseNextRenderer` — client provider + page-tree
  renderer.
- `runWeaverseComponentLoaders(args)` — walk a page tree and run each registered
  component's `loader` server-side.
- Hooks: `useThemeSettings`, `useWeaversePageData`, `useWeaverseRootData`,
  `useWeaverseCommerce` (plus re-exported `@weaverse/react` hooks).
- Studio helpers: `WeaverseNextRuntime`, `createWeaverseNextRuntime`,
  `bindWeaverseNextStudioRuntime`, `WeaverseNextStudioBridge`,
  `WeaverseNextStudioConnect`, `resolveWeaverseNextStudioScriptSrc`,
  `buildWeaverseNextRequestInfo`, `createWeaverseNextThemeSettingsStore`.
- `createSchema` (re-exported from `@weaverse/schema`).

## Server API (`@weaverse/next/server`)

`createWeaverseNextServerClient(config)` returns a client that performs the real
Weaverse public API fetch — the equivalent of Hydrogen's
`context.weaverse.loadPage(...)`.

```ts
import { createWeaverseNextServerClient } from '@weaverse/next/server'
import { components } from '@/weaverse/components'

export async function loadWeaverse(request: Request, storefront: Storefront) {
  let url = new URL(request.url)
  let weaverse = createWeaverseNextServerClient({
    projectId: process.env.WEAVERSE_PROJECT_ID, // string | (ctx) => string | Promise<string>
    components,
    themeSchema,
    commerce: { storefront },
    env: process.env,
    requestContext: {
      url,
      headers: request.headers,
      searchParams: url.searchParams,
      i18n: storefront.i18n,
    },
    cache: { revalidate: 60, tags: ['weaverse'] },
  })

  let [page, theme] = await Promise.all([
    weaverse.loadPage({ type: 'INDEX' }),
    weaverse.loadThemeSettings(),
  ])
  return { page, theme, weaverse }
}
```

### Returned client

| Member | Description |
| --- | --- |
| `loadPage(input?)` | POSTs `{ projectId, url, i18n, params, isDesignMode }` to `/api/public/project`, runs component loaders, returns `WeaverseNextLoaderData` (`page`, `project`, `pageAssignment`, `configs.requestInfo`). In Studio preview mode (`?isPreviewMode=true`) it short-circuits to a synthetic single-section page built from the `sectionType` presets — no fetch, no `projectId` required. A route-level `projectId` override is propagated to `client.projectId`, loaders, and the returned `configs`. |
| `loadThemeSettings(options?)` | POSTs to `/api/public/project_configs`, merges `themeSchema` defaults under `theme`, includes `staticContent`; falls back to defaults on failure. |
| `fetchWithCache<T>(url, options?)` | Mode-aware fetch: `cache: 'no-store'` in design/revision, `next: { revalidate, tags }` in published mode. |
| `projectId` / `resolveProjectId()` | Resolved project id (query → function → string → env). |
| `components`, `commerce`, `storefront`, `requestContext`, `themeSchema`, `themeSettings`, `data`, `dataContext`, `configs` | Readonly request state. `storefront` aliases `commerce.storefront`. |

### Config resolution

Close to Hydrogen's `getWeaverseConfigs`:

- **projectId** — `?weaverseProjectId=` query → config function → config string →
  `WEAVERSE_PROJECT_ID` env.
- **weaverseHost** — trusted request `?weaverseHost=` (only `weaverse.io` /
  `weaverse.dev` over https) → `WEAVERSE_HOST` env → `https://studio.weaverse.io`.
- **API base** — trusted request host → `WEAVERSE_PUBLIC_API_BASE` env → custom
  non-production `WEAVERSE_HOST` → `https://api.weaverse.io`.
- **publicEnv** — `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`.

`WEAVERSE_API_KEY` is read from the request query / env and kept on the internal
base configs, but the current server client does **not** attach it to the
page/theme API requests. It is also **never** serialized into client-facing
`configs` / loader data, so it cannot leak to the browser.

## Studio helpers

Design/preview detection, the Studio bridge script, and the in-page runtime are
shared with the root entry: `createWeaverseNextRuntime` + `WeaverseNextProvider`
hydrate Studio, and `bindWeaverseNextStudioRuntime` wires live updates. The
server client emits `configs.requestInfo` and design-mode flags the bridge
expects.

> **Mount `WeaverseNextStudioConnect` at your root/client shell.**
> `WeaverseNextRenderer` mounts the in-page runtime bridge but does **not**
> inject the Studio bridge script by itself. The script (which lets Studio's
> `checkWeaversePage()` handshake answer on every route, including content-less
> ones) is loaded by `WeaverseNextStudioConnect`, so it must be rendered once at
> the app root/client shell for the Studio editor to connect.

## Current limitations

- Server fetch has a timeout + single attempt; it does not yet replicate
  Hydrogen's subrequest cache, retry/backoff, or merchant-overrides translation
  fetch.
- Next caching is expressed only via `cache: 'no-store'` and
  `next: { revalidate, tags }`; on-demand `revalidatePath`/`revalidateTag` is left
  to the host app.
- `loadCustomPages` (sitemap) and SEO helpers are not ported yet.
- The Studio bridge currently reuses the Hydrogen bundle until a Next-specific
  bundle is required.
- Package is pre-release (`alpha`); the API may still change.
