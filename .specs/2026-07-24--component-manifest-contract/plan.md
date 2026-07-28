# Plan

## Assumptions

- The public generator belongs in the build-only `@weaverse/schema/manifest` subpath because the manifest contract is framework-independent. The main `@weaverse/schema` and `@weaverse/hydrogen` runtime entrypoints remain unchanged.
- Registered Hydrogen modules satisfy a minimal structural source contract: a required `schema` plus optional `loader` and optional manifest examples.
- The package remains browser-compatible. Hashing uses Web Crypto rather than a Node-only dependency.
- The manifest does not contain its own hash. The generator returns canonical JSON and a `sha256:<hex>` digest alongside the manifest object.
- Registry order is non-semantic and components are sorted by type. Setting groups, inputs, preset children, and `childTypes` preserve author order unless the contract explicitly declares otherwise.
- Ordinary schema defaults may be emitted. Defaults belonging to sensitive or server-only inputs are omitted; schema authors mark both classes with `sensitive: true`.
- Dynamic functions are never stringified. The manifest records dynamic availability/conditions as metadata for later exact-runtime validation.
- No Hydrogen-specific adapter is added unless structural typing proves insufficient.

## Approved public seam

Approved before the first TDD cycle:

```ts
import { generateComponentManifest } from '@weaverse/schema/manifest'

let artifact = await generateComponentManifest(components, {
  source: {
    name: 'pilot',
    revision: gitCommit,
    version: packageVersion,
  },
})

artifact.manifest
artifact.json
artifact.hash
```

Tests will exercise this exported package API, not internal serializers. The first fixture will cover deterministic component ordering and canonical bytes; subsequent vertical slices will cover duplicate rejection, dynamic markers, sensitive defaults, schema validity, JSON Schema compatibility, and hashing.

## Phase 1 — Contract and sensitivity metadata

1. Add explicit `sensitive?: boolean` metadata to configurable schema inputs and its Zod validator.
2. Define documented explicit TypeScript interfaces for manifest source, provenance, components, settings, artifact, and errors.
3. Define a versioned Zod manifest schema and exported JSON Schema representation.
4. Add bidirectional compile-time alignment assertions between explicit contracts and Zod output.

### Verification

- Focused schema type/validation tests.
- `pnpm --filter @weaverse/schema typecheck`.

## Phase 2 — Deterministic generator

Work in vertical red-green slices:

1. Generate a minimal versioned manifest from valid components.
2. Sort components by type and recursively canonicalize object keys while preserving semantic array order.
3. Serialize as UTF-8 JSON with two-space indentation and one trailing newline.
4. Hash the exact serialized bytes with SHA-256.
5. Reject duplicate component types and invalid schemas.
6. Replace function-based availability/conditions with explicit dynamic metadata.
7. Omit sensitive/server-only defaults, reject unknown nested preset component types, and reject non-JSON/cyclic manifest data with a path-aware error.
8. Include loader presence and optional representative examples without executing component code.

### Verification

- Public-seam behavior tests with known literal output and digest.
- Mutate each behavior to prove its focused test fails.

## Phase 3 — Public artifact and package enforcement

1. Export the contract, generator, Zod schema, and JSON Schema only from `@weaverse/schema/manifest`.
2. Add the package subpath without changing the main runtime entrypoint and update the Schema manifest API report.
3. Extend packed-package validation to import and execute the generator from the npm tarball and verify declaration navigation.
4. Document compatibility and versioning behavior.

### Verification

Run sequentially:

1. Focused Schema tests.
2. `pnpm run biome`.
3. `pnpm run typecheck`.
4. `pnpm run api:check`.
5. `pnpm run package:check`.

## Files and folders in scope

- `.specs/2026-07-24--component-manifest-contract/`
- `packages/schema/src/validation.ts`
- `packages/schema/src/manifest.ts` (new public subpath entry)
- `packages/schema/package.json`
- `packages/schema/test/component-manifest.test.ts` (new)
- `packages/schema/test/type-alignment.test.ts`
- `packages/schema/README.md`
- `scripts/check-packed-packages.mjs`
- `api-reports/schema.api.md`
- `api-reports/schema.manifest.api.md` (new)
- `api-reports/runtime-exports.api.md`

## Explicitly out of scope

- Pilot's generated artifact, repository guidance, and CI adoption.
- Merchant page composition reads.
- Builder-side dynamic rule execution.
- Proposal creation, preview, approval, publication, or rollback.
- A second declarative availability language.
- Node-only CLI scaffolding.
