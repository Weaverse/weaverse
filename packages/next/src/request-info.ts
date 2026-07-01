import type {
  WeaverseNextRequestContext,
  WeaverseNextRequestInfo,
} from './types'

function toUrl(value: string | URL): URL {
  return typeof value === 'string' ? new URL(value, 'http://localhost') : value
}

function getSearchParamsFromContext(
  context?: WeaverseNextRequestContext
): URLSearchParams {
  if (context?.searchParams) {
    return new URLSearchParams(context.searchParams)
  }

  if (context?.url) {
    let url = toUrl(context.url)
    return new URLSearchParams(url.searchParams)
  }

  return new URLSearchParams()
}

function getPathnameFromContext(context?: WeaverseNextRequestContext): string {
  if (context?.pathname) {
    return context.pathname
  }

  if (context?.url) {
    let url = toUrl(context.url)
    return url.pathname || '/'
  }

  return '/'
}

function coerceQueryValue(value: string): string | boolean {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  return value
}

function toQueryRecord(
  searchParams: URLSearchParams
): Record<string, string | boolean> {
  let queries: Record<string, string | boolean> = {}
  for (let [key, value] of searchParams.entries()) {
    queries[key] = coerceQueryValue(value)
  }
  return queries
}

const TRANSIENT_STUDIO_PARAMS = new Set([
  'weaverseDraftItem',
  // Legacy name from the original design-mode draft-item spike. Keep it out of
  // runtime requestInfo too, in case an older Builder bundle is in front of a
  // newer Next storefront.
  '__weaverseDraftItem',
])

function getRequestInfoSearchParams(
  context?: WeaverseNextRequestContext
): URLSearchParams {
  let searchParams = new URLSearchParams(getSearchParamsFromContext(context))
  for (let key of TRANSIENT_STUDIO_PARAMS) {
    searchParams.delete(key)
  }
  return searchParams
}

/**
 * Build the Hydrogen-like request info shape consumed by the Studio bridge.
 * Duplicate query keys keep the last value, matching `URLSearchParams` iteration
 * assignment and Hydrogen's practical query-object behavior.
 */
export function buildWeaverseNextRequestInfo(
  context?: WeaverseNextRequestContext
): WeaverseNextRequestInfo {
  let searchParams = getRequestInfoSearchParams(context)
  let search = searchParams.toString()

  return {
    pathname: getPathnameFromContext(context),
    search: search ? `?${search}` : '',
    queries: toQueryRecord(searchParams),
    ...(context?.i18n ? { i18n: context.i18n } : {}),
  }
}
