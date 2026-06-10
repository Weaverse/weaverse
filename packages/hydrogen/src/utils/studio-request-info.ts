import type { WeaverseHydrogenParams } from '../types'

interface BrowserLocationLike {
  pathname: string
  search: string
}

function getBrowserLocation(): BrowserLocationLike | undefined {
  if (typeof window === 'undefined') {
    return
  }
  return window.location
}

function getQueriesFromSearch(
  search: string
): Record<string, string | boolean> {
  let queries: Record<string, string | boolean> = {}
  let params = new URLSearchParams(search)
  for (let [key, value] of params.entries()) {
    if (value === 'true') {
      queries[key] = true
    } else if (value === 'false') {
      queries[key] = false
    } else {
      queries[key] = value
    }
  }
  return queries
}

/**
 * React Router v7 single-fetch revalidation can render client data returned
 * from a `*.data` request while the browser is still on the canonical URL.
 * Instance identity must follow the browser URL, not the transient data
 * endpoint, otherwise the SDK creates a fresh Weaverse instance mid-session:
 * in design mode that drops the existing Studio bridge/interactions, and in
 * the live theme it resets every section's runtime state after any
 * revalidation (cart mutations, locale switches, `revalidate()`). See #451.
 */
export function normalizeRequestInfo(
  params: WeaverseHydrogenParams,
  browserLocation: BrowserLocationLike | undefined = getBrowserLocation()
): WeaverseHydrogenParams {
  if (!browserLocation) {
    return params
  }

  let { pathname, search } = browserLocation
  if (
    params.requestInfo.pathname === pathname &&
    params.requestInfo.search === search
  ) {
    return params
  }

  return {
    ...params,
    requestInfo: {
      ...params.requestInfo,
      pathname,
      queries: getQueriesFromSearch(search),
      search,
    },
  }
}
