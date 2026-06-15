// Query params that influence Weaverse page resolution on the Builder:
// revision previews, design-mode flags, and `weaverse*` control params
// (host, version, project id). Everything else — utm_*, fbclid, gclid,
// storefront filters — is irrelevant to which page the Builder returns.
const KEPT_PARAM_RE = /^(?:__revisionId|isDesignMode|weaverse)/

/**
 * Normalize the storefront URL sent in the Builder page API request body.
 *
 * The POST body participates in the `withCache` cache key, so a raw
 * `request.url` fragments the cache by every marketing/tracking param:
 * each distinct `?utm_…`/`fbclid` URL is a guaranteed Builder round-trip
 * even when the resolved page is identical — precisely the paid/social
 * traffic that needs the cache most (builder#2450).
 *
 * The Builder reads only the pathname (locale/type/handle fallback) and
 * the params matched above from this URL, so keep exactly those. Params
 * are sorted for a stable cache key regardless of their order in the
 * incoming URL.
 */
export function normalizePageUrl(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    // Not an absolute URL (shouldn't happen for request.url) — send as-is.
    return url
  }
  const kept = [...parsed.searchParams].filter(([key]) =>
    KEPT_PARAM_RE.test(key)
  )
  kept.sort(([a], [b]) => a.localeCompare(b))
  const search = new URLSearchParams(kept).toString()
  // React Router single-fetch requests loader data from `/<path>.data`, which
  // resolves to the same Builder page as `/<path>`. Strip the suffix so a
  // client navigation and a document load hash to one edge-cache key (the
  // api.weaverse.io worker keys on this url) instead of two — keeping a page's
  // first client navigation off the cold-MISS path.
  let { pathname } = parsed
  if (pathname.endsWith('.data')) {
    pathname = pathname.slice(0, -'.data'.length)
  }
  return `${parsed.origin}${pathname}${search ? `?${search}` : ''}`
}
