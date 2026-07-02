# Feature: Gate merchant-overrides fetch on the theme's i18n schema

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Status**       | completed                                                |
| **Owner**        | @ken                                                      |
| **Issue**        | [Weaverse/builder#2291](https://github.com/Weaverse/builder/issues/2291) (child of #2069 — Full i18n epic) |
| **Branch**       | N/A (not recorded)                                        |
| **Created**      | 2026-06-30                                                |
| **Last Updated** | 2026-06-30                                                |

## Original Prompt

> Not captured — this spec predates the SDD convention's requirement to record the original prompt verbatim. It was migrated from `docs/plans/2026-06-30-gate-merchant-overrides-on-i18n.md` on 2026-07-02.

## Summary

`loadThemeSettings()` fired an unconditional `fetchMerchantOverrides()` translation API call on every SSR, even for themes with no `i18n` schema declared. Added a guard mirroring the existing `staticContent` gate so themes without i18n make zero translation API calls during SSR. Scope: `@weaverse/hydrogen` only. See [`plan.md`](./plan.md) for the full problem/change/verification writeup.
