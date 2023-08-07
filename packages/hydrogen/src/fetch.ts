import type { AppLoadContext } from '@shopify/remix-oxygen'
import { CacheShort, generateCacheControlHeader } from '@shopify/hydrogen'

type FetchWithServerCacheParams = {
  url: string
  options?: RequestInit | Request
  context: AppLoadContext
}

let cacheControl = generateCacheControlHeader(CacheShort())
/**
 * Fetch with server cache requires a storefront.cache instance which is Cloudflare Cache and a waitUntil function, otherwise it will just fetch the url.
 */
export async function fetchWithServerCache(params: FetchWithServerCacheParams) {
  let { url, options = {}, context } = params
  let { storefront, waitUntil } = context
  if (!storefront?.cache || !waitUntil) {
    return fetch(url, options)
  }
  let cacheUrl = new URL(url)
  cacheUrl.pathname = '/cache' + cacheUrl.pathname + hashKey([options.body])
  let cacheKey = new Request(cacheUrl.toString())

  // Check if there's a match for this key.
  let response = await storefront.cache.match(cacheKey)
  if (!response) {
    // Since there's no match, fetch a fresh response.
    response = await fetch(url, {
      ...options,
      headers: {
        'cache-control': cacheControl,
        ...options.headers,
      },
    })
    // Store the response in cache to be re-used the next time.
    waitUntil?.(storefront.cache.put(cacheKey, response.clone()))
  }
  return response
}

type QueryKey = string | readonly unknown[]

function hashKey(queryKey: QueryKey): string {
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
