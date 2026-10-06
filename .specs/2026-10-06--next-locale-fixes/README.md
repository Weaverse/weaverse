# Feature: Next locale fixes — reused-item defaults and market path prefix

| Field            | Value                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| **Status**       | in-progress                                                                                    |
| **Owner**        | @hta218                                                                                        |
| **Issue**        | [#511](https://github.com/Weaverse/weaverse/issues/511), [#534](https://github.com/Weaverse/weaverse/issues/534) |
| **Branch**       | `fix/next-locale-fixes`                                                                        |
| **PR**           | [#537](https://github.com/Weaverse/weaverse/pull/537)                                          |
| **Created**      | 2026-10-06                                                                                     |
| **Last Updated** | 2026-10-07                                                                                     |

## Initiating Requirement

> Steps 1–2 of the `@weaverse/next` stable release plan (Weaverse/builder#2661), shipped as `@weaverse/next@0.1.0-alpha.19`:
>
> 1. **#511:** a reused Next item must not keep the previous locale's settings.
>    - Explicit nested locale values still replace previous values.
>    - Omitted settings reset to schema defaults.
>    - A complete serialized item with omitted optional `data` resets to schema defaults.
>    - Stale nested/flattened settings from the previous payload are removed.
>    - Deferred subscriber notifications remain render-safe and fire once after commit.
>    - Regressions are added next to the existing EN → FR locale-reuse test.
> 2. **#534:** apply `i18n.pathPrefix` to the request pathname so Studio's address bar keeps the market.
>    - Prefix the pathname in `buildWeaverseNextRequestInfo` / `getPathnameFromContext` and in `resolveRequestUrl` when `i18n.pathPrefix` is set and the path does not already carry it.
>    - Idempotent for already-prefixed paths; a no-op for the default market's empty prefix.
>    - Unit tests for all three cases.
> 3. Pin `@weaverse/next` to `@weaverse/react` 5.22.0 and `@weaverse/schema` 0.17.0, in line with `@weaverse/hydrogen` (unblocks Weaverse/forward#89).

## Scope Updates

### 2026-10-06 — PR #537 review

> Address the review on #537:
> - CodeQL `js/polynomial-redos`: no regex on `pathPrefix`.
> - Codex P2: resolve schema defaults from the incoming item `type`, not the reused store's old type.
> - `resolveRequestUrl` returns the app's URL unchanged when there is nothing to prefix.
> - Document that a complete serialized item is `initProject()`'s contract.
> - Add this spec.

## Summary

Two `@weaverse/next` bugs surface once a Next theme serves more than one market (Weaverse/forward#83, #88). Reused item stores now rebuild from the incoming type's schema defaults on a complete update. The request context applies the market path prefix, so Studio keeps the market. The internal dependency pins catch up with `@weaverse/hydrogen`.
