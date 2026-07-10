# Claude/Hermes work log: Issue #2597 Next Studio Bridge E2E

Issue: https://github.com/Weaverse/builder/issues/2597
Branch: `feat/next-studio-bridge-e2e`
Date: 2026-06-23

## Changed files

- `packages/next/src/studio-router.ts`
- `packages/next/src/use-weaverse-next-studio.tsx`
- `packages/next/src/renderer.tsx`
- `packages/next/src/index.ts`
- `packages/next/package.json`
- `packages/next/tsconfig.json`
- `packages/next/vitest.config.ts`
- `packages/next/__tests__/studio-router.test.ts`
- `packages/next/__tests__/__mocks__/next-navigation.ts`
- `.specs/2026-06-21--next-studio-bridge/claude-handoff-issue-2597.md`

## Implementation summary

Claude implemented the first SDK-side Next Studio navigation/revalidation slice:

- Added `createWeaverseNextStudioInternals(router, options)` as a pure adapter from a Next App Router-like object to Studio runtime internals.
- Maps Studio `navigate(to, { preventScrollReset })` to:
  - `router.push(to, { scroll })` by default;
  - `router.replace(to, { scroll })` when `replace: true` is configured;
  - `scroll = false` when `preventScrollReset: true`.
- Maps Studio `revalidate()` to `router.refresh()`.
- Added `useWeaverseNextStudioInternals()` and `WeaverseNextStudio`, a client-only component that calls `useRouter()` from `next/navigation` and feeds callbacks into `WeaverseNextStudioBridge`.
- Updated `WeaverseNextRenderer` to render `WeaverseNextStudio` instead of the raw bridge, so package-level renderer owns Next-native Studio internal wiring.
- Exported the new Studio router helpers and component from `@weaverse/next`.
- Kept `next/navigation` external in tsup and test-mapped it to a local mock because Next is not installed in this monorepo test graph.

Hermes fixed the incomplete Claude pass:

- Fixed Vitest mock typing.
- Applied Biome import ordering.
- Avoided adding `next` as a peer dependency in this slice because regenerating the pnpm lockfile caused unrelated catalog/latest dependency churn. The runtime import remains external and resolves in the consuming Next app.

## Verification results

Passed locally in `Weaverse/weaverse`:

```bash
pnpm --filter @weaverse/next test
# 3 files, 56 tests passed

pnpm --filter @weaverse/next typecheck
# passed

pnpm --filter @weaverse/next build
# passed

pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/package.json --diagnostic-level=error
# passed

git diff --check
# passed
```

Also tested `pnpm install --frozen-lockfile --filter @weaverse/next --ignore-scripts` after removing the peer dependency addition; pnpm reported `Lockfile is up to date` but the command wrapper timed out after pnpm printed `Done`. No lockfile changes are present.

## Remaining risks / manual E2E steps

This is not full Studio E2E yet. Still required:

1. Install/pack this SDK branch into the Next POC.
2. Verify POC build with the new renderer importing `next/navigation`.
3. Mount `WeaverseNextStudioConnect` at the POC root/client shell if it is not already mounted.
4. Open live POC in Studio and verify:
   - bridge script loads;
   - `window.weaverseStudio` exists;
   - `checkWeaversePage()` succeeds;
   - section hover/select works;
   - setting edit updates preview without clobbering drafts;
   - resource-picker changes call `router.refresh()` and server data reloads.

## Builder changes

No Builder change appears necessary for this first slice. The code stays in `@weaverse/next` and maps the framework-specific internals to the existing bridge contract.

## 2026-07-02 — @hta218 (with Claude): fix stale refreshStudio payload on RSC revalidation

Symptom (POC "Resource picker smoke" section): picking a product in Studio ran
the loading bar, the draft was saved, but the section kept rendering the old
product. Publish + full Studio reload was required to see the new resource.

### Root cause (SDK, `packages/next/src/runtime.ts`)

The revalidation round-trip itself worked end-to-end: Builder's fetch patch
appended `weaverseDraftItem` to the Next `_rsc` request, the server loader ran
with the draft product handle, and the RSC response carried fresh per-item
`loaderData`. The failure was client-side in `createWeaverseNextRuntime`:

1. The reused design-mode runtime deliberately skips `setProjectData(page)`
   (correct — the live Studio tree owns unsaved drafts), but it also dropped
   the fresh payload entirely.
2. `bindWeaverseNextStudioRuntime` then called
   `studio.refreshStudio({ data: runtime.data, ... })` — the STALE live tree.
3. Builder's `refreshStudio` merges draft structural edits with the incoming
   payload's per-item `loaderData` (`buildRevalidatedItems`). With a stale
   payload it merged back the OLD `loaderData`, so the section re-rendered the
   previous resource while `revalidationVersion` still bumped — the loading bar
   completed and the preview looked "done" with stale data.

Hydrogen does not have this bug because `createWeaverseInstance` always passes
the fresh loader params straight to `window.weaverseStudio.refreshStudio(...)`.

### Fix

- `createWeaverseNextRuntime` now stashes the latest server payload on the
  runtime (`__weaverseNextLatestData`) on both the create and reuse paths,
  without touching the design-mode live tree.
- `bindWeaverseNextStudioRuntime` reports that stashed payload (falling back to
  `runtime.data`) to `refreshStudio`, mirroring Hydrogen's semantics: fresh
  data flows as a parameter; Builder owns the draft merge.

### Tests

- Updated `should_refresh_studio_after_reusing_runtime_with_new_page_data` —
  it previously asserted `data: reusedRuntime.data`, codifying the bug; it now
  asserts the fresh page items are reported.
- Added
  `should_report_fresh_loader_data_to_refresh_studio_when_design_mode_tree_is_stale`
  simulating the resource-picker flow (stale live tree + fresh `loaderData`).

### Verification

```bash
pnpm --filter @weaverse/next test       # 3 files, 59 tests passed
pnpm --filter @weaverse/next typecheck  # passed
pnpm --filter @weaverse/next build      # passed
pnpm exec biome check packages/next/src/runtime.ts \
  packages/next/__tests__/next-adapter.test.tsx --diagnostic-level=error  # clean
```

### Builder changes

None required — the #2601 Builder changes (draft-item `_rsc` param, deferred
refresh while silent update is pending, honored `shouldRevalidate` for
server-only loaders) are correct; the remaining gap was SDK-side only.

### Remaining manual E2E

Publish/pack a new `@weaverse/next` alpha, install it in the POC, and re-run
the resource-picker smoke: pick a product → loading bar → section renders the
new product without publish + Studio reload.

## 2026-07-09 — low-risk Hydrogen parity slice

After the dedicated Next Studio bridge path was validated end-to-end in the POC, #2659 was audited for remaining `@weaverse/hydrogen` vs `@weaverse/next` gaps. This slice intentionally tackles low-risk parity before deeper Studio/runtime features.

### Scope

- Add custom-page sitemap helper parity on `WeaverseNextServerClient.fetchCustomPages()`.
- Add Next Metadata-compatible SEO conversion helpers (`getWeaverseNextSeoMetadata`, `formatWeaverseNextSeoMetadata`).
- Add missing resource picker data aliases (`WeaverseBlog`, `WeaverseArticle`, `WeaverseMetaObject`) next to product/collection aliases.
- Update `packages/next/README.md` to reflect the dedicated `/static/studio/next/*` bridge and new helper APIs.

### Non-scope

- Translation/static-text sidecar runtime and save-payload support.
- Multi-runtime/nested page selection semantics.
- Global sections.
- Next request-handler/redirect ownership decision.

### Verification target

```bash
pnpm --filter @weaverse/next test
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
git diff --check
```

## 2026-07-09 — 404/error-route Studio connect smoke (issue #2659)

Continuing the parity roadmap after the low-risk Hydrogen parity slice: the next low-risk item was making the package-level 404/error-route Studio-connect story explicit and covered by tests.

### Scope

- Extracted `loadWeaverseNextStudioScript(context?, options?)` from `WeaverseNextStudioConnect` in `packages/next/src/studio-connect.tsx` — a pure-ish helper (resolve script src, dedupe by src, append to `document.head` when `document` exists; SSR-safe no-op otherwise) that can be exercised in Node tests without React effect execution. `WeaverseNextStudioConnect` now just calls it from `useEffect`.
- Exported `loadWeaverseNextStudioScript` / `LoadWeaverseNextStudioScriptOptions` from `@weaverse/next` (`packages/next/src/index.ts`), matching the existing `resolveWeaverseNextStudioScriptSrc` export pattern.
- Added `packages/next/__tests__/studio-connect.test.ts` with a tiny `document`/`head` stub (Node env, no jsdom) covering: design-mode script load with no page/runtime/renderer data (simulating a `not-found.tsx` / `error.tsx` root layout), preview-mode script load, src-dedupe on repeated calls, SSR no-op when `document` is undefined, and rejection of an untrusted `weaverseHost`.
- Updated `packages/next/README.md`: documented that mounting `WeaverseNextStudioConnect` in the root layout also covers `not-found.tsx` / `error.tsx` routes (Studio needs the bridge script before a page tree exists), and removed the now-covered "404/error-route Studio connection smoke" line from Current limitations.

### Non-scope

- Translation/static-text, global sections, multi-runtime/nested Weaverse behavior, request-handler/redirect parity.
- No Builder changes.

### Verification

```bash
pnpm --filter @weaverse/next test       # 5 files, 76 tests passed
pnpm --filter @weaverse/next typecheck  # passed
pnpm --filter @weaverse/next build      # passed
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error  # clean
git diff --check                        # clean
```

### Remaining risk

- This is package-level unit coverage of the script-loading behavior only; it does not exercise a real Next `not-found.tsx`/`error.tsx` route or the browser DOM. Manual/E2E confirmation in the POC (mount `WeaverseNextStudioConnect` in root layout, hit a 404 route in design mode, confirm the bridge script tag appears) is still open.

## 2026-07-09 — root-owned theme provider (`next-theme-provider-design.md` implementation slice)

Implemented the SDK slice from `next-theme-provider-design.md`: a root-owned theme settings store shared between global modules (`Header`/`Footer`, mounted once in `app/layout.tsx`) and the route-scoped page runtime, matching Hydrogen's `withWeaverse()` root store split.

### Scope

- Added `WeaverseNextRootProvider` (`packages/next/src/root-provider.tsx`, `'use client'`): creates exactly one `WeaverseNextThemeSettingsStore` via `useRef` (not `useMemo`, so a parent re-render never replaces it), seeded from `initialThemeSettings`/`themeSchema`/`publicEnv`. Updates the existing store in place (`updateThemeSettings`) if `initialThemeSettings` changes identity after mount, rather than replacing it. Also renders `WeaverseNextContext` with a minimal value (`{ themeSettings, themeSettingsStore }`) so `useThemeSettings()` works for components mounted directly under the root provider, with no route-level `WeaverseNextProvider` above them.
- Added ambient-store adoption to `WeaverseNextProvider` (`packages/next/src/provider.tsx`): reads `WeaverseNextRootContext` via `useContext`; if present, reuses `rootContext.themeSettingsStore` instead of creating a second store (the fallback `useMemo`-created store isn't even constructed in that case). If the route also supplies `themeSettings`/`client.themeSettings`, merges that data into the adopted root store in place inside a `useEffect` (guarded by a ref keyed on value identity so it doesn't re-merge/re-notify every effect run) — the root's initial theme is authoritative for SSR, and the route override applies after client mount. Apps that never mount `WeaverseNextRootProvider` fall back to the pre-existing per-render `useMemo` store, unchanged (still synchronous on SSR).
- `WeaverseNextRenderer`/`runtime.ts` needed no changes — they already read `context.themeSettingsStore` and pass it through to `runtime.internal.themeSettingsStore`, so once the route provider adopts the root store, the page runtime and Studio's `updateThemeSettings()` calls land on the same instance the root modules read.
- Exported `WeaverseNextRootProvider`, `WeaverseNextRootProviderProps`, `WeaverseNextRootContextValue` from `packages/next/src/index.ts`.
- `provider.tsx` and `root-provider.tsx` have a (safe) circular import — each only references the other's export inside a function body (`useContext`/JSX), never at module top-level evaluation, so this is fine under ESM and confirmed clean in the `tsup` build.
- Added a `## Root theme provider` section to `packages/next/README.md` with a minimal `app/layout.tsx` example and a note on the adoption/merge/fallback contract.

### Tests

Added a `WeaverseNextRootProvider` describe block to `packages/next/__tests__/next-adapter.test.tsx` (5 new tests): root-only consumer, root's SSR value staying authoritative even when a route provider carries pending route theme data (the merge itself now runs in a client-only effect, so it doesn't fire under `renderToStaticMarkup`), root-only settings preserved when the route provider has no explicit theme data, the page renderer (`WeaverseNextRenderer`) observing the same root store instance, and unchanged backward-compatible behavior with no root provider mounted.

Hit one test-fixture pitfall worth flagging for future SDK test authors: `@weaverse/core`'s `Weaverse.itemInstances` is a **process-wide static `Map` keyed by item id** (`packages/core/src/core.ts:89`), and `Weaverse.initProject` calls `itemInstance.setData(item)` on an id collision instead of constructing a fresh item — so reusing a fixture item id like `'item-root'` across unrelated tests in the same file (even with different item `type`s) silently corrupts a *later* test's rendered output. Fixed by giving the new renderer test unique page/item ids (`'page-theme-aware'` / `'theme-aware-root'`); this is pre-existing library behavior, not a new bug introduced by this slice.

### Verification

```bash
pnpm --filter @weaverse/next test       # 5 files, 81 tests passed
pnpm --filter @weaverse/next typecheck  # passed
pnpm --filter @weaverse/next build      # passed (tsup: ESM/CJS/DTS all succeeded)
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error  # clean
```

### Non-scope

- Starter convention files (`app/weaverse-next/root-provider.tsx`, `loadWeaverseNextRootTheme()`, moving `Header`/`Footer` in the POC) — POC repo untouched per this run's guardrails.
- Design-mode client-side theme refresh before Studio's own push (flagged as an open product/UX question in the design doc, not a technical blocker).
- Translation/static-text sidecar, global sections, i18n beyond passthrough, redirects.

### Remaining risk

- Not yet verified against a real Next App Router app (root render smoke, navigation-without-remount smoke, Studio edit propagation smoke from the design doc's verification plan are all POC-level manual/E2E steps, not covered by this package-level unit slice).

## 2026-07-09 — autoreview fixes on the root-owned theme provider slice

Fixed both `[P2]` findings from `autoreview-next-root-theme-provider.md` against the root-owned theme provider slice above.

### Scope

- `packages/next/src/root-provider.tsx`: `rootContextValue` and `contextValue` were plain object literals rebuilt every render with a new identity even though the underlying `themeSettingsStore` (`useRef`-stable) never changes — causing every `useThemeSettings()` consumer (root `Header`/`Footer`) to re-render on every root layout re-render. Wrapped both in `useMemo` keyed on `themeSettingsStore`.
- `packages/next/src/provider.tsx`: the route-level merge of `themeSettings`/`client.themeSettings` into the adopted root store ran directly in the render function body, guarded only by a ref. Mutating a store shared outside the component's subtree during render violates React's pure-render contract and is a latent correctness risk under concurrent rendering/StrictMode double-invocation, even though it worked for the primary SSR path. Moved the merge into a `useEffect` (same ref guard, now keyed off effect re-runs instead of render re-runs).
- `packages/next/src/provider.tsx`: removed `themeSettingsValue` from the context `value` memo dependencies. In fallback mode the theme value is represented by a new `themeSettingsStore`; in root-adoption mode the post-mount merge effect notifies `useThemeSettings()` subscribers. Keeping `themeSettingsValue` there would recreate context with a stale root snapshot before the effect fires, causing an avoidable extra render.

### Product semantics change

Moving the merge to an effect changes what SSR renders when a route still passes `themeSettings`/`client.themeSettings` while a root provider is mounted: previously the merge was synchronous so SSR showed the *route's* value; now the merge is client-only, so SSR shows the *root's* initial value, and the route override applies after client mount. This is the intended direction, not an accepted regression — routes shouldn't be loading their own theme settings by default in the final starter, and the root's published-mode initial theme is the priority. Backward compatibility when no root provider is mounted is unchanged: `WeaverseNextProvider client={client with themeSettings}` still renders those settings synchronously on SSR via its own fallback store.

### Tests

- Renamed/rewrote `should_have_route_provider_adopt_the_root_store_and_merge_route_theme_settings` to `should_render_root_ssr_value_even_when_route_provider_carries_pending_theme_data` — now asserts SSR renders the root's value, not the route's, since the merge effect never runs under `renderToStaticMarkup`.
- Rewrote `should_share_the_same_theme_store_between_root_and_the_page_renderer` to drop the route-level `themeSettings` override (which no longer merges synchronously) and instead prove store sharing by asserting the renderer/runtime path observes the root's own value directly.
- The client-only merge effect itself has no dedicated unit test: this package's Vitest config runs in a plain `node` environment (no `jsdom`/`react-dom/test-utils`), and every existing provider test renders via `renderToStaticMarkup`, which never executes effects. This is a pre-existing test-environment gap, not something newly introduced by this fix.

### Verification

```bash
pnpm --filter @weaverse/next test -- __tests__/next-adapter.test.tsx
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
git diff --check
```

### Remaining risk

- The client-only merge effect (route theme data landing in the root store after mount, and root `Header`/`Footer` re-rendering from it) is unverified by an automated test for the reason above — still an open item for a future jsdom-enabled test pass or POC-level manual check.

## 2026-07-10 — pageAssignment / Studio save payload parity

Slice branch: `feat/next-page-assignment-save-parity`

### Scope

- Added an explicit `WeaverseNextPageAssignment` type for the Builder Studio save contract (`projectId`, `type`, `locale`, `handle`, optional inherited/fallback `meta`).
- Normalized raw `/api/public/project` assignments in `createWeaverseNextServerClient().loadPage()`:
  - missing/malformed assignments remain `undefined` instead of being fabricated;
  - nullish `locale` becomes `''`;
  - object `meta` is preserved for inherited/fallback diagnostics.
- Tightened `WeaverseNextLoaderData.pageAssignment` and `WeaverseNextRuntimeInternal.pageAssignment` to the explicit type.
- Added tests proving full save-compatible assignment preservation, null-locale normalization, runtime internal exposure, and runtime reuse updating the assignment after navigation/revalidation.

### Verification

```bash
pnpm --filter @weaverse/next test -- __tests__/next-server.test.tsx __tests__/next-adapter.test.tsx
# 5 files, 83 tests passed

pnpm --filter @weaverse/next typecheck
# passed

pnpm --filter @weaverse/next build
# passed

pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
# passed

git diff --check
# passed
```

### Notes

Claude started the SDK implementation from the handoff and timed out after touching the package source. Hermes completed the missing tests/work-log and ran verification. No Builder database/save endpoint changes were needed for this package-level contract slice.

## 2026-07-10 — multi-runtime / nested instance selection parity

Slice branch: `feat/next-multi-runtime-selection`
Tracker: https://github.com/Weaverse/builder/issues/2659

Continuing Epic 2663 after `@weaverse/next@0.1.0-alpha.7`. This slice codifies the
multi-runtime / nested Weaverse instance contract as package-level tests so
`@weaverse/next` provably matches Hydrogen's `window.__weaverses` registry/reuse
semantics and hands Builder Studio every runtime candidate.

### Outcome: tests-only (no SDK bug found)

Audited `createWeaverseNextRuntime` / `bindWeaverseNextStudioRuntime` against the
Hydrogen reference behavior in `packages/hydrogen/src/WeaverseHydrogenRoot.tsx`
(`createWeaverseInstance()`) and Builder's `resolveEditingInstance()` /
`init()` selection. The existing Next implementation already satisfies the
contract, so no source change was needed — this is a tests + work-log slice.

### Scope

Added a `multi-runtime / nested instance selection` describe block to
`packages/next/__tests__/next-adapter.test.tsx` (5 tests):

1. **Co-located multi-runtime registry** — two design-mode runtimes at the same
   `pathname + search` but different page/root IDs both land in
   `window.__weaverses` under their own keys, are not reused across page IDs, and
   each keeps its own `pageId` / `requestInfo` / `data.rootId` /
   `internal.pageAssignment` / `internal.project`. Also asserts
   `window.__weaverse` tracks the last-created candidate — Hydrogen's
   single-pointer + full-registry split. Builder owns deciding which co-located
   instance is the editable leaf.
2. **Same page + same URL reuse** — same `pageId` + same `requestInfo` returns
   the same runtime object, the registry key still points at it, and internal
   payload fields (`pageAssignment`, `project`) refresh from the latest loader
   pass.
3. **Same page + different URL** — `page` at `/collections/a` then `/collections/b`
   returns a fresh runtime object and overwrites `window.__weaverses[pageId]`,
   mirroring Hydrogen's "reuse only while the browser stays on the same URL".
4. **Studio bind per runtime** — with `window.weaverseStudio = { init, refreshStudio }`
   stubbed, binding both co-located design-mode runtimes calls `init` for each
   runtime object and leaves both registry keys intact. Builder's
   `resolveEditingInstance()` is intentionally NOT reimplemented in the SDK test;
   the SDK only verifies both candidates pass through.
5. **Distinct root item stores / element refs** — co-located runtimes with
   distinct item IDs own distinct root item stores, each carrying its own element
   ref (set directly, since the Node test env has no jsdom). Documents that the
   actual DOM leaf-selection walk is Builder-owned and covered there.

Item IDs are globally unique per test (prefixed `mr-*`) to avoid the process-wide
`Weaverse.itemInstances` static map leaking item stores across tests (the pitfall
flagged in the 2026-07-09 root-theme-provider entry).

### Non-scope

- No Builder Studio selection-logic changes (`resolveEditingInstance()` stays
  Builder-owned).
- No new public API surface — the existing runtime already satisfies the contract.
- Translation/static-text, global sections, markets/i18n, redirect helpers untouched.
- No npm publish / POC update — Hermes handles release flow after review/merge.

### Verification

```bash
pnpm --filter @weaverse/next test -- __tests__/next-adapter.test.tsx
# 5 files, 88 tests passed (83 → 88). NOTE: the `-- <file>` arg did not filter;
# vitest ran the whole package suite (all 5 files). +5 tests = the new block.

pnpm --filter @weaverse/next typecheck  # passed (exit 0)
pnpm --filter @weaverse/next build      # passed (tsup ESM/CJS/DTS all succeeded)
pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
# Checked 33 files. No errors.
git diff --check                        # clean (exit 0)
```

### Remaining risk

- Package-level unit coverage only. It does not exercise a real browser DOM or
  Builder's `resolveEditingInstance()` leaf pick — that path is Builder-owned and
  covered in the Builder repo. Full nested-instance Studio E2E in the POC (two
  co-located instances, confirm Builder edits the intended leaf) remains a
  manual/E2E step.
- Changes left uncommitted per the handoff; Hermes commits/pushes after review.

## 2026-07-10 — translation/static-text foundation parity

Slice branch: `feat/next-translation-sidecar-foundation`
Tracker: https://github.com/Weaverse/builder/issues/2659

First narrow slice for the broader translation/static-text parity area. This intentionally focuses on **static text translation foundation** and Builder static-text bridge wiring; full item-level translation sidecar remains a later slice.

### Scope

- Added Next-owned `TranslationStore` / deprecated `ThemeTextStore` aliases matching Hydrogen's mutable static-text override store.
- Added `TranslationProvider`, `useTranslation`, deprecated `useThemeText`, `createTranslate`, `getNestedKey`, and `interpolate` with the Hydrogen priority chain:
  1. external `t`
  2. live design overrides from `TranslationStore`
  3. locale `merchantOverrides`
  4. theme `staticContent`
  5. key fallback
- Wired `WeaverseNextRootProvider` to own one stable root translation store, plus `staticContent`, `merchantOverrides`, and optional external `t`.
- Wired route-level `WeaverseNextProvider` to adopt the root translation store/static content/merchant overrides, with a standalone fallback store when no root provider is mounted.
- Wired `WeaverseNextRenderer` / `createWeaverseNextRuntime()` so the runtime exposes:
  - `internal.translationStore`
  - deprecated `internal.themeTextStore` (same instance, for Builder's existing `updateStaticText()` RPC)
  - `internal.merchantOverrides`
- Reused runtimes refresh translation store/merchant override wiring and clear stale merchant overrides when the latest loader/config has none.
- Exported the new translation APIs from `@weaverse/next`.
- Added/confirmed server theme-settings coverage for returned `merchantOverrides` and schema-derived `staticContent`.

### Tests

Added coverage in `packages/next/__tests__/next-adapter.test.tsx` and `next-server.test.tsx` for:

- `TranslationStore` set/merge/subscribe behavior.
- translation helper behavior: nested lookup, interpolation, priority chain, own-property design override safety.
- `TranslationProvider` and `useTranslation`, including deprecated store alias and clear error outside provider.
- `WeaverseNextRootProvider` exposing translations to root/global children.
- route provider adopting the root translation store/static content.
- page tree components rendered through `WeaverseNextRenderer` resolving static text.
- runtime `internal.translationStore` / `themeTextStore` / `merchantOverrides` wiring and reuse refresh/clear behavior.
- server `loadThemeSettings()` preserving API-provided `merchantOverrides` while injecting schema static content.

### Non-scope

- No Builder changes.
- No item-level page translation sidecar yet (`translationMap`, translatable section fields, `updateTranslation()`, `getTranslationChanges()` remain a follow-up).
- No POC update or npm publish in this PR until the code is reviewed/merged.

### Verification

```bash
pnpm --filter @weaverse/next test -- __tests__/next-adapter.test.tsx __tests__/next-server.test.tsx
# 5 files, 107 tests passed (test runner executed the whole package suite)

pnpm --filter @weaverse/next typecheck
# passed

pnpm --filter @weaverse/next build
# passed

pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
# passed after formatting provider/root-provider

git diff --check
# passed
```

### Notes

Claude implemented the initial source/tests from the handoff but timed out before closeout. Hermes reviewed the partial diff, fixed stale `merchantOverrides` clearing on runtime reuse, added regression coverage for that case, fixed the standalone-provider fallback `TranslationStore` to use `useRef` instead of `useMemo`, corrected translation priority docs, formatted, and ran verification.

## 2026-07-10 — item-level translation sidecar parity

Slice branch: `feat/next-item-translation-sidecar`
Tracker: https://github.com/Weaverse/builder/issues/2659

Follow-up to PR #488 static-text foundation. This slice implements the item-level/page translation sidecar contract that Builder Studio already uses for Hydrogen.

### Scope

- Added Next item-level translation sidecar types:
  - `WeaverseNextTranslationMapEntry`
  - `WeaverseNextTranslationItemEntry`
  - `WeaverseNextTranslationMap`
  - `WeaverseNextTranslationEntry`
  - `WeaverseNextTranslationChanges`
- `WeaverseNextItem.getSnapShot()` now overlays `runtime.translationMap[itemId][field].translatedValue` over the base `_store`, memoized by `_store` ref + per-item translation entry ref like Hydrogen.
- `WeaverseNextRuntime` now implements:
  - `extractTranslationSidecar()` from page data
  - `setTranslationSidecar(map, locale, languageId)` + item refresh
  - `updateTranslation(itemId, key, originalValue, translatedValue)` + single-item notify
  - `getTranslationChanges()` with Builder's `data.<field>` key namespace
  - `setProjectData()` sidecar re-extraction/clearing on project data replacement
- Reused non-design runtimes apply fresh sidecars through `setProjectData()`; design-mode runtime reuse still avoids clobbering the live Studio-owned tree/sidecar.
- No Builder changes.

### Tests

Added `packages/next/__tests__/next-adapter.test.tsx` coverage for:

- snapshot overlay from page `translationMap`
- base fast path when no translations exist
- snapshot memoization and invalidation after `updateTranslation()`
- `setTranslationSidecar()` locale/languageId/map updates and item refresh
- `updateTranslation()` not mutating base `_store` and firing the item subscriber
- renderer output using translated values
- `getTranslationChanges()` output/undefined guards
- clearing stale sidecar when `setProjectData()` receives data without sidecar
- non-design runtime reuse applying a fresh sidecar
- design-mode runtime reuse preserving live Studio translation sidecar edits

### Verification

```bash
pnpm --filter @weaverse/next test -- __tests__/next-adapter.test.tsx
# 5 files, 118 tests passed (test runner executed the whole package suite)

pnpm --filter @weaverse/next typecheck
# passed

pnpm --filter @weaverse/next build
# passed

pnpm exec biome check packages/next/src packages/next/__tests__ packages/next/README.md --diagnostic-level=error
# passed

git diff --check
# passed

autoreview-copilot --mode local
# clean, no accepted/actionable findings
```

### Notes

Claude implemented the source/tests from the handoff but timed out before closeout. Hermes inspected the diff, fixed formatting/lint, added the work-log, ran verification, and ran autoreview.
