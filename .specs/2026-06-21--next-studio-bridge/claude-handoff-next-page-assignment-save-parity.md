# Claude handoff — Next pageAssignment / Studio save payload parity

## Repo / branch

- Repo: `/Users/hta218/Documents/work/workspace/weaverse`
- Branch: `feat/next-page-assignment-save-parity`
- Base: `main` at `0780667b Release @weaverse/next 0.1.0-alpha.6`
- Tracker: https://github.com/Weaverse/builder/issues/2659

## Context

We are continuing Next Productionization Epic 2663. Already shipped:

- dedicated Next Studio bridge `/static/studio/next/*`
- low-risk helper parity
- error/404 Studio script loading
- root-scoped theme settings provider (`WeaverseNextRootProvider`), published in `@weaverse/next@0.1.0-alpha.6`
- POC root-provider PR merged and manually smoke-tested by Leo

Next requested slice: **pageAssignment / Studio save payload parity**.

Hydrogen reference path:

- `packages/hydrogen/src/weaverse-client.ts`: `loadPage()` preserves `project`, `page`, `pageAssignment` from `/api/public/project`.
- `packages/hydrogen/src/WeaverseHydrogenRoot.tsx`: runtime internal carries `{ project, pageAssignment }`.
- Builder Studio uses `window.__weaverses` and `studio/utils/data.ts::generatePageData()` to build `{ page, pageAssignment }` for save.
- Builder save schema expects `pageAssignment` with `{ projectId, type, locale, handle }`; backend may include `meta` on the wire but it is not saved directly.
- Builder fallback helper: `studio/utils/page-meta.ts::resolveFallbackPageMeta()` treats `fallback_page_*` ids specially and names the new page from `pageAssignment.handle`.

Current Next state:

- `packages/next/src/server/server-client.ts::_createLoaderData()` copies `payload.pageAssignment` as a loose record.
- `packages/next/src/runtime.ts` sets/updates `runtime.internal.pageAssignment` from loader data.
- `packages/next/src/types.ts` currently types `pageAssignment` / `internal.pageAssignment` as loose `Record<string, unknown>` / `unknown`.
- Existing tests cover that runtime internal receives `pageAssignment` at a basic level, but not save-compatible shape, locale normalization, or inherited `meta` preservation.

## Goal

Make the Next package’s page assignment contract explicit and test-backed so the Builder Studio save pipeline receives the same page assignment payload shape it expects from Hydrogen.

Expected implementation shape:

1. Add an explicit exported type for Next page assignments, e.g. `WeaverseNextPageAssignment`, with at least:
   - `projectId: string`
   - `type: PageType | string` (or equivalent that fits existing package typing)
   - `locale: string`
   - `handle: string`
   - optional `meta` for inherited/fallback metadata, preserving unknown fields safely
2. Add a small normalizer/helper if useful, e.g. `normalizeWeaverseNextPageAssignment(input)`:
   - returns `undefined` for missing/malformed assignments rather than fabricating one
   - normalizes `locale: null | undefined` to `''`
   - preserves `meta` when it is an object
   - keeps the payload save-compatible and framework-neutral
3. Use that normalizer in `createWeaverseNextServerClient().loadPage()` / `_createLoaderData()`.
4. Tighten `WeaverseNextLoaderData.pageAssignment` and `WeaverseNextRuntimeInternal.pageAssignment` types to the explicit type.
5. Add tests proving:
   - `loadPage()` preserves a full save-compatible assignment, including `projectId`, `type`, `locale`, `handle`, and inherited `meta`.
   - `loadPage()` normalizes nullish locale to `''`.
   - `WeaverseNextRuntime` exposes that page assignment on `runtime.internal.pageAssignment`.
   - Reusing a design-mode runtime on navigation/request-key changes updates `runtime.internal.pageAssignment` to the latest loader payload.
   - Existing fallback page id prefix (`fallback_page_*`) remains unchanged if tests touch fallback data.
6. Update README/spec work-log concisely with the save payload contract and verification.

## Non-goals

- Do not touch Builder save endpoint or database writes in this SDK PR unless a test reveals an SDK-caused incompatibility.
- Do not implement translation/static-text sidecar in this slice.
- Do not change global sections, multi-runtime selection, markets/i18n cache strategy, or redirect helpers.
- Do not publish npm; Hermes will verify and decide next step.
- Leave changes uncommitted; Hermes will review, run checks, commit, push, and open the PR.

## Verification commands

Run at least:

```bash
pnpm --filter @weaverse/next test -- __tests__/next-server.test.tsx __tests__/next-adapter.test.tsx
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
git diff --check
```

Report exact commands and results. If you hit an unrelated/pre-existing failure, include the failure and continue with the narrow checks where possible.
