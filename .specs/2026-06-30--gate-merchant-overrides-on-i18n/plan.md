# Gate merchant-overrides fetch on the theme's i18n schema

**Date:** 2026-06-30
**Issue:** Weaverse/builder#2291 (child of #2069 — Full i18n epic)
**Scope:** `@weaverse/hydrogen` only. No `builder` repo changes.

## Problem

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

## Change

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

## Files touched

- `packages/hydrogen/src/weaverse-client.ts` — add the i18n guard.
- `packages/hydrogen/__tests__/weaverse-client.test.ts` — 2 tests:
  - no `i18n` schema → no `merchant-overrides` fetch
  - `i18n` schema present → `merchant-overrides` fetch happens

## Verification

- `pnpm exec vp test --run __tests__/weaverse-client.test.ts` — 32 passed.
- `pnpm exec tsc --noEmit -p packages/hydrogen/tsconfig.json` — clean.
- `biome check` on both files — clean.

## Out of scope (tracked separately in #2291)

The issue's broader proposal also covers:
- Merging the standalone `@weaverse/i18n` `getI18nData` loader into the theme
  load and deprecating the standalone export.
- Migrating Pilot + a secondary showcase theme to the merged call.
- Docs / migration note.

This change delivers the core acceptance criterion ("themes without i18n make
zero translation API calls during SSR") with minimal risk. The remaining items
are larger, cross-repo (showcase themes + docs), and should land as follow-ups.
