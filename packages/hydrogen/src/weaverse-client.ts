import {
  createWithCache,
  generateCacheControlHeader,
  type HydrogenEnv,
  type I18nBase,
} from '@shopify/hydrogen'
import type {
  AllCacheOptions,
  FetchProjectPayload,
  FetchProjectRequestBody,
  HydrogenComponentData,
  HydrogenPageData,
  PageType,
  WeaverseClientArgs,
  WeaverseLoaderData,
  WeaverseProjectConfigs,
  WeaverseStudioQueries,
} from './types'
import {
  generateDataFromSchema,
  getPreviewData,
  getRequestQueries,
  getWeaverseConfigs,
} from './utils'

// Constants at the top
const API_PATH = 'api/public'
const DEFAULT_CACHE_STRATEGY = {
  maxAge: 10,
  sMaxAge: 10,
  staleWhileRevalidate: 82800,
  staleIfError: 82800,
}

export class WeaverseClient {
  public API = API_PATH
  public basePageConfigs: Omit<WeaverseProjectConfigs, 'requestInfo'>
  public basePageRequestBody: Omit<FetchProjectRequestBody, 'url'>
  public configs: WeaverseProjectConfigs
  public withCache: ReturnType<typeof createWithCache>

  // Required dependencies
  public request: WeaverseClientArgs['request']
  public storefront: WeaverseClientArgs['storefront']
  public components: WeaverseClientArgs['components']
  public themeSchema: WeaverseClientArgs['themeSchema']
  public env: WeaverseClientArgs['env']
  public cache: WeaverseClientArgs['cache']
  public waitUntil: WeaverseClientArgs['waitUntil']

  constructor(args: WeaverseClientArgs) {
    // Destructure and initialize all dependencies
    const {
      env,
      storefront,
      components,
      cache,
      waitUntil,
      themeSchema,
      request,
    } = args

    // Initialize required properties
    this.request = request
    this.storefront = storefront
    this.components = components
    this.themeSchema = themeSchema
    this.env = env
    this.cache = cache
    this.waitUntil = waitUntil
    this.withCache = createWithCache({ cache, waitUntil, request })

    // Initialize configs
    this.configs = getWeaverseConfigs(request, env as HydrogenEnv)

    // Initialize base configurations
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

  // Helper method for direct fetching in design mode
  private directFetch = async <T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> => {
    try {
      let res = await fetch(url, options)
      if (!res.ok) {
        let error = await res.text()
        throw new Error(`${res.status} ${res.statusText} ${error}`)
      }
      return res.json()
    } catch (err) {
      throw new Error(`Failed to fetch data from ${url}`, { cause: err })
    }
  }

  public fetchWithCache = async <T extends object>(
    url: string,
    options: RequestInit & { strategy?: AllCacheOptions } = {},
  ): Promise<T> => {
    let {
      strategy = this.storefront.CacheCustom(DEFAULT_CACHE_STRATEGY),
      ...reqInit
    } = options
    let cacheKey = [url, options.body]

    if (this.configs.isDesignMode) {
      return this.directFetch<T>(url, reqInit)
    }

    return this.withCache.run(
      {
        cacheKey,
        cacheStrategy: strategy,
        shouldCacheResult: (result: any) => result?.data,
      },
      async () => {
        return this.directFetch<T>(url, {
          ...reqInit,
          headers: {
            'Cache-Control': generateCacheControlHeader(strategy),
            ...reqInit.headers,
          },
        })
      },
    ) as Promise<T>
  }

  loadThemeSettings = async (strategy?: AllCacheOptions) => {
    let defaultThemeSettings = generateDataFromSchema(this.themeSchema)
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
        res = await this.fetchWithCache(url, {
          method: 'POST',
          strategy,
          body,
        })
      }
      let data: any = res || {}
      if (this.themeSchema?.settings || this.themeSchema?.inspector) {
        data.theme = {
          ...defaultThemeSettings,
          ...data.theme,
        }
      }
      if (this.configs.isDesignMode) {
        data = {
          ...data,
          schema: this.themeSchema,
          publicEnv: this.configs.publicEnv,
        }
      }
      return data
    } catch (e) {
      console.info('Unable to load theme settings', e)
      return defaultThemeSettings
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
    params: {
      type?: PageType
      locale?: string
      handle?: string
      strategy?: AllCacheOptions
    } = {},
  ): Promise<WeaverseLoaderData | null> => {
    try {
      let { request, storefront, basePageRequestBody, basePageConfigs } = this
      let {
        projectId,
        isDesignMode,
        weaverseHost,
        isPreviewMode,
        sectionType,
      } = this.configs

      if (isPreviewMode) {
        return getPreviewData(sectionType, this.components, weaverseHost)
      }

      if (!projectId) {
        throw new Error('Missing Weaverse projectId!')
      }

      let { strategy, ...pageLoadParams } = params
      let body: {
        projectId: string
        url: string
        i18n?: I18nBase
        params?: {
          type?: PageType
          locale?: string
          handle?: string
        }
        isDesignMode?: boolean
      } = {
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
        console.error('Weaverse project not found. Id:', projectId)
        project = {
          id: projectId,
          name: 'Weaverse project not found.',
          weaverseShopId: '',
        }
        page = this.generateFallbackPage('Weaverse project not found.')
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
            queries: getRequestQueries<WeaverseStudioQueries>(request),
            pathname: new URL(request.url).pathname,
            search: new URL(request.url).search,
          },
        },
      }
    } catch (e) {
      // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
      console.error(`❌ Page load failed.`, e)
      return null
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
