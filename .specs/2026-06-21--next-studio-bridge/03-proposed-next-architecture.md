# 03 — Proposed `@weaverse/next` Studio architecture

## Principle

Keep SDK-side Studio support small, explicit, and structural. Reuse the existing Studio bridge first, but do not leak private Builder implementation details into the public package contract.

## Public package additions

Possible files:

```text
packages/next/src/runtime.ts
packages/next/src/item.ts
packages/next/src/request-info.ts
packages/next/src/theme-settings-store.ts
packages/next/src/studio-script-src.ts
packages/next/src/studio-connect.tsx
packages/next/src/studio-bridge.tsx
```

Possible exports:

```ts
export {
  WeaverseNextStudioConnect,
  WeaverseNextStudioBridge,
  createWeaverseNextRuntime,
}

export type {
  WeaverseNextRuntime,
  WeaverseNextRuntimeConfig,
  WeaverseNextThemeSettingsStore,
}
```

## Lifecycle split

### Root-level connect

`WeaverseNextStudioConnect` should run in a client component mounted high enough to answer Studio/design-mode contexts even before page content is ready.

Responsibilities:

- Read current search params and hostname.
- Resolve a trusted Studio script URL.
- Load the script only in design/preview/revision contexts.
- Do nothing in normal published mode.

Next App Router note: if this uses `useSearchParams()`, consumers may need to wrap it in `<Suspense>` depending on placement/build mode.

### Page-level bind

`WeaverseNextStudioBridge` should run near the rendered Weaverse page runtime.

Responsibilities:

- Wire Next navigation callbacks.
- Wire a revalidation/refresh callback.
- Attach theme settings store and page assignment to `runtime.internal`.
- On first bind, call `window.weaverseStudio.init(runtime)`.
- On reused design-mode renders, call `window.weaverseStudio.refreshStudio(params)`.

## Navigation and revalidation

Prefer callback-based internals:

```ts
runtime.internal.navigate = (to, options) => router.push(to, { scroll: false })
runtime.internal.revalidate = async () => router.refresh()
```

Do not assume this fully matches Hydrogen revalidation. For loader-backed updates, define how draft item/update context is represented in a Next request and consumed by the server fetch path.

## Runtime creation/reuse

Runtime identity should be based on:

- `pageId`,
- `pathname`,
- `search`,
- relevant locale/request info.

Rules:

- Create a new runtime for a new page/request identity.
- Reuse runtime for same identity where Studio edit subscriptions must survive.
- Refresh reused runtime data through the Studio refresh loop.
- Clear or update stale item instances deliberately.

## Theme settings

A single store should back both:

- React hooks exposed by `@weaverse/next`,
- the Studio-compatible runtime contract.

The store must support `updateThemeSettings(next)` and subscription snapshots.

## Design-mode fetching

Design/preview/revision modes should bypass stale public cache. The POC and app-level fetch helpers must avoid `next: { revalidate: 60 }` in design mode and prefer a no-store strategy.

## Iframe embeddability

The preview route must be frameable by the configured Studio origin. Apps with restrictive `X-Frame-Options` or CSP `frame-ancestors` headers must explicitly allow Studio in design mode.

## Builder split fallback

Do not start with a Builder bridge split. First satisfy the structural runtime contract in `@weaverse/next` and verify actual Studio smoke. Split/rename Builder bridge output only if a concrete incompatibility appears.

## Implementation slices

1. Runtime, item store, request info, theme store, script resolver tests.
2. Root connect + page bind components with mocked `window.weaverseStudio` tests.
3. POC wiring with real project metadata and design-mode no-store.
4. Direct design-mode browser probes.
5. Actual Studio handshake + outline + basic edit smoke.
6. Revalidation/page-switch/translation hardening.
