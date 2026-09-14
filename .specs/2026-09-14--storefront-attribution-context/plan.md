# Plan: Storefront Attribution Context for Theme Settings

## Design

1. `WeaverseClient.safeStorefrontOrigin()` (private) returns
   `${protocol}//${host}` of the incoming request, or `undefined` when the
   protocol is not http(s). `host` keeps an explicit port; `URL` parsing keeps
   userinfo out of it, and path/query/fragment are never read.
2. `loadThemeSettings` adds `storefrontUrl: this.safeStorefrontOrigin()` to the
   `project_configs` request body. `JSON.stringify` drops it when undefined, so
   the wire shape is unchanged for non-http(s) contexts.
3. `WeaverseFetchWithCacheOptions.cacheIdentityBody` lets a caller supply the
   body used for the subrequest cache key. `fetchWithCache` hashes
   `cacheIdentityBody ?? body`, so theme settings keep a host-free cache
   identity (`{ isDesignMode, projectId }`) while the request itself carries the
   origin. Without it, `weaverseApiBase === weaverseHost` (staging or
   self-hosted `WEAVERSE_HOST`) routes through `withCache` and every domain of
   one project would get its own theme-settings entry.

Not changed: page requests (already carry `url`), `fetchCustomPages`,
merchant overrides, design/revision bypass, cache strategies, and every public
type consumers depend on. No new dependency, no configuration, no credential.

## Verification

`packages/hydrogen/__tests__/weaverse-client.test.ts` →
`loadThemeSettings storefront context`:

- `should_send_only_the_safe_origin_when_a_storefront_requests_theme_settings` —
  a deep URL with a query and fragment yields exactly
  `{ projectId, storefrontUrl: 'https://shop.example:8443' }`.
- `should_keep_the_origin_identical_when_routes_differ` — home and a
  locale-prefixed product route produce the same origin.
- `should_share_one_cache_identity_when_two_domains_serve_one_project` — two
  domains produce different request bodies but one identical, host-free
  `cacheIdentityBody`.

Gates: `biome check --diagnostic-level=error`, `tsc --noEmit` in
`packages/hydrogen`, and `vp test --run packages/hydrogen`.

## Touched files

- `packages/hydrogen/src/weaverse-client.ts`
- `packages/hydrogen/__tests__/weaverse-client.test.ts`
- `.specs/2026-09-14--storefront-attribution-context/{README.md,plan.md}`
