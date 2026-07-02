# Plan: Weaverse lazy-section loading — investigation & measurement

**Goal:** Investigate whether lazy-loading Weaverse section glue code (only rendering/hydrating sections present on a page, instead of shipping all registered sections) improves Pilot's mobile Lighthouse performance score, and ship any safe, measured wins along the way.

## Approach

1. Ship independently-verifiable mobile-performance fixes first (image sizing, LCP render-delay, popup gating) — see Part A of `work-logs.md`.
2. Measure the actual initial-JS bundle composition on `weaverse.dev` before assuming the lazy-section refactor would help — see Part B.
3. If the refactor's premise doesn't hold under measurement, do not implement it; instead test cheaper levers (e.g. inline critical CSS) and measure their real PSI impact — see Part C.
4. Record the decision and the measured ceiling so the investigation isn't repeated without new data.

## Files and folders touched

- `../pilot` (sibling repo, `Weaverse/pilot`) — PR [#430](https://github.com/Weaverse/pilot/pull/430), branch `perf/mobile-lighthouse-lcp`: image sizing, hero slideshow/text immediate-render, newsletter popup gating
- `../pilot` — `.github/workflows/claude-code-review.yml` — re-enabled + switched to `workflow_dispatch`-only
- `root.tsx` inline-CSS experiment (Pilot) — implemented, measured, and reverted (no benefit)
- No changes in this repo (`Weaverse/weaverse`) — the `@weaverse/react` lazy-registry / per-item `<Suspense>` refactor discussed in Part B was investigated but **not implemented** (rejected after measurement)

## Outcome

Refactor rejected; see `work-logs.md` for the full measured findings and decision record. This spec is closed as investigated-and-blocked, not implemented.
