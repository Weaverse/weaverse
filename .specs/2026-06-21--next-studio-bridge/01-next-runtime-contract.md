# 01 — `@weaverse/next` Studio runtime contract

This document defines the public SDK-side runtime contract for Studio compatibility. Private Builder implementation details are intentionally summarized.

## Runtime capabilities

Studio-compatible storefront runtimes need these public/structural capabilities:

| Area | Required capability |
| --- | --- |
| Root connection | Load the Studio bridge script when design/preview/revision query markers are present. |
| Page binding | Bind a live Weaverse runtime to the bridge once page data and registered components exist. |
| Runtime identity | Expose stable `pageId`, `projectId`, `requestInfo`, `data`, and `dataContext`. |
| Global registry | Register the active runtime in browser globals used by the bridge for page save/rebind flows. |
| Item instances | Provide item stores, refs, snapshots, updates, and schema-default data behavior. |
| Navigation | Provide a callback that can navigate the preview without losing Studio state. |
| Revalidation | Provide a refresh/revalidation callback and a strategy for loader-backed updates. |
| Theme settings | Expose a theme settings store with schema, settings, public env, subscriptions, and live update method. |
| Component schemas | Expose registered component schemas in the shape Studio can inspect. |
| Translation/static text | Either support translation/static-text sidecars or explicitly degrade gracefully for v0. |

## Required runtime shape

`@weaverse/next` should introduce a Studio-compatible runtime that extends/adapts the base `Weaverse` instance:

```ts
interface WeaverseNextRuntime {
  pageId: string
  projectId: string
  data: WeaverseNextPageData
  dataContext: Record<string, unknown> | null
  requestInfo: WeaverseNextRequestInfo

  weaverseHost?: string
  weaverseApiBase?: string
  weaverseVersion?: string
  isDesignMode: boolean
  isPreviewMode: boolean
  isRevisionPreview: boolean
  sectionType?: string

  internal: {
    navigate?: (to: string, options?: { preventScrollReset?: boolean }) => void
    revalidate?: (options?: unknown) => Promise<void> | void
    project?: unknown
    pageAssignment?: unknown
    themeSettingsStore?: WeaverseNextThemeSettingsStore
    merchantOverrides?: unknown
    themeTextStore?: unknown
  }

  setProjectData(data: unknown): void
  triggerUpdate(): void
}
```

Do not serialize server-only secrets into this runtime.

## Request info

Next must normalize request/search state into a stable object:

```ts
interface WeaverseNextRequestInfo {
  pathname: string
  search: string
  queries: Record<string, string | boolean>
  i18n?: unknown
}
```

Rules:

- Preserve Studio control queries.
- Preserve `pathname` and exact `search` for runtime identity/rebind decisions.
- Keep duplicate-query behavior explicit and tested.
- Do not include secrets.

## Theme settings store

The store must expose the exact contract the Studio bridge expects:

```ts
interface WeaverseNextThemeSettingsStore {
  schema: unknown
  settings: Record<string, unknown>
  publicEnv?: Record<string, string | undefined>
  subscribe(listener: () => void): () => void
  getSnapshot(): Record<string, unknown>
  getServerSnapshot?(): Record<string, unknown>
  updateThemeSettings(next: Record<string, unknown>): void
}
```

Important: the live update method must be `updateThemeSettings`, not a new SDK-only name such as `setSettings`.

## Runtime update loop

Studio binding is not `init()` once.

The SDK must support two lifecycle operations:

1. First design-mode bind: `window.weaverseStudio.init(runtime)`.
2. Subsequent design-mode updates for a reused runtime: `window.weaverseStudio.refreshStudio(params)`.

The refresh loop is required for:

- inspector edits,
- route refreshes,
- loader-backed data refresh,
- page selector changes,
- locale/request-info changes,
- outline/data resync after runtime data changes.

## Global state caveat

The underlying Weaverse core uses browser-global/static registries for component/item runtime state. The Next adapter must be explicit about:

- when it creates vs reuses a runtime,
- how it keys active runtimes by page/request identity,
- how it avoids stale item instances across navigations,
- whether `@weaverse/hydrogen` and `@weaverse/next` can safely coexist in one document.

Coexistence is not required for v0, but the constraint must be documented.

## RSC/client boundary

Production Next App Router usage should follow this shape:

```text
Server Component
  -> fetch serializable page/theme/runtime data
  -> pass data into Client Component boundary

Client Component boundary
  -> import/register component registry
  -> create client/runtime
  -> render provider/renderer/studio bridge
```

Do not create a non-serializable runtime/client in a Server Component and pass it through RSC.

## Cache policy

Design/preview/revision modes must bypass public/stale caching. In Next terms, page/theme fetches in design mode should use a no-store strategy, not `revalidate: 60` or similar stale cache settings.
