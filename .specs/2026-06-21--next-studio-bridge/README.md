# Feature: Next.js Studio Bridge compatibility

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Status**       | in-progress                                              |
| **Owner**        | Weaverse SDK team                                        |
| **Issue**        | [Weaverse/builder#2533](https://github.com/Weaverse/builder/issues/2533) |
| **Branch**       | N/A (design-only spec; public PR [Weaverse/weaverse#470](https://github.com/Weaverse/weaverse/pull/470)) |
| **Created**      | 2026-06-21                                                |
| **Last Updated** | 2026-07-09                                                |

## Original Prompt

> Not captured — this spec predates the SDD convention's requirement to record the original prompt verbatim. It was migrated from `.weaverse/specs/2026-06-21--next-studio-bridge/` on 2026-07-02.

## Summary

`@weaverse/next` can render a Weaverse page tree in a Next.js App Router storefront, but Studio connectivity requires more than iframe preview rendering — it needs a browser-side bridge lifecycle (root-level script connection, page-level runtime binding, and a design-mode update loop). This spec defines the minimum public SDK runtime contract for Studio Bridge compatibility. See [`plan.md`](./plan.md) for the full plan and reading map.

This public SDK spec intentionally avoids private Builder internals — those live in the companion private spec `Weaverse/builder#2586`.

## Supporting documents

- [`plan.md`](./plan.md) — executive summary, goals, architecture, and phase recommendation
- [`01-next-runtime-contract.md`](./01-next-runtime-contract.md) — public runtime contract `@weaverse/next` must satisfy
- [`02-next-adapter-gap-analysis.md`](./02-next-adapter-gap-analysis.md) — current package gaps
- [`03-proposed-next-architecture.md`](./03-proposed-next-architecture.md) — proposed SDK architecture
- [`04-verification-plan.md`](./04-verification-plan.md) — verification layers and pass/fail criteria
- [`claude-review.md`](./claude-review.md) — public summary of Claude's architecture review
- [`claude-handoff-issue-2597.md`](./claude-handoff-issue-2597.md) — agent handoff brief
- [`work-logs.md`](./work-logs.md) — timeline of investigation and implementation work

## Precursor spec

[`../2026-06-19--nextjs-adapter-contract/`](../2026-06-19--nextjs-adapter-contract/) defines the base `@weaverse/next` adapter contract this spec narrows to Studio Bridge compatibility.
