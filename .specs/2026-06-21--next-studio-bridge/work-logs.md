# Claude/Hermes work log: Issue #2597 Next Studio Bridge E2E

Issue: https://github.com/Weaverse/builder/issues/2597
Branch: `feat/next-studio-bridge-e2e`
Date: 2026-06-23

## Changed files

- `packages/next/src/studio-router.ts`
- `packages/next/src/use-weaverse-next-studio.tsx`
- `packages/next/src/renderer.tsx`
- `packages/next/src/index.ts`
- `packages/next/package.json`
- `packages/next/tsconfig.json`
- `packages/next/vitest.config.ts`
- `packages/next/__tests__/studio-router.test.ts`
- `packages/next/__tests__/__mocks__/next-navigation.ts`
- `.specs/2026-06-21--next-studio-bridge/claude-handoff-issue-2597.md`

## Implementation summary

Claude implemented the first SDK-side Next Studio navigation/revalidation slice:

- Added `createWeaverseNextStudioInternals(router, options)` as a pure adapter from a Next App Router-like object to Studio runtime internals.
- Maps Studio `navigate(to, { preventScrollReset })` to:
  - `router.push(to, { scroll })` by default;
  - `router.replace(to, { scroll })` when `replace: true` is configured;
  - `scroll = false` when `preventScrollReset: true`.
- Maps Studio `revalidate()` to `router.refresh()`.
- Added `useWeaverseNextStudioInternals()` and `WeaverseNextStudio`, a client-only component that calls `useRouter()` from `next/navigation` and feeds callbacks into `WeaverseNextStudioBridge`.
- Updated `WeaverseNextRenderer` to render `WeaverseNextStudio` instead of the raw bridge, so package-level renderer owns Next-native Studio internal wiring.
- Exported the new Studio router helpers and component from `@weaverse/next`.
- Kept `next/navigation` external in tsup and test-mapped it to a local mock because Next is not installed in this monorepo test graph.

Hermes fixed the incomplete Claude pass:

- Fixed Vitest mock typing.
- Applied Biome import ordering.
- Avoided adding `next` as a peer dependency in this slice because regenerating the pnpm lockfile caused unrelated catalog/latest dependency churn. The runtime import remains external and resolves in the consuming Next app.

## Verification results

Passed locally in `Weaverse/weaverse`:

```bash
pnpm --filter @weaverse/next test
# 3 files, 56 tests passed

pnpm --filter @weaverse/next typecheck
# passed

pnpm --filter @weaverse/next build
# passed

pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/package.json --diagnostic-level=error
# passed

git diff --check
# passed
```

Also tested `pnpm install --frozen-lockfile --filter @weaverse/next --ignore-scripts` after removing the peer dependency addition; pnpm reported `Lockfile is up to date` but the command wrapper timed out after pnpm printed `Done`. No lockfile changes are present.

## Remaining risks / manual E2E steps

This is not full Studio E2E yet. Still required:

1. Install/pack this SDK branch into the Next POC.
2. Verify POC build with the new renderer importing `next/navigation`.
3. Mount `WeaverseNextStudioConnect` at the POC root/client shell if it is not already mounted.
4. Open live POC in Studio and verify:
   - bridge script loads;
   - `window.weaverseStudio` exists;
   - `checkWeaversePage()` succeeds;
   - section hover/select works;
   - setting edit updates preview without clobbering drafts;
   - resource-picker changes call `router.refresh()` and server data reloads.

## Builder changes

No Builder change appears necessary for this first slice. The code stays in `@weaverse/next` and maps the framework-specific internals to the existing bridge contract.

## 2026-07-02 — @hta218 (with Claude): fix stale refreshStudio payload on RSC revalidation

Symptom (POC "Resource picker smoke" section): picking a product in Studio ran
the loading bar, the draft was saved, but the section kept rendering the old
product. Publish + full Studio reload was required to see the new resource.

### Root cause (SDK, `packages/next/src/runtime.ts`)

The revalidation round-trip itself worked end-to-end: Builder's fetch patch
appended `weaverseDraftItem` to the Next `_rsc` request, the server loader ran
with the draft product handle, and the RSC response carried fresh per-item
`loaderData`. The failure was client-side in `createWeaverseNextRuntime`:

1. The reused design-mode runtime deliberately skips `setProjectData(page)`
   (correct — the live Studio tree owns unsaved drafts), but it also dropped
   the fresh payload entirely.
2. `bindWeaverseNextStudioRuntime` then called
   `studio.refreshStudio({ data: runtime.data, ... })` — the STALE live tree.
3. Builder's `refreshStudio` merges draft structural edits with the incoming
   payload's per-item `loaderData` (`buildRevalidatedItems`). With a stale
   payload it merged back the OLD `loaderData`, so the section re-rendered the
   previous resource while `revalidationVersion` still bumped — the loading bar
   completed and the preview looked "done" with stale data.

Hydrogen does not have this bug because `createWeaverseInstance` always passes
the fresh loader params straight to `window.weaverseStudio.refreshStudio(...)`.

### Fix

- `createWeaverseNextRuntime` now stashes the latest server payload on the
  runtime (`__weaverseNextLatestData`) on both the create and reuse paths,
  without touching the design-mode live tree.
- `bindWeaverseNextStudioRuntime` reports that stashed payload (falling back to
  `runtime.data`) to `refreshStudio`, mirroring Hydrogen's semantics: fresh
  data flows as a parameter; Builder owns the draft merge.

### Tests

- Updated `should_refresh_studio_after_reusing_runtime_with_new_page_data` —
  it previously asserted `data: reusedRuntime.data`, codifying the bug; it now
  asserts the fresh page items are reported.
- Added
  `should_report_fresh_loader_data_to_refresh_studio_when_design_mode_tree_is_stale`
  simulating the resource-picker flow (stale live tree + fresh `loaderData`).

### Verification

```bash
pnpm --filter @weaverse/next test       # 3 files, 59 tests passed
pnpm --filter @weaverse/next typecheck  # passed
pnpm --filter @weaverse/next build      # passed
pnpm exec biome check packages/next/src/runtime.ts \
  packages/next/__tests__/next-adapter.test.tsx --diagnostic-level=error  # clean
```

### Builder changes

None required — the #2601 Builder changes (draft-item `_rsc` param, deferred
refresh while silent update is pending, honored `shouldRevalidate` for
server-only loaders) are correct; the remaining gap was SDK-side only.

### Remaining manual E2E

Publish/pack a new `@weaverse/next` alpha, install it in the POC, and re-run
the resource-picker smoke: pick a product → loading bar → section renders the
new product without publish + Studio reload.

## 2026-07-09 — low-risk Hydrogen parity slice

After the dedicated Next Studio bridge path was validated end-to-end in the POC, #2659 was audited for remaining `@weaverse/hydrogen` vs `@weaverse/next` gaps. This slice intentionally tackles low-risk parity before deeper Studio/runtime features.

### Scope

- Add custom-page sitemap helper parity on `WeaverseNextServerClient.fetchCustomPages()`.
- Add Next Metadata-compatible SEO conversion helpers (`getWeaverseNextSeoMetadata`, `formatWeaverseNextSeoMetadata`).
- Add missing resource picker data aliases (`WeaverseBlog`, `WeaverseArticle`, `WeaverseMetaObject`) next to product/collection aliases.
- Update `packages/next/README.md` to reflect the dedicated `/static/studio/next/*` bridge and new helper APIs.

### Non-scope

- Translation/static-text sidecar runtime and save-payload support.
- Multi-runtime/nested page selection semantics.
- Global sections.
- Next request-handler/redirect ownership decision.

### Verification target

```bash
pnpm --filter @weaverse/next test
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
git diff --check
```
