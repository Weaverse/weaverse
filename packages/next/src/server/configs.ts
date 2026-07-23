import type {
  WeaverseNextBaseConfigs,
  WeaverseNextRequestContext,
} from '../types'

const DEFAULT_WEAVERSE_HOST = 'https://studio.weaverse.io'
const DEFAULT_WEAVERSE_API_BASE = 'https://api.weaverse.io'

/**
 * Weaverse-controlled apex domains the Studio bridge / data API may be served
 * from (matched on the host itself and any subdomain). Kept in sync with
 * Hydrogen's `isTrustedStudioHost`.
 */
const TRUSTED_STUDIO_DOMAINS = ['weaverse.io', 'weaverse.dev']

/**
 * Whether `host` is an origin we trust to resolve page/theme data. The
 * `weaverseHost` query param is attacker-controllable, so a crafted
 * `?weaverseHost=` must be rejected before it can point server-side fetches at
 * an arbitrary origin (SSRF). Only `weaverse.io`/`weaverse.dev` and subdomains
 * over https are trusted.
 */
function isTrustedStudioHost(host: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(host)
  } catch {
    return false
  }
  if (parsed.protocol !== 'https:') {
    return false
  }
  let { hostname } = parsed
  return TRUSTED_STUDIO_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  )
}

function toUrl(value: string | URL): URL | null {
  try {
    return typeof value === 'string'
      ? new URL(value, 'http://localhost')
      : value
  } catch {
    return null
  }
}

/**
 * Extract the request search params from the explicit Next request context.
 * Prefers `searchParams`, falls back to parsing `url`.
 */
export function getContextSearchParams(
  context?: WeaverseNextRequestContext
): URLSearchParams {
  if (context?.searchParams) {
    return new URLSearchParams(context.searchParams)
  }
  if (context?.url) {
    let url = toUrl(context.url)
    if (url) {
      return new URLSearchParams(url.searchParams)
    }
  }
  return new URLSearchParams()
}

/**
 * Last value of a (possibly duplicated) query key. Matches Hydrogen's
 * `getRequestQueries`, which assigns while iterating and so keeps the last
 * occurrence — Studio appends its own control params, so a stale earlier value
 * must not win.
 */
function lastParam(
  searchParams: URLSearchParams,
  key: string
): string | undefined {
  let values = searchParams.getAll(key)
  return values.length ? values.at(-1) : undefined
}

function coerceBool(value: string | undefined): boolean {
  return value === 'true'
}

function readEnv(
  env: Record<string, string | undefined> | undefined,
  key: string
): string | undefined {
  let fromConfig = env?.[key]
  if (fromConfig !== undefined) {
    return fromConfig
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key]
  }
  return
}

/** Overrides used while resolving request-scoped Weaverse configuration. */
export interface ResolveConfigsOptions {
  /** Environment values; missing keys fall back to `process.env`. */
  env?: Record<string, string | undefined>
  /** Public data API base override. */
  weaverseApiBase?: string
  /** Studio origin override. */
  weaverseHost?: string
  /** Studio asset version override. */
  weaverseVersion?: string
}

/**
 * Derive Weaverse configs from the request context and env, close to Hydrogen's
 * `getWeaverseConfigs`. Resolves the trusted host, public API base, design /
 * preview / revision flags, and public env — but never resolves the final
 * `projectId` (that priority chain, which may call an async resolver, lives in
 * the server client). Query/env projectId candidates are returned for the
 * client to combine with function/string inputs.
 */
export function getWeaverseNextConfigs(
  context?: WeaverseNextRequestContext,
  options: ResolveConfigsOptions = {}
): WeaverseNextBaseConfigs {
  let searchParams = getContextSearchParams(context)
  let { env } = options

  let queryHost = lastParam(searchParams, 'weaverseHost')
  // A trusted query host is canonicalized to its origin before use, so a crafted
  // `?weaverseHost=https://studio.weaverse.io/evil?x=1` can only ever resolve to
  // `https://studio.weaverse.io` — never carrying an attacker path/query into the
  // server-side API base.
  let trustedUrlHost =
    queryHost && isTrustedStudioHost(queryHost) ? new URL(queryHost).origin : ''

  let configuredHost =
    options.weaverseHost || readEnv(env, 'WEAVERSE_HOST') || ''
  let weaverseHost = trustedUrlHost || configuredHost || DEFAULT_WEAVERSE_HOST

  // Public data reads default to the edge proxy, but an explicit custom host
  // (staging/self-hosted Weaverse) must stay the API base so those deployments
  // don't fetch page/config data from the production proxy.
  let weaverseApiBase =
    trustedUrlHost ||
    options.weaverseApiBase ||
    readEnv(env, 'WEAVERSE_PUBLIC_API_BASE') ||
    (configuredHost && configuredHost !== DEFAULT_WEAVERSE_HOST
      ? configuredHost
      : DEFAULT_WEAVERSE_API_BASE)

  let isRevisionPreview =
    context?.isRevisionPreview ?? searchParams.has('__revisionId')
  let isDesignMode =
    context?.isDesignMode ?? coerceBool(lastParam(searchParams, 'isDesignMode'))
  let isPreviewMode =
    context?.isPreviewMode ??
    coerceBool(lastParam(searchParams, 'isPreviewMode'))

  return {
    queryProjectId: lastParam(searchParams, 'weaverseProjectId') || '',
    envProjectId: readEnv(env, 'WEAVERSE_PROJECT_ID') || '',
    weaverseHost,
    weaverseApiBase,
    weaverseApiKey:
      lastParam(searchParams, 'weaverseApiKey') ||
      readEnv(env, 'WEAVERSE_API_KEY') ||
      '',
    weaverseVersion:
      lastParam(searchParams, 'weaverseVersion') ||
      options.weaverseVersion ||
      '',
    isDesignMode,
    isPreviewMode,
    isRevisionPreview,
    sectionType:
      context?.sectionType || lastParam(searchParams, 'sectionType') || '',
    publicEnv: {
      PUBLIC_STORE_DOMAIN: readEnv(env, 'PUBLIC_STORE_DOMAIN') || '',
      PUBLIC_STOREFRONT_API_TOKEN:
        readEnv(env, 'PUBLIC_STOREFRONT_API_TOKEN') || '',
    },
  }
}
