import { runWeaverseComponentLoaders } from '../loader'
import { buildWeaverseNextRequestInfo } from '../request-info'
import type {
  WeaverseNextBaseConfigs,
  WeaverseNextCacheConfig,
  WeaverseNextCommerceContext,
  WeaverseNextComponent,
  WeaverseNextComponentData,
  WeaverseNextConfigs,
  WeaverseNextCustomPageEntry,
  WeaverseNextFetchCustomPagesOptions,
  WeaverseNextFetchOptions,
  WeaverseNextLoaderData,
  WeaverseNextLoadPageInput,
  WeaverseNextPageAssignment,
  WeaverseNextPageData,
  WeaverseNextProjectId,
  WeaverseNextRequestContext,
  WeaverseNextServerClient,
  WeaverseNextServerClientConfig,
  WeaverseNextServerLoadPageInput,
  WeaverseNextStorefront,
  WeaverseNextThemeSchema,
  WeaverseNextThemeSettingsOptions,
  WeaverseNextThemeSettingsResponse,
} from '../types'
import { generateDataFromSchema } from '../utils'
import { getWeaverseNextConfigs } from './configs'
import { normalizeNextPageUrl, resolveRequestUrl } from './normalize-page-url'

const DEFAULT_FETCH_TIMEOUT_MS = 10_000
const RANDOM_ID_RADIX = 36
const RANDOM_ID_SLICE_START = 2
const MAX_CUSTOM_PAGE_PAGES = 100

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
} as const

/** Next's `fetch` reads `next: { revalidate, tags }` off the request init. */
type NextRequestInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] }
}

type LooseThemeSchema = WeaverseNextThemeSchema

function asThemeSchema(schema: unknown): LooseThemeSchema | undefined {
  return schema && typeof schema === 'object'
    ? (schema as LooseThemeSchema)
    : undefined
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Math.random().toString(RANDOM_ID_RADIX).slice(RANDOM_ID_SLICE_START)}`
}

/**
 * Normalize the raw `pageAssignment` from `/api/public/project` into a
 * save-compatible {@link WeaverseNextPageAssignment} so the Builder Studio save
 * pipeline receives the same shape it gets from Hydrogen. Returns `undefined`
 * for a missing or malformed assignment (rather than fabricating one), requires
 * string `projectId`/`type`/`handle`, coerces a nullish `locale` to `''`, and
 * preserves an object `meta` untouched.
 */
function normalizeWeaverseNextPageAssignment(
  input: unknown
): WeaverseNextPageAssignment | undefined {
  if (!input || typeof input !== 'object') {
    return
  }
  let { projectId, type, handle, locale, meta } = input as Record<
    string,
    unknown
  >
  if (
    typeof projectId !== 'string' ||
    typeof type !== 'string' ||
    typeof handle !== 'string'
  ) {
    return
  }
  let normalized: WeaverseNextPageAssignment = {
    projectId,
    type,
    handle,
    locale: typeof locale === 'string' ? locale : '',
  }
  if (meta && typeof meta === 'object') {
    normalized.meta = meta as WeaverseNextPageAssignment['meta']
  }
  return normalized
}

/**
 * Server-side Weaverse client for Next.js. Performs the real Weaverse public
 * API fetch (page + theme settings) instead of delegating to injected fetchers,
 * closing the gap with Hydrogen's `context.weaverse.loadPage(...)`.
 */
class NextServerClient implements WeaverseNextServerClient {
  components: WeaverseNextComponent[]
  commerce?: WeaverseNextCommerceContext
  requestContext?: WeaverseNextRequestContext
  themeSchema?: WeaverseNextThemeSchema
  themeSettings: Record<string, unknown>
  data: WeaverseNextLoaderData | null = null
  dataContext: Record<string, unknown> = {}
  configs: WeaverseNextConfigs

  private readonly _projectIdInput?: WeaverseNextProjectId
  private readonly _baseConfigs: WeaverseNextBaseConfigs
  private readonly _fetch: typeof fetch
  private readonly _cache?: WeaverseNextServerClientConfig['cache']
  private readonly _fetchTimeoutMs: number
  private _resolvedProjectId?: string

  constructor(config: WeaverseNextServerClientConfig) {
    // Server client keeps the component definitions for server-side loaders
    // (`runWeaverseComponentLoaders`) and preview-data generation, but it
    // intentionally does NOT call `registerWeaverseNextComponents`. Registering
    // pulls in `../registry` → `@weaverse/react`, which evaluates
    // `React.createContext()` at module load — invalid in the RSC/server graph
    // and the cause of `(0 , x.createContext) is not a function`. The client
    // wrapper/renderer (root `@weaverse/next` client entry) registers the real
    // render components instead, keeping `@weaverse/next/server` React-free.
    this.components = config.components
    this.commerce = config.commerce
    this.requestContext = config.requestContext
    this.themeSchema = config.themeSchema
    // Seed schema defaults before merchant overrides, mirroring the root client.
    this.themeSettings = {
      ...generateDataFromSchema(config.themeSchema),
      ...config.themeSettings,
    }
    this._projectIdInput = config.projectId
    this._fetch = config.fetch ?? globalThis.fetch
    this._cache = config.cache
    this._fetchTimeoutMs = config.fetchTimeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS

    this._baseConfigs = getWeaverseNextConfigs(config.requestContext, {
      env: config.env,
      weaverseHost: config.weaverseHost,
      weaverseApiBase: config.weaverseApiBase,
      weaverseVersion: config.weaverseVersion,
    })

    // Synchronous best-effort projectId (query → string → env). A function
    // resolver is awaited lazily in `resolveProjectId`, so `projectId` reflects
    // its result after the first `loadPage`/`loadThemeSettings`/`resolveProjectId`.
    this.configs = this._buildPublicConfigs(
      this._baseConfigs.queryProjectId ||
        (typeof this._projectIdInput === 'string'
          ? this._projectIdInput.trim()
          : '') ||
        this._baseConfigs.envProjectId
    )
  }

  get projectId(): string {
    return this.configs.projectId
  }

  /** Compatibility alias so loaders can call `weaverse.storefront.query(...)`. */
  get storefront(): WeaverseNextStorefront | undefined {
    return this.commerce?.storefront
  }

  private _buildPublicConfigs(projectId: string): WeaverseNextConfigs {
    let base = this._baseConfigs
    return {
      projectId,
      weaverseHost: base.weaverseHost,
      weaverseApiBase: base.weaverseApiBase,
      weaversePublicApiBase: base.weaverseApiBase,
      weaverseVersion: base.weaverseVersion,
      isDesignMode: base.isDesignMode,
      isPreviewMode: base.isPreviewMode,
      isRevisionPreview: base.isRevisionPreview,
      sectionType: base.sectionType,
      publicEnv: base.publicEnv,
    }
  }

  resolveProjectId = async (): Promise<string> => {
    if (this._resolvedProjectId !== undefined) {
      return this._resolvedProjectId
    }

    // Priority: query param → function → string → env (matches Hydrogen).
    let resolved = this._baseConfigs.queryProjectId
    if (!resolved && typeof this._projectIdInput === 'function') {
      try {
        let value = await this._projectIdInput(this.requestContext)
        if (typeof value === 'string' && value.trim()) {
          resolved = value.trim()
        }
      } catch (error) {
        console.warn(
          '[WeaverseNextServerClient] projectId resolver threw, falling back.',
          error
        )
      }
    }
    if (!resolved && typeof this._projectIdInput === 'string') {
      resolved = this._projectIdInput.trim()
    }
    if (!resolved) {
      resolved = this._baseConfigs.envProjectId
    }

    this._resolvedProjectId = resolved
    this.configs = this._buildPublicConfigs(resolved)
    return resolved
  }

  fetchWithCache = async <T = unknown>(
    url: string,
    options: WeaverseNextFetchOptions = {}
  ): Promise<T> => {
    let { revalidate, tags, ...init } = options
    let requestInit: NextRequestInit = { ...init }

    let { isDesignMode, isRevisionPreview } = this._baseConfigs
    if (isDesignMode || isRevisionPreview) {
      // Design / revision data must never be served stale.
      requestInit.cache = 'no-store'
    } else if (requestInit.cache === undefined) {
      let effectiveRevalidate = revalidate ?? this._cache?.revalidate
      let effectiveTags = tags ?? this._cache?.tags
      if (effectiveRevalidate !== undefined || effectiveTags?.length) {
        requestInit.next = {
          ...(effectiveRevalidate === undefined
            ? {}
            : { revalidate: effectiveRevalidate }),
          ...(effectiveTags?.length ? { tags: effectiveTags } : {}),
        }
      }
    }

    let controller = new AbortController()
    let timeoutId = setTimeout(() => controller.abort(), this._fetchTimeoutMs)
    try {
      let response = await this._fetch(url, {
        ...requestInit,
        signal: requestInit.signal ?? controller.signal,
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return (await response.json()) as T
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private _buildCustomPagesUrl(
    projectId: string,
    options: WeaverseNextFetchCustomPagesOptions,
    cursor: string | null
  ) {
    let params = new URLSearchParams()
    if (options.locale) {
      params.set('locale', options.locale)
    }
    if (options.limit) {
      params.set('limit', String(options.limit))
    }
    if (cursor) {
      params.set('cursor', cursor)
    }
    let qs = params.toString()
    return `${this._baseConfigs.weaverseApiBase}/api/public/v1/projects/${projectId}/custom-pages${
      qs ? `?${qs}` : ''
    }`
  }

  /**
   * Fetch all published custom pages for sitemap generation. Mirrors Hydrogen's
   * helper but uses Next's fetch cache knobs (`revalidate` / `tags`). It returns
   * accumulated results on partial pagination failure so a single API hiccup
   * does not break sitemap generation entirely.
   */
  fetchCustomPages = async (
    options: WeaverseNextFetchCustomPagesOptions = {}
  ): Promise<WeaverseNextCustomPageEntry[]> => {
    let projectId = await this.resolveProjectId()
    let entries: WeaverseNextCustomPageEntry[] = []
    if (!projectId) {
      console.warn(
        '[WeaverseNext] Failed to fetch custom pages: missing projectId'
      )
      return entries
    }

    let cursor: string | null = null
    for (let page = 0; page < MAX_CUSTOM_PAGE_PAGES; page += 1) {
      let url = this._buildCustomPagesUrl(projectId, options, cursor)

      try {
        let result = await this.fetchWithCache<{
          data?: WeaverseNextCustomPageEntry[]
          nextCursor?: string | null
        }>(url, {
          revalidate: options.revalidate,
          tags: options.tags,
        })
        entries.push(...(result.data ?? []))
        if (!result.nextCursor) {
          return entries
        }
        cursor = result.nextCursor
      } catch (error) {
        let message = error instanceof Error ? error.message : String(error)
        console.warn(
          entries.length === 0
            ? `[WeaverseNext] Failed to fetch custom pages: ${message}`
            : `[WeaverseNext] Custom pages pagination interrupted: ${message}`
        )
        return entries
      }
    }

    console.warn('[WeaverseNext] Custom pages pagination cap reached')
    return entries
  }

  private _generateFallbackPage(message: string): WeaverseNextPageData {
    let rootId = generateUuid()
    return {
      id: `fallback_page_${rootId}`,
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

  /**
   * Recursively materialize a section preset (and its preset children) into a
   * flat list of page items, returning the new item id. Ported from Hydrogen's
   * `recursivelyAddDataItem`. Returns `undefined` when the type isn't registered.
   */
  private _buildPreviewItems(
    type: string,
    items: WeaverseNextComponentData[],
    initData: Record<string, unknown> = {}
  ): string | undefined {
    let component = this.components.find((c) => c.schema?.type === type)
    if (!component) {
      return
    }
    let { children, ...data } = (component.schema?.presets ?? {}) as {
      children?: { type: string; [key: string]: unknown }[]
      [key: string]: unknown
    }
    let childIds: { id: string }[] = []
    if (children) {
      for (let child of children) {
        let { type: childType, children: _children, ...childData } = child
        let childId = this._buildPreviewItems(childType, items, childData)
        if (childId) {
          childIds.push({ id: childId })
        }
      }
    }
    let id = generateUuid()
    items.push({ id, type, data: { ...data, ...initData }, children: childIds })
    return id
  }

  /**
   * Synthetic loader data for Studio "section preview" mode. Mirrors Hydrogen's
   * `getPreviewData`: it builds a single-section page from the requested
   * `sectionType`'s presets without hitting `/api/public/project`, so preview
   * works even without a resolved `projectId`.
   */
  private _generatePreviewData(projectId: string): WeaverseNextLoaderData {
    let { sectionType, weaverseHost } = this._baseConfigs
    let items: WeaverseNextComponentData[] = []
    let sectionId = sectionType
      ? this._buildPreviewItems(sectionType, items)
      : undefined

    let configs = {
      ...this._buildPublicConfigs(projectId),
      isPreviewMode: true,
      weaverseHost,
      requestInfo: buildWeaverseNextRequestInfo(this.requestContext),
    }

    return {
      project: {
        id: projectId,
        weaverseShopId: 'shop-id',
        name: 'Section Preview',
      },
      configs,
      page: {
        id: 'weaverse-preview-page',
        name: 'Preview section',
        rootId: '1',
        items: [
          {
            id: '1',
            type: 'main',
            data: {},
            children: sectionId ? [{ id: sectionId }] : [],
          },
          ...items,
        ],
      },
    }
  }

  private _getLoadPageInput(input: WeaverseNextLoadPageInput) {
    let {
      cache,
      projectId: routeProjectId,
      ...rest
    } = input as WeaverseNextServerLoadPageInput
    let params: Record<string, unknown> = {}
    for (let [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        params[key] = value
      }
    }
    return { cache, params, routeProjectId }
  }

  private async _resolveLoadPageProjectId(routeProjectId?: string) {
    let effectiveProjectId =
      (typeof routeProjectId === 'string' && routeProjectId.trim()) ||
      (await this.resolveProjectId())
    if (effectiveProjectId) {
      this.configs = this._buildPublicConfigs(effectiveProjectId)
    }
    return effectiveProjectId
  }

  private _fetchPagePayload(
    projectId: string,
    params: Record<string, unknown>,
    cache?: WeaverseNextCacheConfig
  ) {
    let i18n = this.requestContext?.i18n ?? this.commerce?.storefront?.i18n
    let url = normalizeNextPageUrl(resolveRequestUrl(this.requestContext))
    let apiUrl = `${this._baseConfigs.weaverseApiBase}/api/public/project`
    let userAgent = this.requestContext?.headers?.get('user-agent') ?? ''
    return this.fetchWithCache<Record<string, unknown>>(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        url,
        i18n,
        params,
        isDesignMode: this._baseConfigs.isDesignMode,
      }),
      headers: { ...JSON_HEADERS, 'X-Visitor-UA': userAgent },
      ...(cache ?? {}),
    })
  }

  private _assertNoPageError(payload: Record<string, unknown>) {
    if ('error' in payload && typeof payload.error === 'string') {
      throw new Error(payload.error)
    }
  }

  private _createLoaderData(
    payload: Record<string, unknown>,
    projectId: string
  ): WeaverseNextLoaderData {
    this._assertNoPageError(payload)
    let page = payload.page as WeaverseNextPageData | undefined
    let project = payload.project as WeaverseNextLoaderData['project']
    let pageAssignment = normalizeWeaverseNextPageAssignment(
      payload.pageAssignment
    )

    page ??= this._generateFallbackPage(
      '<div style="text-align: center;">Please add new section to start.</div>'
    )
    project ??= {
      id: projectId,
      name: 'Weaverse project not found.',
      weaverseShopId: '',
    }
    if (Array.isArray(page.items) && page.items.length === 0) {
      page.items.push({
        type: 'main',
        id: page.rootId || generateUuid(),
        data: {},
      })
    }

    return {
      page,
      project,
      pageAssignment,
      configs: {
        ...this._buildPublicConfigs(projectId),
        requestInfo: buildWeaverseNextRequestInfo(this.requestContext),
      },
    }
  }

  private async _runLoaders(data: WeaverseNextLoaderData) {
    this.data = data
    let withLoaders = await runWeaverseComponentLoaders({ client: this, data })
    this.data = withLoaders ?? data
    return this.data
  }

  loadPage = async (
    input: WeaverseNextLoadPageInput = {}
  ): Promise<WeaverseNextLoaderData | null> => {
    try {
      let { cache, params, routeProjectId } = this._getLoadPageInput(input)
      let projectId = await this._resolveLoadPageProjectId(routeProjectId)
      if (this._baseConfigs.isPreviewMode) {
        let previewData = this._generatePreviewData(projectId || 'x')
        this.data = previewData
        return previewData
      }
      if (!projectId) {
        throw new Error('Missing Weaverse projectId!')
      }

      let payload = await this._fetchPagePayload(projectId, params, cache)
      let data = this._createLoaderData(payload, projectId)
      return await this._runLoaders(data)
    } catch (error) {
      console.error('❌ Page load failed', {
        url: this.requestContext?.url,
        projectId: input.projectId || this.configs.projectId,
        message: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  }

  /**
   * Resolve the request locale (e.g. `fr-ca`) used for merchant overrides.
   * Unlike Hydrogen — which defaults to `en`/`us` because a Hydrogen
   * storefront always has an i18n context — Next apps may not thread one
   * through, so a missing language or country means "no explicit locale" and
   * the translation fetch is skipped rather than guessed.
   */
  private _resolveOverridesLocale(): string | undefined {
    let i18n = this.requestContext?.i18n
    let language =
      typeof i18n?.language === 'string' ? i18n.language.trim() : ''
    let country = typeof i18n?.country === 'string' ? i18n.country.trim() : ''
    if (!(language && country)) {
      return
    }
    return `${language.toLowerCase()}-${country.toLowerCase()}`
  }

  /**
   * Fetch locale-specific static-text overrides from the translation API.
   * Ported from Hydrogen's `fetchMerchantOverrides`: skipped entirely when the
   * theme has no `i18n` schema (nothing translatable) or when the request has
   * no explicit locale, and never allowed to fail theme settings.
   */
  private async _fetchMerchantOverrides(
    projectId: string,
    options: WeaverseNextThemeSettingsOptions
  ): Promise<Record<string, unknown> | undefined> {
    let { weaverseHost } = this._baseConfigs
    if (!(asThemeSchema(this.themeSchema)?.i18n && projectId && weaverseHost)) {
      return
    }

    let locale = this._resolveOverridesLocale()
    if (!locale) {
      return
    }

    let url = `${weaverseHost}/api/translation/static?projectId=${projectId}&locale=${locale}`
    try {
      let overrides = await this.fetchWithCache<Record<string, unknown>>(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        revalidate: options.revalidate,
        tags: options.tags,
      })
      return typeof overrides === 'object' && overrides !== null
        ? overrides
        : undefined
    } catch (error) {
      // Translations are additive — a failure must not break theme settings.
      console.warn(
        '[WeaverseNext] Unable to load merchant overrides, using theme defaults:',
        error instanceof Error ? error.message : String(error)
      )
      return
    }
  }

  loadThemeSettings = async (
    // Broad param keeps this assignable to `WeaverseNextClient.loadThemeSettings`;
    // only the cache fields below are honored — no request-context override.
    optionsInput:
      | WeaverseNextThemeSettingsOptions
      | WeaverseNextRequestContext = {}
  ): Promise<WeaverseNextThemeSettingsResponse> => {
    let options = optionsInput as WeaverseNextThemeSettingsOptions
    let themeSchema = asThemeSchema(this.themeSchema)
    let defaultThemeSettings = generateDataFromSchema(this.themeSchema)
    let staticContent = themeSchema?.i18n?.staticContent

    try {
      let projectId = await this.resolveProjectId()
      if (!projectId) {
        throw new Error('Missing Weaverse projectId!')
      }

      let { isDesignMode } = this._baseConfigs
      let url = `${this._baseConfigs.weaverseApiBase}/api/public/project_configs`
      // Project configs and locale overrides are independent reads — mirror
      // Hydrogen and fetch them in parallel instead of serially.
      let [result, merchantOverrides] = await Promise.all([
        this.fetchWithCache<WeaverseNextThemeSettingsResponse>(url, {
          method: 'POST',
          body: JSON.stringify({ projectId, isDesignMode }),
          headers: JSON_HEADERS,
          revalidate: options.revalidate,
          tags: options.tags,
        }),
        this._fetchMerchantOverrides(projectId, options),
      ])

      if (typeof result !== 'object' || result === null) {
        result = { theme: defaultThemeSettings }
      }

      if (themeSchema?.settings || themeSchema?.inspector) {
        if (!result.theme || typeof result.theme !== 'object') {
          result.theme = defaultThemeSettings
        } else {
          result.theme = { ...defaultThemeSettings, ...result.theme }
        }
      }

      if (staticContent) {
        result.staticContent = staticContent
      }

      // Only overwrite when the translation API actually returned overrides so
      // a missing/failed fetch can't wipe overrides shipped by project_configs.
      if (merchantOverrides) {
        result.merchantOverrides = merchantOverrides
      }

      if (isDesignMode) {
        let serializableSchema: WeaverseNextThemeSchema | undefined =
          themeSchema
            ? {
                ...themeSchema,
                settings: themeSchema.settings?.map((group) => ({
                  ...group,
                  inputs: group?.inputs?.map((inputItem) =>
                    typeof inputItem?.condition === 'function'
                      ? {
                          ...inputItem,
                          condition: inputItem.condition.toString(),
                        }
                      : inputItem
                  ),
                })),
              }
            : undefined
        result = {
          ...result,
          schema: serializableSchema,
          publicEnv: this._baseConfigs.publicEnv,
        }
      }

      return result
    } catch (error) {
      let errorDetails = error instanceof Error ? error.message : String(error)
      console.error('Unable to load theme settings', errorDetails)
      return {
        theme: defaultThemeSettings,
        staticContent,
        _error: errorDetails,
        _loadFailed: true,
      }
    }
  }
}

/**
 * Create a server-side {@link WeaverseNextServerClient} for Next.js App Router
 * routes / server components.
 *
 * @example
 * ```ts
 * let weaverse = createWeaverseNextServerClient({
 *   projectId: process.env.WEAVERSE_PROJECT_ID,
 *   components,
 *   commerce: { storefront },
 *   requestContext: { url, headers, searchParams, i18n },
 *   cache: { revalidate: 60, tags: ['weaverse'] },
 * })
 * let data = await weaverse.loadPage({ type: 'INDEX' })
 * let theme = await weaverse.loadThemeSettings()
 * ```
 */
export function createWeaverseNextServerClient(
  config: WeaverseNextServerClientConfig
): WeaverseNextServerClient {
  return new NextServerClient(config)
}

export { getContextSearchParams } from './configs'
