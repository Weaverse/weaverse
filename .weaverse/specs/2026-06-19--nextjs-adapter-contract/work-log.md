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
