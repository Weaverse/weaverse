import type { LoaderArgs } from '@shopify/remix-oxygen'
type QueryKey = string | readonly unknown[]
import { CacheShort, generateCacheControlHeader } from '@shopify/hydrogen'

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
let cacheControl = generateCacheControlHeader(CacheShort())
export let fetchWithServerCache = async ({
  url,

  options = {},
  storefront,
  waitUntil,
}: {
  url: string
  options: RequestInit | Request
  storefront: any
  waitUntil?: any
}) => {
  const cacheUrl = new URL(url)
  cacheUrl.pathname = '/cache' + cacheUrl.pathname + hashKey([options.body])
  const cacheKey = new Request(cacheUrl.toString())
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
export type WeaverseComponentLoaderArgs = LoaderArgs & {
  data: any
  config: { projectId: string; weaverseHost: string }
}

export function getRequestQueries<T = Record<string, string>>(
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

export async function weaverseLoader(
  {
    request,
    context: { env, storefront, waitUntil },
    context,
    params,
  }: LoaderArgs,
  components: {
    [key: string]: {
      [key: string]: any
      loader?: (loaderArgs: WeaverseComponentLoaderArgs) => Promise<any>
    }
  }
): Promise<any> {
  let queries = getRequestQueries(request)
  let projectId = env?.WEAVERSE_PROJECT_ID
  let weaverseHost = env?.WEAVERSE_HOST
  if (!projectId || !weaverseHost) {
    console.error('WEAVERSE_PROJECT_ID or WEAVERSE_HOST is not set!')
    return {}
  }
  let config = {
    projectId,
    weaverseHost,
    ...queries,
  }
  try {
    /**
     * @todo read the url and params from the request => JSON DATA (items, installed add-ons)
     * @todo load the weaverse project page data by current url and projectId
     * @todo read the page data to detech whether items data need 3rd party api call (shopify data, etc)
     * @todo with data from Shopify, we can get it by using context.storefront.query(graphqlQuery)
     * @todo if items data need 3rd party api call, call the api and return the data
     * @todo the returned data format will be {weaversePageData: {}, 3rdPartyData: {}, products: [], collections: [], product: {}, collection: {}, etc}
     */
    let pageData = await fetchWithServerCache({
      url: `${weaverseHost}/api/public/project`,
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          url: request.url,
        }),
      },
      storefront,
      waitUntil,
    })
      .then((r) => r.json())
      .catch((err) => {
        console.log(`❌ Error fetching page data: ${err?.toString()}`)
        return {}
      })
    if (pageData?.items) {
      let items = pageData.items
      pageData.items = await Promise.all(
        items.map(async (item: any) => {
          console.log('👉 --------> - item123:', item)
          let loader = components[item.type]?.loader
          if (loader) {
            return {
              ...item,
              loaderData: await loader({
                data: item,
                context,
                params,
                request,
                config,
              }),
            }
          }
          return item
        })
      )
    }
    return {
      pageData,
      config,
      components: {},
    }
  } catch (err) {
    console.error(err)
    return {}
  }
}
