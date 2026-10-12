# Plan: Dynamic Component Labels (schema declaration)

## Goal

Let a component opt in to a per-instance label via its schema:

```ts
createSchema({ type: 'tile', title: 'Tile', label: (data) => data.heading })
```

The SDK declares, validates, and preserves the callback. It never calls it.

## Ownership

| Concern | Owner |
| --- | --- |
| `label` type, validation, docs, API report | This PR (`@weaverse/schema`) |
| Obtaining effective instance data for the preview locale (translations, drafts) | Later Builder/Studio bridge issue |
| Evaluating the callback, `title` fallback, errors, invalid/async results | Later Builder/Studio bridge issue |
| Displaying the label | Studio |
| Adapter dependency pins | Separate release follow-up |

## Changes

1. `SchemaType.label?(data: Record<string, any>): string | null | undefined`
   with JSDoc stating it is a declaration only. Declared with method syntax so
   its parameter is bivariant: authors may annotate `data` with their own props
   type (`(data: HeadingProps) => data.content`), unannotated callbacks are
   contextually typed as `Record<string, any>`, and the return type is still
   enforced. No public generics on `createSchema`/`SchemaType` (final
   decision). Tradeoff: the annotated props type is not checked against the
   schema's settings.
2. `ElementSchema.label`: `z.custom` accepting any function, optional. Zod
   preserves the function reference and never invokes it; non-functions fail
   validation (`Label must be a function`). Schemas without `label` validate
   exactly as before.
3. No `SchemaBuilder.label()` helper.
4. `packages/schema/README.md`: type listing plus a short "Dynamic instance
   labels" section with the agreed example, stating Studio support is pending.
5. `api-reports/schema.api.md`: `label` on `ElementSchema`, `SchemaList`, and
   `SchemaType`.

## Tests

- `packages/schema/test/component-label.test.ts`: callback preserved and not
  invoked; non-function rejected; schema without `label` unchanged.
- `packages/schema/test/type-alignment.test.ts` (compiled by the schema
  `tsc --noEmit`): `label: (data) => data.heading` type-checks, an async
  callback is a type error, a real `createSchema` call with
  `(data: HeadingProps) => data.content` (required `content`) type-checks,
  while reading an undeclared prop or returning a Promise, number, or object
  is a type error, and the existing `SchemaType` ↔ `ElementSchema`
  alignment assertion covers the new field.

## Out of Scope

Runtime resolution in core/react/hydrogen/next, Studio bridge and outline UI,
translation or data-replacement changes, global configuration, version bumps,
dependency pins, lockfile changes.

## Files Touched

- `packages/schema/src/validation.ts`
- `packages/schema/test/component-label.test.ts` (new)
- `packages/schema/test/type-alignment.test.ts`
- `packages/schema/README.md`
- `api-reports/schema.api.md`
- `.specs/2026-09-30--dynamic-component-labels/` (README, plan, work-logs)
