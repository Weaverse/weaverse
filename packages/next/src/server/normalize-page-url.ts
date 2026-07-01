import type { WeaverseNextRequestContext } from '../types'

// Query params that influence Weaverse page resolution on the Builder:
// revision previews, design-mode flags, design-mode draft item overrides,
// and `weaverse*` control params (host, version, project id). Everything
// else — utm_*, fbclid, gclid, storefront filters — is irrelevant to which
// page the Builder returns and would otherwise fragment any fetch cache keyed
// on the request body. `weaverseDraftItem` is the current draft item param;
// `__weaverseDraftItem` is kept as a legacy compatibility alias.
const KEPT_PARAM_RE =
  /^(?:__revisionId|__weaverseDraftItem|isDesignMode|weaverse)/
const DATA_SUFFIX = '.data'

/**
 * Normalize the storefront URL sent in the Builder page API request body.
 *
 * The Builder reads only the pathname (locale/type/handle fallback) and the
 * Weaverse/Studio control params from this URL, so keep exactly those and drop
 * tracking params. Params are sorted for a stable, cache-friendly string.
 *
 * Ported from `@weaverse/hydrogen`'s `normalizePageUrl`, but tolerant of a
 * relative URL (Next route handlers may only know the pathname).
 */
export function normalizeNextPageUrl(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    try {
      parsed = new URL(url, 'http://localhost')
    } catch {
      return url
    }
  }

  let kept = [...parsed.searchParams].filter(([key]) => KEPT_PARAM_RE.test(key))
  kept.sort(([a], [b]) => a.localeCompare(b))
  let search = new URLSearchParams(kept).toString()

  let { pathname } = parsed
  if (pathname.endsWith(DATA_SUFFIX)) {
    pathname = pathname.slice(0, -DATA_SUFFIX.length)
  }
  return `${parsed.origin}${pathname}${search ? `?${search}` : ''}`
}

/**
 * Build an absolute-ish request URL string from the explicit request context,
 * preferring `url`, then `pathname` + `searchParams`. Used as the input to
 * {@link normalizeNextPageUrl}.
 */
export function resolveRequestUrl(
  context?: WeaverseNextRequestContext
): string {
  if (context?.url) {
    return typeof context.url === 'string'
      ? context.url
      : context.url.toString()
  }
  let pathname = context?.pathname || '/'
  let search = context?.searchParams
    ? new URLSearchParams(context.searchParams).toString()
    : ''
  return `http://localhost${pathname}${search ? `?${search}` : ''}`
}
