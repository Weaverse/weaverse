import type { PageType } from './validation.js'

/**
 * Page types a theme can address with a URL pattern. `*` matches every page
 * type rather than naming one, and `CUSTOM` pages carry their own full path,
 * so neither can be given a pattern.
 */
export type ThemeRoutePageType = Exclude<PageType, '*' | 'CUSTOM'>

/**
 * Route patterns declared by a theme, keyed by page type. Values are paths
 * with `:param` placeholders, e.g. `/shop/:handle` or `/blogs/:blog/:article`.
 *
 * A theme declares only the routes that differ from the Shopify convention;
 * consumers fall back to that convention for every key left out.
 */
export type ThemeRoutes = Partial<Record<ThemeRoutePageType, string>>

/** Matches a whole `:param` path segment. */
const PARAM_SEGMENT = /^:([a-zA-Z][a-zA-Z0-9_]*)$/

/**
 * Expands a theme route pattern into a storefront path.
 *
 * Returns `null` when the pattern is unusable — it does not start with `/`, or
 * a `:param` in it has no value in `params` — so callers fall back to their
 * default route instead of navigating to a path containing a literal `:handle`.
 *
 * @example
 * resolveThemeRoute('/blogs/:blog/:article', { blog: 'news', article: 'hello' })
 * // '/blogs/news/hello'
 */
export function resolveThemeRoute(
  pattern: string,
  params: Record<string, string | undefined>
): string | null {
  if (!pattern.startsWith('/')) {
    return null
  }

  let resolved: string[] = []
  for (let segment of pattern.split('/')) {
    let param = segment.match(PARAM_SEGMENT)?.[1]
    if (!param) {
      resolved.push(segment)
      continue
    }
    let value = params[param]
    if (!value) {
      return null
    }
    resolved.push(encodeURIComponent(value))
  }

  return resolved.join('/')
}
