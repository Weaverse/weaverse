# Work Logs

## 2026-07-27 — @leehoang

- Created the SDK spec from the approved Builder issue #2673 plan.
- Confirmed the existing branch already contains `outlineGroup`; this iteration adds stable identity and the DOM/reveal bridge only.
- Added paired `outlineGroup`/`outlineId` validation with backward compatibility for groups that declare neither field.
- Added and exported `useThemeElement`, DOM marker helpers, and the targeted reveal-event subscription contract for conditional theme elements.
- Verification passed: Schema tests (36/36), Hydrogen tests (169/169), Biome, package typecheck, and Schema/Hydrogen builds. The SDK remains linked locally for Builder/theme QA; nothing was published.

## 2026-10-01 — Popup dismissal contract

- Added an optional `onHide` callback and a matching `weaverse:theme-element-hide` event so Studio can close conditional theme UI when selection leaves its Outline target. The reveal and DOM-marker contracts remain unchanged.
- Added tests for matching IDs and unsubscribe behavior; targeted Hydrogen tests pass 6/6. Hydrogen package typecheck and build pass. Authenticated Studio browser QA is still pending, so this follow-up remains in progress.

## 2026-10-02 — Public API verification and Studio QA

- A previous review by another agent identified the missing Popup dismissal contract; the new `onHide` implementation has not yet received an independent follow-up review.
- Fixed the public API check by documenting `THEME_ELEMENT_HIDE_EVENT` and regenerating the Hydrogen and runtime export reports.
- Verification passed: targeted theme-element tests 6/6, all Hydrogen tests 212/212, full SDK test tasks 8/8, full typecheck tasks 6/6, Biome, public API reports, and packed-package checks for 8 packages and 10 TypeScript entrypoints.
- Authenticated Studio QA confirmed Popup reopen, dismissal on Header/Footer or ordinary canvas-section selection, Escape dismissal, and the tested mobile flow. The other Popup display type and storefront modal behavior outside Studio remain to be checked; status stays in progress.
