# Work Logs

## 2026-07-27 — @leehoang

- Created the SDK spec from the approved Builder issue #2673 plan.
- Confirmed the existing branch already contains `outlineGroup`; this iteration adds stable identity and the DOM/reveal bridge only.
- Added paired `outlineGroup`/`outlineId` validation with backward compatibility for groups that declare neither field.
- Added and exported `useThemeElement`, DOM marker helpers, and the targeted reveal-event subscription contract for conditional theme elements.
- Verification passed: Schema tests (36/36), Hydrogen tests (169/169), Biome, package typecheck, and Schema/Hydrogen builds. The SDK remains linked locally for Builder/theme QA; nothing was published.
