export interface StudioMode {
  isDesignMode?: boolean
  isPreviewMode?: boolean
  isRevisionPreview?: boolean
  weaverseHost: string
  weaverseVersion: string
}

const DEFAULT_WEAVERSE_HOST = 'https://studio.weaverse.io'

/**
 * Weaverse-controlled apex domains the Studio bridge may be served from
 * (matched on the host itself and any subdomain).
 */
const TRUSTED_STUDIO_DOMAINS = ['weaverse.io', 'weaverse.dev']

function isLoopbackHostname(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost')
  )
}

export interface TrustedStudioHostOptions {
  /**
   * Also trust loopback hosts (`localhost` / `127.0.0.1` / `*.localhost`) over
   * http or https.
   *
   * Only safe when the **storefront itself** is loopback (genuine local-builder
   * dev). A production https page can still load a loopback script — loopback is
   * a "potentially trustworthy" origin and is not blocked as mixed content — so
   * honoring a query-supplied loopback host on a public storefront would let a
   * crafted link run whatever a visitor's local service serves inside the
   * storefront origin. MUST stay off on the server, where it is an SSRF vector
   * for page/theme fetches.
   */
  allowLoopback?: boolean
}

/**
 * Whether `host` is an origin we trust to serve the Studio bridge script (or,
 * server-side, to resolve page/theme data).
 *
 * The bridge executes inside the storefront document and the host can drive
 * server-side fetches, so a host taken from an attacker-controllable source —
 * e.g. a crafted `?weaverseHost=` query — is both an XSS and an SSRF vector.
 * Callers MUST reject untrusted hosts before acting on them. Trusts
 * `weaverse.io`/`weaverse.dev` and their subdomains over https; loopback is
 * opt-in (see {@link TrustedStudioHostOptions.allowLoopback}).
 */
export function isTrustedStudioHost(
  host: string,
  options?: TrustedStudioHostOptions
): boolean {
  let parsed: URL
  try {
    parsed = new URL(host)
  } catch {
    return false
  }
  let { hostname, protocol } = parsed
  // Loopback (opt-in) is the only place http is allowed — a local builder
  // serves the bridge over http and there is no cleartext-downgrade risk to a
  // private address. Every other trusted host must be https so server-side
  // page/theme fetches are never downgraded to cleartext.
  if (options?.allowLoopback && isLoopbackHostname(hostname)) {
    return protocol === 'http:' || protocol === 'https:'
  }
  if (protocol !== 'https:') {
    return false
  }
  return TRUSTED_STUDIO_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  )
}

/**
 * Build the Studio bridge script URL for the current mode, or `null` when the
 * storefront is not being previewed inside Weaverse Studio.
 *
 * This is the single gate that keeps the bridge off production storefronts:
 * a normal visitor's URL carries none of the design/preview markers, so the
 * result is `null` and no script is ever requested.
 *
 * Shared by the page-scoped `useStudio` (which also binds the page for
 * editing) and the root-level `useStudioConnect` (which only needs the script
 * to load so Studio's `checkWeaversePage()` handshake can answer on routes
 * with no Weaverse content).
 */
export function getStudioScriptSrc(mode: StudioMode): string | null {
  let {
    isDesignMode,
    isPreviewMode,
    isRevisionPreview,
    weaverseHost,
    weaverseVersion,
  } = mode
  let base = `${weaverseHost}/static/studio/hydrogen`
  let version = `?v=${weaverseVersion}`
  if (isRevisionPreview || isPreviewMode) {
    return `${base}/preview.js${version}`
  }
  if (isDesignMode) {
    return `${base}/index.js${version}`
  }
  return null
}

/**
 * Resolve the Studio bridge script URL from a URL query string — the markers
 * Studio attaches when it drives the preview iframe (`isDesignMode`,
 * `isPreviewMode`, `__revisionId`, `weaverseHost`, `weaverseVersion`) — or
 * `null` outside Studio.
 *
 * `storefrontHostname` is the document's own hostname: a loopback Studio host
 * is only honored when the storefront itself is loopback (genuine local-builder
 * dev), so a crafted public link can't load a script from a visitor's loopback
 * service into the storefront origin.
 *
 * The `weaverseHost` query is attacker-controllable, so a host that is not a
 * {@link isTrustedStudioHost trusted origin} resolves to `null` (no bridge) —
 * it is never silently replaced with production Studio, which would otherwise
 * inject the wrong bridge for self-hosted/staging deployments. Such deployments
 * (a non-`weaverse.io` `WEAVERSE_HOST`) therefore don't load the root bridge on
 * content-less routes; the page-scoped {@link getStudioScriptSrc} via
 * `useStudio` still uses the configured host on content routes.
 *
 * Pure (no DOM) so the root-level connect's production gate stays unit-testable
 * and needs no loader data.
 */
export function resolveStudioScriptSrc(
  search: string,
  storefrontHostname = ''
): string | null {
  let params = new URLSearchParams(search)
  // Match the server's getRequestQueries(), which keeps the LAST value of a
  // duplicated key. Studio appends its own control params, so a pre-existing
  // (stale/untrusted) `weaverseHost` earlier in the URL must not win here, or
  // the root bridge would be skipped while the loader uses the later host.
  let last = (key: string) => params.getAll(key).at(-1)
  let host = last('weaverseHost')
  if (host) {
    let allowLoopback = isLoopbackHostname(storefrontHostname)
    if (!isTrustedStudioHost(host, { allowLoopback })) {
      return null
    }
  }
  return getStudioScriptSrc({
    isDesignMode: last('isDesignMode') === 'true',
    isPreviewMode: last('isPreviewMode') === 'true',
    isRevisionPreview: params.has('__revisionId'),
    weaverseHost: host || DEFAULT_WEAVERSE_HOST,
    weaverseVersion: last('weaverseVersion') || '',
  })
}
