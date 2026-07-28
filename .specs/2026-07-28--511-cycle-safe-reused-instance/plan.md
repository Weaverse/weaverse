# Plan: cycle-safe, identity-aware reused-instance sync

## Problem

`syncReusedInstance()` runs during render on the instance-reuse branch
(same-URL revalidation in live/preview mode) and compared payloads with:

```ts
JSON.stringify(weaverse.dataContext ?? null) !==
  JSON.stringify(params.dataContext ?? null)
```

`createWeaverseDataContext()` copies each route match's **raw** `data` into
`dataContext`, so deferred loader values are still unresolved `Promise`s.

Two distinct defects follow from one root cause — *JSON serialization is the
wrong equality model for a live, unserialized object graph*:

1. **Crash (development).** React 19 attaches an enumerable, self-referencing
   `_debugInfo` to deferred promises. `JSON.stringify` throws
   `TypeError: Converting circular structure to JSON` at render time.
2. **Stale context (production).** Without that metadata, every promise
   stringifies to `{}`. A fresh deferred value therefore compares *equal* to
   the previous render's promise, `contextChanged` stays `false`, and the
   reused instance keeps serving a settled/abandoned promise.

The issue's proposed `'[[promise]]'` token fixes only (1). Verified: two
distinct promises produce identical output under both bare JSON and the
token form, so (2) survives. A blanket `try`/`catch` is also rejected — it
would treat every render as changed and call `triggerUpdate()` in a loop.

## Approach

Add `isSameLoaderPayload(left, right)` and use it for both comparisons.
`syncReusedInstance`'s control flow (assignment order, item notification,
`triggerUpdate`) is deliberately unchanged — only the equality test is swapped.

Comparison semantics, chosen deliberately:

| Case | Behavior | Why |
| --- | --- | --- |
| Promises / thenables | atomic, identity-compared | fresh promise = change; debug metadata never traversed |
| Opaque objects (`Map`, `Set`, `URL`, class instances, cross-realm promises) | atomic, identity-compared | JSON flattens all to `{}`, collapsing distinct async values |
| `toJSON()` bearers (`Date`) | compared via projection | matches wire behavior |
| Cycles | coinductive (assume equal on re-entry) | equal cycles equal, differing leaf still a change, never throws |
| `undefined`/function/symbol | omitted in objects, `null` in arrays | matches `JSON.stringify` |
| NaN / ±Infinity | normalized to `null` | matches `JSON.stringify` |
| Key order | irrelevant | removes the old "false mismatch costs a re-render" caveat |

Thenables are duck-typed (`typeof value.then === 'function'`) rather than
`instanceof Promise` so cross-realm promises stay atomic.

Cycle tracking is scoped to the **active comparison path** (a flat
`[a0,b0,a1,b1,...]` array), not every visited pair: memory stays proportional
to graph depth and the common all-equal walk allocates one array. Memoizing
equal pairs instead measured ~2x slower on a realistic 400-item page, which is
the case that runs on every render. No new dependency.

## Files touched

| File | Change |
| --- | --- |
| `packages/hydrogen/src/utils/is-same-loader-payload.ts` | new — the comparison + rationale |
| `packages/hydrogen/src/utils/sync-reused-instance.ts` | use it for both comparisons; refresh doc comment |
| `packages/hydrogen/__tests__/is-same-loader-payload.test.ts` | new — 22 semantic tests |
| `packages/hydrogen/__tests__/sync-reused-instance.test.ts` | +8 tests: circular promise, fresh identity, repeat sync, cycles, null/undefined, no double-notify |

Internal module only: not exported from `src/utils/index.ts` or `src/index.ts`,
so the public API surface is unchanged (`api:check` passes clean).

## Verification

- RED first: 6 failed / 4 passed with the exact `Converting circular structure
  to JSON` trace at `sync-reused-instance.ts:31`.
- GREEN: 34 focused tests; `@weaverse/hydrogen` 203 tests; repo test, typecheck,
  Biome, build, and `api:check` all clean.
- Mutation-tested: 8 mutants against the final implementation, all killed
  (one surviving mutant exposed dead code, which was removed).
- Differential parity harness vs `JSON.stringify` across 12 edge cases; the only
  intended divergence is that cyclic input does not throw.
