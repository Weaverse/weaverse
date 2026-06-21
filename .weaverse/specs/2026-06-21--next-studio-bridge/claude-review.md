# Claude Review: Next Studio Bridge Spec

> Reviewer: Claude Code (Opus 4.8). Target: PR #470, spec folder
> `.weaverse/specs/2026-06-21--next-studio-bridge/`. This review is read-only;
> no spec/code was modified. Source-grounded against `builder`, `weaverse`
> (SDK), and `weaverse-hydrogen-next-poc` working copies on 2026-06-21.

## Executive verdict

The spec is **substantially correct and unusually well-grounded**. The core
diagnosis — render-only `@weaverse/next` produces `.weaverse-content-root` but
never loads the bridge, never exposes `window.weaverseStudio`, and never binds a
runtime via `init()` — is confirmed against source. The two-part Hydrogen split
(root `useStudioConnect` + page `useStudio`), the runtime-shape gap, and the
"reuse `/static/studio/hydrogen` first" recommendation are all sound.

What the spec **underweights** is that Studio's design-mode update loop is not
`init()`-once. It is driven by the **SDK re-instantiating on every render and
calling `window.weaverseStudio.refreshStudio(params)`** (see
`WeaverseHydrogenRoot.tsx:308-312`), plus a `revalidate()` path
(`builder/studio/rpc/methods.ts:562-614`) that is deeply coupled to React
Router single-fetch (`installDraftItemRevalidationParam`, `buildRevalidatedItems`,
`revalidationVersion` polling). Mapping `revalidate → router.refresh()` is far
more involved than the spec's one-line table implies. Verdict: **approve the
spec to proceed to Phase 1, with the P0/P1 corrections below folded in first.**

## Source-grounded findings

### Confirmed spec claims

- **Bridge handshake is RPC, not DOM.** `checkWeaversePage()` only does
  `document.querySelector('.weaverse-content-root')`
  (`builder/studio/rpc/methods.ts:654-657`), but it is reachable only through the
  preview-side RPC endpoint the bridge script installs. The editor calls it via
  `PreviewRPC.call.checkWeaversePage()` after a 5s wait
  (`main-preview.tsx:149-159`). No script → no endpoint → timeout, even though
  the Next DOM already has the root. The spec's three readiness levels are exact.
- **`init()` is the real bind step.** `HydrogenStudioBridge.init()`
  (`builder/studio/index.ts:104-148`) calls `resolveEditingInstance`, assigns
  `weaverse.studioBridge`, runs `setInitialData`, `syncDataWithEditor`,
  `updatePageOutline`, then `EditorRPC.call.setStudioStateReady()`. Without it,
  RPC answers but no outline/inspector works. Confirmed.
- **Runtime-shape gap is real.** The bridge reads `weaverse.pageId`,
  `weaverse.requestInfo`, `weaverse.internal.{navigate,revalidate,
  themeSettingsStore,pageAssignment,merchantOverrides,themeTextStore}`,
  `weaverse.translationMap/Locale/LanguageId`. The Next renderer builds bare
  `new Weaverse({projectId, data})` and sets only `dataContext` + `isDesignMode`
  (`packages/next/src/renderer.tsx:62-67`). All of those fields are absent.
- **`window.__weaverses` registry is required.** `getPagesData()` iterates
  `window.__weaverses` (`methods.ts:370-379`); `getTranslationChanges()` too
  (`:384-388`); `resolveEditingInstance` consults `window.__weaverses`
  (`index.ts:108`). Hydrogen populates it in `createWeaverseInstance`
  (`WeaverseHydrogenRoot.tsx:296-307`) and sets `window.__weaverse` in `init`
  (`index.ts:147`). Next does neither. Confirmed.
- **Script resolver security policy.** `resolveStudioScriptSrc` /
  `isTrustedStudioHost` (`studio-script-src.ts:52-156`) reject untrusted
  `weaverseHost`, return `null` (never fall back to prod), and gate loopback on a
  loopback storefront. The spec's "reuse this policy, don't loosen it" is correct
  and the function is **pure** — directly reusable by Next.
- **POC is render-only with a hardcoded project id.** `wrapper.tsx:54` passes
  `projectId: "poc-test"`, which lands in `data-weaverse-project-id`
  (`renderer.tsx:63`). Confirmed; breaks Studio project binding.
- **Bridge's Hydrogen imports are type-only.** `index.ts:1-7` and `methods.ts`
  import `WeaverseHydrogen*` purely as TS types (erased at build). Nothing in the
  bundled runtime requires a real Hydrogen class — only the structural shape.
  This is what makes "reuse `/static/studio/hydrogen/index.js`" viable.

### Partially correct or needs nuance

- **`navigate`/`revalidate` mapping is not 1:1.** `02` and `04` map
  `navigate(to,{preventScrollReset:true}) → router.push(to,{scroll:false})`. The
  bridge actually calls `this.weaverse.internal.navigate(_to,{preventScrollReset:
  true})` (`index.ts:402`) — Next's `router.push` will silently ignore that
  second arg, so the adapter wrapper must absorb/translate it, not forward it.
- **`refreshPage` cache-buster does not port cleanly.** `refreshPage`
  (`index.ts:405-419`) appends `__weaverseRefresh=Date.now()` to `studioQueries`
  and navigates same-path so React Router re-runs loaders **and** the SDK builds
  a fresh instance. In Next App Router, `router.push(samePath)` is a route no-op
  and won't refetch RSC; the equivalent is `router.refresh()`, which refetches
  RSC in place **without** changing the URL or re-running the connect effect. The
  spec's L5 gestures at this but the porting is non-trivial — see Missing details.
- **Theme settings store interface name mismatch.** `04` proposes
  `WeaverseNextThemeSettingsStore` with `setSettings(next)`, but the bridge calls
  `themeSettingsStore.updateThemeSettings(data)` (`methods.ts:163-174`) and reads
  `.schema`, `.settings`, `.publicEnv`. The Next store must expose
  `updateThemeSettings`, not `setSettings`, or the theme inspector silently no-ops.
- **Translation is more than "sidecar."** Beyond `translationMap` the bridge also
  uses `internal.themeTextStore.setOverrides/updateOverrides`
  (`index.ts:85-93`, `methods.ts:440-443`) for static text drafts and
  `internal.merchantOverrides` in `syncDataWithEditor` (`index.ts:273-296`). `03`
  lists translation as one P2 gap but does not enumerate the `themeTextStore`
  contract. If absent, `restoreStaticTextDrafts` and `updateStaticText` reference
  `undefined` — currently guarded by `if (themeTextStore)`, so it degrades
  gracefully, but the spec should say so explicitly.
- **Schema "availability" understates a shape problem.** `getAllComponentSchemas`,
  `migrateSchema`, `addInputsVisibilityToSchema`, `getTranslatableKeys`,
  `shouldRevalidateOnItemUpdate` (`builder/studio/utils/data.ts:247-276`,
  `weaverse/schema.ts`) all assume the Hydrogen schema shape (`settings[].inputs[]`
  with `condition`, `defaultValue`, `name`). Next components author via
  `@weaverse/schema` `SchemaType`. Parity of that shape (not just "schemas are
  present") must be verified, or inspector visibility and add-item presets break.

### Incorrect or missing claims

- **Missing: the design-mode refresh loop driver.** The spec frames Studio as
  `init()`-once. In reality `createWeaverseInstance` calls
  `window.weaverseStudio.refreshStudio(normalizedParams)` on **every** design-mode
  render where the instance is reused (`WeaverseHydrogenRoot.tsx:308-312`), and
  `refreshStudio` (`index.ts:166-235`) is what re-syncs data/outline and bumps
  `revalidationVersion`. Next has no equivalent call site. Without it, the first
  edit may bind but loader revalidation, locale change, and page-selector refresh
  will not propagate. This is the single biggest omission.
- **Missing: `revalidate()` is React-Router-single-fetch-shaped.** `revalidate`
  (`methods.ts:562-614`) installs a draft-item query param via
  `installDraftItemRevalidationParam` and polls `studio.revalidationVersion`
  (bumped only by `refreshStudio`) plus per-item loader payload snapshots. None
  of this maps to `router.refresh()` directly: Next has no single-fetch request
  param hook and re-runs RSC server-side, not a client loader. The spec's
  `revalidate() → router.refresh()` row is too optimistic.
- **Missing: instance reuse uses a static global item map.** `Weaverse.itemInstances`
  is a **static** Map shared by every instance (`core/src/core.ts:89,147-148`),
  and `Weaverse.ItemConstructor` is static (`:97`). Bare `new Weaverse()` in Next
  uses the base `WeaverseItemStore` (no schema-default merge, no translation
  `getSnapShot`). The spec calls for `WeaverseNextItem` but does not note that it
  must set `Weaverse.ItemConstructor = WeaverseNextItem` globally and will then
  collide with Hydrogen's assignment if both packages ever load in one document.
- **Missing: iframe-embeddability / framing headers.** The preview iframe uses
  `sandbox="allow-scripts allow-same-origin ..."` (`main-preview.tsx:140`). A Next
  storefront that sets `X-Frame-Options` or CSP `frame-ancestors` (via
  `next.config` headers or middleware) will refuse to frame inside Studio. Not
  mentioned anywhere in the spec; it is a hard pre-req for L3.
- **Missing: Next fetch cache defeats design-mode freshness.** The POC fetch uses
  `next: { revalidate: 60 }` unconditionally (`page.tsx:40`). In design mode this
  serves up-to-60s-stale page data, contradicting "design mode bypasses stale
  cache" (`02`). Design/preview/revision requests must use `cache: 'no-store'`.

## Architecture critique

1. **Reuse-first is correct, but draw the seam at `refreshStudio`, not just
   `init`.** Phase 1 should reproduce *both* SDK call sites:
   `studio.init(runtime)` on bind **and** `studio.refreshStudio(params)` on each
   design-mode re-render with a reused instance. Otherwise the connection smoke
   (L3) can pass while every subsequent edit/revalidate silently fails (L4–L5).

2. **Keep the runtime callback-based; wrap `next/navigation` in a thin client
   component.** `03`'s recommendation is right. Concretely: `WeaverseNextRuntime`
   holds `internal.navigate/revalidate` as plain callbacks; a
   `WeaverseNextStudioBridge` client component calls `useRouter()`/`useSearchParams()`
   and wires `navigate = (to) => router.push(to,{scroll:false})`,
   `revalidate = () => router.refresh()`. This keeps the runtime unit-testable
   and makes `next` a peer dep only of the bridge entrypoint, not the core.

3. **Reuse the *pure* `resolveStudioScriptSrc` verbatim.** It already takes a
   search string and hostname and is framework-neutral. Feed it
   `useSearchParams().toString()` + `window.location.hostname`. Do not copy/fork
   it (forks drift on the trusted-host policy). Best: export it from a shared
   location both packages import.

4. **RSC boundary discipline.** `04`'s "create the client in a client component"
   is right and matches `provider.tsx:39-55`. But the root connect needs
   `useSearchParams()`, which opts the subtree into client rendering and **must be
   wrapped in `<Suspense>`** in App Router or it errors at build. Call this out.

5. **Static global item map is a latent multi-tenant hazard.** Because
   `itemInstances`/`ItemConstructor` are static on `Weaverse`, a page that ever
   imports both `@weaverse/hydrogen` and `@weaverse/next` gets last-writer-wins on
   `ItemConstructor`. POC is Next-only so it's fine now; document the constraint.

## Missing implementation details

- **`refreshStudio` parity:** the Next renderer must, in design mode, dedupe the
  instance through `window.__weaverses[pageId]` keyed by `pathname+search`
  (mirroring `WeaverseHydrogenRoot.tsx:296-307`) and call
  `window.weaverseStudio.refreshStudio({data,requestInfo,pageId})` when the
  instance is reused and `hasWeaverseStudio(window)`.
- **`pageAssignment` propagation:** `generatePageData` reads
  `weaverse.internal.pageAssignment` and `resolveFallbackPageMeta`
  (`builder/studio/utils/data.ts:60-83`). The Next `WeaverseNextLoaderData` already
  carries `pageAssignment` (`types.ts:88-94`) but the renderer drops it. Save
  (`getPagesData`) will produce wrong meta without it.
- **`internal.themeSettingsStore.updateThemeSettings` + RAF-coalesced schema
  recompute:** the store must support live `updateThemeSettings` (color drags) and
  the bridge's `addInputsVisibilityToSchema(migrateSchema(schema), settings)` path.
- **`sectionType`, `weaverseApiBase`, `weaverseVersion`, `isPreviewMode`,
  `isRevisionPreview`:** all read by the bridge/SDK; `requestContext` already has
  most fields (`types.ts:49-62`) but the renderer never forwards them.
- **`requestInfo` identity:** `init()` keys "new request" on `pageId` **and**
  `isEqual(requestInfo, prev)` (`index.ts:114-117`). Next must build a stable
  `requestInfo` (`pathname`, `search`, `queries`, `i18n`) and keep last-value
  semantics for duplicate query keys (matching `resolveStudioScriptSrc`'s `last()`).
- **Design-mode `no-store`:** thread `isDesignMode` into the app's `fetchPage` so
  it sets `cache: 'no-store'` (POC must drop `revalidate: 60` in design mode).
- **Framing headers:** document that the storefront must allow
  `frame-ancestors https://studio.weaverse.io` (and the configured host).

## Verification gaps

The plan (`05`) is strong on L0–L2 probes but thin where the hard failures live.
Add:

- **L0 — `refreshStudio` unit test:** mock `window.weaverseStudio.refreshStudio`;
  assert the renderer calls it on a reused-instance re-render with changed `data`,
  and calls `init` exactly once per `pageId+requestInfo`.
- **L0 — theme store contract test:** assert the Next store exposes
  `updateThemeSettings`, `schema`, `settings`, `publicEnv`, `subscribe`,
  `getSnapshot` (the exact symbols `methods.ts`/`index.ts` read), not `setSettings`.
- **L0 — schema-shape test:** run `migrateSchema` + `addInputsVisibilityToSchema`
  against a real `@weaverse/schema` Next component schema and assert
  `settings[].inputs[].__visible` resolves (catches shape drift early, off-browser).
- **L2 — add a framing probe:** from the editor origin, attempt to load the Next
  preview URL in an `iframe` and assert no `X-Frame-Options`/CSP refusal (check
  response headers server-side too).
- **L2 — assert `window.__weaverses` and `window.__weaverse` populated**, and
  `window.__weaverse.internal.pageAssignment` present (save path).
- **L4/L5 — revalidation probe:** edit a `featured-products`-style loader-backed
  section, assert `studio.revalidationVersion` increments (proving `refreshStudio`
  ran) and the loader payload changed — the `05` matrix omits this signal.
- **L5 — page-selector rebind:** exercise `rebindEditingInstance` /
  `getEditingPageId` with two pages co-located on one URL; assert
  `resolveEditingInstance` picks the intended `pageId`.
- **Negative test:** published-mode URL loads **no** `/static/studio` script and
  registers no `window.weaverseStudio` (regression guard for the prod gate).

## Recommended spec changes before implementation

### P0

- Add a dedicated section: **"Design-mode update loop = init + refreshStudio."**
  Document `WeaverseHydrogenRoot.tsx:308-312` → `index.ts:166-235` and require the
  Next renderer to reproduce the reuse-and-`refreshStudio` call. (Currently absent.)
- Correct the theme-store interface in `04`: replace `setSettings(next)` with
  `updateThemeSettings(next)` and list `schema/settings/publicEnv/subscribe/
  getSnapshot/getServerSnapshot` as the bridge-read contract.
- Add **`internal.pageAssignment`** and the full `configs`→runtime field list
  (`weaverseApiBase`, `weaverseVersion`, `isPreviewMode`, `isRevisionPreview`,
  `sectionType`) to the required runtime shape; the renderer must forward them.
- Add **design-mode `cache:'no-store'`** as an explicit requirement and flag the
  POC's `next:{revalidate:60}` (`page.tsx:40`) as a must-fix.

### P1

- Rewrite the `revalidate → router.refresh()` row into a subsection acknowledging
  the single-fetch coupling (`installDraftItemRevalidationParam`,
  `buildRevalidatedItems`, `revalidationVersion`) and propose how draft-item data
  reaches the RSC fetch (e.g. a query param the app's `fetchPage` reads).
- Add an **iframe-embeddability / `frame-ancestors`** requirement section.
- Add a **schema-shape parity** requirement (not just "schemas available").
- Note the **static `Weaverse.ItemConstructor`** global and the
  `WeaverseNextItem` registration step + Hydrogen-coexistence caveat.

### P2

- Document `themeTextStore.setOverrides/updateOverrides` and `merchantOverrides`
  as the static-text contract; state explicitly that v0 may ship without it
  because the bridge guards on `if (themeTextStore)`.
- Add the `<Suspense>` requirement around `useSearchParams()` in the root connect.

## Proposed implementation sequence

1. **Runtime + helpers (off-browser):** `WeaverseNextRuntime` (all bridge-read
   fields + `internal`), `WeaverseNextItem` (schema-default merge + `getSnapShot`),
   request-info builder, theme store with `updateThemeSettings`, and reuse the
   pure `resolveStudioScriptSrc`. Unit-test the contract symbol-by-symbol.
2. **Client bind components:** `WeaverseNextStudioConnect` (root, `useSearchParams`
   + `<Suspense>`, loads script) and `WeaverseNextStudioBridge` (page; wires
   `useRouter`, sets `internal.navigate/revalidate`, calls `init`, and on reused
   re-render calls `refreshStudio`). Register in `window.__weaverses`.
3. **POC wiring:** real `projectId`/configs, design-mode `no-store`, framing
   headers, drop `poc-test`. Pass L1/L2 probes (incl. framing + `__weaverses`).
4. **Builder Studio smoke (L3/L4):** handshake, outline, select, single text edit,
   `getPagesData` save payload.
5. **Hardening (L5/L6):** `refreshStudio`-backed revalidation, page-selector
   rebind, then translation/static-text and 404/error-route root connect.

Only after step 4 reveals a concrete incompatibility should the Builder
bridge-split (`04`'s fallback) be considered.

## Open questions for Leo/team

- **Revalidation model:** is `router.refresh()` acceptable as the *only* refresh
  primitive, given the bridge expects per-item loader revalidation via a request
  param? If not, do we add a Next-specific `fetchPage` draft-item channel, or
  scope v0 to full-page refresh and defer per-item revalidation?
- **Where does `refreshStudio` get called from in Next?** Inside the renderer's
  `useMemo` (like Hydrogen) or a dedicated effect? Effect timing vs. React 19
  compiler memoization needs a decision.
- **Builder path:** keep `/static/studio/hydrogen/index.js` for both frameworks
  (rename later) or introduce `/static/studio/next/index.js` only on a proven
  split? Spec recommends reuse; confirm Builder owners agree to no rename in v0.
- **Public API:** explicit `WeaverseNextStudioConnect` (Option A, full parity) vs.
  provider-implicit (Option B)? Recommend A; confirm consumer-setup tolerance.
- **Schema source of truth:** will `@weaverse/schema` `SchemaType` stay
  shape-compatible with Builder's `migrateSchema`/`addInputsVisibilityToSchema`,
  or do we need a migration shim in `@weaverse/next`?
- **Translation scope for v0:** ship Studio connect + structural editing only and
  defer translation/static-text, or block v0 on translation parity?
