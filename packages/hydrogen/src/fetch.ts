import type { AppLoadContext } from '@shopify/remix-oxygen'
import { createWithCache } from '@shopify/hydrogen'

type FetchWithServerCacheParams = {
  url: string
  options?: RequestInit | Request
  context: AppLoadContext
}

/**
 * Fetch with server cache requires a storefront.cache instance which is Cloudflare Cache and a waitUntil function, otherwise it will just fetch the url.
 */
export async function fetchWithServerCache(
  params: FetchWithServerCacheParams,
): Promise<any> {
  let { url, options = {}, context } = params
  let { storefront } = context
  let withCache = createWithCache(storefront)
  let cacheKey = [url, options.body]
  let data = await withCache(cacheKey, storefront.CacheShort(), async () => {
    let response = await fetch(url, options)

    /** Thrown errors behave like any other error in a Remix loader */
    if (!response.ok) throw new Error('Something went wrong. Skipping cache.')
    return await response.json()
  })

  return data
}
