import type { LoaderArgs } from '@shopify/remix-oxygen'
import { fetchWithServerCache } from './fetch'
import type {
  HydrogenComponent,
  HydrogenPageConfigs,
  HydrogenPageData,
  WeaverseLoaderConfigs,
} from './types'
import { getRequestQueries } from './utils'

export async function weaverseLoader(
  args: LoaderArgs,
  components: Record<string, HydrogenComponent>,
  loaderConfigs: WeaverseLoaderConfigs = {}
): Promise<HydrogenPageData | null> {
  let { request, context } = args
  let queries = getRequestQueries(request)

  let { WEAVERSE_PROJECT_ID, WEAVERSE_HOST } = context?.env || {}
  let { weaverseProjectId, weaverseHost: hostInQueries } = queries
  let projectId = weaverseProjectId || WEAVERSE_PROJECT_ID
  let weaverseHost = hostInQueries || WEAVERSE_HOST || 'https://weaverse.io'

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
    let { page, project, pageAssignment } = await fetchWithServerCache({
      url: `${weaverseHost}/api/public/project`,
      options: {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          url: request.url,
          i18n: context?.storefront?.i18n,
          ...loaderConfigs,
        }),
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
        items.map(async (itemData: any) => {
          let loader = components[itemData.type]?.loader
          if (loader && typeof loader === 'function') {
            try {
              return {
                ...itemData,
                loaderData: await loader({
                  itemData,
                  configs,
                  ...args,
                }),
              }
            } catch (err) {
              console.log(`❌ Loader run failed! Item: ${itemData}: ${err}`)
              return itemData
            }
          }
          return itemData
        })
      )
    }
    return { page, configs, project, pageAssignment }
  } catch (err) {
    console.log(`❌ Error fetching Weaverse data: ${err?.toString()}`)
    return null
  }
}
