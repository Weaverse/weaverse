# Claude handoff — Next item-level translation sidecar parity

## Repo / branch

- Repo: `/Users/hta218/Documents/work/workspace/weaverse`
- Branch: `feat/next-item-translation-sidecar`
- Base: `main` after PR #488 (`c2a52a2f` merged)
- Tracker: https://github.com/Weaverse/builder/issues/2659

## Context

Continuing Next Productionization Epic 2663.

Landed already:

- PR #488: static-text translation foundation for `@weaverse/next`.
  - `TranslationStore`, `TranslationProvider`, `useTranslation`, deprecated `ThemeText*` aliases.
  - Root/provider/renderer/runtime static text wiring for Builder RPC via `internal.translationStore` / `internal.themeTextStore`.

This new PR should implement the **item-level/page translation sidecar** parity with Hydrogen, without touching Builder.

## Hydrogen reference

Files already audited:

- `packages/hydrogen/src/WeaverseHydrogenRoot.tsx`
  - `WeaverseHydrogenItem.getSnapShot()` overlays `weaverse.translationMap[itemId][key].translatedValue` on top of `_store`.
  - Snapshot is memoized by `_store` ref and per-item translation entry ref.
  - `WeaverseHydrogen` has:
    - `translationMap: TranslationMap = {}`
    - `translationLocale = ''`
    - `translationLanguageId = ''`
    - `extractTranslationSidecar()` reads `translationMap`, `translationLocale`, `translationLanguageId` from page data.
    - `setTranslationSidecar(map, locale, languageId)` sets values, refreshes all items.
    - `updateTranslation(itemId, key, originalValue, translatedValue)` updates one entry, creates new per-item ref, triggers that item.
    - `getTranslationChanges()` returns `{ languageId, entries: [{ itemId, key: 'data.<key>', originalValue, translatedValue }] }` when locale/languageId exist and entries non-empty.
    - `setProjectData(data)` re-extracts sidecar before `initProject()`.
- `packages/hydrogen/src/types.ts`
  - `TranslationMapEntry`, `TranslationItemEntry`, `TranslationMap`, `TranslationEntry`, `TranslationChanges` shapes.

Builder Studio expectations:

- `builder/studio/rpc/methods.ts::updateItemData()`:
  - translation mode is `!!weaverse.translationLocale && typeof weaverse.updateTranslation === 'function'`.
  - translatable schema fields route to `weaverse.updateTranslation(id, key, instance._store[key] ?? '', value)`.
  - non-translatable fields still update `_store`.
- `builder/studio/utils/data.ts::generateItemInfo()` reads `item.getSnapShot()` so selected sidebar sees translated values.
- `builder/studio/utils/data.ts::silentUpdate()` sends `translationDraft` with `weaverse.translationMap`, locale, languageId.
- `builder/studio/rpc/methods.ts::getTranslationChanges()` collects first non-empty `weaverse.getTranslationChanges()` from `window.__weaverses`.

Current Next state:

- `packages/next/src/runtime.ts` has placeholder translation fields/methods:
  - `translationMap: Record<string, unknown> = {}`
  - `translationLocale = ''`
  - `translationLanguageId = ''`
  - `extractTranslationSidecar = () => undefined`
  - `setTranslationSidecar(...)` only assigns fields, no refresh.
  - `updateTranslation = () => undefined`
  - `getTranslationChanges = () => undefined`
- `packages/next/src/item.ts` flattens data/schema defaults but does not overlay translations.
- `packages/next/src/types.ts` does not define Next-specific translation map/change types.
- `packages/next/__tests__/next-adapter.test.tsx` is the main runtime/provider test file.

## Goal

Implement item-level translation sidecar parity in `@weaverse/next`, matching Hydrogen behavior.

Required changes:

1. Add Next translation sidecar types in `packages/next/src/types.ts` and export them from `packages/next/src/index.ts`:
   - `WeaverseNextTranslationMapEntry`
   - `WeaverseNextTranslationItemEntry`
   - `WeaverseNextTranslationMap`
   - `WeaverseNextTranslationEntry`
   - `WeaverseNextTranslationChanges`
   Keep shapes aligned with Hydrogen. Values can be strings for now, but consider object values if needed to match Builder image handling; do not over-broaden without tests.
2. Update `packages/next/src/item.ts`:
   - `WeaverseNextItem` should overlay translations in `getSnapShot()` when `this.weaverse.translationMap?.[this._id]` exists.
   - Use the same memoization pattern as Hydrogen: cache merged snapshot keyed by `_store` ref and translation entry ref.
   - No translations → return base `_store` directly.
3. Update `packages/next/src/runtime.ts`:
   - Type translation fields with the new types.
   - `extractTranslationSidecar()` should read from `this.data` and set map/locale/languageId when present; clear to defaults when absent to prevent stale sidecar after route/reuse/project-data changes.
   - Constructor should call `extractTranslationSidecar()` after `super()` initializes data/items.
   - `setTranslationSidecar(map, locale, languageId)` should set fields and `refreshAllItems()` like Hydrogen.
   - `updateTranslation(itemId, key, originalValue, translatedValue)` should:
     - create per-item map if absent,
     - assign a new per-item entry object so `getSnapShot()` cache invalidates,
     - trigger only that item if present.
   - `getTranslationChanges()` should return undefined unless both `translationLocale` and `translationLanguageId` are set and entries exist.
     - entries use `key: 'data.<key>'`.
   - `setProjectData(data)` override should set data, extract sidecar, then `initProject()`.
   - Runtime reuse branch in `createWeaverseNextRuntime()` should update translation sidecar correctly when fresh page data is applied. Design-mode reuse currently avoids `setProjectData(page)` to avoid clobbering drafts; be careful not to clobber live draft item tree. For design-mode reuse, update only latest payload (`__weaverseNextLatestData`) unless there is a safe reason. For non-design reuse, `setProjectData(page)` should re-extract sidecar via the override.
4. Tests in `packages/next/__tests__/next-adapter.test.tsx`:
   - item snapshot overlays `translationMap` `translatedValue` over base `_store`.
   - no translation returns base snapshot / base values.
   - memoization: same store + same translation entry returns same object; updating translation creates a new per-item entry and snapshot changes.
   - `setTranslationSidecar()` updates locale/languageId/map and refreshes items (can assert item subscriber called or snapshot updates after call).
   - `updateTranslation()` changes only translation map and does not mutate base `_store`; selected snapshot renders translated value; item update subscriber fires.
   - `getTranslationChanges()` returns expected entries with `data.<key>` and undefined when locale/languageId missing or no entries.
   - `setProjectData()` clears stale translation sidecar when next page data lacks it.
   - Runtime reuse non-design applies fresh sidecar via `setProjectData()`. Design-mode reuse should not clobber live item drafts; add/adjust tests only if straightforward.
5. Update `.specs/2026-06-21--next-studio-bridge/work-logs.md` with this slice.

## Non-goals / guardrails

- Do **not** modify Builder.
- Do **not** change static-text foundation from PR #488 except if type wiring is required.
- Do **not** publish npm or update POC in this PR.
- Keep public/deprecated compatibility from PR #488 intact.
- Avoid broad refactors or new API surface beyond the types/methods needed for parity.
- Leave changes uncommitted; Hermes will review, run checks, commit/push/open PR.

## Verification commands

Run at least:

```bash
pnpm --filter @weaverse/next test -- __tests__/next-adapter.test.tsx
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
git diff --check
```

Report exact commands/results. If the test runner executes the whole package suite, report actual count.
