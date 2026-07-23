# Plan: Preserve route context during Next per-item revalidation

## Problem

`@weaverse/next` revalidates a loader-backed Studio item through a dedicated POST:

```text
Builder revalidate(id)
  → runtime.internal.revalidateItem(draftItem)
  → POST /api/weaverse/revalidate { draftItem }
  → create app server client
  → run registered component loader
  → return loaderData
  → apply loaderData to the existing item instance
```

The in-place update is correct: it avoids `router.refresh()`, RSC tree remounts,
scroll reset, and client-state loss. The server request context is not correct.
The POST contains no original route identity, and the handler's `Request` points
to `/api/weaverse/revalidate`, not the page in the Studio iframe.

The current POC mounts the handler as:

```ts
createWeaverseNextRevalidateHandler({
  getClient: () => getWeaverseServerClient(Promise.resolve({})),
})
```

That client falls back to pathname `/`, empty search, and no locale. The existing
resource-picker smoke still passes because its loader only reads the selected
resource and `commerce.storefront`; it does not inspect pathname, locale, page
type, handle, or search state. A successful in-place update is therefore not
proof that production loaders see the same context on page load and revalidation.

This matters for:

- localized PDPs such as `/fr-fr/products/classic-kicks`;
- localized collection pages;
- custom pages resolved by pathname;
- loaders that branch on market/i18n;
- loaders that read filters, variants, preview flags, or other search params;
- loaders that use `context.pageType` or `context.handle`.

## Evidence in current source

- `packages/next/src/revalidate-item.ts` serializes only `{ draftItem }`.
- `packages/next/src/server/revalidate-handler.ts` calls
  `config.getClient(request)` and passes `client.requestContext` to the loader.
- The endpoint request cannot reveal the owning storefront route.
- `WeaverseNextRuntime` already owns `requestInfo`, a stable route snapshot used
  in its runtime key and refreshed on pathname/search/locale navigation.
- `getWeaverseNextConfigs()` reads `weaverseProjectId`, `weaverseHost`, and
  `weaverseApiKey` from search params. Forwarding raw client search would let an
  untrusted POST influence server-owned config.

## Goals

- Run a revalidated component loader with the same route identity as its active
  page: pathname, ordinary search params, i18n, page type, and handle.
- Preserve the existing in-place update and Builder fallback behavior.
- Keep route-context capture SDK-owned; Builder continues to pass only the draft
  item.
- Keep the wire payload small, JSON-safe, explicit, and version-tolerant.
- Keep project ID, Studio host, API base, API key, env, headers/cookies, and
  commerce objects out of the browser-provided route envelope.
- Give the consumer app an already validated `WeaverseNextRequestContext` from
  which it can create the same server client/commerce context used by page loads.
- Verify the contract against real localized Shopify Product, Collection, and
  Custom routes in the POC.

## Non-goals

- Changing Builder's `internal.revalidateItem(draftItem)` contract.
- Replacing full-page refresh flows or the older-SDK fallback.
- Authenticating Studio or introducing a write-capable endpoint.
- Sending a full `Request`, `Headers`, runtime, client, commerce object, or env
  through JSON.
- Letting the browser select a Weaverse project or API host.
- Refactoring unrelated loader APIs, global sections, analytics, or page routing.
- Solving every concurrent revalidation race; existing sequencing/fallback stays
  unchanged unless a failing regression test proves this change introduces one.

## Decision summary

1. Extend the serialized runtime request info with optional `pageType` and
   `handle`, which already exist on `WeaverseNextRequestContext`.
2. POST a new optional `routeContext` field beside `draftItem`.
3. Build it from the active runtime's `requestInfo`, never `window.location`.
4. Serialize only pathname, sanitized search, narrow i18n, page type, and handle.
5. Sanitize once before sending and again inside the route handler.
6. Reconstruct a `WeaverseNextRequestContext` on the endpoint's own origin.
7. Pass that as an optional second argument to `getClient`.
8. Allow missing context so old clients/consumer callbacks remain operational.

## Target data flow

```text
Server page request
  → app builds WeaverseNextRequestContext
      pathname=/fr-fr/products/classic-kicks
      searchParams=?variant=123&isDesignMode=true
      i18n={ country: FR, language: FR, locale: fr-FR }
      pageType=PRODUCT
      handle=classic-kicks
  → server client returns configs.requestInfo
  → client wrapper restores requestContext
  → WeaverseNextRuntime.requestInfo owns the active sanitized route snapshot

Studio resource edit
  → Builder calls runtime.internal.revalidateItem(draftItem)       (unchanged)
  → SDK snapshots runtime.requestInfo
  → SDK strips server-owned/transient controls
  → POST { draftItem, routeContext }
  → handler validates and sanitizes routeContext again
  → handler reconstructs WeaverseNextRequestContext on same origin
  → config.getClient(apiRequest, reconstructedContext)
  → client is created with server-owned project/env/host + route-owned context
  → registered component loader receives client.requestContext
  → loaderData response is applied to the existing item instance
```

## Public contract

### Serialized route context

Add a public JSON-safe type close to `revalidate-item.ts` and export it from the
root entrypoint:

```ts
export interface WeaverseNextRevalidateRouteContext {
  handle?: string
  i18n?: Pick<
    WeaverseNextI18n,
    'country' | 'label' | 'language' | 'locale' | 'pathPrefix'
  >
  pageType?: PageType
  pathname: string
  search: string
}
```

`search` is canonical; do not send the derived `queries` record. This avoids two
representations disagreeing and preserves duplicate query keys through
`URLSearchParams`.

Extend `WeaverseNextRequestInfo`:

```ts
export interface WeaverseNextRequestInfo {
  handle?: string
  i18n?: WeaverseNextI18n
  pageType?: PageType
  pathname: string
  queries: Record<string, string | boolean>
  search: string
}
```

`buildWeaverseNextRequestInfo(context)` copies `context.handle` and
`context.pageType` when present. Existing callers remain valid because both are
optional.

### POST body

```ts
export interface WeaverseNextRevalidateRequestBody {
  draftItem: WeaverseNextComponentData
  routeContext?: WeaverseNextRevalidateRouteContext
}
```

Example after sanitization:

```json
{
  "draftItem": {
    "id": "resource-section",
    "type": "resource-picker-smoke",
    "data": { "product": { "handle": "classic-kicks" } }
  },
  "routeContext": {
    "pathname": "/fr-fr/products/classic-kicks",
    "search": "?variant=123&isDesignMode=true",
    "i18n": {
      "country": "FR",
      "language": "FR",
      "locale": "fr-FR",
      "pathPrefix": "/fr-fr"
    },
    "pageType": "PRODUCT",
    "handle": "classic-kicks"
  }
}
```

### Client runtime surface

Keep Builder's public capability unchanged:

```ts
runtime.internal.revalidateItem?: (
  draftItem: WeaverseNextComponentData
) => Promise<void>
```

Extend the structural helper surface without breaking manual mocks:

```ts
export interface RevalidateItemRuntimeLike {
  itemInstances: Map<string, { setData(update: Record<string, unknown>): unknown }>
  requestInfo?: WeaverseNextRequestInfo
}
```

`requestInfo` stays optional. A real `WeaverseNextRuntime` always supplies it.
When absent, the client omits `routeContext`, preserving the legacy request.

### Handler factory

Add an optional second callback argument:

```ts
export interface WeaverseNextRevalidateHandlerConfig {
  getClient: (
    request: Request,
    requestContext?: WeaverseNextRequestContext
  ) => Promise<WeaverseNextServerClient> | WeaverseNextServerClient
}
```

A callback declared as `(request) => client` remains valid. New consumers use:

```ts
export const { POST } = createWeaverseNextRevalidateHandler({
  getClient: (_request, requestContext) =>
    getWeaverseServerClientFromContext(requestContext),
})
```

The second argument is optional because an old SDK client may call a newly
mounted handler without `routeContext`.

## Route-context source of truth

Use `runtime.requestInfo` captured at the start of
`revalidateWeaverseNextItem()`. Do not use:

- `window.location`: it introduces a second router source, complicates tests and
  can disagree with the runtime during App Router transitions;
- Builder's RPC payload: Builder should remain framework-neutral;
- `runtime.internal.pageAssignment`: an inherited/default template handle may be
  `*` or template metadata, not the actual Shopify resource route handle;
- endpoint headers/pathname: they describe `/api/weaverse/revalidate`.

The page route must put actual `pageType` and `handle` into its initial
`WeaverseNextRequestContext`. The server payload, client wrapper, and runtime then
carry one consistent route identity.

## Client-side sanitization

Create one focused helper, e.g. `buildWeaverseNextRevalidateRouteContext()`, that
returns `undefined` without runtime request info and otherwise:

- copies a valid pathname;
- parses and re-serializes `search` with `URLSearchParams`;
- copies only known i18n string fields;
- copies `pageType` only when `PageTypeSchema` accepts it and copies a bounded
  string `handle`;
- removes denied query controls case-insensitively.

Denied server-owned controls:

- `weaverseProjectId`
- `weaverseHost`
- `weaverseApiKey`
- `weaverseApiBase`
- `weaversePublicApiBase`
- `weaverseVersion`
- `projectId`

Denied transient transport/framework controls:

- `weaverseDraftItem`
- `__weaverseDraftItem`
- `_rsc`

Preserve ordinary application query parameters, duplicate keys, encoded Unicode,
and these mode controls because they affect loader/cache semantics:

- `isDesignMode`
- `isPreviewMode`
- `__revisionId`
- `sectionType`

Client sanitization keeps normal traffic clean; it is not the security boundary.

## Handler validation and security boundary

The route handler repeats the client deny-list, validates `PageTypeSchema`, fixes
the URL origin, canonicalizes both pathname identities once, and uses last-value
Studio-control semantics. Malformed present context returns
`400 { "error": "invalid-route-context" }`; missing context stays legacy-valid.

Only pathname, sanitized search, narrow i18n, page type, and handle cross the JSON
boundary. Project ID, Studio host, API bases/keys, version controls, env, headers,
cookies, commerce objects, runtime, and client stay out of the body. Actual POST
headers may be attached server-side to the reconstructed context, but explicit
route fields remain authoritative over API-route proxy headers.

The complete normative deny-list, bounds, same-origin URL algorithm,
reconstructed mode flags, consumer responsibilities, and adversarial tests live
in [`security-contract.md`](./security-contract.md).

## Handler behavior

1. Parse JSON.
2. Validate `draftItem` as today.
3. If `routeContext` is present, validate and sanitize it.
4. Reconstruct `WeaverseNextRequestContext`.
5. Call `getClient(request, requestContext)`; pass `undefined` for legacy bodies.
6. Resolve the registered component and loader as today.
7. Run the loader with schema defaults, draft data, client, commerce, and
   `client.requestContext`.
8. Return `{ loaderData }` with no-store.
9. Preserve existing status/error behavior; add only
   `invalid-route-context` for malformed present context.

## POC integration

Refactor `app/weaverse-next/server.ts` around one lower-level client constructor
that accepts an explicit `WeaverseNextRequestContext`. Normal page helpers still
collect Next `headers()`/`searchParams`; the revalidation route passes the SDK's
validated callback context and must not rediscover pathname/locale from API-route
proxy headers.

Page boundaries supply actual route identity: Index uses `INDEX`; Product and
Collection use their real handles; Custom uses `CUSTOM` with exact pathname. The
client wrapper restores page type/handle from `configs.requestInfo`, and the
endpoint wires `getClient: (_request, context) =>
getWeaverseServerClientFromContext(context)`.

Keep the existing resource-picker smoke because it queries real Shopify data.
Add a compact loader context snapshot as QA evidence rather than replacing the
commerce query with fixtures. The exact POC edit order is in
[`implementation-handoff.md`](./implementation-handoff.md).

## Backward compatibility

| Client | Handler/app | Result |
| --- | --- | --- |
| Old client | Old handler/app | Existing behavior |
| Old client | New handler/app | No `routeContext`; handler passes `undefined`; consumer legacy fallback works |
| New client | Old handler/app | Extra JSON field is ignored by the existing parser; existing behavior |
| New client | New handler/app | Route-aware loader context |
| Any client | New handler with an existing one-argument `getClient` callback | Callback ignores the optional second argument and still typechecks/runs |

Builder requires no change because the SDK-bound function still accepts only
`draftItem`.

This is an additive alpha contract. Do not remove the missing-context path until
a future major version and only with adoption evidence.

## Exact SDK files

- `packages/next/src/types.ts`
  - add optional `pageType: PageType`/`handle` to `WeaverseNextRequestInfo` if
    not already represented at implementation time;
  - keep server request-context fields unchanged.
- `packages/next/src/request-info.ts`
  - serialize page type and handle.
- `packages/next/src/revalidate-item.ts`
  - define/export route-context type/helper;
  - extend structural runtime surface;
  - send sanitized context.
- `packages/next/src/server/revalidate-handler.ts`
  - extend body/config types;
  - validate/sanitize/reconstruct route context;
  - pass second factory argument.
- `packages/next/src/index.ts` and `packages/next/src/server.ts`
  - export the new public types/helpers from appropriate entrypoints.
- `packages/next/__tests__/revalidate-item.test.ts`
  - client and handler contract regression tests.
- `packages/next/__tests__/next-adapter.test.tsx`
  - request-info route identity tests.
- `packages/next/README.md`
  - route wiring, trust boundary, and migration example.

## POC files

Expected integration surface in `Weaverse/weaverse-hydrogen-next-poc`:

- `app/weaverse-next/server.ts`, `wrapper.tsx`, `server-components.ts`
- `app/weaverse-next/revalidation-context.test.ts` (new; matched by `npm test`)
- `app/weaverse-next/components.tsx` only if a design-mode QA snapshot is rendered
- `app/api/weaverse/revalidate/route.ts`
- route boundaries: `app/[locale]/page.tsx`, plus `products/[handle]/page.tsx`,
  `collections/[handle]/page.tsx`, and `[...slug]/page.tsx` under `app/[locale]/`

The POC test covers Product/Collection/Custom identity, callback wiring, and legacy fallback.

Use the existing resource-picker smoke component because it queries real Shopify
Storefront API product/collection data. Extend its loader result with a compact
context snapshot for verification rather than replacing it with fixtures.

## Verification

The ordered TDD workflow and packed-consumer checklist are normative in
[`implementation-handoff.md`](./implementation-handoff.md). At minimum, verify:

- request info preserves optional page type/handle;
- the client keeps localized route state and ordinary queries while removing all
  denied controls;
- the handler reconstructs a same-origin request context and preserves legacy
  missing-context behavior;
- duplicate Studio controls use the last value/cache path, while literal/encoded
  dot segments produce one canonical pathname in both context fields;
- loader data still applies in place and non-OK responses still trigger fallback;
- package test/typecheck/build/Biome gates pass;
- the exact packed candidate passes the POC build;
- localized Product, Collection, and Custom Studio resource edits return real
  Shopify data with exact context and no remount, scroll reset, stale draft, or
  secret-bearing body fields.

Expected SDK commands, adjusted only if package scripts changed:

```bash
pnpm --filter @weaverse/next test
pnpm --filter @weaverse/next typecheck
pnpm --filter @weaverse/next build
pnpm exec biome check packages/next/src packages/next/__tests__ --diagnostic-level=error
```

Do not claim consumer parity from SDK unit tests alone.

## Release and rollout

1. Merge SDK implementation only after package gates, independent review, packed
   POC build, and manual local Studio smoke.
2. Publish the next `0.1.0-alpha.*` only with explicit release approval.
3. Bump the POC from tarball to the published exact version.
4. Deploy POC manually and repeat Product/Collection/Custom Studio smoke.
5. Record evidence in this spec's work log and #2737.
6. Close #2737 only after production verification; then continue #2739 QA.

## Risks and mitigations

### Client-controlled context

The endpoint is public and the route context is forgeable. Mitigation: narrow
shape, bounds, same-origin URL reconstruction, double sanitization, server-owned
project/host/credentials, registered loaders only, and no-store responses.

### Consumer factory ignores the second argument

The package cannot force an app to use context. Mitigation: update docs and real
POC, make the callback explicit, and add a POC regression test/smoke. Keeping the
argument optional preserves migration but production readiness requires using it.

### Route context drifts during navigation

Snapshot context at revalidation start. Runtime route keys/rebinding already
track pathname/search changes. If a route changes while the request is in flight,
the existing instance reference/fallback semantics remain; do not silently read
later `window.location` state.

### Search params influence server behavior

Some mode params are intentionally preserved. Project, host, API key/base, and
version controls are denied twice. Ordinary app params remain because loaders may
legitimately depend on them.

### Proxy headers describe the API endpoint

The reconstructed context carries explicit route fields. POC factory code must
not let API-route pathname/locale headers override them.

## Rejected alternatives

- Custom pathname header: insufficient for locale, search, and route identity.
- `window.location`: a second route source that can race App Router transitions.
- Builder-supplied context: leaks framework concerns into Builder.
- Complete `requestInfo`: duplicates `search`/`queries` and carries denied controls.
- Full request context/runtime/client: not JSON-safe and risks secret leakage.
- Handler pathname parsing: route conventions are app-owned; page boundaries
  already know page type and actual handle.

## Completion gate

This work is complete only when:
- SDK route identity is propagated and validated end to end;
- security-sensitive controls cannot reach client construction from the body;
- old callback/body shapes remain covered;
- package checks and independent review pass;
- the packed package works in the real POC;
- localized Product, Collection, and Custom resource edits pass in Studio with
  real Shopify data and no visual continuity regression;
- the deployed exact package version is rechecked and evidence is logged.
