# Pilot usage audit for `@weaverse/next`

| Field | Value |
| --- | --- |
| Audit date | 2026-06-19 |
| Source repo | `/Users/hta218/Documents/work/workspace/pilot` |
| Source branch | `fix/390-cart-discount-display` |
| Source status | clean, read-only audit |
| Target issue | [Weaverse/builder#2533](https://github.com/Weaverse/builder/issues/2533) |
| Target spec | `.weaverse/specs/2026-06-19--nextjs-adapter-contract/README.md` |

## Executive summary

Pilot is heavily coupled to the current React Router + Hydrogen runtime, but the actual Weaverse adapter surface needed for a Next.js v0 is smaller than the whole storefront.

For `@weaverse/next` v0, the must-haves are:

1. page data loading (`loadPage`) for the page types Pilot uses
2. theme settings loading (`loadThemeSettings`)
3. root/provider equivalent to `withWeaverse` + `WeaverseHydrogenRoot`
4. schema/component registration (`createSchema`, component registry, recursive render)
5. component-level loader support with access to app-provided Storefront GraphQL + i18n
6. runtime hooks for item/parent/theme settings used by sections
7. an explicit replacement for route loader data (`useLoaderData`, `useRouteLoaderData`) inside sections

Biggest migration risk: many Pilot sections read route data directly via React Router hooks. A Next adapter cannot hide that. The v0 contract should pass route/page commerce data through an explicit `dataContext` or per-page provider instead of trying to emulate React Router route matches.

## Scan evidence

Read-only scan results:

- total TS/TSX/JS/JSX files scanned: `303`
- files importing `@weaverse/hydrogen`: `134`
- files importing `@shopify/hydrogen`: `78`
- files importing `react-router`: `115`
- registered Weaverse components in `app/weaverse/components.ts`: `82`
- route loaders calling `context.weaverse.loadPage`: `9`
- files using `createSchema`: `82`
- files using `HydrogenComponentProps`: `56`
- files using `ComponentLoaderArgs`: `6`
- files using `useThemeSettings`: `20`
- files using `useParentInstance`: `5`
- files using `useItemInstance`: `1`
- files using `useWeaverse`: `1`
- files using `useLoaderData`: `41`
- files using `useRouteLoaderData`: `10`
- files using `useMatches`: `2`
- files using `useNavigate`: `4`

Primary files inspected:

- `app/.server/context.ts`
- `app/.server/root.ts`
- `app/root.tsx`
- `app/routes.ts`
- `server.ts`
- `app/entry.server.tsx`
- `app/weaverse/index.tsx`
- `app/weaverse/components.ts`
- `app/weaverse/schema.server.ts`
- `app/weaverse/style.tsx`
- `app/weaverse/csp.ts`
- representative route loaders:
  - `app/routes/home.tsx`
  - `app/routes/products/product.tsx`
  - `app/routes/collections/collection.tsx`
  - `app/routes/catch-all.tsx`
- representative component loaders/hooks:
  - `app/sections/featured-products/index.tsx`
  - `app/sections/featured-collections/index.tsx`
  - `app/sections/hotspots/item.tsx`
  - `app/sections/single-product/loader.ts`
  - `app/sections/featured-products/product-items.tsx`
  - `app/sections/main-product/index.tsx`
  - `app/components/link.tsx`

## Current Pilot architecture

### Runtime boot

`app/.server/context.ts` creates Hydrogen context, then injects Weaverse:

```ts
const hydrogenContext = createHydrogenContext(...)
const weaverse = new WeaverseClient({
  ...hydrogenContext,
  request,
  cache,
  themeSchema,
  components,
})
Object.assign(hydrogenContext, { weaverse })
```

Implication for Next:

- `createWeaverseNextClient` needs explicit context inputs instead of receiving the whole Hydrogen router context.
- Required inputs are `request/url`, `env`, `cache/fetch`, `themeSchema`, `components`, `storefront`, and `i18n`.
- `storefront` should be app-provided because Next/Hydrogen preview client strategy can be public-token or private-token.

### Root/provider

`app/root.tsx` wraps the document layout with `withWeaverse` and uses `useThemeSettings`:

```tsx
export const Layout = withWeaverse(function RootLayout({ children }) {
  const data = useRouteLoaderData<RootLoader>('root')
  const { topbarHeight, topbarText } = useThemeSettings<ThemeSettings>()
  ...
})
```

`app/.server/root.ts` loads global data:

```ts
const [layout, weaverseTheme] = await Promise.all([
  getLayoutData(context),
  context.weaverse.loadThemeSettings(),
])
```

Implication for Next:

- `@weaverse/next` v0 needs a provider/root equivalent.
- Root data must include theme settings and selected locale.
- Next should not emulate `useRouteLoaderData('root')`; instead pass root data through explicit props/provider.

### Page rendering

`app/weaverse/index.tsx` renders all Weaverse pages through `WeaverseHydrogenRoot`:

```tsx
export function WeaverseContent() {
  return <WeaverseHydrogenRoot components={components} errorComponent={GenericError} />
}
```

Implication for Next:

- v0 renderer can be small: `WeaverseNextRenderer({ data, components, dataContext })`.
- It must support component registry, schema defaults, recursive children, `loaderData`, and error boundary/component fallback.

### Route-level page loading

Nine routes call `context.weaverse.loadPage`:

| File | Page type | Handle source | Notes |
| --- | --- | --- | --- |
| `app/routes/home.tsx` | `INDEX` or `CUSTOM` | locale/path heuristic | also loads shop SEO data |
| `app/routes/catch-all.tsx` | `CUSTOM` | current URL | validates fallback/404 |
| `app/routes/products/product.tsx` | `PRODUCT` | `params.productHandle` | parallel with Shopify product query |
| `app/routes/products/list.tsx` | likely collection/list page | route-defined | product listing |
| `app/routes/collections/collection.tsx` | `COLLECTION` | `params.collectionHandle` | parallel with collection query/filtering |
| `app/routes/collections/list.tsx` | likely collections list | route-defined | collection listing |
| `app/routes/pages/regular-page.tsx` | custom/page | `params.pageHandle` | regular pages |
| `app/routes/blogs/blog.tsx` | blog | `params.blogHandle` | blog listing |
| `app/routes/blogs/article.tsx` | article | `params.articleHandle` | article page |

Implication for Next:

- `getWeaversePage(context)` must accept `pageType` and `handle` explicitly.
- The adapter should not own route matching. Next apps should map `params` to `pageType/handle` in route files.
- `validateWeaverseData` behavior should be available as a helper, but app routes decide whether to `notFound()`.

## Compatibility matrix

| Pilot usage | Evidence | Category | Next v0 action |
| --- | --- | --- | --- |
| `WeaverseClient` constructor | `app/.server/context.ts` | framework adapter | replace with `createWeaverseNextClient(config)` |
| `context.weaverse.loadPage` | 9 route files | adapter core | must implement `client.getPage/loadPage({ type, handle })` |
| `context.weaverse.loadThemeSettings` | `app/.server/root.ts` | adapter core | must implement theme settings fetch |
| `WeaverseHydrogenRoot` | `app/weaverse/index.tsx` | renderer/root | replace with `WeaverseNextRenderer` + provider |
| `withWeaverse` | `app/root.tsx` | provider/root | replace with explicit `WeaverseNextProvider` in App Router layout/page |
| `createSchema` | 82 files | framework-neutral/schema | keep import-compatible from `@weaverse/next` or re-export from shared package |
| `HydrogenComponentProps` | 56 files | naming/API compatibility | add `WeaverseNextComponentProps`; optionally alias for migration |
| `HydrogenComponent` type | `app/weaverse/components.ts` | registry typing | add `WeaverseNextComponent`; ideally same shape |
| `ComponentLoaderArgs` | 6 files | component data loader | must support `data`, `weaverse`, `context`, `commerce/storefront` |
| `useThemeSettings` | 20 files | runtime hook | must support via provider; can re-export shared hook if generalized |
| `useParentInstance` | 5 files | item store hook | must support via `@weaverse/react`/provider |
| `useItemInstance` | 1 file | item store hook | must support via `@weaverse/react`/provider |
| `useWeaverse` | 1 file | editor/runtime hook | must support enough for Studio checks |
| `getWeaverseSeoMeta` | 2 files | SEO helper | useful v0 helper or later; Next can map to `generateMetadata` |
| `getSelectedProductOptions` | `products/product.tsx` | Hydrogen utility wrapper | not core Weaverse; needs Next-compatible helper or app-owned function |
| `IMAGES_PLACEHOLDERS` | multiple components | constants | can re-export for compatibility |
| resource picker types (`WeaverseProduct`, `WeaverseCollection`) | loaders/schemas | schema/types | must re-export or move to shared package |
| `routeHeaders` | 13 route files | React Router/Oxygen cache | replace with Next fetch cache/revalidate/tag strategy |
| `useLoaderData` in sections | 41 files | React Router app coupling | cannot be hidden; replace via explicit `dataContext`/page context hooks |
| `useRouteLoaderData` | 10 files | React Router app coupling | replace with explicit root context hook/provider |
| `useNavigate` | 4 files | React Router navigation | replace with `next/navigation` in app/components, not Weaverse core |
| `useMatches` | 2 files | React Router route tree | app migration issue; do not emulate in adapter |
| `redirect` | 12 files | React Router response API | app routes map to `next/navigation` `redirect()` |
| `hydrogenRoutes` / `app/routes.ts` | route config | React Router app | no adapter scope; Next route files replace it |
| `storefrontRedirect` | `server.ts` | Hydrogen/Oxygen server | separate Next route/proxy helper, not renderer v0 |
| CSP via `createContentSecurityPolicy` | `entry.server.tsx`, `app/weaverse/csp.ts` | server/runtime | Next needs CSP guidance/helper later; not renderer v0 |

## Pilot APIs that should be v0 must-haves

### 1. Page and theme fetch

Must support:

```ts
await weaverse.getPage({ type: 'PRODUCT', handle })
await weaverse.getThemeSettings(context)
```

Reason: every rendered Weaverse route depends on `loadPage`, and the root layout depends on `loadThemeSettings`.

### 2. Component registry + schema defaults

Must support 82 registered components with the same module shape:

```ts
export default Component
export const schema = createSchema(...)
export const loader = async (args) => ... // optional
```

Reason: this is the core content portability surface. If v0 breaks the component module shape, migration cost explodes.

### 3. Component loaders with commerce context

Component loaders currently fetch Shopify data from `weaverse.storefront`:

- `featured-products` queries selected/manual/auto products
- `featured-collections` queries selected collections
- `hotspots/item` queries a selected product
- `single-product/loader.ts` queries product + variants

Minimum loader contract:

```ts
interface WeaverseNextComponentLoaderArgs<TData = unknown> {
  data: TData
  weaverse: WeaverseNextClient
  context: WeaverseNextRequestContext
  commerce: {
    storefront: {
      query: (query: string, options?: unknown) => Promise<unknown>
      i18n: { country: string; language: string }
    }
  }
}
```

For migration compatibility, `weaverse.storefront` can exist as an alias to `commerce.storefront`, but the contract should name commerce explicitly.

### 4. Runtime hooks from item store/provider

Must support:

- `useThemeSettings`
- `useParentInstance`
- `useItemInstance`
- `useWeaverse`

These are real Pilot dependencies and should stay in shared `@weaverse/react` if possible, with `@weaverse/next` re-exporting them for import compatibility.

### 5. Route/root data replacement

Must provide a Next alternative for sections that currently use route data:

- product sections call `useLoaderData<typeof productRouteLoader>()`
- collection sections call `useLoaderData<typeof collectionRouteLoader>()`
- generic link/layout components call `useRouteLoaderData<RootLoader>('root')`

Recommended v0 API:

```ts
<WeaverseNextProvider
  data={weaverseData}
  rootData={rootData}
  pageData={pageData}
  commerce={commerce}
>
  <WeaverseNextRenderer />
</WeaverseNextProvider>
```

and hooks:

```ts
useWeaverseRootData<T>()
useWeaversePageData<T>()
useWeaverseCommerce<T>()
```

Do **not** emulate `useLoaderData` or `useRouteLoaderData`; that would recreate React Router inside Next.

## Pilot APIs that can wait

| Area | Why defer |
| --- | --- |
| Full `storefrontRedirect` parity | server/proxy design, separate from renderer/page data |
| CSP helper parity | required for production hardening, not for package shell |
| Customer Account API | mostly app-specific routes, not Weaverse adapter core |
| Cart route/action helpers | app-specific; Weaverse sections need context/actions, not ownership |
| Full analytics parity | Shopify/Hydrogen owns most analytics; adapter can pass through context later |
| Sitemap helpers | separate route handler helpers; not renderer v0 |
| Full i18n routing strategy | must be app-owned in Next route structure, adapter only accepts explicit i18n |

## Recommended v0 implementation slice

Implement `packages/next` v0 around this smaller surface:

```text
packages/next/src/
  index.ts
  types.ts
  client.ts
  provider.tsx
  renderer.tsx
  schema.ts
```

### v0 exports

```ts
export {
  createWeaverseNextClient,
  WeaverseNextProvider,
  WeaverseNextRenderer,
  createSchema,
  useThemeSettings,
  useParentInstance,
  useItemInstance,
  useWeaverse,
  useWeaverseRootData,
  useWeaversePageData,
  useWeaverseCommerce,
}

export type {
  WeaverseNextClient,
  WeaverseNextClientConfig,
  WeaverseNextComponent,
  WeaverseNextComponentProps,
  WeaverseNextComponentLoaderArgs,
  WeaverseNextLoaderData,
  WeaverseNextRequestContext,
  WeaverseProduct,
  WeaverseCollection,
}
```

### v0 acceptance criteria

- `packages/next` builds in the monorepo.
- A fixture page tree renders with registered components.
- Component loaders can run with `commerce.storefront.query` and i18n.
- Provider exposes theme settings and item store hooks.
- A test demonstrates route data is supplied through explicit `pageData/rootData`, not React Router hooks.
- No dependency on `react-router` or `@shopify/remix-oxygen` in `packages/next`.
- `@shopify/hydrogen` should be a peer/optional integration dependency only if needed for types; the core adapter should work with a plain Storefront-like client.

## Migration notes for Pilot sections

Likely mechanical changes when moving Pilot sections to Next:

| Current import | Next-compatible path |
| --- | --- |
| `@weaverse/hydrogen` `createSchema` | `@weaverse/next` re-export |
| `HydrogenComponentProps` | `WeaverseNextComponentProps` or temporary alias |
| `ComponentLoaderArgs` | `WeaverseNextComponentLoaderArgs` |
| `useThemeSettings` | `@weaverse/next` re-export/shared hook |
| `useParentInstance` / `useItemInstance` / `useWeaverse` | `@weaverse/next` re-export/shared hook |
| `useLoaderData` inside sections | `useWeaversePageData<T>()` |
| `useRouteLoaderData('root')` | `useWeaverseRootData<T>()` |
| `RemixLink` / `react-router` link props | app-level Next `Link` wrapper, not SDK-owned |

## Design changes recommended after audit

Update the main contract spec with these refinements:

1. **Component loaders are v0 must-have**, not optional, because Pilot has real Storefront-backed component loaders.
2. **Explicit root/page data hooks are v0 must-have**, because many sections read route/root loader data directly.
3. **Runtime hooks should be re-exported by `@weaverse/next`** for migration ergonomics.
4. **`commerce.storefront` should be explicit in loader args**, with `weaverse.storefront` as optional compatibility alias.
5. **Do not emulate React Router.** The adapter should provide clear Next-native hooks and route data props.

## Next step

Implement the package shell + type/renderer/provider spike in `packages/next`, with tests against a small fixture that covers:

- page tree render
- theme settings provider
- parent/item lookup hook
- component loader receiving `commerce.storefront`
- route data replacement through `rootData/pageData`
