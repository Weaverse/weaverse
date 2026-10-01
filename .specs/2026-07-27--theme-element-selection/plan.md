# Plan: Theme element selection contract

## Scope

- Extend `InspectorGroupSchema` with `outlineId`.
- Require `outlineGroup` and `outlineId` together while preserving groups that use neither.
- Add a Hydrogen helper that returns `data-wv-theme-id` and subscribes optional reveal and hide callbacks to Studio theme-element events.
- Keep theme elements outside `Weaverse.itemInstances`.

## Implementation

1. Add failing schema tests for paired fields and stable IDs.
2. Add failing Hydrogen utility tests for DOM props and reveal/hide subscription cleanup.
3. Implement schema validation and the Hydrogen helper.
4. Export the helper and event contract from `@weaverse/hydrogen`.
5. Update the public API reports and run targeted tests, Biome, typecheck, builds, and public API checks for affected packages.

## Files touched

- `packages/schema/src/validation.ts`
- `packages/schema/test/inspector-group.test.ts`
- `packages/hydrogen/src/hooks/use-theme-element.ts`
- `packages/hydrogen/src/index.ts`
- `packages/hydrogen/__tests__/theme-element.test.ts`
- `api-reports/hydrogen.api.md`
- `api-reports/runtime-exports.api.md`

## Acceptance criteria

- Untagged inspector groups remain valid.
- A group with only `outlineGroup` or only `outlineId` is rejected.
- A paired group accepts `header`, `footer`, or `popup` with a non-empty ID.
- The Hydrogen helper exposes the stable DOM attribute.
- Reveal callbacks run only for a matching ID and stop after unsubscribe.
- Hide callbacks run only for a matching ID and stop after unsubscribe, allowing Studio to close conditional theme UI when selection leaves it.
- No page item or persistence APIs are changed.
