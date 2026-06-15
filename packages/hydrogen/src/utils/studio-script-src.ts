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

/**
 * Whether `host` is an origin we trust to serve the Studio bridge script.
 *
 * The bridge executes inside the storefront document, so a host taken from an
 * attacker-controllable source — e.g. a crafted `?weaverseHost=` query — is an
 * XSS vector. Callers MUST reject untrusted hosts before handing them to
 * `loadScript`. Trusts `weaverse.io`/`weaverse.dev` and their subdomains, plus
 * localhost for previewing a storefront against a locally-running builder.
 */
export function isTrustedStudioHost(host: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(host)
  } catch {
    return false
  }
  let { hostname, protocol } = parsed
  if (protocol !== 'https:' && protocol !== 'http:') {
    return false
  }
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost')
  ) {
    return true
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
 * The `weaverseHost` query is attacker-controllable, so it is only honored when
 * it is a {@link isTrustedStudioHost trusted Weaverse origin}; otherwise the
 * default Studio host is used, so a crafted URL can never load a script from an
 * arbitrary origin into the storefront document.
 *
 * Pure (no DOM) so the root-level connect's production gate stays unit-testable
 * and needs no loader data.
 */
export function resolveStudioScriptSrc(search: string): string | null {
  let params = new URLSearchParams(search)
  let host = params.get('weaverseHost')
  return getStudioScriptSrc({
    isDesignMode: params.get('isDesignMode') === 'true',
    isPreviewMode: params.get('isPreviewMode') === 'true',
    isRevisionPreview: params.has('__revisionId'),
    weaverseHost:
      host && isTrustedStudioHost(host) ? host : DEFAULT_WEAVERSE_HOST,
    weaverseVersion: params.get('weaverseVersion') || '',
  })
}
