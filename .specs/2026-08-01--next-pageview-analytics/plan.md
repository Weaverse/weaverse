# Plan — Next published-pageview analytics parity

## Problem

`@weaverse/next` renders real page/project data and owns runtime reuse, design/preview flags, and co-located page instances, but it never reports the published pageview that `@weaverse/hydrogen` sends to `/api/public/px`. Implementing this in every starter would duplicate a Weaverse protocol and make deduplication inconsistent.

React Router's stable `location.key` is unavailable in Next App Router. Next also reuses route trees and React development Strict Mode deliberately runs an effect mount/cleanup/remount cycle, so a naïve mount effect can double-fire or miss revisits.

## Ownership decision

`@weaverse/next` owns:

- eligibility from runtime state (`projectId`, `pageId`, `weaverseHost`, design/preview/revision flags);
- the Weaverse `/api/public/px` GET transport;
- per-navigation/per-page deduplication across nested or co-located runtimes;
- navigation observation and runtime lifecycle coordination.

The starter owns no pageview transport or deduplication. No public configuration API is introduced before stable release.

## Proposed implementation

### Module coordinator

Add a private coordinator in `packages/next/src/pageview.ts`. It owns the current navigation identity and the set of page IDs already fired for that navigation. It must:

- allow one event per `pageId` on a navigation;
- allow distinct co-located page IDs;
- clear fired IDs only when a different navigation identity is observed;
- retain dedupe state across renderer/Strict Mode remounts, including remounts that occur after a microtask;
- naturally reset on hard reload when the module instance is recreated.

Do not clear state merely because the last renderer unmounted: that makes a same-URL remount indistinguishable from a real navigation and can double-count. The nullable tracker observes non-Weaverse route identities when the renderer remains mounted, so leaving and returning starts a fresh set without tying dedupe to component lifetime.

### Client hook

Add `packages/next/src/use-pageview.ts`. It derives a navigation identity from `usePathname()` plus normalized `useSearchParams()`, observes navigation changes, and fires after commit when the runtime is eligible. Dedupe belongs to the navigation coordinator and is independent of runtime mount/unmount lifecycle.

The hook accepts a null runtime so `WeaverseNextRenderer` can call it consistently. Transport uses `new Image()` and encodes query parameters. Both load and error paths clean up without surfacing errors to React.

Because `useSearchParams()` suspends during static prerendering, the renderer owns a narrow `Suspense` boundary around the invisible pageview tracker. Storefront content remains outside that boundary, and consumers do not need to add their own boundary solely for SDK analytics.

### Renderer integration

Call the internal hook from `WeaverseNextRenderer`. Existing consumers receive pageview behavior automatically; the package root exports no new analytics API.

### Eligibility

Do not fire when:

- no browser runtime exists;
- project ID, page ID, or Weaverse host is missing;
- design mode is active;
- section/page preview mode is active;
- revision preview mode is active.

Published initial renders and committed client navigations fire at most once for each `(navigation, pageId)` pair.

## TDD matrix

1. Published initial render fires once.
2. Client navigation fires once for the new navigation.
3. Same-navigation remount does not duplicate.
4. Same-navigation remount after an async gap does not duplicate.
5. Same-page co-located runtimes deduplicate.
6. Different co-located page IDs each fire once.
7. An observed navigation through a route with no Weaverse runtime allows a later revisit.
8. A persistent layout runtime observes navigation transitions and permits revisits.
9. Runtime/page reuse uses current navigation and page identifiers.
10. Design, preview, and revision modes do not fire.
11. Missing host/project/page values are no-ops.
12. Transport failure never throws into rendering.

Tests should isolate pure coordinator state from the hook/renderer seam. The package test environment is Node; use focused framework mocks/stubs rather than adding a DOM dependency.

## Files expected

- `packages/next/src/pageview.ts`
- `packages/next/src/use-pageview.ts`
- `packages/next/src/renderer.tsx`
- focused tests under `packages/next/__tests__/`
- this spec/work log

`packages/hydrogen`, Builder, starter code, and public API reports should remain unchanged unless verification proves an unavoidable contract change.

## Verification

- focused pageview tests (RED before implementation, GREEN after);
- `pnpm --filter @weaverse/next test`;
- `pnpm --filter @weaverse/next typecheck`;
- `pnpm --filter @weaverse/next build`;
- `pnpm exec biome check packages/next/src packages/next/__tests__ --diagnostic-level=error`;
- `pnpm run package:check`;
- `git diff --check`.

After review and merge, release exact `@weaverse/next@0.1.0-alpha.16` with npm dist-tag `alpha`, pin that exact version in the POC, and verify the published transport on public storefront routes. Studio UI QA is not part of Hermes automation.
