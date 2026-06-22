import type { WeaverseNextRequestContext } from './types'

/**
 * Weaverse-controlled apex domains the Studio bridge may be served from
 * (matched on the host itself and any subdomain), mirroring Hydrogen's
 * `TRUSTED_STUDIO_DOMAINS`.
 */
const TRUSTED_STUDIO_DOMAINS = ['weaverse.io', 'weaverse.dev']

function isLoopbackHostname(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost')
  )
}

function normalizeOrigin(value: string | null): string | null {
  if (!value) {
    return null
  }

  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

/**
 * Whether `origin` is one we trust to serve the Studio bridge script. Matches
 * Hydrogen's `isTrustedStudioHost`: trusts `weaverse.io` / `weaverse.dev` and
 * their subdomains over https, plus loopback (`localhost` / `*.localhost` /
 * `127.0.0.1`) — but only when the storefront itself is loopback (genuine
 * local-builder dev). Loopback is the only place http is allowed; every other
 * trusted host must be https. Arbitrary origins are rejected.
 */
function isTrustedStudioOrigin(
  origin: string,
  storefrontHostname: string
): boolean {
  let parsed: URL
  try {
    parsed = new URL(origin)
  } catch {
    return false
  }

  let { hostname, protocol } = parsed
  if (isLoopbackHostname(storefrontHostname) && isLoopbackHostname(hostname)) {
    return protocol === 'http:' || protocol === 'https:'
  }

  if (protocol !== 'https:') {
    return false
  }

  return TRUSTED_STUDIO_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  )
}

function toSearchParams(context?: WeaverseNextRequestContext): URLSearchParams {
  if (context?.searchParams) {
    return new URLSearchParams(context.searchParams)
  }

  if (context?.url) {
    let url =
      typeof context.url === 'string'
        ? new URL(context.url, 'http://localhost')
        : context.url
    return new URLSearchParams(url.searchParams)
  }

  return new URLSearchParams()
}

function last(searchParams: URLSearchParams, key: string): string | null {
  let values = searchParams.getAll(key)
  return values.length ? (values.at(-1) ?? null) : null
}

export interface ResolveWeaverseNextStudioScriptSrcOptions {
  framework?: 'hydrogen' | 'next'
  storefrontHostname?: string
}

/**
 * Resolve the Studio script URL from request/search context. v0 intentionally
 * reuses the existing structural Hydrogen bridge script until a concrete Builder
 * incompatibility requires a dedicated Next bundle.
 */
export function resolveWeaverseNextStudioScriptSrc(
  context?: WeaverseNextRequestContext,
  options: ResolveWeaverseNextStudioScriptSrcOptions = {}
): string | null {
  let searchParams = toSearchParams(context)

  let isDesignMode =
    context?.isDesignMode ?? last(searchParams, 'isDesignMode') === 'true'
  let isPreviewMode =
    context?.isPreviewMode ?? last(searchParams, 'isPreviewMode') === 'true'
  let isRevisionPreview =
    context?.isRevisionPreview ?? Boolean(last(searchParams, '__revisionId'))

  if (!(isDesignMode || isPreviewMode || isRevisionPreview)) {
    return null
  }

  let origin = normalizeOrigin(last(searchParams, 'weaverseHost'))
  if (!origin) {
    return null
  }

  let storefrontHostname = options.storefrontHostname ?? ''
  if (!isTrustedStudioOrigin(origin, storefrontHostname)) {
    return null
  }

  let framework = options.framework ?? 'hydrogen'
  let bundle = isDesignMode ? 'index.js' : 'preview.js'
  let version = last(searchParams, 'weaverseVersion')
  let url = `${origin}/static/studio/${framework}/${bundle}`
  return version ? `${url}?v=${encodeURIComponent(version)}` : url
}
