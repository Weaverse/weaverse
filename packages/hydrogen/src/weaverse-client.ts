import {
  createWithCache,
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
  ThemeSettingsResponse,
  WeaverseClientArgs,
  WeaverseLoaderData,
  WeaverseProjectConfigs,
  WeaverseStudioQueries,
  WithCacheFetchResponse,
} from './types'
import { hasError } from './types'
import {
  generateDataFromSchema,
  getPreviewData,
  getRequestQueries,
  getWeaverseConfigs,
} from './utils'

// Constants at the top
const API_PATH = 'v1' as const

const DEFAULT_CACHE_STRATEGY: Readonly<Required<AllCacheOptions>> = {
  maxAge: 5, // 5 seconds for development/testing
  sMaxAge: 5, // 5 seconds CDN cache
  staleWhileRevalidate: 5, // 5 seconds
  staleIfError: 82_800, // 23 hours
  mode: 'public',
} as const

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
    this.withCache = createWithCache({
      cache,
      waitUntil: waitUntil || (() => Promise.resolve()),
      request,
    })

    // Initialize configs
    this.configs = getWeaverseConfigs(request, env as HydrogenEnv)

    // Initialize base configurations
    this.basePageConfigs = {
      projectId: this.configs.projectId,
      weaverseHost: this.configs.weaverseHost,
      weaverseApiBase: this.configs.weaverseApiBase,
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

  // Helper method for direct fetching in design mode - returns same format as withCache.fetch
  private readonly directFetch = async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<WithCacheFetchResponse<T>> => {
    try {
      let response = await fetch(url, options)
      if (!response.ok) {
        let error = await response.text()
        throw new Error(`${response.status} ${response.statusText} ${error}`)
      }
      let data = (await response.json()) as T
      // Return same wrapped format as withCache.fetch
      return {
        data,
        response,
      }
    } catch (err) {
      throw new Error(`Failed to fetch data from ${url}`, { cause: err })
    }
  }

  // Helper method for building API URLs consistently
  private getApiUrl(
    endpoint: string,
    useProxy = !this.configs.isDesignMode
  ): string {
    const { weaverseHost, weaverseApiBase, projectId } = this.configs

    if (useProxy) {
      return `${weaverseApiBase}/v1/${endpoint}?projectId=${projectId}`
    }

    return `${weaverseHost}/api/public/${endpoint}`
  }

  public fetchWithCache = async <T = unknown>(
    url: string,
    options: RequestInit & { strategy?: AllCacheOptions } = {}
  ): Promise<T> => {
    const strategy =
      options.strategy || this.storefront.CacheCustom(DEFAULT_CACHE_STRATEGY)

    // Improved cache key to include method and body content
    const cacheKey = [url, options.method || 'GET', options.body]

    let result: WithCacheFetchResponse<T>

    if (this.configs.isDesignMode) {
      result = await this.directFetch<T>(url, options)
    } else {
      // Use withCache.fetch for better integration with Hydrogen's caching system
      result = (await this.withCache.fetch(url, options, {
        cacheKey,
        cacheStrategy: strategy,
        shouldCacheResponse: (response: any): boolean => {
          // Cache any non-error response (for both Weaverse API and third-party APIs)
          return (
            !hasError(response) && response !== null && response !== undefined
          )
        },
        displayName: 'Weaverse API',
      })) as WithCacheFetchResponse<T>
    }

    return result.data
  }

  loadThemeSettings = async (
    strategy?: AllCacheOptions
  ): Promise<ThemeSettingsResponse> => {
    let defaultThemeSettings = generateDataFromSchema(this.themeSchema)
    try {
      let { configs } = this
      let { weaverseApiBase, weaverseHost, projectId, isDesignMode } = configs
      if (!projectId) {
        throw new Error('Missing Weaverse projectId!')
      }

      let url = this.getApiUrl('project_configs')

      let body = JSON.stringify({ isDesignMode, projectId })
      let data: ThemeSettingsResponse =
        await this.fetchWithCache<ThemeSettingsResponse>(url, {
          method: 'POST',
          strategy,
          body,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
          },
        })

      // Validate that data is a proper object, not corrupted/compressed content
      if (typeof data !== 'object' || data === null) {
        console.warn(
          'Invalid theme settings response format, using defaults:',
          {
            type: typeof data,
            isString: typeof data === 'string',
            length: typeof data === 'string' ? (data as string).length : 'N/A',
            preview:
              typeof data === 'string'
                ? `${(data as string).substring(0, 50)}...`
                : String(data),
          }
        )
        data = { theme: defaultThemeSettings }
      }

      if (this.themeSchema?.settings || this.themeSchema?.inspector) {
        // Ensure data.theme exists and is an object before merging
        if (!data.theme || typeof data.theme !== 'object') {
          data.theme = defaultThemeSettings
        } else {
          data.theme = {
            ...defaultThemeSettings,
            ...data.theme,
          }
        }
      }
      if (this.configs.isDesignMode) {
        data = {
          ...data,
          schema:
            this.themeSchema && typeof this.themeSchema === 'object'
              ? {
                  ...this.themeSchema,
                  settings: this.themeSchema?.settings?.map((group) => ({
                    ...group,
                    inputs: group?.inputs?.map((input) => {
                      if (typeof input?.condition === 'function') {
                        return {
                          ...input,
                          condition: input.condition.toString(),
                        }
                      }
                      return input
                    }),
                  })),
                }
              : undefined,
          publicEnv: this.configs.publicEnv,
        }
      }
      return data
    } catch (e) {
      console.info('Unable to load theme settings', e)
      return { theme: defaultThemeSettings }
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
    } = {}
  ): Promise<WeaverseLoaderData | null> => {
    try {
      let { request, storefront, basePageRequestBody, basePageConfigs } = this
      let {
        projectId,
        isDesignMode,
        weaverseHost,
        weaverseApiBase,
        isPreviewMode,
        sectionType,
      } = this.configs

      if (isPreviewMode) {
        return getPreviewData(sectionType || '', this.components, weaverseHost)
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
        },
      }
      let url = this.getApiUrl('project')

      let projectData: FetchProjectPayload =
        await this.fetchWithCache<FetchProjectPayload>(url, {
          ...reqInit,
          strategy,
        })

      if (hasError(projectData)) {
        throw new Error(projectData.error)
      }

      // Extract what we can from the response
      let { page, project, pageAssignment } = projectData as any

      if (!project) {
        console.warn('Weaverse project not found. Id:', projectId)
        project = {
          id: projectId,
          name: 'Weaverse project not found.',
          weaverseShopId: '',
        }
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
      console.error('❌ Page load failed.', e)
      return null
    }
  }

  execComponentLoader = async (item: HydrogenComponentData) => {
    let { data = {}, type, id } = item
    let component = this.components?.find(({ schema }) => schema?.type === type)
    let loader = component?.loader
    if (typeof loader === 'function' && component) {
      try {
        return {
          ...item,
          loaderData: await Promise.resolve(
            loader({
              data: { ...generateDataFromSchema(component.schema), ...data },
              weaverse: this,
            })
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
