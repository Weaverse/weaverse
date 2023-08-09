export function getRequestQueries<T = Record<string, string | boolean>>(
  request: Request,
) {
  let url = new URL(request.url)
  return Array.from(url.searchParams.entries()).reduce(
    (q: Record<string, unknown>, [k, v]) => {
      q[k] = v === 'true' ? true : v === 'false' ? false : v
      return q
    },
    {},
  ) as T
}

/**
 * Check if the request is from Weaverse Studio.
 * @param request Request
 * @returns boolean
 */
export function studioCheck(request: Request) {
  let queries = getRequestQueries(request)
  let { weaverseProjectId, weaverseHost, isDesignMode, weaverseVersion } =
    queries
  return Boolean(
    isDesignMode && weaverseProjectId && weaverseHost && weaverseVersion,
  )
}
