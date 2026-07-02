# Claude goal: implement `@weaverse/next` v0 package shell

## Context

Repo: `/Users/hta218/Documents/work/workspace/weaverse`
Branch: `feat/next-adapter-shell`
Issue: Weaverse/builder#2533
Spec folder: `.specs/2026-06-19--nextjs-adapter-contract/`

Read these first:

1. `AGENTS.md`
2. `packages/react/AGENTS.md`
3. `.specs/2026-06-19--nextjs-adapter-contract/README.md`
4. `.specs/2026-06-19--nextjs-adapter-contract/pilot-usage-audit.md`
5. Current APIs in:
   - `packages/react/src/index.ts`
   - `packages/react/src/renderer.tsx`
   - `packages/react/src/hooks.ts`
   - `packages/hydrogen/src/index.ts`
   - `packages/hydrogen/src/types.ts`
   - `packages/hydrogen/src/weaverse-client.ts`
   - `packages/hydrogen/src/WeaverseHydrogenRoot.tsx`

## Goal

Implement the first small, test-backed `@weaverse/next` package slice. This is not full Shopify/Hydrogen parity. It should create a buildable package shell and prove the core adapter contract needed by Pilot:

- explicit Next/native root + page data context
- component registry + renderer bridge
- component loader execution with explicit `commerce.storefront`
- runtime hook re-exports for migration ergonomics
- no dependency on `react-router` or `@shopify/remix-oxygen`

## Hard constraints

- Do not commit or push. Hermes will verify and commit if accepted.
- Keep changes scoped to `packages/next` and required workspace/package metadata only.
- Do not modify `packages/hydrogen` behavior unless absolutely unavoidable. Prefer reusing `@weaverse/react` / `@weaverse/schema` exports.
- Do not implement production Next route handlers, Vercel deployment, cart/customer-account integration, sitemap, or CSP parity in this slice.
- Do not read or print `.env` files.
- Do not emulate React Router APIs (`useLoaderData`, `useRouteLoaderData`, route matches). Provide explicit Next-native data hooks instead.
- Tests first where possible: add failing tests for the public behavior before implementation, then make them pass.
- Keep types pragmatic. Avoid `any`; use `unknown`, interfaces, and narrow test fixtures.

## Expected files

Likely create:

```text
packages/next/
  package.json
  AGENTS.md
  src/
    index.ts
    types.ts
    client.ts
    provider.tsx
    renderer.tsx
    hooks.ts
    loader.ts
  __tests__/
    next-adapter.test.tsx
```

Adjust if repo conventions require a different test location.

## Required public API

Export at least:

```ts
export {
  createWeaverseNextClient,
  WeaverseNextProvider,
  WeaverseNextRenderer,
  runWeaverseComponentLoaders,
  useWeaverseRootData,
  useWeaversePageData,
  useWeaverseCommerce,
  useThemeSettings,
  useParentInstance,
  useItemInstance,
  useChildInstances,
  useWeaverse,
  createSchema,
}

export type {
  WeaverseNextClient,
  WeaverseNextClientConfig,
  WeaverseNextComponent,
  WeaverseNextComponentProps,
  WeaverseNextComponentLoaderArgs,
  WeaverseNextLoaderData,
  WeaverseNextRequestContext,
  WeaverseNextCommerceContext,
  WeaverseProduct,
  WeaverseCollection,
}
```

Naming can vary slightly if the implementation needs it, but keep the intent clear and update tests/spec work-log.

## Implementation requirements

### 1. Package shell

Create `packages/next/package.json` consistent with existing packages:

- name: `@weaverse/next`
- version aligned with SDK packages (`5.16.3` currently)
- tsup build from `src/index.ts`
- scripts: `dev`, `build`, `clean`, `test`, `typecheck`
- dependencies should include `@weaverse/react`, `@weaverse/schema`, `react`, `react-dom`
- peer/optional Next dependency only if strictly needed; v0 should not require importing from `next/*`
- must not depend on `react-router` or `@shopify/remix-oxygen`

### 2. Provider + hooks

Implement a provider that accepts explicit data instead of route loader emulation:

```tsx
<WeaverseNextProvider
  client={client}
  rootData={rootData}
  pageData={pageData}
  commerce={commerce}
>
  {children}
</WeaverseNextProvider>
```

Provide hooks:

```ts
useWeaverseRootData<T>()
useWeaversePageData<T>()
useWeaverseCommerce<T>()
```

These should throw clear errors when used outside the provider.

### 3. Client

Implement a minimal `createWeaverseNextClient(config)` that returns an object with:

- `projectId`
- `components`
- `themeSchema`
- `requestContext`
- `commerce`
- `storefront` compatibility alias for `commerce.storefront`
- current loaded `data` / `dataContext` enough for `@weaverse/react` renderer compatibility
- `loadPage(input)` and `loadThemeSettings()` wrappers when fetchers are provided in config

Do not guess the real Weaverse API endpoint if it is not already reusable. For this slice, it is acceptable for `loadPage` / `loadThemeSettings` to delegate to injected fetchers from config. The goal is contract shape and renderer/provider tests, not production network I/O.

### 4. Renderer

Implement `WeaverseNextRenderer` that can render a serialized Weaverse page tree through `@weaverse/react` primitives.

Preferred approach: reuse `@weaverse/react` `WeaverseRoot` if the client shape can satisfy it. If that is too coupled to `@weaverse/core`, add a minimal bridge/client shape rather than duplicating large renderer logic.

The renderer should accept either:

```tsx
<WeaverseNextRenderer />
```

using provider context, or:

```tsx
<WeaverseNextRenderer client={client} data={pageData} />
```

if that is simpler. Keep provider usage tested.

### 5. Component loaders

Implement `runWeaverseComponentLoaders` (or equivalent) that walks a serialized page tree and runs component `loader` functions with:

```ts
{
  data: itemData,
  weaverse: client,
  context: requestContext,
  commerce,
}
```

Compatibility requirement:

- `client.storefront` should alias `commerce.storefront` so Pilot-like loaders that call `weaverse.storefront.query(...)` can work.
- Loader return values should be attached to the item data as `loaderData` in the shape consumed by renderer/components.
- Walk children recursively.

### 6. Re-exports

Re-export:

- `createSchema` and relevant schema/types from `@weaverse/schema`
- runtime hooks from `@weaverse/react`: `useWeaverse`, `useItemInstance`, `useParentInstance`, `useChildInstances`
- `isBrowser` / `isIframe` only if already available via `@weaverse/react` or a tiny local utility is needed by Pilot migration

For `useThemeSettings`, inspect whether it is Hydrogen-specific. If it is not cleanly shared, provide a Next version backed by provider root/theme data.

## Required tests

Add tests proving:

1. Provider hooks return explicit `rootData`, `pageData`, and `commerce`.
2. Hooks throw clear errors outside provider.
3. Component loader receives `commerce.storefront`, `weaverse.storefront` alias, and item `data`, then attaches `loaderData`.
4. Renderer can render a tiny fixture tree with a registered component and child text/props.
5. The package source does not import `react-router` or `@shopify/remix-oxygen`.

Keep tests small and fast. Mock all external IO.

## Verification commands to run

Run the narrowest useful commands first:

```sh
pnpm --filter @weaverse/next test
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm run biome -- packages/next
```

If those pass, also try:

```sh
pnpm run typecheck -- --filter=@weaverse/next
pnpm run build -- --filter=@weaverse/next
```

If a command is invalid because of repo tooling, run the equivalent and document the exact command/output.

## Acceptance criteria

- `@weaverse/next` exists as a workspace package and builds.
- Tests pass for provider hooks, component loader execution, and renderer fixture.
- No source dependency/import on `react-router` or `@shopify/remix-oxygen` in `packages/next`.
- The API matches the Pilot usage audit direction: explicit root/page data hooks, explicit commerce context, component loaders v0 must-have.
- Update `.specs/2026-06-19--nextjs-adapter-contract/work-logs.md` with what changed, commands run, and any limitations.

## Report back

When done, report:

- files changed
- public API added
- test/build commands and results
- unresolved tradeoffs or limitations
- anything Hermes should independently verify
