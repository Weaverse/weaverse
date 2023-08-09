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
  loaderConfigs?: WeaverseLoaderConfigs,
): Promise<WeaverseLoaderData | null> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      let { request, context, params } = args
      let i18n = context?.storefront?.i18n
      let queries =
        getRequestQueries<Omit<HydrogenPageConfigs, 'requestInfo'>>(request)

      let { WEAVERSE_PROJECT_ID, WEAVERSE_HOST } = context?.env || {}
      let { weaverseProjectId, weaverseHost, weaverseVersion, isDesignMode } =
        queries
      let projectId = weaverseProjectId || WEAVERSE_PROJECT_ID
      weaverseHost = weaverseHost || WEAVERSE_HOST || 'https://weaverse.io'

      if (!projectId) {
        throw new Error(
          `Missing Weaverse project's id. Try adding WEAVERSE_PROJECT_ID to your .env file then restart the server.`,
        )
      }
      let configs: HydrogenPageConfigs = {
        projectId,
        weaverseHost,
        weaverseVersion,
        isDesignMode,
        requestInfo: {
          i18n,
          params,
          queries,
          pathname: new URL(request.url).pathname,
          search: new URL(request.url).search,
        },
      }

      let payload = await fetchWithServerCache({
        url: `${weaverseHost}/api/public/project`,
        options: {
          method: 'POST',
          body: JSON.stringify({
            i18n,
            projectId,
            loaderConfigs,
            url: request.url,
          }),
        },
        context,
      })
      let { page, project, pageAssignment } = payload
      if (!page || !project || !pageAssignment) {
        throw new Error(
          // @ts-ignore
          payload?.error || 'Invalid Weaverse project payload!',
        )
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
          }),
        )
      }
      resolve({ page, configs, project, pageAssignment })
    } catch (err) {
      console.log(`❌ Error fetching project data: ${err?.toString()}`)
      reject(err)
    }
  })
}
