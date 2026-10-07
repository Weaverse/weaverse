import type { PageType } from './validation.js'

/**
 * Page types a theme can address with a URL pattern. `*` matches every page
 * type rather than naming one, and `CUSTOM` pages carry their own full path,
 * so neither can be given a pattern.
 */
export type ThemeRoutePageType = Exclude<PageType, '*' | 'CUSTOM'>

/**
 * Route patterns declared by a theme, keyed by page type, so Studio can
 * navigate to a page on a theme that does not follow the Shopify URL
 * convention. A pattern is an absolute path of static segments and whole
 * `:param` segments, with two params:
 *
 * - `:handle` — the page's own handle (product, collection, page, blog or
 *   article handle).
 * - `:blog` — the handle of an article's blog; only meaningful for `ARTICLE`.
 *
 * @example
 * routes: {
 *   ALL_PRODUCTS: '/shop',
 *   COLLECTION: '/shop/:handle',
 *   ARTICLE: '/journal/:handle', // Shopify convention: '/blogs/:blog/:handle'
 * }
 *
 * A theme declares only the routes that differ from the Shopify convention;
 * Studio falls back to that convention for every key left out, and for a
 * pattern it cannot fill.
 */
export type ThemeRoutes = Partial<Record<ThemeRoutePageType, string>>
