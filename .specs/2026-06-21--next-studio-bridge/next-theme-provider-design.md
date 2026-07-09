# Next theme provider final design

Design/spec only — no SDK source touched. Builds on the route-scoped proof merged
in `weaverse-hydrogen-next-poc` PR #1 (`app/weaverse-next/server.ts`,
`wrapper.tsx`, `theme-settings-css-variables.tsx`), which is **superseded by
this revision** — see "Correction" below.

## Correction (post-review)

The previous version of this doc recommended keeping theme settings +
`WeaverseNextProvider` route-scoped, with only Studio connect at root. Leo
flagged that this breaks the real Hydrogen/Pilot architecture: global modules
(`Header`, `Footer`, popups, search, product cards, global CSS) render **once
in root** and read `useThemeSettings()`. Route-scoping the theme settings
store means those modules either have to be duplicated per route or can't
read theme settings from root at all — neither matches Pilot.

Evidence (Pilot):

- `app/root.tsx`: root loader calls `context.weaverse.loadThemeSettings()`;
  `Layout = withWeaverse(RootLayout)`; `GlobalStyle`, `Header`, `Footer`,
  `NewsletterPopup` render once in root and call `useThemeSettings()`.
- `app/.server/root.ts`: `loadCriticalData()` includes
  `weaverseTheme: context.weaverse.loadThemeSettings()`.
- `packages/hydrogen/src/WeaverseHydrogenRoot.tsx`: `withWeaverse()` creates
  the theme settings store once via `useCreateThemeSettingsStore()` and wraps
  the **entire root layout** in `ThemeSettingsStoreContext.Provider` — not a
  per-route provider.
- `packages/hydrogen/src/utils/use-theme-settings-store.ts`: the store reads
  its initial value from `useRouteLoaderData('root')`; in the browser it also
  sets `window.__weaverseThemeSettingsStore = this`.
- `packages/hydrogen/src/utils/use-studio.ts`: `useStudio(weaverse)` puts
  `themeSettingsStore` on `weaverse.internal.themeSettingsStore`; Studio calls
  `updateThemeSettings()` on that same instance during live edits.

Leo's product priority, in order:

1. Published mode is the priority case, always.
2. Design mode is secondary — it updates the store through the Studio bridge
   (`weaverse.internal.themeSettingsStore.updateThemeSettings()`), it does not
   drive root architecture.
3. Published mode must load initial global theme settings once at root so
   global modules render once and SSR correctly, avoiding a CSS/settings
   flash on first paint.

This revision keeps the route-scoped POC's page runtime/renderer split (it is
still correct for page data), but makes the **theme settings store root-owned**
to match Pilot.

## Recommendation: root-owned store + route-scoped page runtime (revised)

| Concern | Scope | Why |
| --- | --- | --- |
| Studio script connect (`WeaverseNextStudioConnect`) | **Root** (`app/layout.tsx`) | Unchanged. No page data dependency — resolves design/preview mode from `window.location.search` client-side, so it works before any route/page tree exists, and covers `not-found.tsx`/`error.tsx`. |
| Theme settings **store** (`WeaverseNextThemeSettingsStore`) | **Root** (`app/layout.tsx`, new `WeaverseNextRootProvider`) | **Changed.** Global modules (`Header`, `Footer`, popups, global CSS var bridge) render once in root and must read `useThemeSettings()` from a store that also lives at root — matching `withWeaverse()`'s `ThemeSettingsStoreContext`. A route-scoped store cannot serve components that render above/around `{children}`. |
| Page data fetch + `WeaverseNextRenderer`/runtime | **Route/page** | Unchanged. Needs the page's `searchParams` (design-mode flags, `weaverseProjectId`, etc.) and a serializable server payload (`page`) to construct a client-side `WeaverseNextClient`. Root layouts still cannot supply page-specific data. |
| Page-level `WeaverseNextProvider` | **Route/page**, but **adopts the root store instead of creating its own** | The route still needs a provider to carry `pageData`/`rootData`/`commerce`/`client` for the page tree, but it must not instantiate a second theme settings store — see SDK API changes below. |

This is not "root vs. route" as a single binary choice — the store and the
page renderer have different data dependencies and correctly live at
different scopes, same as Hydrogen's `withWeaverse()` (root store) +
`WeaverseHydrogenRoot` (route-scoped page tree) split. The POC proved the
route-scoped renderer half; it did not attempt the root store half.

## Constraints from Next App Router

1. **Root `layout.tsx` does not receive page `searchParams`.** Only a page
   (leaf segment) gets `searchParams`. This still means `isDesignMode`/
   `isPreviewMode`/`isRevisionPreview` cannot be resolved server-side in the
   root layout — but it no longer blocks a root-owned store. The root load
   can call `getWeaverseServerClient()`/`loadThemeSettings()` **without**
   design-mode context, i.e. always as a published-mode fetch, matching
   priority #1. Design-mode freshness is not a root-server concern any
   more — it is a client-side Studio bridge concern (see below).
2. **Root layouts persist across client-side navigation and do not remount.**
   Previously read as a reason to avoid a root provider (no remount signal
   per navigation). Re-read under the corrected priorities, this is
   *exactly the right behavior*: theme settings are global, not per-route —
   Pilot's root store also does not refetch on every navigation, it is
   fetched once at root and only updated by Studio's
   `updateThemeSettings()` push. A root provider that persists across
   navigation is the intended shape, not a workaround.
3. **Server → Client serialization is strict.** `WeaverseNextClient`
   (`client.ts`) holds functions and component references and cannot cross
   the Server→Client boundary. Only plain data (`theme.theme`,
   `theme.schema`, `page`) can be passed down; store construction
   (`createWeaverseNextThemeSettingsStore(...)`) must happen inside a
   `'use client'` component — now `WeaverseNextRootProvider` at root, instead
   of (only) `WeaverseNextProvider` per route.
4. **Design/preview query params are still route-scoped by nature** for the
   *page tree* — a Studio preview URL targets one page's content, so the
   per-route page/runtime fetch remains the natural freshness unit. This
   constraint applies to page data, not to the theme settings store, which is
   global by definition.
5. **No React-Router-style `useRouteLoaderData('root')` in App Router.** This
   is the one genuinely new constraint versus Hydrogen: Hydrogen's root store
   reads its initial value straight from the root loader via
   `useRouteLoaderData('root')`, reachable from any descendant. Next has no
   built-in equivalent for "read the parent layout's server data from a
   descendant." The root store's initial value must instead be threaded down
   as React Context from `WeaverseNextRootProvider` (a client component
   mounted in `app/layout.tsx`), which is the standard App Router pattern for
   this and requires no new Next API.

## Store unification (root + route)

`WeaverseNextProvider` today (`provider.tsx:70-77`) unconditionally creates
its own store via `createWeaverseNextThemeSettingsStore(...)`, and
`WeaverseNextRenderer` reads `context.themeSettingsStore` off that provider
and hands the same instance into `createWeaverseNextRuntime(...)`
(`renderer.tsx:64-70`), which stores it on
`runtime.internal.themeSettingsStore` (`runtime.ts:142-147`). That
provider→renderer sharing is correct and unchanged.

What was missing: nothing connected that instance to a root-level store, so
a root-mounted `Header`/`Footer` reading `useThemeSettings()` would either
throw (no provider above it) or read a *different* store than the one Studio
updates through the page runtime.

The fix is one more level of adoption, not a new store type:

- `WeaverseNextRootProvider` (new, root-scoped) creates **the** canonical
  `WeaverseNextThemeSettingsStore` from the root-loaded `theme.theme`/
  `theme.schema`, and exposes it on a new, small `WeaverseNextRootContext`.
- `WeaverseNextProvider` (existing, route-scoped) checks for an ambient
  `WeaverseNextRootContext` first; if present, it reuses that store instead
  of calling `createWeaverseNextThemeSettingsStore(...)` itself. If absent
  (e.g. an app that doesn't mount the root provider — including the current
  POC), it falls back to today's behavior unchanged.
- `WeaverseNextRenderer`/`runtime.ts` are untouched — they already just read
  whatever store is on `WeaverseNextContext.themeSettingsStore` and pass it
  through, so once the route provider is handed the root store, the page
  runtime and Studio's `updateThemeSettings()` calls automatically land on
  the same instance the root `Header`/`Footer` read.

Load-bearing invariant (updated): **exactly one
`WeaverseNextThemeSettingsStore` instance should exist per page load — owned
by `WeaverseNextRootProvider` when mounted, falling back to
`WeaverseNextProvider` when it isn't.** Nothing else should call
`createWeaverseNextThemeSettingsStore(...)` directly.

## Proposed starter convention files

```text
app/
  layout.tsx                          # root: loads initial theme settings once (published-mode),
                                       # mounts <WeaverseNextRootProvider>, <StudioConnect />,
                                       # <Header />, {children}, <Footer />, <NewsletterPopup />
  weaverse-next/
    studio-connect.tsx                 # thin wrapper around WeaverseNextStudioConnect (root-scoped)
    root-provider.tsx                  # thin wrapper around WeaverseNextRootProvider (root-scoped)
    server.ts                          # getWeaverseServerClient() + loadWeaverseNextPage() (route-scoped)
                                        # + loadWeaverseNextRootTheme() (root-scoped, no searchParams)
    wrapper.tsx                        # WeaverseNextPage: builds client, mounts Provider+Renderer (route-scoped)
    theme-settings-css-variables.tsx   # optional CSS var bridge, reads useThemeSettings() (can now live in root)
  page.tsx                             # calls loadWeaverseNextPage({ type: 'INDEX' })
  products/[handle]/page.tsx           # calls loadWeaverseNextPage({ type: 'PRODUCT', handle })
  collections/[handle]/page.tsx        # calls loadWeaverseNextPage({ type: 'COLLECTION', handle })
```

Key change from the POC layout: `app/layout.tsx` gains a server-side theme
load (`loadWeaverseNextRootTheme()`, no `searchParams` — see open questions)
and wraps `children` in `WeaverseNextRootProvider`, so `Header`/`Footer`/
popups can live in `app/layout.tsx` itself (or a component it renders) and
call `useThemeSettings()` directly, exactly like Pilot's `root.tsx`. Naming
cleanup carried over from the previous version (`WeaverseHome` →
`WeaverseNextPage`) is unchanged.

Routes should **not** load theme settings by default. They should load page data
(and commerce data) only; `useThemeSettings()` consumers read the root-owned
store. A route may still opt into its own `loadThemeSettings()` call for a
special page-local reason, but that is no longer part of the starter baseline
and should be treated as an exception.

## Proposed SDK API changes: minimal addition now required

Unlike the previous version of this doc, a small API addition is justified —
global modules cannot reach a route-scoped store.

1. **New `WeaverseNextRootProvider`** (`packages/next/src/root-provider.tsx`,
   `'use client'`). Props: `children`, `initialThemeSettings?: Record<string, unknown>`,
   `themeSchema?: unknown`. Creates one
   `createWeaverseNextThemeSettingsStore({ schema: themeSchema, settings: initialThemeSettings })`
   via `useMemo`/`useRef` (same store factory already in
   `theme-settings-store.ts` — no new store implementation) and exposes it
   through a new `WeaverseNextRootContext` (`{ themeSettingsStore }`, mirroring
   the existing `WeaverseNextContext` shape but intentionally narrower — it
   does not carry `client`/`pageData`/`rootData`, which stay route-scoped).
2. **`WeaverseNextProvider` gains ambient-store adoption.** In `provider.tsx`,
   before the existing `useMemo` that calls
   `createWeaverseNextThemeSettingsStore(...)`, read
   `useContext(WeaverseNextRootContext)`. If present, use
   `rootContext.themeSettingsStore` directly instead of constructing a new
   one; if `themeSettings` prop / `client.themeSettings` differ from the root
   store's current snapshot (e.g. the page also has page-specific serialized
   theme data), call `rootStore.updateThemeSettings(...)` once on mount/change
   rather than replacing the store. No prop signature change to
   `WeaverseNextProvider` — this is additive, backward compatible, and a
   no-op for apps that never mount `WeaverseNextRootProvider` (including the
   current POC).
3. **`useThemeSettings()` unchanged.** It already reads whatever store is on
   `WeaverseNextContext`; nothing in `hooks.ts` needs to change. A root
   `Header`/`Footer` that is *not* under `WeaverseNextProvider` (i.e. rendered
   directly in `layout.tsx`, outside any page's provider) needs its own way to
   read the store — either `WeaverseNextRootProvider` also renders
   `WeaverseNextContext.Provider` with a minimal value (`{ themeSettingsStore, themeSettings: store.getSnapshot() }` and everything else `undefined`), so `useThemeSettings()` works unmodified for root-level consumers, or add one new hook, e.g. `useWeaverseRootThemeSettings()`, that reads `WeaverseNextRootContext` directly. Prefer the first option (reuse `WeaverseNextContext`) to avoid a second hook with near-identical behavior.
4. **`runtime.ts`/`renderer.tsx`: no changes.** They already accept an
   externally supplied `themeSettingsStore` via `WeaverseNextRuntimeConfig`
   (`runtime.ts:142-147`) and read it off `WeaverseNextContext`
   (`renderer.tsx:64-70`) — once `WeaverseNextProvider` is handing them the
   root store instead of a fresh one, the existing plumbing carries it through
   to `runtime.internal.themeSettingsStore` and thus to Studio's
   `updateThemeSettings()` calls with zero further changes.

Rejected, still:

- A combined `loadPageWithTheme()` server helper — still app-specific,
  unchanged reasoning from the prior version.
- Renaming existing hooks/components beyond the starter-level
  `WeaverseHome` → `WeaverseNextPage` rename already proposed.

## Cache/freshness semantics (revised)

Source of truth: `NextServerClient.fetchWithCache` (`server-client.ts:189-227`)
and `loadThemeSettings` (`server-client.ts:520-603`), which forces `no-store`
only when `isDesignMode || isRevisionPreview` (from `_baseConfigs`, itself
derived from `requestContext` — see constraint #1/#5 above).

| Load | Where | Mode | Behavior |
| --- | --- | --- | --- |
| Root theme settings | `app/layout.tsx` → `WeaverseNextRootProvider` | Always published-mode fetch (no `searchParams` available at root, so `requestContext.isDesignMode` is never set here) | `next: { revalidate, tags }` per `cache` config, e.g. `revalidate: 60, tags: ['weaverse']`. One fetch per request/revalidation window, shared by every route under the root layout. |
| Route page data | route `page.tsx` → `loadWeaverseNextPage()` | Published | Same `fetchWithCache` revalidate/tags path as before — unchanged from the previous design. |
| Route page data | route `page.tsx` → `loadWeaverseNextPage()` | Design mode / revision preview | Forced `cache: 'no-store'` — unchanged. |
| Theme settings **live updates** | Client, via Studio bridge | Design mode only | Not a fetch at all — `weaverse.internal.themeSettingsStore.updateThemeSettings(next)`, called by Studio's runtime binding (`bindWeaverseNextStudioRuntime`/`studio.init`), mutates the **one** root-owned store in place and notifies subscribers (`useThemeSettings()` consumers re-render, including root `Header`/`Footer`). No network re-fetch of theme settings is needed for this path. |
| Theme settings outside Studio | Any | Published, no Studio session | No live update path exists or is needed — the root store's snapshot is whatever `WeaverseNextRootProvider` was seeded with, refreshed only by Next's normal revalidation on the *next* request/render, not client-side. This matches Leo's priority #2/#3: design mode never drives the base architecture, it only patches the already-mounted root store. |
| Route navigation | Client-side nav between routes | Any | Root layout does not remount, so the root store is **not** recreated per navigation — it is the same instance across the whole session, exactly like `withWeaverse()`'s store. The route-scoped page runtime/provider still gets a fresh page-data fetch and (if no root provider is present) fresh store per the pre-existing per-route identity logic (`runtime.ts:87-89, 176-222`); when a root provider *is* present, the route provider adopts the same root store instead of creating one, so navigation does not reset theme settings either. |

## Studio bridge interaction with `themeSettingsStore.updateThemeSettings`

Unchanged mechanism, now anchored at root instead of per-route:

- Studio calls `updateThemeSettings(next)` on
  `runtime.internal.themeSettingsStore`, which — once the route provider
  adopts the root store — is the same instance `WeaverseNextRootProvider`
  created and the same instance root `Header`/`Footer`/popups read via
  `useThemeSettings()`.
- No new wiring inside `runtime.ts`/`use-weaverse-next-studio.tsx` is needed;
  the store-sharing invariant just needs to hold one level higher than
  before (root, not route).
- Do not construct a second `createWeaverseNextThemeSettingsStore(...)`
  anywhere in app code once a root provider is mounted — that remains the
  one rule that breaks Studio's live updates if violated, same as the
  previous version of this doc, just scoped to "per app session" instead of
  "per route render."

## Migration path from POC PR #1 (revised)

POC PR #1 is **only a proof of the store/update path at route scope** — it
correctly proved that `WeaverseNextProvider` → `WeaverseNextRenderer` →
`runtime.internal.themeSettingsStore` → Studio's `updateThemeSettings()` all
share one instance. It did not attempt (and is not) the final root
architecture. Steps, lowest risk first:

1. Add `WeaverseNextRootProvider` + `WeaverseNextRootContext` to
   `packages/next/src` (additive, no existing export changes).
2. Add ambient-store adoption to `WeaverseNextProvider` (`provider.tsx`) as
   described above — additive, backward compatible; apps that don't mount
   `WeaverseNextRootProvider` see no behavior change.
3. Add `loadWeaverseNextRootTheme()` (or equivalent) to the starter's
   `app/weaverse-next/server.ts` — a `searchParams`-free call to
   `getWeaverseServerClient()`/`loadThemeSettings()`, callable from
   `app/layout.tsx`.
4. Update the starter `app/layout.tsx` to load root theme settings, mount
   `WeaverseNextRootProvider`, and move `Header`/`Footer`/popup components
   (currently plain React in the POC's `SiteHeader`) to read
   `useThemeSettings()`.
5. Rename `WeaverseHome` → `WeaverseNextPage` (carried over from the previous
   version — naming only).
6. Document the new root-provider shape in `packages/next/README.md`
   alongside the existing "Rendering in a Next route" section.
7. No SDK version bump beyond whatever semver step the new
   `WeaverseNextRootProvider` export requires (minor, additive).

## Verification plan for the next implementation slice

Layer on top of the existing `04-verification-plan.md` L0–L2, scoped to this
slice:

1. `npm run lint && npm run typecheck && npm run build` after adding
   `WeaverseNextRootProvider` and the `WeaverseNextProvider` ambient-store
   change.
2. **Root render smoke:** confirm `Header`/`Footer`/popup components rendered
   directly in `app/layout.tsx` call `useThemeSettings()` successfully (no
   "must be used inside a `<WeaverseNextProvider>`" throw) and render the
   root-loaded values on first paint, in both published and design mode.
3. **Navigation-without-remount smoke:** navigate between two routes (e.g.
   `/` → `/products/aurora-jacket`) and confirm `Header`/`Footer` do **not**
   remount (e.g. via a render-count probe or React DevTools) — only the page
   content under `{children}` changes.
4. **Studio edit propagation smoke:** open a route in Studio design mode,
   edit one theme setting field, and confirm both (a) the root `Header`/
   `Footer`/CSS-var bridge and (b) the page-level `WeaverseNextRenderer`
   update from the same edit without a full remount — this is the
   root-vs-route store-unification invariant, so it must be checked on both
   ends, not just the page renderer as in the previous version's plan.
5. L1 direct render smoke on all three route shapes, unchanged from before.
6. Cache inspection: confirm the root theme-settings fetch follows the
   published revalidate/tags path (never `no-store`, since root never sees
   design-mode context) while a design-mode *page* fetch still forces
   `no-store`, per the revised cache table above.

## Explicit non-scope

- Translation/static-text sidecar (tracked separately; `runtime.ts` already
  stubs `extractTranslationSidecar`/`setTranslationSidecar` as no-ops).
- Global sections.
- Markets/i18n beyond the existing `requestContext.i18n` passthrough.
- Redirects / Next request-handler ownership.

## Open questions / blockers

- **Exact shape of the root server theme load without `searchParams`.**
  `app/layout.tsx` has no access to the current route's `searchParams`, so
  `loadWeaverseNextRootTheme()` cannot resolve `isDesignMode` server-side and
  must always fetch as published mode (per constraint #1/#5). Confirm this is
  acceptable for first paint in design mode too — i.e. the root SSR pass
  always renders published-mode theme settings, and Studio's client-side
  `updateThemeSettings()` push corrects it after hydration. Leo's priority
  ordering suggests yes, but this needs explicit sign-off since it means a
  design-mode session briefly shows published values before Studio's script
  finishes handshaking.
- **Whether design-mode initial load needs a client-side refresh.** If a
  brief published-mode flash before Studio's `init()` call is not acceptable,
  the alternative is a client-side effect in `WeaverseNextRootProvider` that
  re-fetches theme settings once `isDesignMode` is detected from
  `window.location.search` (mirroring how `WeaverseNextStudioConnect`
  resolves design mode client-side today) and calls
  `updateThemeSettings()` itself before Studio's own push arrives. Not
  designed in this pass — flag as follow-up if the flash proves visible in
  practice.
- `loadThemeSettings()` still does not force `no-store` for bare
  `isPreviewMode` (section-preview) requests — only
  `isDesignMode`/`isRevisionPreview` do. Unchanged open question from the
  previous version; still not fixed here (source not touched).
- No blockers to starting the `WeaverseNextRootProvider` implementation
  slice; the two items above are product/UX sign-offs, not technical
  blockers.
