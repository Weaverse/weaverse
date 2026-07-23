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

## 2026-07-23 — @paul (Phase 2)

- Added a source-preserving declaration build that emits `.d.ts` and `.d.ts.map` files, rewrites internal aliases, and copies authored declaration inputs with identity maps.
- Published authored `src` files and mapped declarations for Core, React, Hydrogen, Experiments, and Next.
- Added packed-tarball validation ensuring every declaration map resolves to an included source file inside the same package.
- Preserved all public export counts and strict/non-strict compatibility in isolated packed consumers.
- Prototyped the same output for Schema, but its exported `z.infer` aliases became consumer-compiler-dependent when unbundled. Kept Schema on its bundled declaration until Phase 3 can introduce proven-equivalent explicit contracts.
- Verified a clean install/build, API report checks, and packed declaration-map checks.
- Replaced internal source aliases with relative imports so TypeScript-generated maps remain byte/column faithful; ESM Experiments sources now author their required `.js` specifiers directly.
- Added exact identity maps for authored `.d.ts` inputs using `@jridgewell/gen-mapping` and trace-based validation for every sampled position.
- Added the declaration builder to Turbo's global cache inputs and added CJS consumer coverage alongside ESM checks.

## 2026-07-23 — @paul (Phase 3: Schema)

- Replaced Zod-inferred public authoring aliases with explicit interfaces and unions matching the existing output contract.
- Added bidirectional assignability checks between every explicit schema contract and its `z.output` type.
- Enabled Schema's source-preserving declarations and declaration maps after strict/loose packed consumers proved compatibility.
- Added hover documentation for every public Schema symbol and property, including direct migration guidance on deprecated APIs.
- Reduced Schema's API report from 55 undocumented markers to zero and enabled `ae-undocumented` as a CI error for the package.
- Preserved the legacy permissive recursive preset contract (`children?: any[]`) with a concrete compile-time fixture.
- Replaced anonymous validation and registry result objects with named, documented public interfaces.
- Strengthened packed deprecation checks to require migration guidance for `enabledOn`, `inspector`, and `SchemaBuilder.enabledOn`.

## 2026-07-23 — @paul (Phase 3: remaining packages)

- Added useful hover documentation to every public Core, React, Hydrogen, Experiments, and Next declaration and property.
- Preserved all public signatures and deprecated APIs while adding direct migration guidance.
- Regenerated all API reports with zero `(undocumented)` markers.
- Promoted `ae-undocumented` to a CI error for every public TypeScript package.
