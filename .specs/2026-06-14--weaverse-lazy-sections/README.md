# Feature: Weaverse lazy-section loading — investigation, measurement & decision

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Status**       | completed                                                |
| **Owner**        | @paul-phan                                                |
| **Issue**        | N/A                                                       |
| **Branch**       | N/A (cross-repo investigation; see `plan.md` for the Pilot PR) |
| **Created**      | 2026-06-14                                                |
| **Last Updated** | 2026-06-14                                                |

## Original Prompt

> Not captured — this spec predates the SDD convention's requirement to record the original prompt verbatim. It was migrated from `docs/plans/2026-06-14-weaverse-lazy-sections.md` on 2026-07-02.

## Summary

Investigated whether lazy-loading Weaverse section glue code would move Pilot's mobile Lighthouse score above 80. A live bundle measurement refuted the refactor's premise (the removable slice is ~25–35 KB out of a ~280 KB non-removable framework/runtime/shell floor), so the refactor was **rejected**. The one remaining "safe" lever (inlining critical CSS) was implemented, deployed, measured over 5 PSI runs, found to be a wash, and reverted. Four unrelated mobile-perf fixes shipped in [Pilot PR #430](https://github.com/Weaverse/pilot/pull/430) stand. See [`plan.md`](./plan.md) for scope and [`work-logs.md`](./work-logs.md) for the full measured findings.
