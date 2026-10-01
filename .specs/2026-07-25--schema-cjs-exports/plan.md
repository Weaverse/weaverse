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
| `exports["."]` | `types`, `import` | per-condition `import`/`require` branches, each with its own `types` |
| `exports["./manifest"]` | `types`, `import` | per-condition `import`/`require` branches, each with its own `types` |
| `tsup.format` | `["esm"]` | `["esm", "cjs"]` |

`type: "module"` is kept, so `dist/*.js` stays ESM and tsup emits the CJS half as `dist/*.cjs`.

The `types` condition is nested inside each of `import` and `require` rather than hoisted. A single
shared `.d.ts` is read by TypeScript as ESM (the package is `type: "module"`), so CommonJS consumers
on `module: node16`/`node18` fail with **TS1479** even though the runtime `require` works. The
`require` branch therefore points at `.d.cts` declarations. This applies identically to
`@weaverse/experiments`, the repo's only other `type: "module"` dual package, which had the same
latent defect and is fixed in the same way.

### 1b. `scripts/build-declarations.mjs`

For `type: "module"` packages, emit a `.d.cts` sibling for every `dist/types/**/*.d.ts`, rewriting
relative `./x.js` specifiers to `./x.cjs` so the CommonJS declaration graph stays internally
consistent under `skipLibCheck: false`. CommonJS packages are untouched.

### 2. `scripts/check-packed-packages.mjs`

The existing check installed packed tarballs as *direct* dependencies only, so
`@weaverse/hydrogen`'s transitive `@weaverse/schema` resolved to the published registry copy and
hid the regression source. Four hardening changes:

1. Write a `pnpm-workspace.yaml` with **edge-scoped** `overrides` (`parent>child`) for each internal
   dependency edge whose declared range still accepts the packed version, so transitive resolution
   hits the tarballs under test. Edges with incompatible pins (currently `@weaverse/next`, which
   still declares `@weaverse/schema@0.10.0` and `@weaverse/react@5.16.4`) are deliberately left on
   registry resolution and reported, preserving the pre-existing install-time coverage for stale or
   invalid internal metadata instead of masking it behind a blanket override.
2. Assert every published entrypoint (except `@weaverse/cli`, ESM-only executable, and
   `@weaverse/biome`, JSON-only) declares a `require` condition.
3. `assertCommonJsArtifact` first classifies the require target the way Node does — by extension and
   the nearest `package.json` `type` — so a `.js` target inside a `type: "module"` package is
   rejected even when it contains no import/export statement. It then rejects ESM syntax, including
   `export const` / `export function` / `export class`, which a statement-kind-only check misses.
4. Assert that a `type: "module"` package resolves its require-condition `types` to `.d.cts`, and
   that every resolved declaration target actually exists in the tarball.
5. Add `manifest-runtime.cjs`, a CommonJS smoke test that `require`s both `@weaverse/schema` and
   `@weaverse/schema/manifest` from the packed tarballs and asserts the deterministic manifest hash;
   add both specifiers to the existing `consumer.cts` NodeNext CJS typecheck; and add a
   `module: node16` CJS typecheck (`node16-consumer.cts`) over the Weaverse packages, which is the
   mode that actually catches TS1479.

### 2b. `scripts/public-packages.mjs`

`findCondition` searched the exports object depth-first for a condition name anywhere in the tree.
That is wrong once `types` legally appears inside both the `import` and `require` branches with
different targets. It now resolves conditions the way Node and TypeScript do — in declaration order,
following only active or `default` keys — and exposes `requireTypes` alongside `types`.

The pre-existing `runtime.cjs` check already covered the Hydrogen CJS transitive path once the
overrides were in place — it was the check that went RED on `main`.

## Touched files / packages

- `packages/schema/package.json`
- `packages/experiments/package.json` (same latent TS1479 defect, same owner boundary)
- `scripts/build-declarations.mjs`
- `scripts/check-packed-packages.mjs`
- `scripts/public-packages.mjs`
- `.specs/2026-07-25--schema-cjs-exports/{README.md,plan.md}`

No source files, templates, archived packages, dependency upgrades, or version bumps.

## Verification

| Command | Result |
| --- | --- |
| `pnpm run package:check` (on `main`) | RED — `ERR_PACKAGE_PATH_NOT_EXPORTED` from `runtime.cjs` |
| `pnpm run package:check` (fix reverted, guards kept) | RED — `@weaverse/schema has no require condition` |
| `pnpm run package:check` (`require` → ESM file) | RED — `points its require condition at the ES module` |
| `pnpm run package:check` (flat shared `types`) | RED — `resolves require-condition types to ./dist/types/index.d.ts, which TypeScript reads as ESM` |
| `pnpm run package:check` (fixed) | GREEN — `Verified 8 packed packages and 10 TypeScript entrypoints` |
| `pnpm run test` | GREEN — 8 tasks, 322 tests |
| `pnpm run typecheck` | GREEN |
| `pnpm run biome` | GREEN |

Plus an out-of-tree packed-tarball consumer proving `require('@weaverse/schema')`,
`require('@weaverse/schema/manifest')`, and `require('@weaverse/hydrogen')` all resolve, and that
ESM imports still work.

## Review follow-ups (deliberately not fixed here)

- **Dual-package hazard on `schemaRegistry`.** Building the same entrypoint as both ESM and CJS
  creates two `SchemaRegistry` classes and two `schemaRegistry` instances, so `instanceof` and
  registry contents can diverge in a mixed-format process. This is inherent to every dual package in
  this repo (`core`, `react`, `hydrogen`, `next`, `experiments` all already ship both formats) and
  converging on one canonical instance means an ESM-wrapper-over-CJS redesign of the build. No
  Weaverse package or template reads or mutates `schemaRegistry`/`devTools` across a format
  boundary today, so there is no reachable defect in this PR's scope. Tracked as a follow-up rather
  than expanded into this fix, per the scope governor.
- **`@weaverse/next` stale internal pins.** It declares `@weaverse/schema@0.10.0` and
  `@weaverse/react@5.16.4` while the workspace ships `0.13.0`/`5.19.0`. The packed check now reports
  these instead of silently overriding them. Correcting the pins is release/version work, which this
  PR is not allowed to touch.

## Residual risk

Version bumps and publishing are deliberately out of scope. `@weaverse/schema` must be released
(minor, since the package contract gains a condition) and `@weaverse/hydrogen` must be re-pinned to
that version before consumers see the fix. `@weaverse/experiments` also needs a release to ship its
TS1479 fix.
