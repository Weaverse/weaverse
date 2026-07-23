# Plan

## Compatibility constraints

- Preserve current strict and non-strict TypeScript behavior.
- Do not replace Zod-inferred public types with narrower interfaces.
- Verify built and packed artifacts rather than source barrels alone.
- Treat CLI and Biome as published packages, but exclude them from TypeScript declaration requirements where not applicable.
- Roll out declaration changes package-by-package so each change remains reviewable and releasable.

## Phase 1 — Freeze the published interface (completed)

1. Inventory every active package, public entrypoint, and exported symbol.
2. Add deterministic API reports generated from built declarations.
3. Add a packed-artifact checker for runtime entries, type entries, named exports, and retained deprecation JSDoc.
4. Compile representative packed consumers under `strict: true` and `strict: false`.
5. Run the artifact contract in CI after a clean build.

### Exit criteria

- A changed or missing public export produces a reviewable report diff or CI failure.
- Packed artifacts, not source imports, prove the package interface.
- Existing permissive schema authoring behavior has compatibility fixtures.

## Phase 2 — Restore authored-source navigation

1. Prototype source-preserving declaration output on `@weaverse/schema`.
2. Emit declaration maps and include every mapped source in the tarball.
3. Verify all map targets after packing.
4. Roll the proven configuration through Core, React, Hydrogen, Experiments, and Next.

### Exit criteria

- Cmd/Ctrl+click from a packed consumer resolves to an included authored declaration/source file.
- No package depends on missing declaration-map targets.

## Phase 3 — Document the public interface

1. Add explicit documented contracts alongside inferred types, beginning with schema authoring types.
2. Prove bidirectional assignability against `z.input` and `z.output` where relevant.
3. Add JSDoc to public functions, classes, methods, options, callbacks, and object properties.
4. Preserve `@deprecated` tags and direct migration guidance in emitted declarations.
5. Migrate existing public names only after strict/non-strict packed fixtures prove equivalence.

### Exit criteria

- Every public symbol/property has useful hover documentation.
- Intentional type tightening is split into a separately versioned migration.

## Phase 4 — Enforcement and rollout

1. Add CI checks for undocumented public declarations and broken map targets.
2. Review API reports for every active TypeScript package.
3. Build, typecheck, test, and inspect packed tarballs.
4. Release packages in dependency order.

## Files and folders in scope

- `.specs/2026-07-23--public-sdk-navigation/`
- `.github/workflows/check.yml`
- `package.json`
- `scripts/`
- `api-reports/`
- `packages/{core,react,hydrogen,schema,experiments,next}/package.json`
- `packages/{core,react,hydrogen,schema,experiments,next}/tsconfig.json`
- Public declarations under `packages/{core,react,hydrogen,schema,experiments,next}/src/`
- Packed-consumer fixtures/tests added for this feature

## Verification gates

- `pnpm run biome`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- New packed-interface/API-report CI command
