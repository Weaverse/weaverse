# @weaverse/next client boundary

Issue: [#542](https://github.com/Weaverse/weaverse/issues/542)

## Outcome

A Next.js App Router app can import `@weaverse/next` from Server Components. Rendering `WeaverseNextRootProvider` or `WeaverseNextStudioConnect` in `app/layout.tsx`, and calling `createSchema` or `generateDataFromSchema` in server code, both work. In `1.0.0` either one failed `next build` with `createContext is not a function`, because the published bundle lost every `'use client'` directive and evaluated React contexts at module scope.

## Scope & contract

- The root entry's public runtime exports are unchanged (`api-reports/runtime-exports.api.md`).
- Client code is everything that renders, calls hooks, or reaches `@weaverse/react` (which creates contexts at module scope): the `@weaverse/react` re-exports, `createWeaverseNextClient`, hooks, providers, renderer, runtime, Studio bridge/connect, translation context, `useWeaverseNextStudioInternals`. It lives in `src/client-boundary.ts`.
- Server-safe exports stay in `dist/index.*`: the `@weaverse/schema` surface, `generateDataFromSchema`, `runWeaverseComponentLoaders`, request info, revalidation helpers, SEO helpers, Studio router/script helpers, theme settings store, translation stores, and all types.
- From a Server Component, client exports resolve to client references: they can be rendered or passed down, not called.
- `@weaverse/next/server` is unchanged.
- Non-goals: a separate `@weaverse/next/client` entry; changing which modules are client code.

## Acceptance

- `next build` passes for: SDK components rendered in a Server Component layout; a Server Component importing `createSchema`/`generateDataFromSchema` from `@weaverse/next`; app-owned `'use client'` wrappers (still valid); `@weaverse/next/server` in server code. Turbopack and webpack.
- `dist/client-boundary.{mjs,js}` start with `'use client'`; no other `dist` script references `createContext`, `react`, `react/jsx-runtime`, `next/navigation` or `@weaverse/react`.
- Runtime export report and type entrypoints unchanged.

## Approach

- `src/index.ts` re-exports the client set by name from `./client-boundary`; type exports keep their source modules.
- `tsup.config.ts` builds two configs: `index` + `server` with an esbuild plugin that marks `./client-boundary` external (rewritten to `./client-boundary.mjs` or `.js` from the per-format output extension, since tsup emits CJS through an ESM pass), and `client-boundary` alone with a `'use client'` banner and Rollup tree-shaking off (it strips directives).
- `build` cleans `dist` once up front, since the two configs write to the same directory.

## Verification

- `pnpm run biome`, `typecheck`, `test`, `package:check` (now including `assertNextClientBoundary`, which fails on the `1.0.0` tarball).
- A Next 16.3 fixture app on the packed tarball: the four cases above with Turbopack and webpack; the page renders server-computed schema data and a client hook reading root theme settings.
- Consumers: Weaverse/forward#100 (Forward on 1.0.1, imports from `@weaverse/next` only) and Weaverse/docs#82 (Next.js docs).
