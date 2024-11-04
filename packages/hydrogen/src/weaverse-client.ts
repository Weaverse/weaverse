import {
  type HydrogenEnv,
  createWithCache,
  generateCacheControlHeader,
} from '@shopify/hydrogen'
import type {
  AllCacheOptions,
  FetchProjectPayload,
  FetchProjectRequestBody,
  FetchWithCacheOptions,
  HydrogenComponentData,
  HydrogenPageData,
  LoadPageParams,
  WeaverseClientArgs,
  WeaverseLoaderData,
  WeaverseProjectConfigs,
  WeaverseStudioQueries,
} from './types'
import {
  generateDataFromSchema,
  getRequestQueries,
  getWeaverseConfigs,
} from './utils'

export class WeaverseClient {
  API = 'api/public'
  basePageConfigs: Omit<WeaverseProjectConfigs, 'requestInfo'>
  basePageRequestBody: Omit<FetchProjectRequestBody, 'url' | 'countries'>
  configs: WeaverseProjectConfigs
  withCache: ReturnType<typeof createWithCache>

  request: WeaverseClientArgs['request']
  storefront: WeaverseClientArgs['storefront']
  components: WeaverseClientArgs['components']
  themeSchema: WeaverseClientArgs['themeSchema']
  env: WeaverseClientArgs['env']
  cache: WeaverseClientArgs['cache']
  waitUntil: WeaverseClientArgs['waitUntil']
  countries?: WeaverseClientArgs['countries']

  constructor(args: WeaverseClientArgs) {
    let {
      env,
      storefront,
      components,
      countries,
      cache,
      waitUntil,
      themeSchema,
      request,
    } = args
    this.request = request
    this.storefront = storefront
    this.components = components
    this.themeSchema = themeSchema
    this.env = env
    this.cache = cache
    this.waitUntil = waitUntil
    this.countries = countries
    this.withCache = createWithCache({ cache, waitUntil, request })

    this.configs = getWeaverseConfigs(request, env as HydrogenEnv)

    this.basePageConfigs = {
      projectId: this.configs.projectId,
      weaverseHost: this.configs.weaverseHost,
      weaverseApiKey: this.configs.weaverseApiKey,
      weaverseVersion: this.configs.weaverseVersion,
      isDesignMode: this.configs.isDesignMode,
    }
    this.basePageRequestBody = {
      isDesignMode: this.configs.isDesignMode,
      i18n: storefront.i18n,
      projectId: this.configs.projectId,
    }
  }

  fetchWithCache = async <T>(
    url: string,
    options: FetchWithCacheOptions = {},
  ) => {
    let cacheKey = [url, options.body]
    let {
      strategy = this.storefront.CacheCustom({
        maxAge: 1,
        sMaxAge: 1,
        staleWhileRevalidate: 82800,
      }),
      ...reqInit
    } = options
    if (this.configs.isDesignMode) {
      try {
        const res = await fetch(url, reqInit)
        return await res.json<T>()
      } catch (err) {
        throw new Error(`Failed to fetch data from ${url}`, { cause: err })
      }
    }
    let res = this.withCache(cacheKey, strategy, async () => {
      let response = await fetch(url, {
        ...reqInit,
        headers: {
          'Cache-Control': generateCacheControlHeader(strategy),
          ...reqInit.headers,
        },
      })
      if (!response.ok) {
        let error = await response.text()
        let { status, statusText } = response
        throw new Error(`${status} ${statusText} ${error}`, { cause: error })
      }
      return await response.json<T>()
    })
    return res as Promise<T>
  }

  loadThemeSettings = async (strategy?: AllCacheOptions) => {
    try {
      let { API, configs } = this
      let { weaverseHost, projectId, isDesignMode } = configs
      if (!projectId) {
        throw new Error('Missing Weaverse projectId!')
      }
      let url = `${weaverseHost}/${API}/project_configs`
      let res: any
      let body = JSON.stringify({ isDesignMode, projectId })
      if (isDesignMode) {
        res = await fetch(url, { method: 'POST', body }).then((res) =>
          res.json(),
        )
      } else {
        res = await this.fetchWithCache(url, { method: 'POST', strategy, body })
      }
      let data: any = res || {}
      if (data?.theme && this.themeSchema?.inspector) {
        let defaultThemeSettings = {}
        if (this.themeSchema) {
          defaultThemeSettings = generateDataFromSchema(this.themeSchema)
        }
        data.theme = {
          ...defaultThemeSettings,
          ...data.theme,
        }
      }
      if (this.configs.isDesignMode) {
        data = {
          ...data,
          schema: this.themeSchema,
          countries: this.countries || [],
          publicEnv: this.configs.publicEnv,
        }
      }
      return data
    } catch (e) {
      console.error('❌ Theme settings load failed.', e)
      return null
    }
  }

  generateFallbackPage = (message: string): HydrogenPageData => {
    let rootId = crypto.randomUUID()
    return {
      id: `fallback_page_${Date.now()}`,
      rootId,
      name: 'Default Page',
      items: [
        {
          type: 'main',
          id: rootId,
          data: { dangerouslySetInnerHTML: { __html: message } },
        },
      ],
    }
  }

  loadPage = async (
    params: LoadPageParams = {},
  ): Promise<WeaverseLoaderData | null> => {
    try {
      let { request, storefront, basePageRequestBody, basePageConfigs } = this
      let { projectId, isDesignMode, weaverseHost } = this.configs

      if (!projectId) {
        throw new Error('Missing Weaverse projectId!')
      }

      let { strategy, ...pageLoadParams } = params
      let body: FetchProjectRequestBody = {
        ...basePageRequestBody,
        params: pageLoadParams,
        url: request.url,
      }

      let reqInit: RequestInit = {
        method: 'POST',
        body: JSON.stringify(body),
      }
      let url = `${weaverseHost}/${this.API}/project`
      let payload: FetchProjectPayload

      if (isDesignMode) {
        payload = await fetch(url, reqInit).then((res) => res.json())
      } else {
        payload = await this.fetchWithCache(url, {
          ...reqInit,
          strategy,
        })
      }

      if (payload?.error) {
        throw new Error(payload?.error)
      }
      let { page, project, pageAssignment } = payload
      if (!project) {
        throw new Error(`Weaverse project not found. Id: ${projectId}`)
      }
      if (!page) {
        page = this.generateFallbackPage('Please add new section to start.')
      }
      if (page?.items) {
        let items = page.items
        page.items = await Promise.all(items.map(this.execComponentLoader))
      }
      return {
        page,
        project,
        pageAssignment,
        configs: {
          ...basePageConfigs,
          requestInfo: {
            i18n: storefront.i18n,
            // TODO: @hta218 - migrate to Remix hooks
            queries: getRequestQueries<WeaverseStudioQueries>(request),
            pathname: new URL(request.url).pathname,
            search: new URL(request.url).search,
          },
        },
      }
    } catch (e) {
      // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
      console.error(`❌ Page load failed.`, e)
      throw e
    }
  }

  execComponentLoader = async (item: HydrogenComponentData) => {
    let { data = {}, type, id } = item
    let component = this.components.find(({ schema }) => schema?.type === type)
    let loader = component?.loader
    if (typeof loader === 'function') {
      try {
        return {
          ...item,
          loaderData: await Promise.resolve(
            loader({
              data: { ...generateDataFromSchema(component.schema), ...data },
              weaverse: this,
            }),
          ),
        }
      } catch (e) {
        console.warn('❌ Item loader run failed.', type, id, e)
        return item
      }
    }
    return item
  }
}
