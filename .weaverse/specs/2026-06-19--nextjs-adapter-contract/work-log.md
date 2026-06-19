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
