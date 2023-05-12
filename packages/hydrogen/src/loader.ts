import type { LoaderArgs } from '@shopify/remix-oxygen'
import { fetchWithServerCache } from './fetch'
import { getRequestQueries } from './utils'

export type WeaverseLoaderArgs = LoaderArgs & {
  data: any
  config: { projectId: string; weaverseHost: string }
}

export async function weaverseLoader(
  args: LoaderArgs,
  components: {
    [key: string]: {
      [key: string]: any
      loader?: (args: WeaverseLoaderArgs) => Promise<unknown>
    }
  }
): Promise<unknown> {
  let { request, context, params } = args
  let { env, storefront, waitUntil } = context
  let queries = getRequestQueries(request)
  let projectId = env?.WEAVERSE_PROJECT_ID
  let weaverseHost = env?.WEAVERSE_HOST
  if (!projectId || !weaverseHost) {
    console.log('❌ Missing `WEAVERSE_PROJECT_ID` or `WEAVERSE_HOST`!')
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
        console.log(`❌ Error fetching project data: ${err?.toString()}`)
        return {}
      })

    if (pageData?.items) {
      let items = pageData.items
      pageData.items = await Promise.all(
        items.map(async (item: any) => {
          let loader = components[item.type]?.loader
          if (loader && typeof loader === 'function') {
            return {
              ...item,
              loaderData: await loader({
                data: item,
                context,
                params,
                request,
                config,
              }).catch((e) => {
                console.log(
                  `❌ Loader run failed! Item: ${item.type}: ${e?.toString()}`
                )
                return {}
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
    console.log(`❌ Error fetching Weaverse data: ${err?.toString()}`)
    return {}
  }
}
