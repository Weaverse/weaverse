/** In-memory Web Cache API stand-in for Hydrogen's cached fetch in tests. */
export function createMemoryCache(): Pick<Cache, 'match' | 'put' | 'delete'> {
  let entries = new Map<string, Response>()
  let keyOf = (request: RequestInfo | URL) =>
    request instanceof Request ? request.url : String(request)
  return {
    match: async (request) => entries.get(keyOf(request))?.clone(),
    put: async (request, response) => {
      entries.set(keyOf(request), response.clone())
    },
    delete: async (request) => entries.delete(keyOf(request)),
  }
}
