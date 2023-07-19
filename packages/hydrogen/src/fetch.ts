import type { AppLoadContext } from '@shopify/remix-oxygen'
import { CacheShort, generateCacheControlHeader } from '@shopify/hydrogen'
import { hashKey } from './utils'

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
