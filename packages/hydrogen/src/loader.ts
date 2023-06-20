import type { LoaderArgs } from '@shopify/remix-oxygen'
import { fetchWithServerCache } from './fetch'
import type {
  HydrogenComponent,
  HydrogenPageConfigs,
  HydrogenPageData,
} from './types'
import { getRequestQueries } from './utils'

export async function weaverseLoader(
  args: LoaderArgs,
  components: Record<string, HydrogenComponent>
): Promise<HydrogenPageData | null> {
  let { request, context, params } = args
  let {
    env,
    storefront: { i18n },
  } = context
  let queries = getRequestQueries(request)
  let projectId = queries?.projectId || env?.WEAVERSE_PROJECT_ID
  let weaverseHost = env?.WEAVERSE_HOST || 'https://weaverse.io'
  if (!projectId) {
    console.log('❌ Missing `projectId`!')
    return null
  }
  let configs: HydrogenPageConfigs = {
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
    let projectAPI = `${weaverseHost}/api/public/project`
    let url = request.url
    let page = await fetchWithServerCache({
      url: projectAPI,
      options: {
        method: 'POST',
        body: JSON.stringify({ projectId, url, i18n }),
      },
      context,
    })
      .then((r) => r.json())
      .catch((err) => {
        console.log(`❌ Error fetching project data: ${err?.toString()}`)
        return {}
      })

    if (page?.items) {
      let items = page.items
      page.items = await Promise.all(
        items.map(async (item: any) => {
          let loader = components[item.type]?.loader
          if (loader && typeof loader === 'function') {
            try {
              return {
                ...item,
                loaderData: await loader({
                  data: item,
                  context,
                  params,
                  request,
                  configs,
                }),
              }
            } catch (err) {
              console.log(`❌ Loader run failed! Item: ${item}: ${err}`)
              return item
            }
          }
          return item
        })
      )
    }
    return { page, configs }
  } catch (err) {
    console.log(`❌ Error fetching Weaverse data: ${err?.toString()}`)
    return null
  }
}
