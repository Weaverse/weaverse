# Work Logs

## 2026-07-24 — @paul

- Created isolated worktree `/Users/paul/temp/weaverse-agent-manifest` from `origin/main` on `feat/agent-component-manifest`; the original dirty checkout remains untouched.
- Reviewed issue #505, the Schema and Hydrogen public component contracts, validation code, package exports, API-report enforcement, packed-package checks, and existing test conventions.
- Proposed `@weaverse/schema` as the framework-independent public seam, structurally accepting Hydrogen component modules without adding an adapter.
- Created the feature spec before implementation as required by repository SDD conventions.
- Confirmed the public test seam, then moved it to the build-only `@weaverse/schema/manifest` subpath so the generator is absent from normal Schema and Hydrogen runtime exports.
- Added the version-one manifest contract, runtime validator, JSON Schema, deterministic generator, SHA-256 artifact hash, source provenance, loader-presence metadata, dynamic rule markers, duplicate/invalid-schema rejection, and JSON/cycle validation.
- Added `sensitive: true` as the shared classification for secret and server-only setting values; redaction covers defaults, presets, nested registered child presets, and examples, while unknown nested component types fail closed.
- Added ESM subpath exports plus `typesVersions` compatibility and packed tests for NodeNext and legacy Node10 TypeScript resolution.
- Kept the generator build-only. The normal Schema entry's transitive build grew by only 140 bytes for the new `sensitive` validation field; the generator entry is loaded only when explicitly imported.
- Addressed independent review findings covering protected-value handling, canonical ordering terminology, meaningful Zod/type alignment, legacy resolution, preset fail-closed behavior, and own enumerable `__proto__` JSON keys.
- Verified Biome, monorepo typecheck, 497 tests with one skipped, API reports, and packed artifacts for eight packages and ten TypeScript entrypoints.
- Final blocker review found runtime Zod objects accepted unknown properties while the JSON Schema rejected them; switched all structured manifest validators to `z.strictObject` and added root/nested parity regressions.
- Corrected the plan's touched-file inventory and completed a final re-review with no blockers.
- Final verification passed Biome, six typecheck tasks, 498 passing tests with one skipped, and packed/API validation for eight packages and ten TypeScript entrypoints.
- Independently validated Codex's P1 review finding that structured examples could retain sensitive keys below `data` or inside arrays.
- Added a failing regression for nested object/array examples, then made example redaction recursive while retaining schema-aware preset child redaction.
- Follow-up verification passed focused Biome, Schema typecheck, all 56 Schema tests, and packed/API validation for eight packages and ten TypeScript entrypoints.
- A fresh Codex review found that typed child data inside examples still used only the parent schema's sensitive-name set; independently reproduced the leak with a failing parent/child example regression.
- Scoped recursive redaction to each nested registered component `type`, preserving unrelated example objects and existing preset behavior.
- Second follow-up verification passed focused Biome, Schema typecheck, all 57 Schema tests, and packed/API validation for eight packages and ten TypeScript entrypoints.
- Duplicate fresh Codex reviews identified two valid compatibility blockers: mixed `settings`/`inspector` schemas could miss legacy sensitive inputs, and arbitrary nested preset fields named `children` were misclassified as component preset nodes.
- Added red regressions for both cases, merged modern and legacy setting groups using Hydrogen's compatibility ordering, and restricted child-type validation to root/typed preset nodes.
- Third follow-up verification passed focused Biome, Schema typecheck, all 59 Schema tests, and packed/API validation for eight packages and ten TypeScript entrypoints.
- Codex then found a valid duplicate-name edge case: a modern sensitive definition could coexist with an unflagged legacy duplicate whose default was still emitted.
- Added a failing duplicate-definition regression and applied effective sensitivity by setting name across all merged definitions.
- Fourth follow-up verification passed focused Biome, Schema typecheck, all 60 Schema tests, and packed/API validation for eight packages and ten TypeScript entrypoints.
- Codex found that an arbitrary nested object whose `type` matched a component could replace inherited sensitivity and reveal a parent-classified field.
- Added a failing collision regression and changed nested component sensitivity to add registered names without dropping inherited names.
- Fifth follow-up verification passed focused Biome, Schema typecheck, all 61 Schema tests, and packed/API validation for eight packages and ten TypeScript entrypoints.
- Codex found that the exported runtime and JSON Schema validators still accepted `sensitive: true` together with `defaultValue`, bypassing generator-only redaction.
- Added a red validator regression and encoded sensitive/non-sensitive inputs as a structural union so Zod, generated JSON Schema, and TypeScript all enforce the invariant.
- Sixth follow-up verification passed focused Biome, Schema typecheck, all 62 Schema tests, refreshed API reports, and packed/API validation for eight packages and ten TypeScript entrypoints.
