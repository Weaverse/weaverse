import type { createWithCache } from '@shopify/hydrogen'
import { type Storefront } from '@shopify/hydrogen'
import type { LoaderArgs } from '@shopify/remix-oxygen'
import pkg from '../package.json'
import type {
  AllCacheOptions,
  FetchProjectPayload,
  FetchProjectRequestBody,
  FetchWithCacheOptions,
  HydrogenComponent,
  HydrogenComponentData,
  HydrogenThemeSchema,
  I18nLocale,
  Localizations,
  PageLoadParams,
  WeaverseClientArgs,
  WeaverseLoaderData,
  WeaverseProjectConfigs,
  WeaverseStudioQueries,
} from './types'
import { getRequestQueries } from './utils'

export class WeaverseClient {
  API = 'api/public/project'
  clientVersion = pkg.version
  storefront: Storefront<I18nLocale>
  components: HydrogenComponent[]
  countries: Localizations
  themeSchema: HydrogenThemeSchema
  configs: WeaverseProjectConfigs
  basePageConfigs: Omit<WeaverseProjectConfigs, 'requestInfo'>
  basePageRequestBody: Omit<FetchProjectRequestBody, 'url'>
  withCache: ReturnType<typeof createWithCache>

  constructor(args: WeaverseClientArgs) {
    let { configs, storefront, components, countries, withCache, themeSchema } =
      args
    this.storefront = storefront
    this.components = components
    this.countries = countries
    this.themeSchema = themeSchema
    this.configs = configs
    this.withCache = withCache
    this.basePageConfigs = {
      projectId: configs.projectId,
      weaverseHost: configs.weaverseHost,
      weaverseVersion: configs.weaverseVersion,
      isDesignMode: configs.isDesignMode,
    }
    this.basePageRequestBody = {
      countries,
      isDesignMode: this.configs.isDesignMode,
      i18n: storefront.i18n,
      projectId: this.configs.projectId,
    }
  }

  fetchWithCache = <T>(url: string, options: FetchWithCacheOptions) => {
    let cacheKey = [url, options.body]
    let { strategy = this.storefront.CacheShort(), ...reqInit } = options
    let res = this.withCache(cacheKey, strategy, async () => {
      let response = await fetch(url, reqInit)
      if (!response.ok) {
        throw new Error('Something went wrong. Skipping cache.')
      }
      return await response.json<T>()
    })
    return res as Promise<T>
  }

  loadThemeSettings = async (strategy?: AllCacheOptions) => {
    let { API, configs } = this
    let { weaverseHost, projectId } = configs
    let res = await this.fetchWithCache<{ ok: boolean; payload: any }>(
      `${weaverseHost}/${API}/${projectId}/configs`,
      { strategy },
    )
    let data = null
    if (res.ok) {
      data = res.payload
      if (this.configs.isDesignMode) {
        data = {
          ...data,
          schema: this.themeSchema,
          countries: this.countries,
          publicEnv: this.configs.publicEnv,
        }
      }
    }
    return data
  }

  loadPage = async (
    args: LoaderArgs,
    configs: PageLoadParams & { strategy?: AllCacheOptions } = {},
  ): Promise<WeaverseLoaderData | null> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let { request, params } = args
        let { strategy, ...pageLoadParams } = configs
        let body: FetchProjectRequestBody = {
          ...this.basePageRequestBody,
          params: pageLoadParams,
          url: request.url,
        }
        let reqInit: RequestInit = {
          method: 'POST',
          body: JSON.stringify(body),
        }
        let url = `${this.configs.weaverseHost}/api/public/project`
        let payload: FetchProjectPayload
        if (this.configs.isDesignMode) {
          payload = await fetch(url, reqInit).then((res) => res.json())
        } else {
          payload = await this.fetchWithCache(url, {
            ...reqInit,
            strategy,
          })
        }
        let { page, project, pageAssignment } = payload
        if (!page || !project || !pageAssignment) {
          return reject(
            new Error(
              // @ts-ignore
              payload?.error || 'Invalid Weaverse project payload!',
            ),
          )
        }
        if (page?.items) {
          let items = page.items
          page.items = await Promise.all(
            items.map((item) => this.execComponentLoader(item, args)),
          )
        }
        let data: WeaverseLoaderData = {
          page,
          project,
          pageAssignment,
          configs: {
            ...this.basePageConfigs,
            requestInfo: {
              params,
              i18n: this.storefront.i18n,
              queries: getRequestQueries<WeaverseStudioQueries>(request),
              pathname: new URL(request.url).pathname,
              search: new URL(request.url).search,
            },
          },
        }
        return resolve(data)
      } catch (err) {
        console.log(`❌ [Weaverse page]`, err)
        reject(err)
      }
    })
  }

  execComponentLoader = async (
    item: HydrogenComponentData,
    args: LoaderArgs,
  ) => {
    let schema = this.components.find(
      ({ schema }) => schema?.type === item.type,
    )
    let { loader } = schema || {}
    if (loader && typeof loader === 'function') {
      try {
        return {
          ...item,
          loaderData: await loader({
            itemData: item,
            ...args,
          }),
        }
      } catch (err) {
        console.log(`❌ [Weaverse item loader]`, item.id, err)
        return item
      }
    }
    return item
  }
}

export function createWeaverseClient(args: WeaverseClientArgs) {
  return new WeaverseClient(args)
}
