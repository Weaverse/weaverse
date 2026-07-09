# Claude handoff: implement Next root theme provider

Repo: `/Users/hta218/Documents/work/workspace/weaverse`
Branch: `feat/next-root-theme-provider`

## Goal

Implement the SDK slice from `.specs/2026-06-21--next-studio-bridge/next-theme-provider-design.md`:

- add a root-owned theme settings provider for `@weaverse/next`
- make route-scoped `WeaverseNextProvider` adopt that ambient root store instead of creating a second store
- keep behavior backward-compatible when no root provider is mounted

This is SDK package work only. Do not modify the POC repo in this run.

## Context / product reasoning

Published mode is the priority. In Hydrogen/Pilot, global modules render once in root under `withWeaverse(RootLayout)` and read `useThemeSettings()` from a root-owned theme store:

- Pilot `app/root.tsx`: `Layout = withWeaverse(RootLayout)`; root renders `GlobalStyle`, `Header`, `Footer`, `NewsletterPopup` once.
- Pilot `app/.server/root.ts`: root loader returns `weaverseTheme: context.weaverse.loadThemeSettings()`.
- Hydrogen `withWeaverse()` creates the theme store at root and `useStudio(weaverse)` attaches that same store to `weaverse.internal.themeSettingsStore`; Studio edits call `updateThemeSettings()` on that store.

Next must match this shape:

```tsx
app/layout.tsx
  <WeaverseNextRootProvider initialThemeSettings={theme.theme} themeSchema={theme.schema}>
    <WeaverseNextStudioConnect />
    <Header />
    {children}
    <Footer />
  </WeaverseNextRootProvider>

route/page wrapper
  <WeaverseNextProvider client={client} pageData={...}>
    <WeaverseNextRenderer />
  </WeaverseNextProvider>
```

The page runtime/renderer remains route-scoped, but the theme settings store must be root-owned and shared with route runtimes.

## Current relevant files

- `packages/next/src/provider.tsx`
- `packages/next/src/hooks.ts`
- `packages/next/src/theme-settings-store.ts`
- `packages/next/src/renderer.tsx`
- `packages/next/src/runtime.ts`
- `packages/next/src/index.ts`
- `packages/next/src/types.ts`
- `packages/next/__tests__/next-adapter.test.tsx`

## Required behavior

1. New public client component export:
   - likely `WeaverseNextRootProvider`
   - props: `children`, `initialThemeSettings?: Record<string, unknown>`, `themeSchema?: unknown`, optionally `publicEnv?: Record<string, string | undefined>` if the existing store supports it.

2. Root provider must create exactly one `WeaverseNextThemeSettingsStore` for its mounted lifetime.
   - Use `useRef`, not `useMemo`, so a parent re-render does not replace the store instance.
   - If `initialThemeSettings` changes after mount, update the existing store via `updateThemeSettings()`; do not replace it.

3. `useThemeSettings()` must work for root-level consumers under `WeaverseNextRootProvider` even if there is no route-level `WeaverseNextProvider` above them.
   - Prefer making root provider also provide `WeaverseNextContext` with a minimal value so existing `useThemeSettings()` keeps working.
   - Keep root/page/commerce hooks outside route provider behavior sensible: `useThemeSettings()` should work at root, but `useWeaverseRootData`/`useWeaversePageData`/`useWeaverseCommerce` can still return undefined values if only root provider is present, unless you think preserving throw is better. Tests should define the contract clearly.

4. `WeaverseNextProvider` must adopt the ambient root store if present.
   - If root provider exists, do not create a second theme store.
   - If `themeSettings` prop / `client.themeSettings` is provided in route provider, merge it into the root store (update existing store), not replace the store.
   - If no root provider exists, fallback to current behavior unchanged.

5. `WeaverseNextRenderer`/`runtime.ts` should not need changes unless tests prove otherwise.
   - It already passes `context.themeSettingsStore` to runtime.
   - Studio updates should reach the same root store once adoption works.

6. Export new API from `packages/next/src/index.ts` and types as needed.

7. Update `packages/next/README.md` minimally with a short root provider example. Do not over-document.

8. Update `.specs/2026-06-21--next-studio-bridge/work-logs.md` with a short entry and verification placeholders.

## TDD requirements

Add focused tests in `packages/next/__tests__/next-adapter.test.tsx` or a new nearby test file.

Minimum tests:

1. Root-level consumer:
   - render `<WeaverseNextRootProvider initialThemeSettings={{ topbarText: 'Root free shipping' }}> <Probe useThemeSettings /> </WeaverseNextRootProvider>`
   - expect output contains `Root free shipping`.

2. Route provider adopts root store:
   - create root provider with `topbarText: 'Root'`
   - inside it render `WeaverseNextProvider client={client with themeSettings: { topbarText: 'Route' }}` and a `Probe` using `useThemeSettings()`
   - expected: after render snapshot should reflect merged/route value if route supplies override. If SSR/static render cannot observe effect timing, design around initial merge synchronously or adjust expected behavior. Prefer synchronous initial merge to avoid flash.

3. Renderer/runtime uses root store:
   - render root provider + route provider + `WeaverseNextRenderer` with a simple page.
   - obtain/runtime check if practical, or use a component that reads `useThemeSettings()` inside the rendered tree.
   - assert the runtime internal store is the same store when possible.

4. Backward compatibility:
   - existing `WeaverseNextProvider client={client with themeSettings}` without root provider still exposes theme settings as before.

Run targeted test after writing RED before implementation if practical; then implement.

## Commands

After implementation, run:

```bash
pnpm --filter @weaverse/next test -- __tests__/next-adapter.test.tsx
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm --filter @weaverse/next lint
```

If package scripts differ, inspect `packages/next/package.json` and run the closest available commands.

## Guardrails

- Do not commit or push.
- Do not touch npm version/publish files.
- Do not modify Builder repo or POC repo.
- Do not add broad API surface beyond the root provider + ambient adoption.
- Keep implementation simple and additive.

## Report back

Print:
- changed files
- tests/commands run and result
- any unresolved issue
