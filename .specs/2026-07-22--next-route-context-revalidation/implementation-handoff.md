# Implementation handoff: Next route-context revalidation

Implement [Weaverse/builder#2737](https://github.com/Weaverse/builder/issues/2737)
from [`plan.md`](./plan.md). Read the original revalidation spec and the current
source before editing. Use TDD: add each focused failing test, run it to confirm
the expected failure, then make the minimum implementation pass.

## Repositories

1. SDK: `Weaverse/weaverse`
2. Consumer verification: `Weaverse/weaverse-hydrogen-next-poc`
3. Builder: read-only verification only; no contract change is expected

## Required behavior

- `internal.revalidateItem(draftItem)` remains unchanged for Builder.
- The SDK POST includes a sanitized route snapshot when runtime context exists.
- The route handler validates the snapshot, reconstructs a
  `WeaverseNextRequestContext`, and passes it to the consumer factory.
- Registered component loaders receive a client whose `requestContext` matches
  the active storefront route.
- `pageType` is a `PageTypeSchema`-validated `PageType`, not an arbitrary string.
- Duplicate Studio controls use the last value, and pathname/URL pathname share
  one URL-canonicalized value.
- Browser input cannot choose project ID, Weaverse host, API base, API key, or
  server env.
- In-place loader application, fallback behavior, and scroll continuity remain
  unchanged.

## Ordered TDD slices

### 1. Request-info route identity

1. Add failing tests showing `buildWeaverseNextRequestInfo()` preserves optional
   `pageType` and `handle` from `WeaverseNextRequestContext`.
2. Add `pageType?: PageType` and `handle?: string` to
   `WeaverseNextRequestInfo` and its builder.
3. Run the focused request-info/runtime tests.

### 2. Client route-context serialization

1. Extend the test runtime with `requestInfo`.
2. Add a failing test whose search contains normal route state plus malicious or
   transient Weaverse controls.
3. Implement the route-context serializer in `revalidate-item.ts`.
4. Assert the POST keeps pathname, duplicate/encoded ordinary query values,
   locale/i18n, page type, and handle while removing every denied control.
5. Keep `requestInfo` optional on the structural runtime type; when absent, omit
   `routeContext` for compatibility.

### 3. Handler validation and reconstruction

1. Add failing tests for a valid localized PDP context.
2. Extend `getClient` with an optional second `requestContext` argument.
3. Validate and sanitize `routeContext` before client creation.
4. Validate page type with `PageTypeSchema`; reconstruct canonical pathname,
   `URLSearchParams`, same-origin URL, i18n, handle, and mode flags.
5. Prove the registered loader receives that reconstructed context through the
   returned client's `requestContext`.
6. Add literal/encoded dot-segment tests proving `pathname === url.pathname`.
7. Add duplicate Studio-control tests proving last-value and cache-mode parity
   with `getWeaverseNextConfigs()`.
8. Add hostile path/search/control-param tests and legacy missing-context test.

### 4. POC route factory

1. Refactor the POC server-client helper so page routes can pass `pageType` and
   `handle`, and the revalidation route can pass an explicit request context.
2. Update `app/[locale]/page.tsx`, Product
   `app/[locale]/products/[handle]/page.tsx`, Collection
   `app/[locale]/collections/[handle]/page.tsx`, and Custom
   `app/[locale]/[...slug]/page.tsx`.
3. Update the client wrapper to restore `pageType` and `handle` from serialized
   `configs.requestInfo`.
4. Wire the revalidation handler callback's second argument into the explicit
   server-client path.
5. Extend the existing real Storefront API smoke loader response with a compact
   route-context snapshot used only as QA evidence; do not replace Shopify data
   with fixtures or fallback demo data.
6. Add `app/weaverse-next/revalidation-context.test.ts`; require assertions for
   Product/Collection/Custom identity, explicit callback context, and legacy
   missing-context fallback. The existing `npm test` glob runs this file.

### 5. Documentation and compatibility

1. Update package README route-handler wiring.
2. Document that `requestContext` is validated browser input and project/host/env
   must still come from server config.
3. Keep the old one-argument `getClient` callback example valid.
4. Run package tests, typecheck, build, and formatting/lint checks. Use
   `pnpm exec biome check packages/next/src packages/next/__tests__
   --diagnostic-level=error` from the SDK root.

### 6. Packed consumer and Studio QA

1. Build and pack the final SDK candidate.
2. Install the tarball in the real POC without committing registry/lockfile noise
   until the candidate is final.
3. Run POC checks and build.
4. Exercise localized Product, Collection, and Custom routes in Studio.
5. Change a real product and collection resource on the smoke section.
6. Inspect the revalidation response/visible QA snapshot for exact pathname,
   locale, page type/handle, and ordinary query params.
7. Confirm no page remount, scroll reset, stale draft, secret-bearing body field,
   or unexpected full-route refresh.
8. Remove the endpoint temporarily or mock a non-OK response and confirm Builder
   still falls back to route refresh.

## Guardrails

- Do not read route identity from `window.location`.
- Do not let Builder construct or pass route context.
- Do not serialize `Headers`, `URL`, cookies, auth state, env, project ID, Studio
  host, API key, API base, commerce client, or the whole runtime/client.
- Do not trust `queries`; derive query values from sanitized `search` so there is
  one canonical representation.
- Do not use `URLSearchParams.get()` for Studio controls; preserve current
  last-duplicate precedence.
- Do not retain raw pathname after URL canonicalization; context pathname and URL
  pathname must be identical.
- Do not change the endpoint default or Builder RPC signature.
- Do not change Builder source for this slice.
- Do not weaken registered-component lookup, no-store responses, or failure
  fallback.
- Do not publish until packed-tarball POC and manual Studio checks pass.

## Expected deliverables

- SDK implementation and regression tests
- Package documentation update
- POC integration, automated route-context regressions, and real-data smoke
  evidence
- Updated spec work log with command outputs and manual QA result
- Alpha release only after review and explicit approval
