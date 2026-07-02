# Feature: Next.js adapter contract for framework-neutral Hydrogen

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Status**       | in-progress                                              |
| **Owner**        | Weaverse SDK team                                        |
| **Issue**        | [Weaverse/builder#2533](https://github.com/Weaverse/builder/issues/2533) |
| **Branch**       | N/A (design-only spec)                                    |
| **Created**      | 2026-06-19                                                |
| **Last Updated** | 2026-06-19                                                |

## Original Prompt

> Not captured — this spec predates the SDD convention's requirement to record the original prompt verbatim. It was migrated from `.weaverse/specs/2026-06-19--nextjs-adapter-contract/` on 2026-07-02.

## Summary

Defines the first `@weaverse/next` adapter contract so Weaverse can support a Next.js App Router storefront while keeping the existing React Router/Hydrogen SDK stable. Follows on from the `Weaverse/weaverse-hydrogen-next-poc` feasibility spike (public Storefront token mode, serialized page tree rendering). See [`plan.md`](./plan.md) for the full contract.

## Supporting documents

- [`plan.md`](./plan.md) — full adapter contract, design principles, data flow, and implementation slices
- [`pilot-usage-audit.md`](./pilot-usage-audit.md) — audit of current Pilot usage of `@weaverse/hydrogen`, classified by category
- [`claude-goal-packages-next-v0.md`](./claude-goal-packages-next-v0.md) — Claude Code handoff brief for the `packages/next` v0 shell implementation
- [`work-logs.md`](./work-logs.md) — timeline of investigation and implementation work

## Follow-on spec

[`../2026-06-21--next-studio-bridge/`](../2026-06-21--next-studio-bridge/) narrows this contract to the Studio Bridge compatibility slice.
