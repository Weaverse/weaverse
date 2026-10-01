# Feature: Cycle-safe, identity-aware reused-instance sync

| Field            | Value                                                   |
| ---------------- | ------------------------------------------------------- |
| **Status**       | completed                                                |
| **Owner**        | @paul                                                    |
| **Issue**        | [#511](https://github.com/Weaverse/weaverse/issues/511)  |
| **Branch**       | `fix/511-cycle-safe-reused-instance`                     |
| **Created**      | 2026-07-28                                               |
| **Last Updated** | 2026-07-28                                               |

## Original Prompt

> Analyze and fix https://github.com/Weaverse/weaverse/issues/511 so reused
> Hydrogen instances safely adopt deferred loader data during same-URL
> revalidation without render-time crashes or stale Promise-backed context.

## Summary

`syncReusedInstance()` compared loader payloads with bare `JSON.stringify()`
during render. `dataContext` carries live route loader data, so deferred values
are still unresolved `Promise`s: React 19 development builds attach an
enumerable, self-referencing `_debugInfo` to them and stringifying throws
`TypeError: Converting circular structure to JSON`. In production the same call
silently returns `{}` for every promise, so a *fresh* deferred value compares
equal to the previous one and the reused instance keeps serving stale context.
This spec replaces that comparison with `isSameLoaderPayload()`, a structural
comparison that treats promises/thenables and other opaque objects as atomic
identity-compared values and handles cyclic graphs coinductively.
