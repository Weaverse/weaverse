# Optional merchant-overrides loading

Two changes to the same optional loader: the 2026-06-30 i18n gate (first
part, unchanged) and the 2026-10-06 request deadline (#535, last part).

## Part 1 — Gate merchant-overrides fetch on the theme's i18n schema

**Date:** 2026-06-30
**Issue:** Weaverse/builder#2291 (child of #2069 — Full i18n epic)
**Scope:** `@weaverse/hydrogen` only. No `builder` repo changes.

### Problem

`loadThemeSettings()` runs `fetchMerchantOverrides()` unconditionally in its
`Promise.all` (`weaverse-client.ts`). `fetchMerchantOverrides` only guarded on
`projectId && weaverseHost` — both always present in a normal setup — so it
fired a translation API call on **every** SSR:

```
GET {weaverseHost}/api/translation/static?projectId=…&locale=en-us
```

even for themes that declare **no `i18n` schema** and have no translatable
surface. This is the latency/cost the issue flags ("themes without i18n make
zero translation API calls during SSR"). It was cached and failed gracefully,
so it was a perf/cost issue, not a correctness or security bug.

Asymmetry in the same function: `staticContent` was already gated on
`themeSchema.i18n`, but the network fetch feeding `merchantOverrides` was not.

### Change

Add one guard at the top of `fetchMerchantOverrides`, mirroring the existing
`staticContent` condition:

```ts
// Skip entirely when the theme hasn't opted into i18n.
if (!this.themeSchema?.i18n) {
  return
}
```

`HydrogenThemeSchema.i18n` is optional (`types.ts`); it is `undefined` for a
no-i18n theme and an object once the theme opts in. So the guard cleanly
separates the two cases and is fully backward-compatible: any theme that
already declares `i18n` keeps fetching overrides exactly as before.

### Files touched

- `packages/hydrogen/src/weaverse-client.ts` — add the i18n guard.
- `packages/hydrogen/__tests__/weaverse-client.test.ts` — 2 tests:
  - no `i18n` schema → no `merchant-overrides` fetch
  - `i18n` schema present → `merchant-overrides` fetch happens

### Verification

- `pnpm exec vp test --run __tests__/weaverse-client.test.ts` — 32 passed.
- `pnpm exec tsc --noEmit -p packages/hydrogen/tsconfig.json` — clean.
- `biome check` on both files — clean.

### Out of scope (tracked separately in #2291)

The issue's broader proposal also covers:
- Merging the standalone `@weaverse/i18n` `getI18nData` loader into the theme
  load and deprecating the standalone export.
- Migrating Pilot + a secondary showcase theme to the merged call.
- Docs / migration note.

This change delivers the core acceptance criterion ("themes without i18n make
zero translation API calls during SSR") with minimal risk. The remaining items
are larger, cross-repo (showcase themes + docs), and should land as follow-ups.

## Part 2 — Bound the optional overrides request (#535)

**Date:** 2026-10-06
**Issue:** #535
**Scope:** `@weaverse/hydrogen` only.

### Problem

`loadThemeSettings()` awaits the main settings and `fetchMerchantOverrides()`
together with `Promise.all`. In ordinary live mode the optional overrides
request (`{weaverseHost}/api/translation/static`) goes through Hydrogen's
`withCache.fetch`, which in `@shopify/hydrogen` 2026.4.2 calls `fetch` and
reads the body with no deadline. The main settings request uses `directFetch`
by default, because the public API base is the external proxy; it uses
`withCache.fetch` too only when the API base equals the Builder host (for
example a self-hosted `WEAVERSE_HOST`). `directFetch` (design mode, revision
preview, external public API proxy) has the SDK's abort timeout. On a cold
cache, an overrides request that stalls before or during its body keeps the
whole theme load pending, and the `catch` that falls back to theme defaults
never runs.

### Change

- `fetchMerchantOverrides` passes `signal: AbortSignal.timeout(fetchTimeoutMs)`
  to `fetchWithCache`. The client's existing `fetchTimeoutMs` (default 10 s) is
  the deadline. Hydrogen forwards the request options to `fetch`, so the signal
  covers the connection and the body read, and aborting closes the transport.
  An abort before the body arrives rejects, so the existing `catch` returns
  `undefined` and the theme settings keep their defaults.
- `fetchWithCache`'s `shouldCacheResponse` refuses to cache when the request
  signal has aborted. Hydrogen catches a body read cut short by the abort and
  returns an empty payload, which the old predicate would store as a valid
  entry. The overrides would then stay empty until that entry expires.
- Main settings keep no deadline on the cached path. `directFetch` ignores the
  caller's signal and keeps its own per-attempt timeout and retry, so design
  and revision modes are unchanged. No other cached request gets a signal.

### Files touched

- `packages/hydrogen/src/weaverse-client.ts` — overrides signal and the
  aborted-response cache guard.
- `packages/hydrogen/__tests__/weaverse-client.test.ts` — the i18n gating
  suite now drives a local HTTP origin through the real Hydrogen
  `withCache.fetch` and `InMemoryCache`:
  - a stalled overrides body settles on the main settings with no
    overrides, the server sees the connection closed, and the next load
    requests again (nothing was cached);
  - overrides that arrive in time merge, and a second load is served from
    cache with one origin request. This replaces the spy-based "fetches
    merchant overrides when the theme declares an i18n schema" case.
- Release notes are written at release time; the in-repo changelogs are no
  longer maintained.

### Verification

- The stall case times out before the fix and passes after it.
- Removing only the cache guard fails the "next load requests again" check:
  the aborted empty payload is served from cache.
- `pnpm exec vp test --run` in `packages/hydrogen`, `pnpm run typecheck`, and
  `biome check` on the changed files.
