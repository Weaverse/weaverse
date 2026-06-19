# Work log: Next.js adapter contract

## 2026-06-19 — Alan

- Created design spec for Weaverse/builder#2533.
- Confirmed `packages/next` currently only contains `.gitkeep`.
- Read repo guidance from `AGENTS.md`, current architecture notes, and existing `@weaverse/hydrogen` APIs:
  - `WeaverseClient`
  - `WeaverseHydrogenRoot`
  - `WeaverseHydrogen`
  - `HydrogenComponent` / loader types
- Captured POC findings from `Weaverse/weaverse-hydrogen-next-poc`:
  - `@shopify/hydrogen@preview` works in Next.js App Router.
  - public Storefront token mode is valid for the spike.
  - live product/collection/cart/checkout were verified on Vercel.
  - serialized Weaverse section tree rendering works.
- Recommended next step: Pilot usage audit before implementing `packages/next`.

## 2026-06-19 — Alan (Pilot usage audit)

- Audited `/Users/hta218/Documents/work/workspace/pilot` read-only.
- Source branch was `fix/390-cart-discount-display`; worktree was clean.
- Scanned 303 TS/TSX/JS/JSX files excluding generated/vendor directories.
- Key counts:
  - `@weaverse/hydrogen` imports: 134 files
  - `@shopify/hydrogen` imports: 78 files
  - `react-router` imports: 115 files
  - registered Weaverse components: 82
  - `context.weaverse.loadPage` route calls: 9
  - `createSchema` files: 82
  - `HydrogenComponentProps` files: 56
  - `ComponentLoaderArgs` files: 6
  - `useThemeSettings` files: 20
  - `useLoaderData` files: 41
  - `useRouteLoaderData` files: 10
- Wrote [`pilot-usage-audit.md`](./pilot-usage-audit.md).
- Updated the main README to mark component loaders and explicit root/page data hooks as v0 must-haves.
- New recommended next action: implement the small `packages/next` shell + renderer/provider spike with fixture tests.

## 2026-06-19 — Alan (packages/next v0 shell)

- Created a self-contained Claude Code handoff at [`claude-goal-packages-next-v0.md`](./claude-goal-packages-next-v0.md).
- Ran Claude Code 2.1.179 in print mode on branch `feat/next-adapter-shell`; Claude hit `Reached max turns (45)` after producing a partial diff.
- Finished verification/fixes manually:
  - fixed TypeScript errors in tests, loader recursion, and renderer root id handling
  - added required `'use client'` boundaries to provider/hooks/renderer for Next App Router
  - memoized provider context value to avoid avoidable renderer/store reinitialization
  - removed generated `dist/` output from the working tree
  - removed unnecessary optional `next` peer dependency to avoid pulling Next/sharp into the lockfile
  - made React/ReactDOM peer dependencies so tests use one React instance with `@weaverse/react`
  - corrected lockfile to add only the minimal `packages/next` importer without upgrading Vite+/tooling
- Implemented `@weaverse/next` v0 package shell:
  - `createWeaverseNextClient`
  - `WeaverseNextProvider`
  - `WeaverseNextRenderer`
  - `runWeaverseComponentLoaders`
  - explicit hooks: `useWeaverseRootData`, `useWeaversePageData`, `useWeaverseCommerce`, `useThemeSettings`
  - schema/runtime hook re-exports for migration ergonomics
- Added tests for provider hooks, outside-provider errors, component loader commerce/storefront alias, inline child loader recursion, renderer fixture output, and no `react-router` / `@shopify/remix-oxygen` imports in `packages/next/src`.
- Verification results:
  - `pnpm install --frozen-lockfile --ignore-scripts` ✅
  - `pnpm --filter @weaverse/next test` ✅ — 9 tests passed
  - `pnpm --filter @weaverse/next typecheck` ✅
  - `pnpm --filter @weaverse/next build` ✅
  - `pnpm run biome -- packages/next` ✅
  - `pnpm exec turbo run typecheck --filter=@weaverse/next` ✅
  - `pnpm exec turbo run build --filter=@weaverse/next` ✅
  - autoreview-copilot local review ✅ — clean after fixing client-boundary/memoization findings
- Known limitation: network I/O is intentionally injected through `fetchPage` / `fetchThemeSettings`; this slice proves contract shape and rendering/loader mechanics, not the production Weaverse API fetcher.
