# Image focal point implementation plan

## Outcome and scope

Implement the SDK contract from #528. Reuse existing image object transport,
public type re-exports, authoring validation, and package-consumer checks.
Keep crop UI and theme rendering implementation in the companion issues.

## Current behavior

- `packages/core/src/types.ts` owns `WeaverseImage`. React exports Core; Hydrogen
  explicitly re-exports the same type. No duplicate image type is needed.
- `WeaverseClient.loadPage` / `execComponentLoader` and `loadThemeSettings`
  retain nested setting objects. Response guards only validate the envelope.
- `WeaverseHydrogenItem` flattens serialized data and shallowly replaces input
  values on updates. Its translation snapshot preserves replacement image objects.
- `ThemeSettingsStore` shallowly replaces setting values. React's renderer
  recursively resolves data connectors and then spreads settings into component
  props. None of these paths projects an image onto a fixed field list.
- `BasicInputSchema` validates authoring inputs but currently accepts arbitrary
  defaults. Add a narrow check for an image default's optional focal point,
  retaining legacy URLs, partial image objects, and defaults for other inputs.
- There is no SDK image-value parser at the persisted content boundary. Do not
  introduce a recursive payload sanitizer or validate every arbitrary object.
  Studio validates user-supplied coordinates before persistence (#3043).

## Implementation sequence

1. Commit this canonical spec and plan.
2. Extend the packed consumer fixture with images using and omitting focal points
   through Core, React, and Hydrogen. Demonstrate failure on the current types.
3. Add documented optional coordinates to the canonical type. Keep public exports
   unchanged and regenerate public API reports.
4. Add a regression test at the Hydrogen store-to-React-component boundary:
   preserve points from JSON payloads, update/reset one usage without affecting
   another, and retain metadata through data-connector processing.
   Verify the theme-settings path through its existing store.
5. Add focused schema tests for valid endpoints, absent metadata, malformed and
   non-finite coordinates, error paths, and unrelated-input compatibility.
   Run the invalid cases before implementing the authoring validation.
6. Implement validation inside `BasicInputSchema` with the already-installed Zod
   runtime. Keep the focal point schema private; no new public helper or dependency.
7. Document ownership, normalized coordinates, CSS percentage mapping, optional
   fallback, validation boundaries, and the SDK/Studio/theme release order.
8. Run lint, typecheck, tests, build, public API documentation checks, and packed
   package-consumer checks. Inspect all changes, commit coherent groups, push,
   and open a draft PR with evidence and remaining release steps.

## Files and areas

- `.specs/2026-09-22--image-focal-point/{README.md,plan.md,work-logs.md}`
- `packages/core/src/types.ts`
- `packages/schema/src/validation.ts`
- `packages/schema/test/image-focal-point.test.ts`
- `packages/hydrogen/__tests__/image-focal-point.test.tsx`
- `packages/hydrogen/README.md`
- `scripts/check-packed-packages.mjs`
- Generated affected files in `api-reports/`

## Verification

Use `pnpm@11.1.2` and the frozen lockfile. Run targeted failing checks first,
then the documented `pnpm run biome`, `pnpm run typecheck`, `pnpm run test`,
`pnpm run api:report`, and `pnpm run package:check`.
The packed consumer must exercise the actual exported declarations, not source
aliases. A temporary mutation that drops focal points must fail the data-flow
regression. No new test framework or dependency is needed.

## Rollout and compatibility

Release the changed Schema package and the synchronized Core/React/Hydrogen
group after merge, updating the existing exact dependency pins during the normal
release process. No versions are guessed or published by this PR. Studio and
Pilot consume those releases separately.

The optional field needs no data migration. Reset means removing the field,
not automatically persisting `{ x: 0.5, y: 0.5 }`, so legacy positioning remains
available. CSS percentages align the selected point with the same relative
position in the frame; they do not promise centered framing of the whole subject.

## Risks and limits

TypeScript's `number` cannot express a finite bounded range. Schema validation
covers authored image defaults; generic content transport remains unchanged.
Studio must validate editor values, and themes should handle untrusted custom
data appropriately. Do not add SDK image-processing logic or change the generic
transport contract to enforce this feature.
