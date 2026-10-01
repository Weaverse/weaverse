# Plan — remove browser usage pixels

## Contract

- Legacy SDK/site releases may keep calling `/api/public/px`; Builder preserves its response but no longer records usage from it.
- The new Hydrogen and Next releases remove browser pixel transport.
- Project API request headers remain unchanged.
- Builder counts every successful non-design origin project response, regardless of SDK generation.
- API-worker cache hits remain unmetered because they do not execute Builder.
- Existing daily billing remains $1 per 5,000 requests.

## Implementation

1. Keep the inherited pixel-removal cutover private to the new package release.
2. Delete the superseded request-header additions and their tests.
3. Keep the existing project request construction unchanged.
4. Cover the remaining Hydrogen and Next behavior through existing package tests.

## Files expected

- `packages/hydrogen/src/utils/use-studio.ts`
- `packages/hydrogen/src/utils/pixel.ts` (removed)
- `packages/hydrogen/__tests__/use-pixel.test.ts` (removed)
- `packages/next/src/pageview-tracker.tsx` (removed)
- `packages/next/src/pageview.ts` (removed)
- `packages/next/src/use-pageview.ts` (removed)
- `packages/next/src/renderer.tsx`
- `packages/next/src/root-provider.tsx`
- `packages/next/src/runtime.ts`
- `packages/next/README.md`
- `packages/next/__tests__/pageview-renderer.test.tsx` (removed)
- `packages/next/__tests__/pageview.test.ts` (removed)
- this spec and work log

## Coordinated release order

1. Builder count-all origin handling and pixel no-op.
2. Hydrogen and Next package release.

## Verification

- focused Hydrogen and Next tests;
- package tests, typecheck, build, Biome, and packed public API checks;
- cross-repository verification that SDK pixel transport is absent and Builder owns origin counting.
