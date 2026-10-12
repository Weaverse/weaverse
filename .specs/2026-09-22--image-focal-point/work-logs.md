# Work logs

## 2026-09-22 — @hta218

- Implemented the optional Core `WeaverseImage.focalPoint` contract. React and
  Hydrogen retain their existing re-exports; only Core's API report changes.
- Added private Zod validation for `image` input defaults. Legacy defaults and
  unrelated input types remain untouched. Persisted content validation belongs
  to Studio; no SDK-wide data sanitizer or new dependency was introduced.
- Verified the existing page-loading, component-loader, item-store, translation
  snapshot, data-connector, and theme-setting paths preserve nested image values.
  The packed runtime fixture exercises JSON payloads, independent usages,
  Studio-style updates, saved resets, and the actual React component props.
- Extended packed-consumer TypeScript checks for Core, React, and Hydrogen,
  including omitted metadata and malformed coordinate shapes. Added the
  theme-settings regression to its existing test file.
- Documented the contract, CSS integration, validation limits, and release order
  in `packages/hydrogen/readme.md`.

### Verification

- Baseline packed declarations rejected the new field through all three public
  entrypoints (`TS2353`), before the type change.
- Baseline authoring validation failed 15 invalid-coordinate/error-path checks;
  all 23 targeted schema cases pass after the change.
- `pnpm run biome`, `pnpm run typecheck`, and `pnpm run test` passed. The full
  suite reported 595 passing tests and one existing skipped test. After adding
  the theme-store regression, its complete targeted file passed all 16 tests.
- `pnpm run api:report` passed, including build and API documentation checks.
- The `pnpm run package:check` build/API stages passed. After refining the new
  consumer fixture, `node scripts/check-packed-packages.mjs` passed: 8 packed
  packages and 10 TypeScript entrypoints, strict/non-strict consumers, and the
  focal point render check.
- A temporary runtime snapshot mutation dropping `focalPoint` caused the render
  assertion to fail; the unmodified candidate passed. The probe was removed.
- The packed fixture resolves React and React DOM from the renderer's own
  dependency tree. This avoids the monorepo's separate React copies and uses the
  actual CommonJS entrypoint, matching the package-consumer environment.

### Remaining release work

Implementation is ready for PR review. After merge, release Schema and the
synchronized Core/React/Hydrogen group using the repository's release workflow,
then update Studio and Pilot in their companion issues. No package version,
registry publication, merge, or project-board status was changed here.
