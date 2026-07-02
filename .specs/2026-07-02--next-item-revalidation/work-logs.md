# Work Logs

## 2026-07-02 — @hta218 (with Claude)

Implemented the full SDK slice plus companion Builder + POC wiring.

### SDK (`packages/next`, on `fix/next-stale-refresh-studio-payload` / PR #478)

- `src/server/revalidate-handler.ts` — `createWeaverseNextRevalidateHandler`:
  parses/validates `{ draftItem }`, resolves the component from the client
  registry (404 unknown type, 422 missing loader), runs the loader with the
  same args shape as `runWeaverseComponentLoaders` (schema defaults merged
  under draft data), returns `{ loaderData }` with `Cache-Control: no-store`.
- `src/revalidate-item.ts` — `revalidateWeaverseNextItem`: POSTs the draft
  item, applies `{ loaderData }` in place via `instance.setData`, throws on
  any failure so Builder can fall back.
- `internal.revalidateItem` added to `WeaverseNextRuntimeInternal`; wired by
  `WeaverseNextStudio` (new `revalidateEndpoint` prop, default
  `/api/weaverse/revalidate`) through `WeaverseNextStudioBridge`.
- Tests: `__tests__/revalidate-item.test.ts` (handler contract + client
  apply/fallback), 64 tests passing.

### Builder (on `fix/next-rsc-resource-revalidation` / PR #2601, pending QA)

- `studio/rpc/revalidation.ts` — `runPreferredRevalidation`: prefers
  `internal.revalidateItem(draftItem)`, falls back to the legacy fetch-patch +
  `internal.revalidate()` flow on rejection or missing capability.
- `studio/rpc/methods.ts#revalidate` — builds the draft item object, defers
  fetch-patch install to the refresh fallback only; completion poll unchanged
  (per-item path completes via the `loader-payload` signal).
- Tests: 4 new cases in `app/test/studio/rpc/revalidation.test.ts` (30 pass).

### POC

- `app/api/weaverse/revalidate/route.ts` mounts the handler with the app's
  `getWeaverseServerClient`.
- Installed the packed SDK tarball; `next build` registers the route.

### Verification

- SDK: test (64), typecheck, build, biome — all pass.
- Builder: revalidation tests (30), biome, typecheck, build:studio — all pass.
- Live endpoint smoke against the running POC dev server:
  - valid draft item → 200 with real Storefront API `loaderData`
    (product `unisex-fila-classic-kicks`);
  - unknown component type → 404; invalid JSON → 400;
  - `cache-control: no-store` on all responses.

### Remaining

- Browser QA in Studio: resource-picker edit should update the section with
  NO scroll-to-top and no page remount; fallback QA with the route removed.
- After QA: merge PR #478 + Builder PR #2601, release `@weaverse/next` alpha,
  revert the POC tarball dependency to the npm version.

## 2026-07-02 — @hta218 — shipped

- Browser QA passed on both paths: Next POC (per-item, no scroll-to-top) and
  Pilot/Hydrogen (legacy refresh flow unaffected; full Builder suite 2103
  tests green).
- Merged: Weaverse/weaverse#478 (SDK) and Weaverse/builder#2601 (Builder
  feature-detect + fallback).
- Released `@weaverse/next@0.1.0-alpha.4` (npm dist-tag `alpha`), tagged
  `@weaverse/next@0.1.0-alpha.4`, `dev` synced with `main`.
- POC reverted from the local tarball to the npm release; revalidate route
  committed.
