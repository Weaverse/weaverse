# Claude handoff — Next multi-runtime / nested instance selection parity

## Repo / branch

- Repo: `/Users/hta218/Documents/work/workspace/weaverse`
- Branch: `feat/next-multi-runtime-selection`
- Base: `main` at `3738e484 Release @weaverse/next 0.1.0-alpha.7`
- Tracker: https://github.com/Weaverse/builder/issues/2659

## Context

Continuing Next Productionization Epic 2663 after publishing `@weaverse/next@0.1.0-alpha.7` for pageAssignment/save payload parity.

Next requested slice from the parity roadmap: **multi-runtime / nested Weaverse instance behavior spec + tests**.

Hydrogen/Builder reference behavior:

- `packages/hydrogen/src/WeaverseHydrogenRoot.tsx::createWeaverseInstance()`:
  - stores every runtime in `window.__weaverses[pageId]`;
  - reuses only when `pageId + requestInfo.pathname + requestInfo.search` match;
  - same page on a different URL creates a fresh instance and overwrites that pageId registry key;
  - design mode calls `window.weaverseStudio.refreshStudio(normalizedParams)` for the live page.
- Builder Studio active-instance selection is in the Builder repo, not this package:
  - `builder/studio/utils/instance-binding.ts::resolveEditingInstance()` filters `window.__weaverses` to current `pathname + search` and then picks the editor-intended pageId or the DOM leaf instance.
  - `builder/studio/index.ts::init()` keys initialization by both pageId and requestInfo.
- Therefore SDK-side Next must primarily guarantee the same runtime registry/reuse contract and give Builder enough request/root-element data to select the right runtime.

Current Next code:

- `packages/next/src/runtime.ts`
  - `getRuntimeKey(pageId, requestInfo) => pageId:pathname:search`
  - `window.__weaverses[pageId] = runtime`
  - `window.__weaverse = runtime`
  - same request key reuses existing runtime;
  - design-mode reuse does not clobber live draft tree but updates latest payload/internal data.
- `packages/next/src/renderer.tsx` mounts `<WeaverseRoot context={weaverse} />` and `<WeaverseNextStudio runtime={weaverse} />`.
- `packages/next/__tests__/next-adapter.test.tsx` already covers single runtime create/reuse, but not multi-runtime/nested contract explicitly.

## Goal

Add narrow package-level tests and docs/work-log for Next multi-runtime parity. Prefer tests first. If tests expose a real bug, fix the smallest SDK-side issue. If existing implementation already passes, this PR can be tests/docs-only.

Expected test coverage (likely in `packages/next/__tests__/next-adapter.test.tsx`):

1. **Co-located multi-runtime registry**
   - Create two design-mode runtimes with the same `pathname + search` but different page IDs and distinct root/item IDs.
   - Assert `window.__weaverses` contains both keys.
   - Assert each runtime keeps its own `pageId`, `requestInfo`, `data.rootId`, `internal.pageAssignment`, and `project`.
   - Assert the runtimes are not reused across page IDs.

2. **Same page + same URL reuse**
   - Existing coverage likely already exists; strengthen only if needed.
   - Assert same pageId + same requestInfo returns the same runtime and updates internal payload fields.

3. **Same page + different URL does not reuse the stale runtime object**
   - Create page `page-1` at `/collections/a` then page `page-1` at `/collections/b`.
   - Assert the second call returns a different runtime object and `window.__weaverses['page-1']` points to the new runtime.
   - This mirrors Hydrogen's "reuse only while browser stays on same URL" comment.

4. **Studio bind calls init per runtime without collapsing registry**
   - Stub `window.weaverseStudio = { init: vi.fn(), refreshStudio: vi.fn() }`.
   - Bind both co-located design-mode runtimes.
   - Assert `init` is called for each runtime object.
   - Do **not** reimplement Builder's `resolveEditingInstance()` in the SDK tests; just verify Next passes both candidates through.

5. **Root element compatibility for Builder leaf selection** (only if feasible without jsdom)
   - The test env is Node, so don't add jsdom. You can directly set mocked refs or item `_element` values if simple.
   - If awkward, document that DOM leaf-selection is Builder-owned and covered there, while SDK ensures each runtime has distinct root item stores when item IDs are distinct.

## Non-goals

- Do not modify Builder Studio selection logic in this PR.
- Do not add new public API surface unless tests reveal an SDK bug that needs one.
- Do not solve translation/static-text, global sections, markets/i18n, or redirect helpers.
- Do not publish npm or update POC in this slice; Hermes will handle release flow after review/merge.
- Leave changes uncommitted; Hermes commits/pushes after review.

## Files to inspect/change

- `packages/next/src/runtime.ts`
- `packages/next/src/renderer.tsx`
- `packages/next/__tests__/next-adapter.test.tsx`
- `.specs/2026-06-21--next-studio-bridge/work-logs.md`

## Verification commands

Run at least:

```bash
pnpm --filter @weaverse/next test -- __tests__/next-adapter.test.tsx
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
git diff --check
```

Report exact commands/results. If the test runner executes extra package tests despite the file arg, report the actual count.
