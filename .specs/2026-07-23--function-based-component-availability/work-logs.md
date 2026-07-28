# Work Logs

## 2026-07-23 — @paul

- Created an isolated worktree from `origin/main` on `feat/function-based-component-availability`.
- Added the public `Resolvable`, `ComponentGroup`, `ComponentAvailabilityContext`, and `enabled` schema contract using test-first development.
- Updated strict schema helpers, `SchemaBuilder`, Hydrogen options typing, tests, and the schema package README.
- Verified 11 focused tests, 38 schema tests, schema/Hydrogen builds, Biome, and monorepo typecheck.
- Left package versions and lockfile unchanged pending explicit release approval. Hydrogen's exact schema dependency must be updated after the independent schema release.
- After publishing 5.17.0, verified the packed Hydrogen declaration and found the named availability types were not re-exported. Added explicit canonical imports/re-exports and updated `CreateHydrogenSchemaOptions` to consume them before a patch release.
- Deprecated `enabledOn` in favor of `enabled` through a documented compatibility overlay on the existing Zod-inferred `SchemaType`. A broader explicit-interface/declaration-map rollout was deferred because changing required-field behavior in non-strict consumers is not patch-safe.
