import type { LoaderArgs } from '@shopify/remix-oxygen'
import { fetchWithServerCache } from './fetch'
import type {
  HydrogenComponent,
  HydrogenComponentData,
  HydrogenPageConfigs,
  WeaverseLoaderData,
  WeaverseLoaderConfigs,
  HydrogenPageData,
  HydrogenProjectType,
  HydrogenPageAssignment,
} from './types'
import { getRequestQueries } from './utils'

type FetchProjectPayload = {
  page: HydrogenPageData
  project: HydrogenProjectType
  pageAssignment: HydrogenPageAssignment
}

export async function weaverseLoader(
  args: LoaderArgs,
  components: HydrogenComponent[],
  loaderConfigs?: WeaverseLoaderConfigs
): Promise<WeaverseLoaderData | null> {
  try {
    let { request, context } = args
    let queries = getRequestQueries<Record<string, string>>(request)

    let { WEAVERSE_PROJECT_ID, WEAVERSE_HOST } = context?.env || {}
    let { weaverseProjectId, weaverseHost } = queries
    let projectId = weaverseProjectId || WEAVERSE_PROJECT_ID
    weaverseHost = weaverseHost || WEAVERSE_HOST || 'https://weaverse.io'

    if (!projectId) {
      throw new Error('Missing project id')
    }
    let configs: HydrogenPageConfigs = {
      projectId,
      weaverseHost,
      ...queries,
    }

    let res = await fetchWithServerCache({
      url: `${weaverseHost}/api/public/project`,
      options: {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          url: request.url,
          i18n: context?.storefront?.i18n,
          loaderConfigs,
        }),
      },
      context,
    })
    let payload: FetchProjectPayload = await res.json()
    let { page, project, pageAssignment } = payload
    if (!page || !project || !pageAssignment) {
      // @ts-ignore
      throw new Error(payload?.error || 'Invalid payload')
    }
    if (page?.items) {
      let items = page.items
      page.items = await Promise.all(
        items.map(async (itemData: HydrogenComponentData) => {
          let type = itemData.type
          let { loader } =
            components.find(({ schema }) => schema?.type === type) || {}
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
    console.log(`❌ Error fetching project data: ${err?.toString()}`)
    return null
  }
}
