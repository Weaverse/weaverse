# Feature: Optional merchant-overrides loading

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Status**       | in-progress                                              |
| **Owner**        | @ken                                                      |
| **Issue**        | [Weaverse/builder#2291](https://github.com/Weaverse/builder/issues/2291) (child of #2069 — Full i18n epic); [#535](https://github.com/Weaverse/weaverse/issues/535) |
| **Branch**       | `fix/optional-merchant-overrides`                         |
| **Created**      | 2026-06-30                                                |
| **Last Updated** | 2026-10-06                                                |

## Initiating Requirement

> Not captured — this spec predates the SDD convention's requirement to record the original prompt verbatim. It was migrated from `docs/plans/2026-06-30-gate-merchant-overrides-on-i18n.md` on 2026-07-02.

## Scope Updates

### 2026-10-06 — Bound the optional overrides request (#535)

> For a theme that opts into i18n, `loadThemeSettings` waits for both the main theme-settings response and `fetchMerchantOverrides` with `Promise.all`. In ordinary live mode the overrides request (`{weaverseHost}/api/translation/static`) goes through Hydrogen's `withCache.fetch`, which adds no deadline, unlike the timeout-protected `directFetch`. On a cold cache, a stalled overrides request can keep theme loading pending after the main settings have already succeeded; the existing default fallback only runs once the request settles.
>
> - Bound the overrides request at the real cached-fetch boundary, including response-body completion. On timeout or failure, settle with the theme defaults and cancel the abandoned transport where the runtime supports it. Reuse the existing timeout conventions.
> - Successful overrides still merge and keep their caching behavior. A timed-out or partial response is never stored as override data.
> - Unchanged: no overrides request for themes without i18n, project and locale cache separation, design and revision behavior, main settings error behavior, and the direct-fetch retry semantics. Do not change other cached requests or add retry or cache infrastructure.
> - Prove the stall with a controlled offline regression through the real Hydrogen cached fetch, failing before the fix, plus a successful-overrides control.
>
> This is a source-backed failure boundary, not a measured production incident.

## Summary

`loadThemeSettings()` fetches locale-specific merchant overrides only for themes that declare an `i18n` schema, so themes without i18n make zero translation API calls during SSR. The overrides request is optional: it is bounded by the client fetch timeout, so a stalled request falls back to theme defaults instead of holding theme loading, and an aborted response is never cached. Scope: `@weaverse/hydrogen` only. See [`plan.md`](./plan.md).

Current phase (2026-10-06): the #535 fix is implemented and under pull-request review; it is not yet released in a published `@weaverse/hydrogen` version.
