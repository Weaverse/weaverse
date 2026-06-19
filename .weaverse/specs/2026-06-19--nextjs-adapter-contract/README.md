# Spec: Next.js adapter contract for framework-neutral Hydrogen

| Field | Value |
| --- | --- |
| Status | Draft ready for review |
| Issue | [Weaverse/builder#2533](https://github.com/Weaverse/builder/issues/2533) |
| Repository | `Weaverse/weaverse` |
| Owner | Weaverse SDK team |
| Date | 2026-06-19 |
| Scope | Design contract first; no package implementation in this step |

## Goal

Define the first `@weaverse/next` adapter contract so Weaverse can support a Next.js App Router storefront while keeping the existing React Router/Hydrogen SDK stable.

This spec follows the POC result from `Weaverse/weaverse-hydrogen-next-poc`:

- `@shopify/hydrogen@preview` can run in Next.js App Router.
- Public Storefront token mode works for live product, collection, cart, and checkout verification.
- A serialized Weaverse page tree can be rendered in Next.js through a component registry.
- The remaining work is an SDK/adapter contract, not basic feasibility.

## Non-goals

- Do not replace `@weaverse/hydrogen`.
- Do not force React Router/Hydrogen users onto Next.js concepts.
- Do not build the full `@weaverse/next` package in this step.
- Do not solve every Shopify request-handler/redirect/market/i18n edge case in v0.
- Do not require `PRIVATE_STOREFRONT_API_TOKEN`; public Storefront token mode must be valid for the spike path.

## Current repo state

`packages/next` currently only contains `.gitkeep`; it is a placeholder package.

Relevant existing package responsibilities:

- `@weaverse/core` — framework-agnostic item store, registry, events.
- `@weaverse/react` — React context/hooks/renderer primitives.
- `@weaverse/hydrogen` — React Router + Hydrogen runtime integration:
  - `WeaverseClient`
  - `WeaverseHydrogenRoot`
  - `WeaverseHydrogen`
  - Hydrogen-flavored component types/loaders
  - Studio/design-mode wiring

The Next.js adapter should reuse core/react concepts where possible and add only framework-specific glue.

## Design principles

1. **Adapter, not fork** — keep framework-neutral logic in core/react; isolate Next.js routing/cache/actions differences in `@weaverse/next`.
2. **Server-first rendering** — Next.js App Router should fetch Weaverse page data in server components, route handlers, or server utilities.
3. **Explicit data boundaries** — avoid hidden React Router concepts such as route matches and loader data.
4. **Preview mode is a runtime mode** — design/preview should disable stale caching and support Studio refresh without leaking secrets.
5. **Cart is Shopify-owned** — Weaverse should expose enough context for sections/components; Shopify cart actions stay in the storefront or a thin helper layer.
6. **Keep v0 small** — prove page fetch + section render + Studio preview before broad SDK parity.

## Proposed package shape

Target package:

```text
packages/next/
  package.json
  src/
    index.ts
    client.ts
    env.ts
    render.tsx
    provider.tsx
    types.ts
    studio.ts
    cache.ts
```

Proposed public exports:

```ts
export {
  createWeaverseNextClient,
  getWeaversePage,
  WeaverseNextProvider,
  WeaverseNextRenderer,
  getWeaverseSearchParams,
  isWeaverseDesignMode,
  createWeaverseMetadata,
}

export type {
  WeaverseNextClient,
  WeaverseNextClientConfig,
  WeaverseNextComponent,
  WeaverseNextComponentProps,
  WeaverseNextPageData,
  WeaverseNextRequestContext,
  WeaverseNextRenderOptions,
}
```

Names are provisional. The key is the contract, not the exact naming.

## Core contract

### `createWeaverseNextClient(config)`

Creates a request-safe client for fetching Weaverse page/project/theme data.

```ts
interface WeaverseNextClientConfig {
  projectId: string | ((context: WeaverseNextRequestContext) => string | Promise<string>)
  components: WeaverseNextComponent[]
  themeSchema?: unknown
  env?: Record<string, string | undefined>
  weaverseHost?: string
  weaverseApiBase?: string
  weaversePublicApiBase?: string
  weaverseApiKey?: string
  weaverseVersion?: string
  fetch?: typeof fetch
  cache?: WeaverseNextCacheConfig
}
```

Rules:

- `projectId` supports static and request-derived resolution, matching current Hydrogen behavior.
- The client must not require a React Router `Request`, `LoaderFunctionArgs`, `useMatches`, or route loader context.
- Server-only values (`WEAVERSE_API_KEY`) stay server-side.
- Public values needed by Studio/client hydration must be explicitly selected, not blindly serialized.

### `getWeaversePage(context)`

Fetches page data for the current route.

```ts
interface WeaverseNextRequestContext {
  url: URL
  pathname: string
  searchParams: URLSearchParams
  headers?: Headers
  cookies?: unknown
  i18n?: WeaverseI18n
  pageType?: PageType
  handle?: string
  isDesignMode?: boolean
  isPreviewMode?: boolean
  isRevisionPreview?: boolean
  sectionType?: string
}

interface WeaverseNextClient {
  getPage(context: WeaverseNextRequestContext): Promise<WeaverseNextLoaderData | null>
  getThemeSettings(context: WeaverseNextRequestContext): Promise<unknown>
  getCustomPages(context: WeaverseNextRequestContext): Promise<unknown[]>
}
```

Rules:

- Accept plain context, not a framework-specific loader args object.
- Compute equivalent of current `requestInfo` from `pathname`, `searchParams`, and i18n.
- Use Next.js caching primitives intentionally:
  - published storefront pages: `fetch(..., { next: { revalidate } })` or caller-controlled cache
  - design/preview mode: `cache: 'no-store'`
  - on-demand refresh: route handler calls `revalidatePath` / `revalidateTag`
- Return a data structure close to existing `WeaverseLoaderData` so components remain portable.

### `WeaverseNextRenderer`

Renders a serialized page tree through registered components.

```tsx
interface WeaverseNextRendererProps {
  data: WeaverseNextLoaderData
  components: WeaverseNextComponent[]
  dataContext?: Record<string, unknown>
}
```

Rules:

- Use a type-to-component registry.
- Render recursively from `page.items`.
- Generate default schema data the same way Hydrogen does.
- Do not depend on React Router hooks.
- Server components should be possible for top-level fetch/render, but registered Weaverse sections may be client components when they need interactivity.

### `WeaverseNextProvider`

Client boundary for editor/runtime state.

```tsx
interface WeaverseNextProviderProps {
  children: React.ReactNode
  data: WeaverseNextLoaderData
  designMode?: boolean
  previewMode?: boolean
  refresh?: () => void
}
```

Rules:

- Reuse `@weaverse/react` context where possible.
- For Studio updates, map current React Router revalidation to Next.js refresh semantics:
  - storefront client component: `router.refresh()`
  - route handler/webhook: `revalidatePath()` or `revalidateTag()`
- Avoid requiring `useLoaderData`, `useMatches`, or `useRouteLoaderData`.

## React Router/Hydrogen to Next.js mapping

| Existing Hydrogen concept | Current source | Next.js adapter equivalent |
| --- | --- | --- |
| `loader({ request, context })` | React Router/Hydrogen | server component fetch or route utility receives explicit `WeaverseNextRequestContext` |
| `useLoaderData()` | `react-router` | explicit props from server component to provider/renderer |
| `useMatches()` / route loader data | `react-router` | explicit page/theme data object; no implicit route tree dependency |
| `useRevalidator().revalidate()` | React Router | `router.refresh()` in client components; `revalidatePath`/`revalidateTag` in server contexts |
| `useNavigate()` | React Router | `next/navigation` router methods only inside client boundary |
| Hydrogen `context.storefront` | Hydrogen runtime | app-provided Storefront client from `@shopify/hydrogen@preview` or plain Storefront API client |
| Oxygen cache / `createWithCache` | Hydrogen runtime | Next fetch cache, tags, ISR, or caller-provided cache adapter |
| request handlers / redirects | Hydrogen runtime | Next route handlers / `proxy.ts` / redirects config, not v0 renderer core |

## Data flow

Published page request:

```text
Next.js route/page
  -> build WeaverseNextRequestContext from params + headers/searchParams/i18n
  -> createWeaverseNextClient(config)
  -> client.getPage(context)
  -> WeaverseNextProvider + WeaverseNextRenderer
  -> registered section components render with props/dataContext
```

Design/preview request:

```text
Studio iframe URL with weaverse query params
  -> isWeaverseDesignMode(searchParams) = true
  -> fetch page with no-store
  -> serialize public config + page data to client boundary
  -> Studio bridge posts updates
  -> provider updates item stores and triggers router.refresh when full reload is needed
```

Webhook/revalidation request:

```text
Builder/Studio publish event
  -> Next route handler validates secret/signature
  -> revalidateTag('weaverse:project:<projectId>') or revalidatePath(path)
  -> storefront serves refreshed data on next request
```

## Component contract

Proposed Next component type should stay close to current Hydrogen component shape but remove Hydrogen-specific names:

```ts
interface WeaverseNextComponentProps<L = unknown> extends WeaverseElement {
  children?: React.ReactNode
  className?: string
  loaderData?: L
  dataContext?: Record<string, unknown>
}

interface WeaverseNextComponent<TProps = WeaverseNextComponentProps> {
  default: React.ComponentType<TProps>
  schema: SchemaType
  loader?: (args: WeaverseNextComponentLoaderArgs) => Promise<unknown>
}

interface WeaverseNextComponentLoaderArgs<TData = unknown> {
  data: TData
  context: WeaverseNextRequestContext
  weaverse: WeaverseNextClient
}
```

Open point for implementation: component loaders may be too expensive/ambiguous in App Router server components. v0 can defer per-component loaders unless Pilot audit proves they are required.

## Shopify/Hydrogen preview contract

`@weaverse/next` should not own the whole Shopify runtime. It should integrate with an app-provided Storefront client.

Minimum app-side input:

```ts
interface CommerceContext {
  storefront?: {
    graphql: (query: string, options?: unknown) => Promise<unknown>
    i18n?: WeaverseI18n
  }
  cart?: unknown
  customerAccount?: unknown
}
```

Rules:

- Support public Storefront token mode because Pilot and the POC prove it works.
- Support private token mode when the app provides it; do not require it for v0.
- Do not hide cart mutations inside Weaverse core. Sections can call app actions through props/context.
- Market/i18n values must be explicit and part of cache keys/tags.

## Studio/design mode contract

The Next adapter must preserve these capabilities:

- detect design/preview/revision mode from Weaverse query params
- load unpublished/revision data in design mode
- inject/connect Studio bridge script only when required
- update item data in-place where possible
- refresh the route when a server re-fetch is required
- expose theme settings and theme text stores to components
- keep server-only API keys out of client-rendered payloads

Open implementation questions:

- How much of `WeaverseHydrogenRoot` should be generalized into `@weaverse/react` vs copied into `@weaverse/next`?
- Should Studio bridge code live in `@weaverse/react` with adapter hooks, or inside each framework package?
- How should translations sidecar and merchant overrides hydrate in App Router?

## Cache and revalidation contract

Proposed v0 cache keys/tags:

```text
weaverse:project:<projectId>
weaverse:page:<projectId>:<locale>:<pageType>:<handle>
weaverse:theme:<projectId>:<locale>
weaverse:custom-pages:<projectId>:<locale>
```

Rules:

- Published mode may use ISR/revalidate windows.
- Design/preview/revision mode must bypass cache.
- Locale, country/market, projectId, page type, and handle must be included in cache isolation.
- Revalidation APIs should be optional helpers, not required for rendering.

## Recommended implementation slices

### Slice 1 — contract spike in `packages/next`

Implement a minimal package shell and types only:

- `packages/next/package.json`
- `packages/next/src/index.ts`
- `packages/next/src/types.ts`
- `packages/next/src/render.tsx`

Acceptance:

- package builds with monorepo tooling
- exposes provisional types
- renderer can render a serialized page tree with registered components
- no Studio bridge yet
- no cart helpers yet

### Slice 2 — Pilot usage audit

Audit current Pilot usage of `@weaverse/hydrogen` and classify each API:

| Category | Example | Action |
| --- | --- | --- |
| Framework-neutral | schema, renderer data shape, item store | move/reuse in core/react |
| React Router-specific | `useLoaderData`, `useMatches`, `useNavigate` | map/adapt in Next |
| Hydrogen-specific | storefront/customer/cart context | app-provided commerce context |
| Studio-specific | bridge, design mode, translations | adapter hook/client boundary |

Acceptance:

- compatibility matrix committed under the same spec folder
- identifies v0 must-haves vs later parity work

### Slice 3 — POC integration against `@weaverse/next`

After Slice 1 and 2, update the POC or a tiny example app to consume the local package instead of local renderer code.

Acceptance:

- live Storefront API route still works
- Weaverse section render still works
- browser smoke test verifies route render

## Acceptance criteria for this design issue

This spec is complete when:

- It proposes a concrete adapter interface.
- It separates framework-neutral, React Router-specific, Next.js-specific, Hydrogen-specific, and Studio-specific responsibilities.
- It includes data flow and cache/revalidation flow.
- It names a small next implementation slice.
- It records risks and unknowns plainly enough for estimation.

## Risks and unknowns

- `@weaverse/react` currently imports React Router-related assumptions indirectly through Hydrogen usage patterns; implementation may require extracting more framework-neutral code.
- Existing Hydrogen component loaders may not map cleanly to App Router server components.
- Studio live editing may need a dedicated client boundary to avoid over-refreshing full routes.
- Next cache invalidation differs sharply from Oxygen/Hydrogen cache semantics.
- Preview env and Vercel org access remain operational follow-ups, not adapter design blockers.
- Request-handler/redirect parity may require a separate design issue after the renderer/page-data contract is proven.

## Out of scope for v0

- Full Hydrogen request-handler parity.
- Full market/i18n routing strategy.
- Migration tooling from Pilot to Next.js.
- A public npm release.
- Production docs.

## Pilot usage audit result

The Pilot usage audit is recorded in [`pilot-usage-audit.md`](./pilot-usage-audit.md).

Key changes from the audit:

- Component loaders are a v0 must-have because Pilot has real Storefront-backed section loaders.
- Explicit root/page data hooks are a v0 must-have because many Pilot sections read `useLoaderData` / `useRouteLoaderData` today.
- Runtime hooks (`useThemeSettings`, `useParentInstance`, `useItemInstance`, `useWeaverse`) should be re-exported by `@weaverse/next` for migration ergonomics.
- Loader args should expose explicit `commerce.storefront`; `weaverse.storefront` can exist as a compatibility alias.
- The adapter should not emulate React Router route matches. Next apps should pass route data through provider props and use Next-native route files.

## Immediate next action

Implement **Slice 1: package shell + renderer/provider spike** in `packages/next`, informed by the Pilot audit. Keep it small: types, provider, renderer, schema/hook re-exports, and fixture tests for page tree render + component loader + explicit root/page data.
