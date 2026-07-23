# Implementation Plan

## Scope

Implement the public `enabled` component-schema API required by builder#2736:

```ts
enabled?: Resolvable<boolean, ComponentAvailabilityContext>
```

The callback receives the current page `{ id, type, handle, locale }` and placement `group`. Existing `enabledOn` remains supported and Builder combines both rules with AND semantics.

Function forms for `childTypes`, `limit`, `presets`, and input `shouldRevalidate` are follow-up work; they require different per-instance contexts and are not part of this delivery.

## Design

1. Define and export `Resolvable`, `ComponentGroup`, and `ComponentAvailabilityContext` from `@weaverse/schema`.
2. Add `enabled` to the canonical Zod element schema and duplicated strict/helper shapes.
3. Development validation accepts booleans and functions without executing callbacks. Runtime synchronization and error handling belong to Builder's preview bridge.
4. Add `SchemaBuilder.enabled()`. Existing object-spread behavior in `mergeSchemas` gives `enabled` last-override-wins semantics.
5. Update Hydrogen's duplicated schema options type. `HydrogenComponentSchema` continues to alias `SchemaType` and Hydrogen continues re-exporting schema types.
6. Do not resolve availability during component registration; the registry must retain the raw callback for the active preview bridge to evaluate against current page context.

## Tests

- Accept `enabled: true` and `enabled: false`.
- Accept a synchronous callback and preserve its inferred context.
- Reject invalid scalar values.
- Verify `SchemaBuilder.enabled()` and `mergeSchemas()` preserve false/callback values.
- Verify the types are exported through `@weaverse/hydrogen` declarations.
- Preserve all existing schema validation behavior.

## Validation

```sh
pnpm exec vp test --run packages/schema/test
pnpm -F @weaverse/schema build
pnpm -F @weaverse/hydrogen build
pnpm run biome
pnpm run typecheck
```

Before release, run the full monorepo test/build gates required by the SDK release skill.

## Files and Folders Touched

- `.specs/2026-07-23--function-based-component-availability/`
- `packages/schema/src/validation.ts`
- `packages/schema/src/index.ts`
- `packages/schema/test/`
- `packages/schema/README.md`
- `packages/hydrogen/src/types.ts`
- `packages/hydrogen/__tests__/` only if an emitted/re-export regression test is needed
- package versions and `pnpm-lock.yaml` during the approved release step

## Delivery Sequence

1. Merge and release the independent schema package.
2. Update Hydrogen's exact schema dependency and release the fixed core/react/hydrogen group.
3. Builder consumes the released SDK and implements preview-side resolution.
4. Public docs and `/Users/paul/Workspace/shopify-hydrogen-skills` update only after SDK and Builder behavior are released.
