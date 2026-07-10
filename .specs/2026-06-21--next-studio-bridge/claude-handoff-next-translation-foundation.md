# Claude handoff — Next translation/static-text foundation parity

## Repo / branch

- Repo: `/Users/hta218/Documents/work/workspace/weaverse`
- Branch: `feat/next-translation-sidecar-foundation`
- Base: `main` at `0b303b5b Test Next multi-runtime selection parity`
- Tracker: https://github.com/Weaverse/builder/issues/2659

## Context

Continuing Next Productionization Epic 2663. Recently landed:

- `@weaverse/next@0.1.0-alpha.7`: pageAssignment/save payload parity.
- PR #487: tests-only multi-runtime/nested instance registry parity.

Next parity area is **translation/static-text sidecar**. It is broad, so this first PR should be a narrow **foundation** slice: add the static text translation provider/store/hooks and wire them into the Next root/provider/runtime enough for Builder static-text Studio updates to reach the runtime. Do not try to finish item-level translation sidecar in this PR unless the cleanest implementation falls out naturally.

## Hydrogen reference

Important Hydrogen files already audited:

- `packages/hydrogen/src/hooks/translation-context.tsx`
  - exports `TranslationProvider`, `useTranslation`, deprecated `useThemeText`, `createTranslate`, `getNestedKey`, `interpolate`.
  - priority: external `t` > design overrides (`TranslationStore`) > merchantOverrides > staticContent > key.
- `packages/hydrogen/src/utils/translation-store.ts`
  - mutable `TranslationStore` / deprecated `ThemeTextStore`, with `setOverrides`, `updateOverrides`, `subscribe`, snapshots.
- `packages/hydrogen/src/WeaverseHydrogenRoot.tsx::withWeaverse()`
  - root wrapper creates a single `TranslationStore` and wraps app in `TranslationProvider` with root-loaded `staticContent` and `merchantOverrides`.
- `packages/hydrogen/src/utils/use-studio.ts::useStudio()`
  - attaches `translationStore`, deprecated `themeTextStore`, and `merchantOverrides` to `weaverse.internal` so Builder `updateStaticText()` can mutate live design overrides.
- `packages/hydrogen/src/weaverse-client.ts::loadThemeSettings()`
  - always includes `staticContent` from `themeSchema.i18n.staticContent` and locale-specific `merchantOverrides` from the API.

Builder Studio expectations:

- `builder/studio/rpc/methods.ts::updateStaticText()` reads `this.studio.weaverse.internal.themeTextStore` and calls `updateOverrides(overrides)` for live static text preview, then accumulates changes for save.
- `builder/studio/index.ts::restoreStaticTextDrafts()` reads `internal.themeTextStore` and calls `setOverrides(...)` during init.
- `builder/studio/index.ts::syncDataWithEditor()` sends `staticTranslationOverrides: merchantOverrides || undefined`.

Current Next state:

- `packages/next/src/types.ts::WeaverseNextThemeSettingsResponse` already has `staticContent?: Record<string, unknown>` and `merchantOverrides?: Record<string, unknown>`.
- `packages/next/src/server/server-client.ts::loadThemeSettings()` needs audit: it likely returns remote theme response but may not inject `themeSchema.i18n.staticContent` like Hydrogen does.
- `packages/next/src/root-provider.tsx` owns theme settings store only.
- `packages/next/src/provider.tsx` route provider adopts root theme store only.
- `packages/next/src/runtime.ts` stubs translation sidecar methods and does not attach static text stores/overrides to `runtime.internal`.
- No `useTranslation` / `useThemeText` exports in `@weaverse/next` yet.

## Goal: first narrow foundation slice

Implement static text translation foundation parity for `@weaverse/next`:

1. Add Next-owned translation context/store modules, porting Hydrogen behavior with Next naming and compatibility aliases:
   - `TranslationStore`, deprecated `ThemeTextStore`
   - `TranslationProvider`, deprecated `ThemeTextProvider`
   - `useTranslation`, deprecated `useThemeText`
   - helpers `createTranslate`, `getNestedKey`, `interpolate`
   - keep behavior aligned with Hydrogen priority chain and interpolation.
2. Wire root provider ownership:
   - `WeaverseNextRootProvider` should create one stable `TranslationStore` ref, like it does for theme settings.
   - Add props for `staticContent`, `merchantOverrides`, and optional external `t` if needed.
   - Wrap children in `TranslationProvider` so global modules can call `useTranslation()` / `useThemeText()`.
3. Wire route/runtime adoption enough for Builder static text updates:
   - Add translation store and merchant overrides to root context value.
   - Let `WeaverseNextProvider` adopt the ambient root translation store/merchantOverrides (fallback creates its own store when no root provider exists).
   - Extend `WeaverseNextContextValue` / runtime config/internal types as needed.
   - `WeaverseNextRenderer` should pass translation store / merchantOverrides into `createWeaverseNextRuntime()`.
   - `WeaverseNextRuntime.internal` should include `translationStore`, deprecated `themeTextStore`, and `merchantOverrides` so Builder's existing static-text RPC works with Next just like Hydrogen.
4. Ensure `loadThemeSettings()` mirrors Hydrogen static content behavior:
   - If `themeSchema.i18n.staticContent` exists, include it in the returned theme settings response.
   - Preserve returned `merchantOverrides` if present; do not invent a fetch endpoint unless current server client already has one or tests can mock returned data.
5. Export public APIs from `packages/next/src/index.ts`.
6. Tests:
   - `TranslationStore`: `setOverrides`, `updateOverrides`, subscribe/snapshot behavior.
   - `createTranslate`: priority chain + interpolation + nested merchant/static lookup + design override exact-key priority.
   - `TranslationProvider`/`useTranslation`: hook returns translated values inside provider and throws outside provider.
   - `WeaverseNextRootProvider`: root/global child can call `useTranslation()` using `staticContent` and live store overrides.
   - Runtime bridge: a runtime created through provider/renderer or direct `createWeaverseNextRuntime` config exposes `internal.themeTextStore`/`translationStore` and `merchantOverrides`; updating the store changes `useTranslation()` consumers in tests where feasible.
   - Server theme settings: `loadThemeSettings()` includes `themeSchema.i18n.staticContent` in response.
7. Update `packages/next/README.md` only if there is an obvious public API snippet; otherwise work-log is enough.
8. Append a concise work-log entry to `.specs/2026-06-21--next-studio-bridge/work-logs.md`.

## Non-goals / guardrails

- Do **not** touch Builder in this PR.
- Do **not** implement full item-level translation sidecar unless it is very small and required by static text wiring. In particular, do not rewrite `WeaverseNextItem.getSnapShot()` / `updateTranslation()` unless you intentionally choose to include item translations and add tests.
- Do **not** add a live network fetch for merchant overrides unless current server client already has the endpoint semantics. Preserve/propagate the response shape first.
- Do **not** update POC or publish npm.
- Keep old/deprecated Hydrogen names as compatibility aliases (`ThemeTextStore`, `useThemeText`, etc.) if you add new canonical names.
- Leave changes uncommitted; Hermes will review, run checks, commit/push/open PR.

## Verification commands

Run at least:

```bash
pnpm --filter @weaverse/next test -- __tests__/next-adapter.test.tsx __tests__/next-server.test.tsx
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
git diff --check
```

Report exact commands/results. If the test runner ignores file args and runs all package tests, report actual count.
