# Feature: Fix ThemeSettingsStore Max Listeners Exceeded

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Status**       | completed                                                |
| **Owner**        | @paul-phan                                                |
| **Issue**        | #431                                                      |
| **Branch**       | N/A (not recorded)                                        |
| **Created**      | 2025-07-15                                                |
| **Last Updated** | 2025-07-15                                                |

## Original Prompt

> Not captured — this spec predates the SDD convention's requirement to record the original prompt verbatim. It was migrated from `docs/plans/2025-07-15-theme-settings-store-max-listeners-{plan,design}.md` on 2026-07-02.

## Summary

`ThemeSettingsStore` had a hard cap of 100 listeners; once exceeded, new `useThemeSettings()` subscriptions were silently dropped, so components stopped receiving theme setting updates. Removed the cap, added an advisory dev-only warning at 500 listeners, and consolidated 6 `useThemeSettings()` calls in Pilot's `badges.tsx` into 1. See [`design.md`](./design.md) for the root-cause analysis and [`plan.md`](./plan.md) for the task-by-task implementation.
