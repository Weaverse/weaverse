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
 * React Router v7 single-fetch revalidation can render client data returned from
 * a `/_root.data` request while the browser is still on the merchant-facing
 * preview URL. In design mode, Studio instance identity must follow the browser
 * URL, not the transient data endpoint, otherwise the SDK creates a fresh
 * Weaverse instance without the existing Studio bridge/interactions attached.
 */
export function normalizeDesignModeRequestInfo(
  params: WeaverseHydrogenParams,
  browserLocation: BrowserLocationLike | undefined = getBrowserLocation()
): WeaverseHydrogenParams {
  if (!(params.isDesignMode && browserLocation)) {
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
