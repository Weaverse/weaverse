# Security contract: revalidation route context

The revalidation endpoint is public and every JSON field is attacker-controlled.
Client-side sanitization keeps normal traffic clean; handler-side validation is
the security boundary.

## Wire shape

Only this JSON-safe route subset may cross the browser boundary:

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

Never serialize headers, cookies, auth state, env, project ID, Studio host, API
keys/bases, commerce clients, the complete request context, runtime, or client.
Do not send the derived `queries` record; `search` is canonical and preserves
duplicate keys.

## Double sanitization

Apply the same denied-query policy before sending and after parsing.

Server-owned controls:

- `weaverseProjectId`
- `weaverseHost`
- `weaverseApiKey`
- `weaverseApiBase`
- `weaversePublicApiBase`
- `weaverseVersion`
- `projectId`

Transient transport/framework controls:

- `weaverseDraftItem`
- `__weaverseDraftItem`
- `_rsc`

Compare denied keys case-insensitively. Preserve ordinary application queries,
duplicate keys, encoded Unicode, and the mode controls needed by loader/cache
semantics: `isDesignMode`, `isPreviewMode`, `__revisionId`, and `sectionType`.

## Shape and bounds

- `pathname`: non-empty string, maximum 2,048 characters.
- `search`: string, empty or begins with `?`, maximum 8,192 characters.
- `handle`: optional non-empty string, maximum 512 characters.
- `pageType`: optional value accepted by `PageTypeSchema`; arbitrary strings are
  invalid.
- Each allowed i18n field: optional string, maximum 256 characters.
- `i18n`: plain object only; arrays and nested values are invalid.

A malformed present context returns HTTP 400 with
`{ "error": "invalid-route-context" }` before `getClient` runs. A completely
missing context is valid legacy input and passes `undefined` to the callback.

## Path and origin safety

A valid pathname:

- starts with exactly one `/`;
- does not start with `//`;
- contains no backslash or ASCII control character;
- contains no `?` or `#`.

Never resolve an untrusted pathname with `new URL(pathname, origin)`. Fix the
endpoint origin first, then assign validated components and reuse the URL's
canonical pathname everywhere:

```ts
let endpointUrl = new URL(request.url)
let routeUrl = new URL(endpointUrl.origin)
routeUrl.pathname = pathname
routeUrl.search = sanitizedSearch
let canonicalPathname = routeUrl.pathname
```

Browser input therefore cannot change protocol, host, port, username, or
password. Literal or percent-encoded dot segments may normalize, but
`requestContext.pathname` and `requestContext.url.pathname` must both receive
`canonicalPathname`; never preserve the raw pathname in only one field.

## Reconstructed server context

The handler creates:

```ts
let lastParam = (key: string) => {
  let values = searchParams.getAll(key)
  return values.length ? values.at(-1) : undefined
}

let requestContext: WeaverseNextRequestContext = {
  pathname: canonicalPathname,
  searchParams,
  url: routeUrl,
  headers: new Headers(request.headers),
  i18n,
  pageType,
  handle,
  isDesignMode: lastParam('isDesignMode') === 'true',
  isPreviewMode: lastParam('isPreviewMode') === 'true',
  isRevisionPreview: searchParams.has('__revisionId'),
  sectionType: lastParam('sectionType') || undefined,
}
```

Last-value semantics are normative for duplicated Studio controls because Studio
appends its authoritative values. This must match `getWeaverseNextConfigs()` and
its cache-mode resolution.

Headers come from the actual same-origin POST, never its JSON body. Apps must
treat explicit pathname/search/i18n as authoritative because proxy route headers
on this request may describe `/api/weaverse/revalidate`.

## Consumer responsibility

The app creates its client with project ID, host, API bases/keys, environment,
component registry, and cache policy from server code/config only. It may use the
validated context for route identity, locale, request headers, and commerce
market construction, but it must not recover denied controls from raw body data.

Route context is routing input, never an authorization decision. A registered
loader must not treat pathname, handle, page type, locale, or search values as
proof that the caller may access a resource. Public Storefront lookups may use
those values; customer/private data requires independent server-side session and
authorization checks derived from the actual request.

Existing endpoint protections remain mandatory:

- execute only registered component types;
- run loaders only and never persist draft data;
- respond `Cache-Control: no-store` on success and errors;
- reject non-OK responses client-side so Builder can fall back;
- keep design/revision requests uncached.

## Required adversarial tests

- Absolute/protocol-relative pathname cannot change origin.
- Literal and percent-encoded dot segments yield the same canonical value in
  `pathname` and `url.pathname`.
- Backslash, control character, query-in-path, fragment-in-path, and oversized
  values fail before client construction.
- Malformed i18n, `PageTypeSchema` values, handle, and search fail closed.
- Every denied key is removed even when client-side sanitization is bypassed.
- Duplicate ordinary queries and encoded Unicode survive.
- Duplicate `isDesignMode`, `isPreviewMode`, and `sectionType` controls use the
  last value; cache-mode assertions match normal config resolution.
- JSON cannot invent headers/cookies.
- Spoofed pathname/handle/page type is treated only as public routing input and
  cannot bypass a registered loader's independent customer/private-data auth.
- Missing context keeps legacy behavior.
- Invalid context responses remain `no-store`.
