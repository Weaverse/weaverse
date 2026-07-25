# Plan: Restore CommonJS resolution for `@weaverse/schema`

## Problem

`@weaverse/schema@0.13.0` added an `exports` map with only the `import` condition:

```json
"exports": {
  ".": { "types": "./dist/types/index.d.ts", "import": "./dist/index.js" },
  "./manifest": { "types": "./dist/types/manifest.d.ts", "import": "./dist/manifest.js" }
}
```

Once an `exports` map exists, Node stops falling back to `main`. Every `require()` of the package
root and of `./manifest` therefore fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`. `@weaverse/schema@0.12.0`
had no `exports` map, so `require` fell back to `main` and Node's `require(ESM)` support handled it.

`@weaverse/hydrogen` still publishes a CJS bundle (`dist/index.js`) that contains
`var schema$1 = require('@weaverse/schema')`, so every CommonJS consumer of Hydrogen broke too.

## Design decision: real CJS artifact, not `require` → ESM

The issue proposes `"require": "./dist/index.js"` (pointing at the ESM file) as one option. That is
rejected:

- `@weaverse/hydrogen` declares `engines.node >= 20`. Synchronous `require(ESM)` only became
  unflagged in Node 22.12 / 20.19. On Node 20.0–20.18 it throws `ERR_REQUIRE_ESM`.
- `require(ESM)` is still refused outright on any Node where the module graph contains top-level
  `await`, and it changes the shape of the returned namespace object versus a real CJS module.
  Relying on it makes the published contract depend on the consumer's exact Node patch version.
- Every other dual package in this repo (`core`, `react`, `hydrogen`, `next`, `experiments`) already
  ships a real CJS artifact. Schema was the only outlier.

So schema builds `esm` + `cjs` with tsup and declares both conditions.

## Changes

### 1. `packages/schema/package.json`

| Field | Before | After |
| --- | --- | --- |
| `main` | `dist/index.js` (ESM) | `dist/index.cjs` (CJS, for Node10 resolvers) |
| `module` | absent | `dist/index.js` |
| `exports["."]` | `types`, `import` | `types`, `import`, `require: ./dist/index.cjs` |
| `exports["./manifest"]` | `types`, `import` | `types`, `import`, `require: ./dist/manifest.cjs` |
| `tsup.format` | `["esm"]` | `["esm", "cjs"]` |

`type: "module"` is kept, so `dist/*.js` stays ESM and tsup emits the CJS half as `dist/*.cjs`.
`dist/types/**` declarations are unchanged and are shared by both conditions.

### 2. `scripts/check-packed-packages.mjs`

The existing check installed packed tarballs as *direct* dependencies only, so
`@weaverse/hydrogen`'s transitive `@weaverse/schema` resolved to the published registry copy and
hid the regression source. Four hardening changes:

1. Write a `pnpm-workspace.yaml` with `overrides` for every packed `@weaverse/*` package in the
   scratch consumer, so transitive resolution also hits the tarballs under test.
2. Assert every published entrypoint (except `@weaverse/cli`, ESM-only executable, and
   `@weaverse/biome`, JSON-only) declares a `require` condition.
3. `assertCommonJsArtifact` parses each `require` target and rejects it if it contains ESM
   `import` / `export` / `export =` statements — this blocks the "point `require` at the ESM file"
   shortcut from ever landing.
4. Add `manifest-runtime.cjs`, a CommonJS smoke test that `require`s both `@weaverse/schema` and
   `@weaverse/schema/manifest` from the packed tarballs and asserts the deterministic manifest hash;
   and add both specifiers to the existing `consumer.cts` NodeNext CJS typecheck.

The pre-existing `runtime.cjs` check already covered the Hydrogen CJS transitive path once the
overrides were in place — it was the check that went RED on `main`.

## Touched files / packages

- `packages/schema/package.json`
- `scripts/check-packed-packages.mjs`
- `.specs/2026-07-25--schema-cjs-exports/{README.md,plan.md}`

No source files, templates, archived packages, dependency upgrades, or version bumps.

## Verification

| Command | Result |
| --- | --- |
| `pnpm run package:check` (on `main`) | RED — `ERR_PACKAGE_PATH_NOT_EXPORTED` from `runtime.cjs` |
| `pnpm run package:check` (fix reverted, guards kept) | RED — `@weaverse/schema has no require condition` |
| `pnpm run package:check` (`require` → ESM file) | RED — `points its require condition at the ES module` |
| `pnpm run package:check` (fixed) | GREEN — `Verified 8 packed packages and 10 TypeScript entrypoints` |
| `pnpm run test` | GREEN — 8 tasks, 322 tests |
| `pnpm run typecheck` | GREEN |
| `pnpm run biome` | GREEN |

Plus an out-of-tree packed-tarball consumer proving `require('@weaverse/schema')`,
`require('@weaverse/schema/manifest')`, and `require('@weaverse/hydrogen')` all resolve, and that
ESM imports still work.

## Residual risk

Version bumps and publishing are deliberately out of scope. `@weaverse/schema` must be released
(minor, since the package contract gains a condition) and `@weaverse/hydrogen` must be re-pinned to
that version before consumers see the fix.
