# Plan — versioned project-request usage metering

## Contract

- Legacy SDK/site releases keep their existing `/api/public/px` behavior.
- The new Hydrogen and Next releases remove browser pixel transport.
- Each live public project request carries `X-Weaverse-Usage-Source: project-request-v1`.
- Design mode, section preview, and revision preview requests carry no marker.
- Project configs and Content API requests carry no marker.
- The API worker strips the marker before an origin miss reaches Builder.

## Implementation

1. Keep the inherited pixel-removal cutover private to the new package release.
2. Add the marker at each framework's page-project request construction seam.
3. Reuse existing mode flags so Studio and revision requests remain excluded.
4. Cover request headers behaviorally through the existing Hydrogen and Next server-client tests.

## Files expected

- `packages/hydrogen/src/utils/use-studio.ts`
- `packages/hydrogen/src/utils/pixel.ts` (removed)
- `packages/hydrogen/__tests__/use-pixel.test.ts` (removed)
- `packages/hydrogen/src/weaverse-client.ts`
- `packages/hydrogen/__tests__/weaverse-client.test.ts`
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

1. Builder receipt schema, transactional ingestion, and direct fallback.
2. Cloudflare Queue/DLQ resources and edge usage worker consumer.
3. API worker producer binding, awaited enqueue, and marker stripping.
4. Hydrogen and Next package release.

## Verification

- focused Hydrogen and Next request tests, RED then GREEN;
- package tests, typecheck, build, Biome, and packed public API checks;
- cross-repository marker/strip/direct-fallback contract verification.
