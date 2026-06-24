# Claude handoff: Next Studio Bridge E2E for @weaverse/next

Issue: https://github.com/Weaverse/builder/issues/2597
Branch: `feat/next-studio-bridge-e2e`
Date: 2026-06-23

## Goal

Implement the SDK-side part of **Next Studio Bridge E2E for `@weaverse/next`**.

Start in `packages/next`. Do **not** modify Builder unless you can prove the current bridge bundle cannot work with a Next-compatible runtime. Do **not** push. Hermes will inspect, verify, and push.

## Context

The POC already renders real Weaverse data on `/` via `@weaverse/next/server` and `weaverse.loadPage({ type: 'INDEX' })`. Rendering works, but Studio connect/edit/revalidate is not yet proven.

Leo clarified two important requirements:

1. Studio script loading must be owned by `@weaverse/next`, matching `@weaverse/hydrogen` architecture.
2. Hydrogen runtime internals are React Router-specific. Next needs Next App Router equivalents:
   - `internal.navigate` -> `next/navigation` router navigation
   - `internal.revalidate` -> `router.refresh()`

## Source files to read first

Hydrogen reference:

- `packages/hydrogen/src/utils/use-studio.ts`
- `packages/hydrogen/src/utils/studio-script-src.ts`
- `packages/hydrogen/src/WeaverseHydrogenRoot.tsx`
- `packages/hydrogen/src/types.ts`

Current Next implementation:

- `packages/next/src/studio-connect.tsx`
- `packages/next/src/studio-bridge.tsx`
- `packages/next/src/runtime.ts`
- `packages/next/src/renderer.tsx`
- `packages/next/src/provider.tsx`
- `packages/next/src/theme-settings-store.ts`
- `packages/next/src/studio-script-src.ts`
- `packages/next/src/types.ts`
- `packages/next/src/index.ts`
- `packages/next/package.json`

Spec/reference notes:

- `.weaverse/specs/2026-06-21--next-studio-bridge/01-next-runtime-contract.md`
- `.weaverse/specs/2026-06-21--next-studio-bridge/02-next-adapter-gap-analysis.md`
- `.weaverse/specs/2026-06-21--next-studio-bridge/03-proposed-next-architecture.md`

## Required implementation shape

Design a package-level Next client boundary so consuming apps can mount SDK-provided Studio support without manually wiring Studio scripts/navigation. Prefer a small public API over app-local hacks.

Expected direction:

- Keep root-level script connect separate from page-level runtime bind, like Hydrogen.
- Add/finish a Next-specific client component/hook that uses `useRouter()` from `next/navigation` and passes:
  - `navigate` -> `router.push(...)` or `router.replace(...)`, with `scroll: false` when appropriate.
  - `revalidate` -> `router.refresh()`.
- Ensure this is client-only and does not make `@weaverse/next/server` import `next/navigation` or React client code.
- If importing `next/navigation` requires package metadata changes, update `packages/next/package.json` carefully (peer/dev/optional as appropriate for this monorepo).
- Preserve existing public exports where possible; avoid breaking already-published alpha APIs.
- Keep existing compatibility shims/deep imports intact.

## Runtime/bridge requirements

The runtime bound to `window.weaverseStudio.init(runtime)` must expose the structural contract expected by the Studio bridge:

- `pageId`
- `projectId`
- `requestInfo`
- `data` / `dataContext`
- `internal.project`
- `internal.pageAssignment`
- `internal.navigate`
- `internal.revalidate`
- `internal.themeSettingsStore`
- `setProjectData()` / `triggerUpdate()` / item instances via core runtime

Design mode reused runtime must not clobber unsaved drafts. Existing logic already avoids `setProjectData(page)` when design mode is involved; preserve that behavior.

## Tests to add/update

Add focused tests in `packages/next/__tests__` for the high-risk pieces you touch. Prefer unit tests that do not need a real browser/Next app.

At minimum, cover one or more of:

- Next Studio boundary wires `navigate` and `revalidate` into `WeaverseNextStudioBridge`.
- Runtime bind initializes once, then refreshes on reused runtime updates.
- Script resolver/connect keeps script loading package-owned.
- Request/design mode no-store behavior stays intact if you touch server client/cache.
- Type/API exports remain stable.

If `next/navigation` is hard to unit test directly, isolate a small adapter function/component prop boundary so the behavior is testable with mocks.

## Verification commands

Run and report:

```bash
pnpm --filter @weaverse/next test
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/package.json --diagnostic-level=error
git diff --check
```

If a command fails due to pre-existing unrelated repo state, capture the exact output and narrow the cause.

## Output requirement

Before exiting, write a concise work log to:

`.weaverse/specs/2026-06-21--next-studio-bridge/claude-worklog-issue-2597.md`

Include:

- changed files
- implementation summary
- verification commands/results
- remaining risks / manual Studio E2E steps
- whether Builder changes appear necessary

Again: do **not** push and do **not** create/publish packages. Hermes will verify and handle follow-up.
