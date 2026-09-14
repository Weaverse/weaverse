# Plan: Storefront Attribution Context for Theme Settings

## Design

1. `WeaverseClient.safeStorefrontOrigin()` (private) returns
   `${protocol}//${host}` of the incoming request, or `undefined` when the
   protocol is not http(s). `host` keeps an explicit port; `URL` parsing keeps
   userinfo out of it, and path/query/fragment are never read.
2. `loadThemeSettings` adds `storefrontUrl: this.safeStorefrontOrigin()` to the
   `project_configs` request body. `JSON.stringify` drops it when undefined, so
   the wire shape is unchanged for non-http(s) contexts.
3. The module-private `bodyFreeCacheRequests` WeakSet marks the exact options
   object built by `loadThemeSettings`, and `fetchWithCache` omits the body from
   the subrequest cache key only for marked objects: the key stays
   `['weaverse-fetch', url, method, undefined, projectId, 'theme-settings']`
   while the request itself carries the origin. Nothing else in that body varies
   the response: `projectId` is already in the key, and design/revision modes
   bypass `withCache` entirely. The gate is deliberately the internal options
   object rather than the public `cacheTarget` value — an earlier revision keyed
   on the target and silently collapsed the cache of any consumer selecting
   `theme-settings` with varying bodies — and the marked slot holds the private
   `BODY_FREE_CACHE_SENTINEL` string rather than `undefined`, so an external
   no-body call cannot collide with the marked identity. No public API was added or changed, so
   `api-reports/hydrogen.api.md` needs no new entry.

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
  domains produce one identical, host-free subrequest cache key through the
  real `fetchWithCache`.
- `should_still_send_each_storefront_origin_when_two_domains_serve_one_project`
  — while the outbound bodies still carry each domain's own origin.

Gates: `biome check --diagnostic-level=error`, `tsc --noEmit` in
`packages/hydrogen`, and `vp test --run packages/hydrogen`.

## Touched files

- `packages/hydrogen/src/weaverse-client.ts`
- `packages/hydrogen/__tests__/weaverse-client.test.ts`
- `.specs/2026-09-14--storefront-attribution-context/{README.md,plan.md}`
