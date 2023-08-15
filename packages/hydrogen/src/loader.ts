import type { LoaderArgs } from '@shopify/remix-oxygen'
import { fetchWithServerCache } from './fetch'
import type {
  FetchProjectRequestBody,
  HydrogenComponent,
  HydrogenComponentData,
  HydrogenPageConfigs,
  I18nLocale,
  Localizations,
  WeaverseLoaderConfigs,
  WeaverseLoaderData,
} from './types'
import { getRequestQueries } from './utils'

export async function weaverseLoader(
  args: LoaderArgs,
  components: HydrogenComponent[],
  countries: Localizations,
  loaderConfigs?: WeaverseLoaderConfigs,
): Promise<WeaverseLoaderData | null> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      let { request, context, params } = args
      let queries =
        getRequestQueries<Omit<HydrogenPageConfigs, 'requestInfo'>>(request)
      let { WEAVERSE_PROJECT_ID, WEAVERSE_HOST } = context?.env || {}
      let { weaverseProjectId, weaverseHost, isDesignMode, weaverseVersion } =
        queries
      let projectId = weaverseProjectId || WEAVERSE_PROJECT_ID
      weaverseHost = weaverseHost || WEAVERSE_HOST || 'https://weaverse.io'

      if (!projectId) {
        throw new Error(
          `Missing Weaverse project's id. Try adding WEAVERSE_PROJECT_ID to your .env file then restart the server.`,
        )
      }

      let i18n: I18nLocale = context?.storefront?.i18n
      let reqBody: FetchProjectRequestBody = {
        isDesignMode,
        i18n,
        countries,
        projectId,
        loaderConfigs,
        url: request.url,
      }
      let url = `${weaverseHost}/api/public/project`
      let payload
      if (isDesignMode) {
        payload = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(reqBody),
        }).then((res) => res.json())
      } else {
        payload = await fetchWithServerCache({
          url,
          options: { method: 'POST', body: JSON.stringify(reqBody) },
          context,
        })
      }
      let { page, project, pageAssignment } = payload
      if (!page || !project || !pageAssignment) {
        throw new Error(
          // @ts-ignore
          payload?.error || 'Invalid Weaverse project payload!',
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
      if (page?.items) {
        let items = page.items
        page.items = await withLoaderData(items, components, configs, args)
      }
      resolve({ page, configs, project, pageAssignment })
    } catch (err) {
      console.log(`❌ Error fetching project data: ${err?.toString()}`)
      reject(err)
    }
  })
}

async function withLoaderData(
  items: HydrogenComponentData[],
  components: HydrogenComponent[],
  configs: HydrogenPageConfigs,
  args: LoaderArgs,
) {
  return await Promise.all(
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
