type QueryKey = string | readonly unknown[]

export function hashKey(queryKey: QueryKey): string {
  const rawKeys = Array.isArray(queryKey) ? queryKey : [queryKey]
  let hash = ''

  // Keys from `storefront.query` are in the following shape:
  // ['prefix', 'api-endpoint', {body:'query',headers:{}}]
  // Since the API endpoint already contains the shop domain and api version,
  // we can ignore the headers and only use the `body` from the payload.
  for (const key of rawKeys) {
    if (key != null) {
      if (typeof key === 'object') {
        // Queries from useQuery might not have a `body`. In that case,
        // fallback to a safer (but slower) stringify.
        if (!!key.body && typeof key.body === 'string') {
          hash += key.body
        } else {
          hash += JSON.stringify(key)
        }
      } else {
        hash += key
      }
    }
  }

  return hash
}

export function getRequestQueries<T = Record<string, string | boolean>>(
  request: Request
) {
  let url = new URL(request.url)
  return Array.from(url.searchParams.entries()).reduce(
    (q: Record<string, unknown>, [k, v]) => {
      q[k] = v === 'true' ? true : v === 'false' ? false : v
      return q
    },
    {}
  ) as T
}
