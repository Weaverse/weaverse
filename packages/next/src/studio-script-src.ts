import type { WeaverseNextRequestContext } from './types'

const TRUSTED_STUDIO_HOSTS = new Set([
  'https://studio.weaverse.io',
  'https://studio.weaverse.dev',
])

function isLoopbackHostname(hostname: string): boolean {
  return (
    hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
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

function isTrustedStudioOrigin(
  origin: string,
  storefrontHostname: string
): boolean {
  if (TRUSTED_STUDIO_HOSTS.has(origin)) {
    return true
  }

  let hostname = new URL(origin).hostname
  return isLoopbackHostname(hostname) && isLoopbackHostname(storefrontHostname)
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

  let storefrontHostname = options.storefrontHostname ?? 'localhost'
  if (!isTrustedStudioOrigin(origin, storefrontHostname)) {
    return null
  }

  let framework = options.framework ?? 'hydrogen'
  let bundle = isDesignMode ? 'index.js' : 'preview.js'
  let version = last(searchParams, 'weaverseVersion')
  let url = `${origin}/static/studio/${framework}/${bundle}`
  return version ? `${url}?v=${encodeURIComponent(version)}` : url
}
