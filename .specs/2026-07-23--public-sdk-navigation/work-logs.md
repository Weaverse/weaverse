# Work Logs

## 2026-07-23 — @paul

- Created an isolated worktree from `origin/main` on `update/public-sdk-navigation`.
- Audited active package entrypoints, declaration generation, source publication, tests, and CI.
- Confirmed that current tests import source barrels and do not validate packed declarations.
- Confirmed that TypeScript packages do not emit declaration maps or publish authored sources.
- Identified Zod-inferred schema permissiveness as a compatibility boundary; explicit interfaces must not narrow it silently.
- Chose a phased rollout: freeze packed interfaces first, then restore navigation, then document contracts.
- Added API Extractor reports for nine public entrypoints across six TypeScript packages.
- Added packed-tarball checks for declared entry files, retained `enabledOn` deprecation metadata, named availability exports, and strict/non-strict external consumers.
- Added a dedicated CI job that performs a clean build and verifies reports and tarballs.
- Baseline reports expose substantial documentation debt, led by Next (95 root exports) and Hydrogen (108 root exports); documentation enforcement remains deferred until those reports are incrementally cleaned up.
- Verified Biome, typecheck, the full test suite, builds, API report drift detection, and packed package consumers.
- Hardened the artifact gate after review: package and entrypoint discovery is manifest-driven, all eight published packages install from tarballs in an isolated consumer, ESM/CJS runtime exports are inventoried, and deprecation checks parse the declaration AST.
- Added distinct strict/loose compatibility fixtures and a `skipLibCheck: false` declaration pass for Core, React, Schema, and Experiments.
- Corrected the root Node engine to `>=22.13`, matching pnpm 11.1.2.
- Accepted bounded Phase 1 limitations: the Next browser entry is statically inventoried and CJS-executed but not directly ESM-executed under Node, and API Extractor currently analyzes with bundled TypeScript 5.9 while the repo uses TypeScript 6.
