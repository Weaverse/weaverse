# Plan: Next locale fixes

## Approach

### #511 — reused items rebuild from schema defaults (`packages/next/src/item.ts`)

`WeaverseNextItem.setData()`:

- **Complete serialized item** (`'id' in update && 'type' in update`, which is what core `initProject()` passes for a reused instance): replace `_store` with
  1. `generateDataFromSchema(elementRegistry.get(update.type)?.schema)`,
  2. then the nested `data` (when present),
  3. then `flattenItemData(update)`.

  Nothing from the previous payload survives: no stale setting, no stale nested `data`, no other type's defaults.
- **Partial update:** unchanged; it merges through the inherited `data` setter.
- **Deferred render-phase notification:** unchanged.

This matches Hydrogen's #508 semantics and goes further: Hydrogen keeps the previous store, so a stale setting without a schema default would survive.

### #534 — market path prefix (`packages/next/src/request-info.ts`, `packages/next/src/server/normalize-page-url.ts`)

- `withPathPrefix(pathname, i18n)` normalizes `i18n.pathPrefix` to `/<segment>` by splitting on `/`, not with a regex (CodeQL `js/polynomial-redos`).
- It prefixes a path that lacks it, leaves `/de-de` and `/de-de/...` alone, does not treat `/de-defaults` as prefixed, and is a no-op for an empty prefix.
- It is applied in `getPathnameFromContext` (explicit `pathname` and url-derived) and in `resolveRequestUrl`.
- `resolveRequestUrl` returns the app's `url` string unchanged when there is nothing to add.
- The Builder already strips the prefix when resolving a page (verified against the live API: `/de-de/about` = `/about` CUSTOM, `/de-de` = `/` INDEX), so no API change is needed.

### Dependencies (`packages/next/package.json`)

`@weaverse/react` 5.20.3 → 5.22.1 and `@weaverse/schema` 0.16.0 → 0.17.0; regenerate `pnpm-lock.yaml`.

## Tests

`packages/next/__tests__/next-adapter.test.tsx`, next to the EN → FR reuse test, via a `switchLocale()` helper:
- an omitted setting resets to its default;
- omitted `data` resets to defaults;
- a stale setting without a default is dropped and nested `data` replaced;
- a reused item that changes type gets the new type's defaults.

Also in `next-adapter.test.tsx`:
- `buildWeaverseNextRequestInfo` prefixes an explicit pathname and a url-derived pathname;
- it keeps an already-prefixed path;
- it leaves the default market alone.

`packages/next/__tests__/next-server.test.tsx`, for `resolveRequestUrl`:
- prefixes a url and a pathname-only context;
- keeps an already-prefixed url;
- returns an unprefixed url unchanged;
- normalizes surrounding slashes.

Behavior-changing tests were written first and seen failing.

## Verification

- `pnpm --filter @weaverse/next run typecheck`
- `pnpm exec vp test --run packages/next`
- `pnpm exec biome check packages/next`
- `pnpm run package:check`
- CI on #537

## Files touched

| File | Change |
| --- | --- |
| `packages/next/src/item.ts` | Complete-item reset from the incoming type's defaults |
| `packages/next/src/request-info.ts` | `withPathPrefix`; pathname prefixing |
| `packages/next/src/server/normalize-page-url.ts` | `resolveRequestUrl` prefixing, no-op when unchanged |
| `packages/next/__tests__/next-adapter.test.tsx` | Item reset and request-info tests |
| `packages/next/__tests__/next-server.test.tsx` | `resolveRequestUrl` tests |
| `packages/next/package.json`, `pnpm-lock.yaml` | Dependency pins |
| `.specs/2026-10-06--next-locale-fixes/` | This spec |

## Out of scope

- The `0.1.0-alpha.19` release (plan step 3).
- Removing Forward's own prefix workaround: that is a Forward follow-up after the release.
