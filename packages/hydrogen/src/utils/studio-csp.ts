import { resolveStudioScriptSrc } from './studio-script-src'

/**
 * CSP sources Weaverse Studio needs while it drives the storefront in its
 * iframe. Shaped like Hydrogen's `ContentSecurityPolicyDirectives`, so it can
 * be passed as `createContentSecurityPolicy({ directives })`, where each array
 * extends Hydrogen's defaults.
 */
export interface WeaverseStudioCspDirectives {
  /** Origins the Studio bridge fetches from. */
  connectSrc?: string[]
  /** Origins Studio loads fonts from. */
  fontSrc?: string[]
  /** The Studio origin allowed to embed the storefront. */
  frameAncestors?: string[]
  /** Origins Studio loads images from. */
  imgSrc?: string[]
  /** The Studio bridge origin, plus `'unsafe-eval'` in design mode. */
  scriptSrc?: string[]
  /** Origins Studio loads stylesheets from. */
  styleSrc?: string[]
}

/**
 * CSP directives for Weaverse Studio, for the request being rendered.
 *
 * Returns `{}` for normal visitors: outside Studio the browser never contacts
 * Weaverse, so a theme's policy needs nothing extra. Inside Studio, the Studio
 * origin is allowed to embed the page and serve the bridge, and design mode
 * adds `'unsafe-eval'` because the bridge rebuilds schema `condition`
 * functions from strings.
 *
 * The `weaverseHost` query is attacker-controllable, so it goes through the
 * same trust check that gates the bridge script: an untrusted host, or a
 * loopback host on a non-loopback storefront, returns `{}`, as does a relative
 * or malformed URL. Works in both report-only and enforcing policies.
 *
 * The example below needs `@shopify/hydrogen` 2026.10.3 or later, the first
 * release with `createContentSecurityPolicy`.
 *
 * @example
 * ```ts
 * let csp = createContentSecurityPolicy({
 *   shop,
 *   directives: getWeaverseStudioCspDirectives(request),
 * })
 * ```
 */
export function getWeaverseStudioCspDirectives(
  request: Request | URL | string
): WeaverseStudioCspDirectives {
  let url: URL
  try {
    url = new URL(request instanceof Request ? request.url : request)
  } catch {
    // A relative or malformed URL can't be Studio; never break the response.
    return {}
  }
  let bridgeSrc = resolveStudioScriptSrc(url.search, url.hostname)
  if (!bridgeSrc) {
    return {}
  }
  let studio = new URL(bridgeSrc).origin
  let isDesignMode = url.searchParams.getAll('isDesignMode').at(-1) === 'true'
  return {
    connectSrc: [studio],
    fontSrc: [studio],
    frameAncestors: [studio],
    imgSrc: [studio],
    scriptSrc: isDesignMode ? [studio, "'unsafe-eval'"] : [studio],
    styleSrc: [studio],
  }
}
