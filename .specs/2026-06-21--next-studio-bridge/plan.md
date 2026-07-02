# Plan: Next.js Studio Bridge compatibility

## Executive summary

`@weaverse/next` can render a Weaverse page tree in a Next.js App Router storefront, but Studio connectivity requires more than iframe preview rendering.

Studio needs a browser-side bridge lifecycle:

1. Root-level script connection when Studio/design-mode query markers are present.
2. Page-level runtime binding when a Weaverse runtime instance exists.
3. A design-mode update loop so Studio receives refreshed page/runtime data after edits, route refreshes, and page changes.

The current `@weaverse/next` alpha is render-only. It creates a base `Weaverse` instance and renders `<WeaverseRoot />`; it does not load the Studio script, expose `window.weaverseStudio`, bind a Studio-compatible runtime, or drive the Studio refresh loop.

## Repo placement

This public SDK spec intentionally avoids detailed private Builder internals.

- Public `Weaverse/weaverse`: SDK-facing runtime contract, adapter gaps, proposed Next architecture, verification requirements.
- Private `Weaverse/builder`: exact Studio/RPC implementation audit, private Builder source paths, and investigation work logs.

## Reading map

1. [`01-next-runtime-contract.md`](./01-next-runtime-contract.md) — public runtime contract `@weaverse/next` must satisfy.
2. [`02-next-adapter-gap-analysis.md`](./02-next-adapter-gap-analysis.md) — current package gaps.
3. [`03-proposed-next-architecture.md`](./03-proposed-next-architecture.md) — proposed SDK architecture.
4. [`04-verification-plan.md`](./04-verification-plan.md) — verification layers and pass/fail criteria.
5. [`claude-review.md`](./claude-review.md) — public summary of Claude's architecture review.

## Goals

- Define the minimum public SDK runtime needed for Studio Bridge compatibility.
- Preserve the current render-only adapter strengths.
- Avoid leaking private Builder implementation details into the public SDK repo.
- Provide enough contract detail for another agent or engineer to implement the SDK side.

## Non-goals

- Do not document private Builder RPC internals in this public repo.
- Do not rewrite Builder Studio as part of the SDK spec.
- Do not implement code in this spec-only PR.
- Do not solve full Pilot parity in this slice.
- Do not expose server-only API keys/tokens to the client.

## High-level architecture

```text
Next App Router server route
  -> fetch page/theme data with request-aware cache policy
  -> pass serializable data/config into a client boundary

@weaverse/next client boundary
  -> register components in browser
  -> create/reuse a Studio-compatible runtime
  -> render <WeaverseRoot context={runtime} />
  -> in design mode, load Studio bridge script
  -> bind runtime via window.weaverseStudio.init(runtime)
  -> on reused design-mode renders, call window.weaverseStudio.refreshStudio(params)
```

## Phase recommendation

1. Update this public SDK spec and the private Builder companion spec.
2. Implement the `@weaverse/next` runtime compatibility layer.
3. Update the POC to pass real project/runtime metadata and design-mode no-store fetching.
4. Verify direct design-mode bridge probes.
5. Verify actual Studio iframe connection and basic editing.
6. Split Builder bridge output only if the existing structural bridge cannot be reused.

## Files and folders touched

- `.specs/2026-06-21--next-studio-bridge/` — this spec (public contract, gap analysis, proposed architecture, verification plan)
- `packages/next/` — target implementation package (see `03-proposed-next-architecture.md`)
- Companion private spec: `Weaverse/builder#2586` (Studio/RPC implementation audit, out of scope for this repo)
- No implementation code changes in this spec-only slice
