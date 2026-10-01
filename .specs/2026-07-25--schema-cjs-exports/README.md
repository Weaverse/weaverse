# Feature: Restore CommonJS resolution for `@weaverse/schema`

| Field | Value |
| --- | --- |
| **Status** | completed |
| **Owner** | @paul |
| **Issue** | [#508](https://github.com/Weaverse/weaverse/issues/508) |
| **Branch** | `fix/508-schema-cjs-exports` |
| **Created** | 2026-07-25 |
| **Last Updated** | 2026-07-25 |

## Original Prompt

> Fix the published package contract so CommonJS consumers of `@weaverse/schema` and the CJS build of
> `@weaverse/hydrogen` no longer fail with `ERR_PACKAGE_PATH_NOT_EXPORTED`. Reproduce the exact
> regression against packed artifacts, add a focused regression check and demonstrate RED before the
> production change, determine the Node >=20 compatible package design (prefer a real CJS artifact
> instead of pointing `require` at an ESM file unless the supported Node matrix proves that is valid),
> apply the smallest robust fix for both the schema root and any affected public subpath such as
> `@weaverse/schema/manifest`, and make packed-artifact verification cover direct CommonJS schema
> consumption and the Hydrogen CJS transitive path.

## Summary

`@weaverse/schema@0.13.0` shipped an `exports` map that only declares the `import` condition, so Node
refuses every `require()` of the package root and of `@weaverse/schema/manifest`. Because
`@weaverse/hydrogen` still publishes a CJS build that `require`s `@weaverse/schema`, every CommonJS
consumer of Hydrogen broke as well. This spec ships a real dual (ESM + CJS) schema artifact, adds the
`require` condition for both public subpaths, and hardens `scripts/check-packed-packages.mjs` so a
missing `require` condition can never ship again.

## Outcome

- `packages/schema` now builds `esm` + `cjs` with tsup (`dist/*.js` ESM, `dist/*.cjs` CJS).
- `exports` declares `types` / `import` / `require` for `.` and `./manifest`; `main` points at the CJS
  artifact for legacy Node10 resolvers.
- `scripts/check-packed-packages.mjs` now fails when a published entrypoint drops its `require`
  condition, executes a CommonJS schema/manifest smoke test against the packed tarballs, and
  typechecks `@weaverse/schema` + `@weaverse/schema/manifest` from a `.cts` consumer.
