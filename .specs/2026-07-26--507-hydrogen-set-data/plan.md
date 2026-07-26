# Plan — Hydrogen item data refresh on reused item stores

## Problem

`Weaverse.initProject()` (core) reuses item stores keyed by item id:

```ts
const itemInstance = itemInstances.get(item.id)
if (itemInstance) itemInstance.setData(item)
else this.createItemInstance(item)
```

Two asymmetries make reused stores render stale content:

1. **Flattening asymmetry.** `WeaverseHydrogenItem`'s constructor does
   `Object.assign(this._store, schemaData, data, rest)` — settings are flattened
   to the top level. The inherited `setData` only does
   `{ ...this._store, ...update }`, so the new settings sit unused under
   `_store.data` while `_store.<field>` keeps the previous locale's value.
2. **Omitted-default asymmetry.** Serialized payloads omit a field when its value
   equals the schema default. DE → EN: DE sends `buttonText: 'In den Warenkorb'`,
   EN omits `buttonText` (it equals the schema default `'Add to cart'`). A plain
   flatten-merge leaves the German string in place; defaults must be re-applied
   before the incoming nested data.

Constraint: `syncReusedInstance` calls `setData({})` for context-only refreshes.
That call must only swap the `_store` reference and notify — it must not reset
settings to schema defaults.

## Approach

Override `setData` in `WeaverseHydrogenItem` (Hydrogen-owned, minimal):

- Split `update` into `{ data, ...rest }` and resolve the schema from the
  incoming `type` when present.
- If `update` has no own keys → context-only refresh: re-create the `_store`
  reference (`{ ...this._store }`), notify, return. No defaults, no resets.
- Normalize updates that carry nested `data` or represent a complete serialized
  item (`id` + `type`). Re-apply schema defaults before flattening incoming
  settings; complete items still reset defaults when the optional `data`
  property itself is absent.
- Replace the stored nested `data` with the latest serialized value instead of
  retaining the previous locale's payload. Schema-less and top-level-only
  partial updates keep the base shallow-merge behavior.
- Then `triggerUpdate()` and return `this.data`, matching the base contract.

Scope is `@weaverse/hydrogen` only. `@weaverse/core` and `@weaverse/next` are
untouched; a follow-up handles Next. No runtime-owner rebinding, no other
lifecycle changes.

## Tests (TDD, AAA, `should_*_when_*` naming)

New file `packages/hydrogen/__tests__/weaverse-hydrogen-item.test.ts`, driving the
real reused-item seam (`WeaverseHydrogen.setProjectData()` → core `initProject()`
→ `itemInstance.setData(item)`):

1. Explicit locale A → B values replace stale flattened settings.
2. B → default locale resets a field omitted because it equals its schema default.
3. A complete serialized item that omits optional `data` still resets defaults.
4. The stored nested `data` reflects the latest serialized payload.
5. Empty `setData({})` preserves settings, swaps the store reference, and notifies
   subscribers.

## Files touched

- `packages/hydrogen/src/WeaverseHydrogenRoot.tsx` — add `setData` override to
  `WeaverseHydrogenItem`.
- `packages/hydrogen/__tests__/weaverse-hydrogen-item.test.ts` — new regression tests.
- `api-reports/hydrogen.api.md` — public class gains a `setData` member (regenerated
  via `pnpm run api:report` if it changes).
- `.specs/2026-07-26--507-hydrogen-set-data/**` — this spec.

## Verification

- `pnpm exec vp test --run packages/hydrogen/__tests__/weaverse-hydrogen-item.test.ts`
- `turbo test --filter=@weaverse/hydrogen`
- `pnpm run typecheck`, `pnpm run biome`, `pnpm run package:check`
