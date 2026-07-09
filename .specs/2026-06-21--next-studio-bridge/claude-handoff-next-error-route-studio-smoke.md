# Claude handoff: Next error/404 route Studio connect smoke

Repo: `/Users/hta218/Documents/work/workspace/weaverse`
Branch: `feat/next-error-route-studio-smoke`
Base: `main` after PR #481 merge (`249ea48a`)
Tracker: https://github.com/Weaverse/builder/issues/2659

## Context

Leo asked to continue the Next productionization parity roadmap after PR #481 merged. Hermes should review/verify; Claude should implement.

The dedicated Next Studio bridge is already validated in the POC for normal Weaverse pages. Remaining parity roadmap says the next low-risk slice is **404/error-route Studio connect tests/smoke**.

Current package facts:

- Root-level script connector: `packages/next/src/studio-connect.tsx`
- Page-level renderer/runtime binder: `packages/next/src/renderer.tsx`, `packages/next/src/runtime.ts`, `packages/next/src/studio-bridge.tsx`, `packages/next/src/use-weaverse-next-studio.tsx`
- Existing tests: `packages/next/__tests__/next-adapter.test.tsx`, `studio-router.test.ts`, `next-server.test.tsx`, `revalidate-item.test.ts`
- Test environment is Node, not jsdom. Avoid adding new deps unless absolutely necessary.

## Goal

Make the package-level 404/error route Studio-connect story explicit and covered by tests.

A Next app should be able to mount `<WeaverseNextStudioConnect />` in a root client boundary/layout so Studio scripts still load on routes that do **not** render `<WeaverseNextRenderer />`, e.g. App Router `not-found.tsx` / `error.tsx` routes. This is important because Studio needs the bridge script before a page tree exists.

## Expected implementation shape

Prefer a small, low-risk change:

1. Extract a pure-ish helper from `studio-connect.tsx` that can be tested in Node without React effect execution. Suggested API (adjust if you find a better name):
   - `loadWeaverseNextStudioScript(context?, options?)`
   - It should resolve the script via existing `resolveWeaverseNextStudioScriptSrc(...)`, dedupe by src, and append the script to `document.head` only when `document` exists.
   - It should accept `storefrontHostname` like the component does.
   - Keep SSR safe: no throw when `window`/`document` are absent.
2. Make `WeaverseNextStudioConnect` call that helper in `useEffect`.
3. Add Node tests with a tiny document/window stub to verify:
   - design-mode root connector loads `/static/studio/next/index.js` even when there is no page/runtime/renderer data (simulates 404/error route root layout).
   - preview-mode connector loads `/static/studio/next/preview.js`.
   - duplicate calls with the same src append only once.
   - SSR/no-document path is a no-op.
   - untrusted `weaverseHost` remains rejected/no script appended.
4. Update `packages/next/README.md` to explicitly mention mounting `WeaverseNextStudioConnect` in the app root/layout to support normal pages, `not-found.tsx`, and `error.tsx` routes.
5. Append a concise work-log entry to `.specs/2026-06-21--next-studio-bridge/work-logs.md`.

## Non-goals

- Do not implement translation/static-text, global sections, multi-runtime/nested Weaverse behavior, or request-handler/redirect parity in this PR.
- Do not modify Builder.
- Do not publish, push, merge, or create PR.
- Avoid adding jsdom/happy-dom/testing-library just for this slice.

## Verification commands

Run at least:

```bash
pnpm --filter @weaverse/next test
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
git diff --check
```

If a command fails because of an issue introduced by your diff, fix it and rerun.

## Reporting

When done, leave files changed but do not commit. Report:

- changed files
- behavior covered
- verification commands/results
- any remaining risk
