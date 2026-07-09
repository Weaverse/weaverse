# Claude handoff: Next theme provider final design

Repo: `/Users/hta218/Documents/work/workspace/weaverse`
Branch: `docs/next-theme-provider-design`

Related POC repo: `/Users/hta218/Documents/work/workspace/weaverse-hydrogen-next-poc` (main now includes merged PR #1, route-scoped theme-settings proof)

## Goal

Produce a concise design note for the final `@weaverse/next` theme settings/root-provider direction after the POC route-scoped proof.

This is design/spec only. Do not implement SDK code yet.

## Background

Hydrogen `withWeaverse()` handles:
- root Studio connect
- theme settings provider/store
- translation/static content provider
- root/global data access

Current `@weaverse/next` has lower-level pieces:
- `WeaverseNextStudioConnect`
- `WeaverseNextProvider`
- `useThemeSettings()`
- `createWeaverseNextThemeSettingsStore()`
- server `loadThemeSettings()`

POC PR #1 proved a route-scoped pattern:
- each route's server component calls one helper that loads page data + theme settings from one server client
- published mode relies on SDK/Next fetch cache/revalidate
- design mode stays fresh/no-store
- provider receives `theme.theme` / `theme.schema`
- CSS vars update through the same store path Studio bridge uses

Open product/architecture question:
- Should final Next starter/SDK keep route-scoped theme settings, push them into a shared root provider/layout, or use a hybrid pattern?
- Need account for Next App Router constraints: root layout doesn't receive page `searchParams`, root layouts persist across client navigation, design/preview URL params are route/page scoped, and Server→Client serialization boundaries are strict.

## Tasks

1. Inspect current SDK Next source:
   - `packages/next/src/provider.tsx`
   - `packages/next/src/hooks.ts`
   - `packages/next/src/theme-settings-store.ts`
   - `packages/next/src/studio-connect.tsx`
   - `packages/next/src/runtime.ts`
   - `packages/next/src/server/server-client.ts`
   - `packages/next/README.md`

2. Inspect POC merged shape:
   - `/Users/hta218/Documents/work/workspace/weaverse-hydrogen-next-poc/app/layout.tsx`
   - `/Users/hta218/Documents/work/workspace/weaverse-hydrogen-next-poc/app/weaverse-next/server.ts`
   - `/Users/hta218/Documents/work/workspace/weaverse-hydrogen-next-poc/app/weaverse-next/wrapper.tsx`
   - `/Users/hta218/Documents/work/workspace/weaverse-hydrogen-next-poc/app/weaverse-next/theme-settings-css-variables.tsx`
   - `/Users/hta218/Documents/work/workspace/weaverse-hydrogen-next-poc/README.md`

3. Read relevant Next 16 local docs if needed in the POC repo under `node_modules/next/dist/docs/`, especially App Router layout/searchParams/caching behavior. Do not web search unless necessary.

4. Write design output to:
   `.specs/2026-06-21--next-studio-bridge/next-theme-provider-design.md`

## Design output requirements

Keep it practical and concise. Include:

- Short recommendation: route-scoped, root-scoped, or hybrid — and why.
- Constraints from Next App Router.
- Proposed starter convention files (`app/weaverse-next/*`) and which concern lives where.
- Proposed SDK API changes if any, but avoid adding API surface unless clearly justified.
- Cache/freshness semantics:
  - published mode
  - design mode
  - preview/revision mode
  - route navigation
- Studio bridge interaction with `themeSettingsStore.updateThemeSettings`.
- Migration path from current POC PR #1.
- Verification plan for next implementation slice.
- Explicit non-scope: translation/static-text sidecar, global sections, markets/i18n, redirects.

## Guardrails

- Do not edit package source code.
- Do not commit or push.
- Do not modify env files or print secrets.
- Keep the design grounded in actual source; do not invent Next APIs.

## Report back

Print:
- file written
- recommended pattern
- any blockers/open questions
