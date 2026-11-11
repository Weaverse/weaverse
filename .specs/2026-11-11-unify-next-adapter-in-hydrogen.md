# Unify the Next.js adapter inside @weaverse/hydrogen

Issue: [#581](https://github.com/Weaverse/weaverse/issues/581) (parent [#543](https://github.com/Weaverse/weaverse/issues/543))

## Outcome

`@weaverse/hydrogen` holds both framework adapters. The Next.js adapter that shipped as `@weaverse/next` now lives in the Hydrogen package behind `@weaverse/hydrogen/next` and `/next/server`, so a fixed-group release no longer bumps and re-pins a separate `@weaverse/next`, and storefronts can no longer end up with two `@weaverse/react` copies through a stale `@weaverse/next` pin. Code that is identical in both adapters exists once.

## Scope & contract

- The Next.js adapter source and tests move into `packages/hydrogen` (`src/next/**`, `__tests__/next/**`). `@weaverse/hydrogen` no longer depends on `@weaverse/next`.
- `next` becomes an optional peer of `@weaverse/hydrogen` (`>=14`, as `@weaverse/next` declared), so React Router themes do not install Next.js.
- `@weaverse/next` stops being published: the package folder moves to `archived/next` and leaves the workspace, publish list and API reports. Already-published versions keep working. It is deprecated on npm at the next fixed-group release (`npm deprecate @weaverse/next "Use @weaverse/hydrogen/next instead"`); the release skill carries that one-time step.
- Public entries lose nothing: every runtime and type export of `/next` and `/next/server` stays, including `useStudioSelection` on `/next`. Types the entries already referenced through `@weaverse/next` (for example `WeaverseNextClient`, `WeaverseNextServerClientConfig`) are exported by name, which is additive.
- RSC safety is unchanged: `/next` and `/next/server` (built files and every local chunk they load) never load React client code. Client code is reached only through the adapter's client boundary, built as its own `next-client-boundary.{mjs,js}` file that keeps a `'use client'` banner.
- Deduplicated, behavior unchanged: the translation store (`TranslationStore`, `ThemeTextStore`) and the pure translate helpers (`createTranslate`, `interpolate`, `getNestedKey`, `TranslateFunction`) exist once in `src/utils` and are used by both adapters.
- Non-goals: new framework bindings, changes to `/internal`, import changes in themes, and merging the adapter-specific translation contexts or `useThemeSettings` (see Follow-ups).

## Acceptance

- `pnpm run biome`, `typecheck`, `test` and `package:check` pass; `api:check` shows no removals from public entries.
- Forward builds and type-checks unchanged against the packed `@weaverse/hydrogen`; Pilot type-checks unchanged.
- The release skill has no `@weaverse/next` bump or publish step.

## Approach

- `packages/hydrogen/vite.config.ts` replaces the CLI build flags: one `vp pack` config for the six entries, with a plugin that keeps `./client-boundary` external as `./next-client-boundary.{mjs,js}`, and a second config that builds `src/next/client-boundary.ts` alone under a `'use client'` banner (same layout `@weaverse/next` used). JSDoc comments are dropped from the output so a comment naming a client package cannot trip the guard.
- `src/next.ts` and `src/next-server.ts` keep their curated export lists, now from `./next/index` and `./next/server`.
- `scripts/check-packed-packages.mjs`: `assertHydrogenNextServerSafe` requires both boundary files with `'use client'` first, and walks `next*.{mjs,js}` and their local chunks, stopping at the boundary; any other file on that walk must be free of `createContext`, `react`, `react/jsx-runtime`, `next/navigation` and `@weaverse/react`. The packed consumer takes `next` from Hydrogen's dev dependency.
- Vitest maps `next/navigation` to a local shim; the Hydrogen `tsconfig` type-checks the moved Next tests.

## Follow-ups

- `TranslationProvider`/`useTranslation` still exist per adapter: separate React contexts, and the Next one lives behind the client boundary with its own error message.
- `useThemeSettings` differs by design (React Router reads the Weaverse root, Next.js reads the provider's store).
- Studio script resolution (`resolveStudioScriptSrc` vs `resolveWeaverseNextStudioScriptSrc`) and `generateDataFromSchema` have per-adapter copies with small behavior differences.
- `WeaverseComponent`/`WeaverseComponentLoaderArgs` stay on `/react-router`.

## Verification

- SDK gates above, plus Forward (`bun run typecheck`, `bun run build`) and Pilot (`npm run typecheck`) installed from the `pnpm pack` tarball of `@weaverse/hydrogen`.
