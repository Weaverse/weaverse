# Claude handoff — Next published-pageview analytics

## Context

- Repo: `/Users/hta218/Documents/work/workspace/weaverse`
- Branch: `feat/next-pageview-analytics`
- Base: `1a695920c3872bc9be0f7ffb81485a7d7bf5d089`
- Tracker: https://github.com/Weaverse/builder/issues/2738
- Spec: `.specs/2026-08-01--next-pageview-analytics/{README.md,plan.md,work-logs.md}`

Read repo-local `AGENTS.md`, the complete spec, and these existing parity references before editing:

- `packages/hydrogen/src/utils/pixel.ts`
- `packages/hydrogen/src/utils/use-studio.ts` (`usePixel`)
- `packages/hydrogen/__tests__/use-pixel.test.ts`
- `packages/next/src/renderer.tsx`
- `packages/next/src/runtime.ts`
- `packages/next/src/types.ts`

## Goal

Implement automatic Weaverse published-pageview analytics in `@weaverse/next` using TDD. Keep transport and deduplication private to the package. Integrate through `WeaverseNextRenderer` so consumers do not add starter code.

## Required behavior

- One `/api/public/px` GET per `(real navigation, pageId)`.
- Count initial published render and committed client navigation.
- Deduplicate same-page nested/co-located runtimes.
- Count distinct co-located page IDs separately.
- Do not double-fire during React Strict Mode effect cleanup/remount.
- Allow revisits after an observed navigation through a non-Weaverse route; do not infer route changes while the entire SDK tree is absent.
- Handle persistent layout runtimes and reused page runtimes.
- Skip design, preview, and revision modes.
- Missing host/project/page values are no-ops.
- Network errors never affect rendering.

## Expected shape

- Pure internal coordinator in `packages/next/src/pageview.ts`.
- Internal client hook in `packages/next/src/use-pageview.ts`, using `usePathname()` and normalized `useSearchParams()` as Next navigation identity.
- Renderer-owned invisible tracker component that calls the hook with a nullable runtime inside a narrow SDK-owned `Suspense` boundary; storefront content remains outside.
- High-signal focused tests under `packages/next/__tests__/` with AAA and `should_*_when_*` names.
- Prove RED before implementation and record the failing evidence in the work log.

## Non-goals

- Do not change `packages/hydrogen`, Builder, POC, starter code, or experiments.
- Do not add GA/Meta/vendor analytics, consent management, or a generic/public analytics API.
- Do not change public exports or API reports unless unavoidable and justified.
- Do not publish, commit, push, open a PR, or edit package versions.
- Do not edit `.claude/skills/releasing-weaverse-sdks/SKILL.md`; Hermes owns that separate procedural correction.

## Verification

Run focused tests while editing, then:

```bash
pnpm --filter @weaverse/next test
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ --diagnostic-level=error
git diff --check
```

Leave all changes uncommitted. Report exact files changed and command results; Hermes will review, run package checks, commit, and push.
