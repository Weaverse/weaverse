# Plan: Per-item loader revalidation for @weaverse/next

## Problem

When a Studio user edits a loader-backed input (e.g. a resource picker) on a
Next.js App Router storefront, Builder revalidates the preview by:

1. Patching `window.fetch` so `_rsc` requests carry a `weaverseDraftItem`
   query param (the unsaved item JSON).
2. Calling `weaverse.internal.revalidate()` → `router.refresh()`.

The rewritten RSC URL changes the App Router **page segment cache key**
(`__PAGE__?{...}` is keyed on search params), so applying the refreshed payload
**remounts the page tree**:

- the preview scrolls to the top, then Builder scrolls back to the selected
  section (jarring double scroll);
- client component state is lost (playing video, open drawers, form input);
- the whole page re-renders for a single-item data change;
- the transient draft payload leaks into the preview's canonical URL (worked
  around today by `cleanPreviewPath()` in Builder).

Hydrogen does not have this problem: React Router's `useRevalidator()` re-runs
route loaders **in place** — no navigation, no remount. The essential semantics
are "re-run the server-side component loader, apply fresh `loaderData` in
place". `router.refresh()` was only ever an approximation of that.

## Goals

- Revalidate a single edited item's server-side loader without any router
  navigation or RSC tree re-apply.
- Keep the mechanism package-owned (`@weaverse/next`), with one-file wiring in
  the consumer app, matching the existing `loadWeaversePage` pattern.
- Keep Builder backward compatible: feature-detect the new capability, fall
  back to the current `router.refresh()` flow for older SDK versions.

## Non-goals

- Replacing full-page refresh flows (`refreshPage`, locale change, page
  import) — those still use `router.refresh()` / navigation.
- Changing the Hydrogen revalidation path.
- Theme-settings revalidation (unaffected; live-updated via
  `updateThemeSettings`).
- Removing the `weaverseDraftItem` fetch patch entirely in v1 — it remains the
  fallback for SDKs without `revalidateItem`.

## Design

### Data flow

```text
Editor resource picker change
  → Builder preview RPC: revalidate(id)
  → feature-detect: typeof weaverse.internal.revalidateItem === 'function'
     ├─ yes (new path):
     │    Builder builds the draft item JSON (as today) and calls
     │    weaverse.internal.revalidateItem(draftItem)
     │      → SDK POSTs { draftItem } to the app's revalidate endpoint
     │      → route handler (SDK factory) looks up the component by type,
     │        runs its loader server-side with the draft data
     │      → returns { loaderData }
     │      → SDK applies: itemInstances.get(id).setData({ loaderData })
     │      → item re-renders in place; Builder's poll observes the
     │        loader-payload change → completion 'loader-payload'
     └─ no (fallback): current fetch-patch + internal.revalidate() flow
```

No `router.refresh()`, no URL rewrite, no remount, no scroll.

### Public API (`@weaverse/next`)

Server (exported from `@weaverse/next/server`):

```ts
export function createWeaverseNextRevalidateHandler(config: {
  /** Reuse the app's server-client factory (components + commerce context). */
  getClient: (request: Request) => Promise<WeaverseNextServerClient>
}): { POST: (request: Request) => Promise<Response> }
```

Consumer wiring (one file):

```ts
// app/api/weaverse/revalidate/route.ts
import { createWeaverseNextRevalidateHandler } from '@weaverse/next/server'
import { getWeaverseServerClient } from '@/app/weaverse-next/server'

export const { POST } = createWeaverseNextRevalidateHandler({
  getClient: (request) => getWeaverseServerClient(/* from request */),
})
```

Client (wired automatically by `WeaverseNextStudio`):

```ts
runtime.internal.revalidateItem = async (draftItem) => {
  let response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draftItem }),
  })
  let { loaderData } = await response.json()
  let instance = runtime.itemInstances.get(draftItem.id)
  instance?.setData({ ...draftItem.data, loaderData })
  runtime.triggerUpdate()
}
```

Endpoint path: default `/api/weaverse/revalidate`, overridable via
`WeaverseNextStudio` prop / client config (`revalidateEndpoint`).

### Request/response contract

```jsonc
// POST /api/weaverse/revalidate
{ "draftItem": { "id": "...", "type": "resource-picker-smoke", "data": { /* unsaved settings */ } } }

// 200
{ "loaderData": { /* loader output, JSON-serializable */ } }

// 4xx
{ "error": "unknown-component-type" | "missing-loader" | "invalid-payload" }
```

Handler behavior:

- Resolve the component by `draftItem.type` from the client's registry; 404 on
  unknown types (no arbitrary code paths).
- Merge schema defaults under `draftItem.data` before calling the loader
  (mirrors `execComponentLoader` / `runWeaverseComponentLoaders`).
- Loader receives the same args shape as page-load loaders
  (`{ data, weaverse, commerce }`), so component loaders need no changes.
- Always respond `no-store`.

### Security considerations

The endpoint runs registered component loaders with caller-provided settings
data. Exposure is equivalent to today's `weaverseDraftItem` URL param (any
visitor can already trigger design-mode loader runs with arbitrary draft data
via the page URL), and loaders only query public storefront data. Mitigations:

- Only registered component types are executable; payload validated before use.
- The handler runs loaders only — it never persists data or touches Weaverse
  write APIs.
- Response is `no-store`, so poisoned payloads cannot be cached.
- Optional hardening (documented, not enforced in v1): consumers can gate the
  route on design-mode markers / trusted `weaverseHost`.

### Builder changes (companion, private spec)

In `builder/studio/rpc/methods.ts#revalidate`:

- If `weaverse.internal.revalidateItem` exists and a draft item param was
  built: call it (await), skip `installDraftItemRevalidationParam` and
  `internal.revalidate()`.
- Completion detection is unchanged — the existing poll already observes
  per-item loader-payload changes (`getRevalidationCompletion`), and the new
  path changes the payload directly.
- Fallback path (no `revalidateItem`, or the call throws/404s — e.g. the app
  has not mounted the route) reverts to the current fetch-patch + refresh flow
  within the same revalidation window.

Logged in `builder/.specs/2026-06-21--next-studio-bridge/` work-log when
implemented.

## Files and folders touched

SDK (`Weaverse/weaverse`):

- `packages/next/src/server/revalidate-handler.ts` — new: route-handler factory
- `packages/next/src/server.ts` — export the factory
- `packages/next/src/runtime.ts` — `internal.revalidateItem` type + wiring
- `packages/next/src/use-weaverse-next-studio.tsx` / `studio-bridge.tsx` —
  wire `revalidateItem` (endpoint config) into the runtime internals
- `packages/next/src/studio-router.ts` — extend internals factory if needed
- `packages/next/src/types.ts` — contract types
- `packages/next/__tests__/` — handler + client wiring tests

Builder (`Weaverse/builder`, separate PR):

- `studio/rpc/methods.ts` — feature-detect + fallback in `revalidate()`
- `app/test/studio/rpc/` — tests

POC (`Weaverse/weaverse-hydrogen-next-poc`):

- `app/api/weaverse/revalidate/route.ts` — mount the handler

## Implementation slices

1. **Handler + contract (off-browser):** `createWeaverseNextRevalidateHandler`
   with unit tests (unknown type, missing loader, schema-default merge, loader
   args shape, no-store).
2. **Client wiring:** `internal.revalidateItem` on the runtime, endpoint
   config, apply-in-place via `setData`; tests with mocked fetch.
3. **POC wiring + smoke:** mount the route, verify resource-picker edit updates
   the section with **no scroll jump and no page remount**.
4. **Builder feature-detect + fallback** (separate Builder PR), then E2E smoke
   against local Builder.

## Verification

- Unit (SDK): handler contract cases; client applies `loaderData` in place and
  triggers a re-render; fallback intact when endpoint is absent.
- POC smoke (design mode, local Builder):
  - pick a product → loading bar → section renders the new product;
  - **no scroll-to-top**; viewport position preserved; selected section stays
    in view;
  - `window.location` never gains `weaverseDraftItem`;
  - older-SDK fallback still works (feature flag off / route removed).
- Hydrogen regression: existing `.data`/single-fetch revalidation tests pass
  untouched.

## Risks / open questions

- **Loader args parity:** Next loaders currently receive
  `{ data, commerce, weaverse }` via `runWeaverseComponentLoaders`; the handler
  must construct an identical shape or loaders behave differently between page
  load and revalidation.
- **Endpoint discovery:** default path convention vs explicit config — start
  with convention + override prop.
- **Multiple runtimes per URL:** `revalidateItem` must resolve the item in the
  owning runtime (`window.__weaverses`), not just the last-registered one.
- **Draft payload size:** POST body avoids URL/header size limits entirely
  (improvement over both the query-param and header transports).
