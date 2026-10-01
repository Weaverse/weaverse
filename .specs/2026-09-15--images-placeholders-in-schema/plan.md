# Plan

## Change

1. Move the `IMAGES_PLACEHOLDERS` constant, with its TSDoc, from
   `packages/hydrogen/src/index.ts` to `packages/schema/src/images-placeholders.ts`
   and export it from `packages/schema/src/index.ts`.
2. Pin `@weaverse/schema` to `0.15.0` in `@weaverse/hydrogen` and
   `@weaverse/next` (was `0.14.0`), and refresh `pnpm-lock.yaml`.
3. Regenerate `api-reports/` with `pnpm run api:report`.

## Why the pins move to the workspace schema version

Internal `@weaverse/*` dependencies resolve from npm, not as workspace links.
`scripts/api-reports.mjs` resolves `export * from '@weaverse/schema'` against the
workspace build, while `scripts/check-packed-packages.mjs` only substitutes the
packed schema tarball for an edge whose pin equals the workspace schema version.
With the old `0.14.0` pins, the packed adapters installed a registry schema
without the constant, so their runtime exports disagreed with the report.
Pinning to `0.15.0` (the current workspace version, already on npm) keeps
`pnpm install --frozen-lockfile` working and makes the packed check exercise the
schema that carries the constant.

## Release order (required)

Publishing `@weaverse/hydrogen` with a schema pin that lacks the constant would
remove `IMAGES_PLACEHOLDERS` from its public API. Release in this order:

1. `@weaverse/schema` minor: `0.15.0` → `0.16.0`.
2. Re-pin `@weaverse/schema` to `0.16.0` in `packages/hydrogen/package.json` and
   `packages/next/package.json` before building them.
3. Fixed group (core, react, hydrogen), then the next `@weaverse/next` prerelease.
4. `pnpm install` once the new versions are on npm, then commit the lockfile.

## Files touched

- `packages/schema/src/images-placeholders.ts` (new)
- `packages/schema/src/index.ts`
- `packages/hydrogen/src/index.ts`
- `packages/hydrogen/package.json`
- `packages/next/package.json`
- `pnpm-lock.yaml`
- `api-reports/hydrogen.api.md`
- `api-reports/schema.api.md`
- `api-reports/runtime-exports.api.md`
- `.specs/2026-09-15--images-placeholders-in-schema/`
