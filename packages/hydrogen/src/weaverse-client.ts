import {
  CacheCustom,
  createWithCache,
  type HydrogenEnv,
  type I18nBase,
} from '@shopify/hydrogen'
import type {
  CachingStrategy,
  FetchProjectPayload,
  FetchProjectRequestBody,
  HydrogenComponent,
  HydrogenComponentData,
  HydrogenPageData,
  LoadPageParams,
  PageType,
  ProjectIdValidationResult,
  ThemeSettingsResponse,
  WeaverseClientArgs,
  WeaverseLoaderData,
  WeaverseProjectConfigs,
  WeaverseStudioQueries,
  WithCacheFetchResponse,
} from './types'
import {
  hasError,
  isFetchProjectPayload,
  isProjectIdFunction,
  WeaverseError,
} from './types'
import {
  generateDataFromSchema,
  getPreviewData,
  getRequestQueries,
  getWeaverseConfigs,
} from './utils'

/**
 * Cache duration constants (in seconds).
 * These values optimize CDN hit rates while maintaining fresh content.
 */
const CACHE_DURATIONS = {
  /** Short cache for frequently changing content (10 seconds) */
  SHORT: 10,
  /** Long cache duration - 23 hours to maximize CDN hits before daily refresh */
  LONG: 82_800,
} as const

/**
 * Network timeout for fetch requests (in milliseconds).
 * Default is 10 seconds to balance reliability and user experience.
 */
const DEFAULT_FETCH_TIMEOUT_MS = 10_000

/**
 * Weaverse API version path
 */
const API_PATH = 'v1' as const

/**
 * Default cache strategy for Weaverse API requests.
 * Optimized for CDN performance with 23-hour stale content tolerance.
 */
const DEFAULT_CACHE_STRATEGY: CachingStrategy = {
  maxAge: CACHE_DURATIONS.SHORT,
  sMaxAge: CACHE_DURATIONS.SHORT,
  staleWhileRevalidate: CACHE_DURATIONS.LONG,
  staleIfError: CACHE_DURATIONS.LONG,
} as const

export class WeaverseClient {
  API = API_PATH
  basePageConfigs: Omit<WeaverseProjectConfigs, 'requestInfo'>
  basePageRequestBody: Omit<FetchProjectRequestBody, 'url'>
  configs: WeaverseProjectConfigs
  withCache: ReturnType<typeof createWithCache>

  // Required dependencies
  request: WeaverseClientArgs['request']
  customerAccount: WeaverseClientArgs['customerAccount']
  storefront: WeaverseClientArgs['storefront']
  components: WeaverseClientArgs['components']
  themeSchema: WeaverseClientArgs['themeSchema']
  env: WeaverseClientArgs['env']
  cache: WeaverseClientArgs['cache']
  waitUntil: WeaverseClientArgs['waitUntil']

  // Performance optimizations
  private readonly parsedUrl: URL
  private readonly componentsByType: Map<string, HydrogenComponent>

  // Configuration
  private readonly fetchTimeoutMs: number

  constructor(args: WeaverseClientArgs) {
    // Assign required dependencies
    this.request = args.request
    this.storefront = args.storefront
    this.customerAccount = args.customerAccount
    this.components = args.components
    this.themeSchema = args.themeSchema
    this.env = args.env
    this.cache = args.cache
    this.waitUntil = args.waitUntil

    // Performance optimizations
    this.parsedUrl = new URL(args.request.url)
    this.componentsByType = this.buildComponentLookupMap(args.components)

    // Configuration
    this.fetchTimeoutMs = args.fetchTimeoutMs || DEFAULT_FETCH_TIMEOUT_MS

    // Initialize cache and configs
    this.initializeCache(args)
    this.initializeConfigs(args)
  }

  /**
   * Initialize Hydrogen cache with proper configuration.
   * Logs warning if waitUntil is missing.
   */
  private initializeCache(args: WeaverseClientArgs): void {
    if (!args.waitUntil) {
      console.warn(
        '⚠️ WeaverseClient: waitUntil not provided, background operations may not complete'
      )
    }

    this.withCache = createWithCache({
      cache: args.cache,
      waitUntil: args.waitUntil || (() => Promise.resolve()),
      request: args.request,
    })
  }

  /**
   * Initialize configs with projectId resolution and fail-fast validation.
   * Throws WeaverseError if projectId cannot be resolved.
   */
  private initializeConfigs(args: WeaverseClientArgs): void {
    // Get base configs once to avoid duplicate calls
    const baseConfigs = getWeaverseConfigs(
      args.request,
      args.env as HydrogenEnv
    )

    // Resolve projectId with multi-project support
    const resolvedProjectId = this.resolveProjectIdSync(
      args.projectId,
      args.request,
      args.env as HydrogenEnv,
      baseConfigs
    )

    // Fail-fast validation: throw if projectId is empty
    if (!resolvedProjectId || resolvedProjectId.trim() === '') {
      throw new WeaverseError(
        'Failed to initialize WeaverseClient: No valid projectId found. ' +
          'Set WEAVERSE_PROJECT_ID environment variable or provide projectId parameter.',
        'MISSING_PROJECT_ID'
      )
    }

    // Initialize configs with resolved projectId
    this.configs = {
      ...baseConfigs,
      projectId: resolvedProjectId,
    }

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
      i18n: args.storefront.i18n,
      projectId: this.configs.projectId,
    }

    // Freeze configs to prevent accidental mutations
    Object.freeze(this.configs)
    Object.freeze(this.basePageConfigs)
    Object.freeze(this.basePageRequestBody)
  }

  /**
   * Build component lookup map for O(1) access by type.
   * Significantly improves performance for large component lists.
   */
  private buildComponentLookupMap(
    components: HydrogenComponent[]
  ): Map<string, HydrogenComponent> {
    return new Map(components.map((comp) => [comp.schema?.type, comp]))
  }

  /**
   * Extract comprehensive error information from unknown error type.
   * Preserves error context, codes, and stack traces for debugging.
   *
   * @param error - Unknown error to extract information from
   * @returns Structured error information with message, code, stack, and context
   *
   * @example
   * ```typescript
   * try {
   *   // ... operation
   * } catch (error) {
   *   const errorInfo = this.extractErrorInfo(error)
   *   console.error('Operation failed:', errorInfo.message, errorInfo.context)
   * }
   * ```
   */
  private extractErrorInfo(error: unknown): {
    message: string
    code?: string
    stack?: string
    context?: Record<string, unknown>
  } {
    if (error instanceof WeaverseError) {
      return {
        message: error.message,
        code: error.code,
        context: error.context,
        stack: error.stack,
      }
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
      }
    }

    return {
      message: String(error),
    }
  }

  /**
   * Extract error message only (for backward compatibility).
   * Use extractErrorInfo() for more detailed error information.
   *
   * @deprecated Use extractErrorInfo() instead to preserve error context
   */
  private extractErrorMessage(error: unknown): string {
    return this.extractErrorInfo(error).message
  }

  /**
   * Validates projectId format (alphanumeric, hyphens, underscores only).
   * Returns detailed validation result with error message.
   *
   * @param projectId - Project identifier to validate
   * @returns Validation result with error message if invalid
   */
  private validateProjectId(projectId: string): ProjectIdValidationResult {
    if (!projectId || projectId.trim() === '') {
      return {
        valid: false,
        error: 'Project ID cannot be empty',
      }
    }

    // Only allow alphanumeric characters, hyphens, and underscores
    const validPattern = /^[a-zA-Z0-9_-]+$/
    if (!validPattern.test(projectId)) {
      return {
        valid: false,
        error: `Invalid format: "${projectId}". Only alphanumeric characters, hyphens, and underscores are allowed.`,
      }
    }

    return { valid: true }
  }

  /**
   * Resolves projectId with multi-project architecture support.
   * Uses priority chain to determine the correct project ID.
   *
   * @param projectId - Project identifier (string, function, or undefined)
   * @param request - HTTP request for context access
   * @param env - Hydrogen environment with variables
   * @param baseConfigs - Pre-fetched base configs to avoid duplicate calls
   * @returns Resolved project ID string (empty string if none found)
   */
  private resolveProjectIdSync(
    projectId: string | (() => string) | (() => Promise<string>) | undefined,
    request: Request,
    env: HydrogenEnv,
    baseConfigs?: WeaverseProjectConfigs
  ): string {
    return (
      this.resolveFromQueryParams(request) ||
      this.resolveFromFunction(projectId) ||
      this.resolveFromString(projectId) ||
      this.resolveFromEnvironment(baseConfigs, request, env) ||
      ''
    )
  }

  /**
   * Priority 1: Resolve projectId from URL query parameters.
   * Used for design mode and preview mode overrides.
   */
  private resolveFromQueryParams(request: Request): string | null {
    const queries = getRequestQueries<WeaverseStudioQueries>(request)
    return queries.weaverseProjectId || null
  }

  /**
   * Priority 2: Resolve projectId from function parameter.
   * Detects and rejects async functions with helpful error.
   */
  private resolveFromFunction(
    projectId: string | (() => string) | (() => Promise<string>) | undefined
  ): string | null {
    if (!isProjectIdFunction(projectId)) {
      return null
    }

    // Check if it's an async function BEFORE calling
    if (projectId.constructor.name === 'AsyncFunction') {
      throw new WeaverseError(
        'Async projectId functions must be awaited before passing to WeaverseClient. ' +
          'Use: projectId: await getProjectAsync() instead of: projectId: getProjectAsync',
        'ASYNC_PROJECT_ID'
      )
    }

    try {
      const result = projectId()

      // Safety net: check if result is a Promise
      if (result instanceof Promise) {
        throw new WeaverseError(
          'Async projectId functions must be awaited before passing to WeaverseClient. ' +
            'Use: projectId: await getProjectAsync() instead of: projectId: getProjectAsync',
          'ASYNC_PROJECT_ID'
        )
      }

      if (result && result.trim() !== '') {
        const trimmed = result.trim()
        const validation = this.validateProjectId(trimmed)

        if (validation.valid) {
          return trimmed
        }

        // Throw on validation failure - fail-fast for explicit projectId
        throw new WeaverseError(
          validation.error || 'Invalid projectId format',
          'INVALID_PROJECT_ID'
        )
      }
    } catch (err) {
      // Re-throw WeaverseError (async function errors, validation errors)
      if (err instanceof WeaverseError) {
        throw err
      }

      // Wrap unexpected errors
      throw new WeaverseError(
        `Failed to evaluate projectId function: ${err instanceof Error ? err.message : String(err)}`,
        'PROJECT_ID_FUNCTION_ERROR',
        undefined,
        { cause: err instanceof Error ? err.stack : String(err) }
      )
    }

    return null
  }

  /**
   * Priority 3: Resolve projectId from explicit string parameter.
   */
  private resolveFromString(
    projectId: string | (() => string) | (() => Promise<string>) | undefined
  ): string | null {
    if (typeof projectId !== 'string') {
      return null
    }

    const trimmed = projectId.trim()
    if (trimmed === '') {
      return null
    }

    const validation = this.validateProjectId(trimmed)
    if (validation.valid) {
      return trimmed
    }

    // Throw on validation failure - fail-fast for explicit projectId
    throw new WeaverseError(
      validation.error || 'Invalid projectId format',
      'INVALID_PROJECT_ID'
    )
  }

  /**
   * Priority 4: Resolve projectId from environment variables.
   */
  private resolveFromEnvironment(
    baseConfigs: WeaverseProjectConfigs | undefined,
    request: Request,
    env: HydrogenEnv
  ): string | null {
    const configs = baseConfigs || getWeaverseConfigs(request, env)

    if (configs.projectId && configs.projectId.trim() !== '') {
      return configs.projectId.trim()
    }

    return null
  }

  /**
   * Helper method for direct fetching in design mode.
   * Returns same format as withCache.fetch for consistency.
   * Includes 10-second timeout to prevent hanging requests.
   */
  private readonly directFetch = async <T>(
    url: string,
    options: RequestInit = {},
    timeoutMs = this.fetchTimeoutMs
  ): Promise<WithCacheFetchResponse<T>> => {
    const controller = new AbortController()
    const timeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(
      () => controller.abort(),
      timeoutMs
    )

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new WeaverseError(
          `HTTP ${response.status}: ${response.statusText}`,
          'FETCH_ERROR',
          response.status,
          { url, errorText }
        )
      }

      const data = (await response.json()) as T
      return { data, response }
    } catch (err) {
      if (err instanceof WeaverseError) {
        throw err
      }

      if (err.name === 'AbortError') {
        throw new WeaverseError(
          `Request timeout after ${timeoutMs}ms`,
          'TIMEOUT_ERROR',
          undefined,
          { url, timeoutMs }
        )
      }

      throw new WeaverseError(
        'Network error during fetch',
        'NETWORK_ERROR',
        undefined,
        { url, cause: err instanceof Error ? err.message : String(err) }
      )
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
    }
  }

  // Helper method to detect if request is from localhost
  private isLocalhost(): boolean {
    const hostname = this.parsedUrl.hostname
    return hostname === 'localhost' || hostname === '127.0.0.1'
  }

  // Helper method for building API URLs consistently
  private getApiUrl(
    endpoint: string,
    useProxy = !(this.configs.isDesignMode || this.isLocalhost())
  ): string {
    const { weaverseHost, weaverseApiBase, projectId } = this.configs

    if (useProxy) {
      return `${weaverseApiBase}/v1/${endpoint}?projectId=${projectId}`
    }

    return `${weaverseHost}/api/public/${endpoint}`
  }

  public fetchWithCache = async <T = unknown>(
    url: string,
    options: RequestInit & { strategy?: CachingStrategy } = {}
  ): Promise<T> => {
    const strategy = options.strategy || CacheCustom(DEFAULT_CACHE_STRATEGY)

    // Update cache key to include method, body content, and projectId for multi-project isolation
    // Prefix for easier debugging in cache systems
    const cacheKey = [
      'weaverse-fetch',
      url,
      options.method || 'GET',
      options.body,
      this.configs.projectId,
    ]

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
    strategy?: CachingStrategy
  ): Promise<ThemeSettingsResponse> => {
    const defaultThemeSettings = generateDataFromSchema(this.themeSchema)
    try {
      const { configs } = this
      const { projectId, isDesignMode } = configs
      if (!projectId) {
        throw new Error('Missing Weaverse projectId!')
      }

      const url = this.getApiUrl('project_configs')

      const body = JSON.stringify({ isDesignMode, projectId })
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
    } catch (error) {
      const errorMessage = 'Unable to load theme settings'
      const errorDetails = this.extractErrorMessage(error)

      console.error(errorMessage, errorDetails)

      return {
        theme: defaultThemeSettings,
        _error: errorDetails,
        _loadFailed: true,
      }
    }
  }

  generateFallbackPage = (message: string): HydrogenPageData => {
    const rootId = crypto.randomUUID()
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
    params: LoadPageParams = {}
  ): Promise<WeaverseLoaderData | null> => {
    try {
      const { request, storefront, basePageRequestBody, basePageConfigs } = this
      const {
        projectId: clientProjectId,
        weaverseHost,
        isPreviewMode,
        sectionType,
      } = this.configs

      // Validate route-level projectId if provided
      if (params.projectId !== undefined) {
        if (typeof params.projectId !== 'string') {
          console.error(
            'Route-level projectId validation failed: must be a string. ' +
              `Received: ${typeof params.projectId}`
          )
          return null
        }

        const validation = this.validateProjectId(params.projectId)
        if (!validation.valid) {
          console.error(
            `Route-level projectId validation failed: ${validation.error}`
          )
          return null
        }
      }

      // Override client-level projectId with route-level projectId if provided
      const effectiveProjectId = params.projectId || clientProjectId

      if (isPreviewMode) {
        return getPreviewData(sectionType || '', this.components, weaverseHost)
      }

      if (!effectiveProjectId) {
        throw new Error('Missing Weaverse projectId!')
      }

      const { strategy, ...pageLoadParams } = params
      const body: {
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
        projectId: effectiveProjectId, // Use effective (potentially overridden) projectId
        params: pageLoadParams,
        url: request.url,
      }

      const reqInit: RequestInit = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
        },
      }
      const url = this.getApiUrl('project')

      const projectData: FetchProjectPayload =
        await this.fetchWithCache<FetchProjectPayload>(url, {
          ...reqInit,
          strategy,
        })

      if (hasError(projectData)) {
        throw new Error(projectData.error)
      }

      // Extract what we can from the response using type guard
      // If validation fails, use fallback data instead of throwing
      let page: HydrogenPageData | undefined
      let project: WeaverseLoaderData['project'] | undefined
      let pageAssignment: WeaverseLoaderData['pageAssignment'] | undefined

      if (isFetchProjectPayload(projectData)) {
        // Valid response - extract normally
        page = projectData.page
        project = projectData.project
        pageAssignment = projectData.pageAssignment
      } else {
        console.warn(
          'Invalid project data structure received from API, using fallback data',
          { projectId: effectiveProjectId }
        )
        // Try to extract what we can from the malformed response
        const responseData = projectData as any
        page = responseData?.page
        project = responseData?.project
        pageAssignment = responseData?.pageAssignment
      }

      if (!project) {
        console.warn('Weaverse project not found. Id:', effectiveProjectId)
        project = {
          id: effectiveProjectId,
          name: 'Weaverse project not found.',
          weaverseShopId: '',
        }
      }

      if (!page) {
        page = this.generateFallbackPage('Please add new section to start.')
      }
      if (page?.items) {
        const items = page.items
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
            pathname: this.parsedUrl.pathname,
            search: this.parsedUrl.search,
          },
        },
      }
    } catch (error) {
      const errorMessage = '❌ Page load failed'
      const errorContext: Record<string, unknown> = {
        url: this.request.url,
        projectId: params.projectId || this.configs.projectId,
      }

      if (error instanceof WeaverseError) {
        console.error(errorMessage, {
          code: error.code,
          message: error.message,
          ...errorContext,
          ...error.context,
        })
      } else if (error instanceof Error) {
        console.error(errorMessage, {
          message: error.message,
          stack: error.stack,
          ...errorContext,
        })
      } else {
        console.error(errorMessage, {
          error: String(error),
          ...errorContext,
        })
      }

      return null
    }
  }

  execComponentLoader = async (item: HydrogenComponentData) => {
    const { data = {}, type, id } = item
    const component = this.componentsByType.get(type)
    const loader = component?.loader
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
      } catch (error) {
        console.warn('❌ Item loader run failed.', type, id, error)
        return item
      }
    }
    return item
  }
}
