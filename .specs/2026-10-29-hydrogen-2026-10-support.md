# Support Hydrogen 2026.10 in @weaverse/hydrogen 6.0

Issue: [#545](https://github.com/Weaverse/weaverse/issues/545) (epic [#543](https://github.com/Weaverse/weaverse/issues/543), survey [#544](https://github.com/Weaverse/weaverse/issues/544), layout [#547](https://github.com/Weaverse/weaverse/issues/547))

## Outcome

Hydrogen themes on `@shopify/hydrogen` 2026.10+ (the framework-agnostic library, wired through React Router middleware) can load Weaverse pages, theme settings and section loader data, and connect to Studio. `@weaverse/hydrogen` 6.0 targets Hydrogen 2026.10+ only; 5.x stays the line for Hydrogen ≤2026.4.

## Scope & contract

- `WeaverseClient` no longer takes a classic `HydrogenContext`. Its arguments are `request`, `storefront` (a 2026.10 Storefront client), `env`, `cache` (a Hydrogen `CacheInstance`), optional `waitUntil`, `components`, `themeSchema`, and the existing `projectId`, `fetchTimeoutMs`, `throwPageLoadFailures`.
- `storefront.i18n` is the 2026.10 normalized i18n (`language`, `country`, `pathPrefix`, plus app fields such as `label`). It feeds the Builder request body, merchant-override locale and `requestInfo.i18n`; `pathPrefix` must keep reaching Studio.
- Builder API caching uses `createFetchWithCache` and `Cache(...)`. Strategies have no `sMaxAge`. Behavior kept: design mode, revision preview and the external public API proxy bypass the cache; errors and invalid Builder envelopes are never cached; the theme-settings request keeps a body-free cache key; non-2xx Builder responses surface as `WeaverseError` with the status.
- Section loaders keep `{data, weaverse}`; `weaverse.storefront` is the 2026.10 client, so loaders call `storefront.graphql(doc, {variables, cache})`. No `query` compatibility shim.
- `RouteLoaderArgs` and the `AppLoadContext` augmentation no longer come from `@shopify/remix-oxygen`. The app context type is React Router's.
- `getSelectedProductOptions(request)` keeps its signature and filtering of Weaverse/Studio params, built on the 2026.10 `getSelectedProductOptions({searchParams})`.
- Env typing no longer augments `HydrogenEnv`; the SDK exports its own `WeaverseEnv` for the variables it reads.
- Packaging: drop `@shopify/remix-oxygen`; `@shopify/hydrogen` becomes a peer dependency `>=2026.10.0`.
- Non-goals here: the #547 entry-point split (`/react`, `/react-router`, `/next`), the codemod, and changes to `@weaverse/next` beyond reuse. They land on this branch before 6.0.0 is released, so themes break once.

## Acceptance

- `@weaverse/hydrogen` imports and runs with `@shopify/hydrogen@2026.10.x`; no import of removed Hydrogen APIs or `@shopify/remix-oxygen`.
- `loadPage`, `loadThemeSettings`, `fetchCustomPages`, `fetchWithCache` behave as before for caching, retries, failure classification and design-mode bypass.
- `requestInfo.i18n` includes `pathPrefix`.
- Typecheck, tests, `api:check` (with intentional report updates) and `package:check` pass against Hydrogen 2026.10.

## Approach

1. Workspace devDependency `@shopify/hydrogen@^2026.10` for `packages/hydrogen`; peer range `>=2026.10.0`; remove `@shopify/remix-oxygen`.
2. `weaverse-client.ts`: replace `createWithCache`/`CacheCustom` with `createFetchWithCache`/`Cache`; parse JSON inside `shouldCacheResponse` via the response context and after the fetch; keep validators, body-free keys and error mapping.
3. `types.ts`: new `WeaverseClientArgs`, `WeaverseStorefront`, `WeaverseEnv`, `WeaverseI18n` on `I18nConfig`; `RouteLoaderArgs` on React Router `LoaderFunctionArgs`; remove `HydrogenEnv`/remix-oxygen augmentations.
4. `index.ts`: wrap the new `getSelectedProductOptions`.
5. Tests: replace `InMemoryCache` with a local in-memory Web Cache stub; update fixtures to the new args.
6. Then the #547 layout, codemod and docs before releasing 6.0.0.

## Migration

Themes move to Hydrogen 2026.10 first (React Router middleware, `client.graphql`), then build `WeaverseClient` from the request-scoped storefront client in middleware. Guide: Weaverse/docs#66.

## Verification

- `pnpm run typecheck`, `pnpm run test`, `pnpm run biome`, `pnpm run api:check`, `pnpm run package:check` before push.
- Pilot canary on Hydrogen 2026.10 (Weaverse/pilot#191) and Studio checks (Weaverse/builder#3178).
