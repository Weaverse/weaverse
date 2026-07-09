# Next theme provider final design

Design/spec only — no SDK source touched. Builds on the route-scoped proof merged
in `weaverse-hydrogen-next-poc` PR #1 (`app/weaverse-next/server.ts`,
`wrapper.tsx`, `theme-settings-css-variables.tsx`).

## Recommendation: hybrid — keep the split the POC already landed on

There is no single root-vs-route answer because the two concerns in Hydrogen's
`withWeaverse()` have different data dependencies:

| Concern | Scope | Why |
| --- | --- | --- |
| Studio script connect (`WeaverseNextStudioConnect`) | **Root** (`app/layout.tsx`) | No page data dependency — resolves design/preview mode from `window.location.search` client-side (see `studio-connect.tsx:41-61`), so it can run before any route/page tree exists. Already mounted this way, and correctly covers `not-found.tsx`/`error.tsx`. |
| Theme settings fetch + `WeaverseNextProvider` + `WeaverseNextRenderer` | **Route/page** | Needs the page's `searchParams` (design-mode flags, `weaverseProjectId`, etc.) and a serializable server payload (`theme.theme` / `theme.schema`) to construct a client-side `WeaverseNextClient`. Root layouts cannot supply either. |

This is not a compromise waiting to be resolved into one pattern — it is the
correct shape given Next App Router's constraints below. The POC already
implements it. The remaining work is formalizing it as the documented starter
convention and doing minor naming cleanup, not restructuring.

## Constraints from Next App Router

1. **Root `layout.tsx` does not receive page `searchParams`.** Only a page
   (leaf segment) gets `searchParams`. Studio design/preview/revision flags
   arrive as query params on the current route, so any component that needs
   `isDesignMode`/`isPreviewMode`/`isRevisionPreview` server-side must be
   constructed at the page, not the layout.
2. **Root layouts persist across client-side navigation.** They do not
   remount when navigating between sibling routes. A provider mounted there
   would need an external mechanism to receive new theme data per navigation
   (e.g. a module-level store updated imperatively) — additional
   complexity with no upside, since each page already re-renders its own
   client wrapper on navigation.
3. **Server → Client serialization is strict.** `WeaverseNextClient`
   (`client.ts`) holds functions and component references and cannot cross
   the Server→Client boundary. Only the plain data (`theme.theme`,
   `theme.schema`, `page`) can be passed down; `createWeaverseNextClient(...)`
   must run inside a `'use client'` component, per the existing
   `provider.tsx` doc comment.
4. **Design/preview query params are route-scoped by nature** — a Studio
   preview URL targets one page, so the per-route fetch is the natural unit
   of freshness, not an app-wide one.

## Why the store is already unified (no new API needed)

`WeaverseNextProvider` creates the theme settings store
(`createWeaverseNextThemeSettingsStore`, `provider.tsx:70-77`) and exposes it
on context. `WeaverseNextRenderer` reads `context.themeSettingsStore` and
passes the **same instance** into `createWeaverseNextRuntime(...)`
(`renderer.tsx:64-70`), which stores it on `runtime.internal.themeSettingsStore`
(`runtime.ts:142-147`) instead of creating a second one. So:

- `useThemeSettings()` (hooks.ts) and Studio's runtime-facing
  `updateThemeSettings(next)` calls read/write the same store.
- No new store/plumbing is needed to make Studio field edits reach
  `useThemeSettings()` consumers (e.g. `ThemeSettingsCssVariables`) — this
  already works as long as `WeaverseNextRenderer` is rendered inside the
  matching `WeaverseNextProvider`.

This is the load-bearing invariant to preserve in any future refactor: **the
provider must own store creation, and the renderer must be the only other
place that touches it** (by reading it off context, not creating its own).

## Proposed starter convention files

No change to `packages/next/src/*` public API. Formalize `app/weaverse-next/*`
as the expected starter shape (rename for clarity, not new files):

```text
app/
  layout.tsx                          # mounts <StudioConnect /> once, root-scoped
  weaverse-next/
    studio-connect.tsx                 # thin wrapper around WeaverseNextStudioConnect (root-scoped)
    server.ts                          # getWeaverseServerClient() + loadWeaverseNextPage() (route-scoped)
    wrapper.tsx                        # WeaverseNextPage: builds client, mounts Provider+Renderer (route-scoped)
    theme-settings-css-variables.tsx   # optional CSS var bridge, reads useThemeSettings()
  page.tsx                             # calls loadWeaverseNextPage({ type: 'INDEX' })
  products/[handle]/page.tsx           # calls loadWeaverseNextPage({ type: 'PRODUCT', handle })
  collections/[handle]/page.tsx        # calls loadWeaverseNextPage({ type: 'COLLECTION', handle })
```

Naming cleanup vs. the current POC (app-level rename only, no SDK impact):

- `loadWeaverseHomePage` → keep as a thin `{ type: 'INDEX' }` convenience over
  the existing generic `loadWeaversePage`;
  it already exists this way, just don't let the generic wrapper component
  inherit the "Home" name.
- `WeaverseHome` (the client wrapper component, currently reused for every
  route type) → rename to `WeaverseNextPage` in the starter. It is already
  generic (`data`, `dataContext`); only the name is misleading.

Every route keeps doing its own `Promise.all([loadPage(), loadThemeSettings()])`
via one shared server client instance, exactly as `loadWeaversePage()` does
today — this is intentionally not collapsed into a single SDK-level combined
loader (see below).

## Proposed SDK API changes: none required

Considered and rejected, to avoid unjustified surface growth:

- **A combined `loadPageWithTheme()` server helper in `@weaverse/next/server`.**
  Rejected — the `Promise.all` combination is two lines, app-specific
  (commerce fetches often need to interleave), and the app already owns
  `getWeaverseServerClient()` per the README's explicit rationale ("Next does
  not inject a custom context object into every route loader"). Adding this
  would duplicate logic apps already write correctly.
- **A root-level `WeaverseNextRootProvider` seeded from a server layout.**
  Rejected — blocked by constraint #1 (no `searchParams` in layouts) and
  constraint #2 (no natural remount signal for new route data). Would need a
  parallel data channel (e.g. a client-side singleton store the page pushes
  into) that duplicates what `runtime.ts`'s `__weaverses` page-identity
  registry already does correctly for same-page updates.
- **Renaming `WeaverseNextProvider`/hooks.** No behavior change needed; only
  starter-level file/component renames (`WeaverseHome` → `WeaverseNextPage`).

## Cache/freshness semantics

Source of truth: `NextServerClient.fetchWithCache` (`server-client.ts:189-227`)
and `loadThemeSettings` (`server-client.ts:520-603`).

| Mode | `page` fetch | `theme settings` fetch |
| --- | --- | --- |
| **Published** | `next: { revalidate, tags }` from `cache` config (POC: `revalidate: 60, tags: ['weaverse', ...]`) | Same `fetchWithCache` path, same cache config unless the route passes explicit `revalidate`/`tags` to `loadThemeSettings(options)` |
| **Design mode** (`isDesignMode`) | Forced `cache: 'no-store'` | Forced `cache: 'no-store'` |
| **Revision preview** (`isRevisionPreview`) | Forced `cache: 'no-store'` | Forced `cache: 'no-store'` |
| **Section preview** (`isPreviewMode` only, e.g. Studio's "add new section" preview) | Synthesized locally in `_generatePreviewData` — no network call | **Not forced no-store** — `fetchWithCache` only checks `isDesignMode \|\| isRevisionPreview`, so a bare `isPreviewMode` theme-settings call can still hit Next's fetch cache. Flagged as an open question below, not fixed here (source not touched). |
| **Route navigation** (same page identity, e.g. Studio design-mode param change) | Full-route change → new page component render → fresh fetch, new client, new provider/store, matching a fresh `runtime` identity via `pageId:pathname:search` (`runtime.ts:87-89, 176-222`) | Same-route param change while in design mode → still no-store, still refetched, but `createWeaverseNextRuntime` **reuses** the existing runtime for the same identity and calls `refreshStudio` instead of `init` — so the CSS var bridge/`useThemeSettings()` update in place rather than remounting |

## Studio bridge interaction with `themeSettingsStore.updateThemeSettings`

No new wiring needed — see "Why the store is already unified" above. To keep
this correct going forward:

- Always render `WeaverseNextRenderer` as a child of the `WeaverseNextProvider`
  built from the *same* client (this is already how `WeaverseNextPage`/
  `WeaverseHome` is structured).
- Do not construct a second `createWeaverseNextThemeSettingsStore(...)`
  anywhere in app code — the provider's is the only instance that should
  exist per page render; anything else breaks Studio's `updateThemeSettings`
  reaching `useThemeSettings()` consumers.

## Migration path from POC PR #1

No breaking change. Steps, in order of risk (lowest first):

1. Rename `WeaverseHome` → `WeaverseNextPage` in `wrapper.tsx` (and update the
   three call sites: `page.tsx`, `products/[handle]/page.tsx`,
   `collections/[handle]/page.tsx`). Naming only, no behavior change.
2. Document this file layout as the canonical starter shape in
   `packages/next/README.md`'s "Rendering in a Next route" / "Studio setup"
   sections (currently describes an equivalent but not identically-named
   shape).
3. No SDK version bump required — nothing in `packages/next/src` changes as
   part of this design.

## Verification plan for the next implementation slice

Layer on top of the existing `04-verification-plan.md` L0–L2 (unit + direct
render + design-mode bridge smoke), scoped to this slice:

1. `npm run lint && npm run typecheck && npm run build` in the POC after the
   rename.
2. L1 direct render smoke on all three route shapes (`/`,
   `/products/[handle]`, `/collections/[handle]`) — confirm no regression
   from the rename.
3. L2 design-mode smoke: open a route with Studio design-mode query params,
   edit one theme setting field in Studio, confirm the CSS var
   (`--weaverse-theme-*`) updates without a full remount — this specifically
   verifies the provider/runtime store-sharing invariant above still holds.
4. Navigate between two different routes (e.g. `/` → `/products/aurora-jacket`)
   in design mode and back; confirm each route gets its own fresh theme
   settings fetch (no stale CSS vars carried over from the previous route).
5. Open network/cache inspection on a published-mode route vs. a design-mode
   route to confirm the revalidate/no-store split in the table above holds
   in practice, not just in source.
6. Follow up on the open `isPreviewMode`-only cache question above with a
   targeted repro (section-preview URL without design-mode flag) before
   deciding whether it needs a fix — out of scope for this design slice.

## Explicit non-scope

- Translation/static-text sidecar (tracked separately; `runtime.ts` already
  stubs `extractTranslationSidecar`/`setTranslationSidecar` as no-ops).
- Global sections.
- Markets/i18n beyond the existing `requestContext.i18n` passthrough.
- Redirects / Next request-handler ownership.

## Open questions / blockers

- `loadThemeSettings()` does not force `no-store` for bare `isPreviewMode`
  (section-preview) requests — only `isDesignMode`/`isRevisionPreview` do.
  Confirm whether Studio's section-preview flow ever relies on immediately
  fresh theme settings; if so this needs a source fix in a follow-up slice
  (not this design-only pass).
- No blockers to starting the rename/documentation slice.
