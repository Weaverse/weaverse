# Feature: Storefront Attribution Context for Theme Settings

| Field | Value |
| --- | --- |
| **Status** | in-progress |
| **Owner** | @paul |
| **Issue** | [PR #526](https://github.com/Weaverse/weaverse/pull/526) |
| **Branch** | `feat/storefront-context-for-configs` |
| **Created** | 2026-09-14 |
| **Last Updated** | 2026-09-14 |

## Initiating Requirement

Builder gained user-managed per-project hostname controls: a merchant sees the
hostnames observed requesting their project's content in **Manage previews** and
can add one to their saved previews or block it, which is then enforced at the
Cloudflare edge and at the Builder origin. Page reads already carry `url`, so
they are attributable. Theme/config reads (`/api/public/project_configs`) carried
`{ isDesignMode, projectId }` only, so Builder could not tell which storefront
asked and those requests stayed unattributable.

This SDK change is the smallest backwards-compatible addition that closes that
gap:

- `loadThemeSettings` sends `storefrontUrl`: the incoming request's **safe
  origin** only — scheme, host and explicit port. Path, query, fragment and
  userinfo are dropped, so no customer route and no credential-bearing value
  leaves the storefront. A non-http(s) request omits the field.
- The response does not vary by storefront, so the origin must not fragment any
  cache. It is excluded from the edge's cache selectors, and the internal
  `project_configs` request is marked (module-private WeakSet) so its subrequest
  cache key omits the body — two domains of one project keep sharing one
  theme-settings entry. The gate is the exact internal options object, NOT the
  public `cacheTarget` value: `fetchWithCache` is public API, and keying on the
  target let an outside caller selecting `theme-settings` with varying bodies
  collapse into one entry. No public API was added or changed.
- Older Builder deployments ignore the extra field, and older SDKs simply omit
  it and remain unattributable. No new credential and no required configuration
  for SDK consumers. Adoption is a rollout prerequisite for theme/config
  attribution, never a hard dependency.

This is caller-declared attribution — resource containment, not authentication
or licensing.

## Summary

The canonical cross-repository spec (storage, enforcement, collection limits,
propagation window, UI and rollout order) lives in the Builder repository at
`.specs/2026-09/2026-09-14--project-hostname-controls/`. This spec records only
the SDK contract; it is deliberately not a copy.
