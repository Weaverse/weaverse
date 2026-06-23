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

/**
 * Build the Hydrogen-like request info shape consumed by the Studio bridge.
 * Duplicate query keys keep the last value, matching `URLSearchParams` iteration
 * assignment and Hydrogen's practical query-object behavior.
 */
export function buildWeaverseNextRequestInfo(
  context?: WeaverseNextRequestContext
): WeaverseNextRequestInfo {
  let searchParams = getSearchParamsFromContext(context)
  let search = searchParams.toString()

  return {
    pathname: getPathnameFromContext(context),
    search: search ? `?${search}` : '',
    queries: toQueryRecord(searchParams),
    ...(context?.i18n ? { i18n: context.i18n } : {}),
  }
}
