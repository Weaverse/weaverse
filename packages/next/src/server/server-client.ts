import type { SchemaType } from '@weaverse/schema'
import { runWeaverseComponentLoaders } from '../loader'
import { registerWeaverseNextComponents } from '../registry'
import { buildWeaverseNextRequestInfo } from '../request-info'
import type {
  WeaverseNextBaseConfigs,
  WeaverseNextCommerceContext,
  WeaverseNextComponent,
  WeaverseNextComponentData,
  WeaverseNextConfigs,
  WeaverseNextFetchOptions,
  WeaverseNextLoaderData,
  WeaverseNextLoadPageInput,
  WeaverseNextPageData,
  WeaverseNextProjectId,
  WeaverseNextRequestContext,
  WeaverseNextServerClient,
  WeaverseNextServerClientConfig,
  WeaverseNextServerLoadPageInput,
  WeaverseNextStorefront,
  WeaverseNextThemeSettingsOptions,
  WeaverseNextThemeSettingsResponse,
} from '../types'
import { generateDataFromSchema } from '../utils'
import { getContextSearchParams, getWeaverseNextConfigs } from './configs'
import { normalizeNextPageUrl, resolveRequestUrl } from './normalize-page-url'

const DEFAULT_FETCH_TIMEOUT_MS = 10_000

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
} as const

/** Next's `fetch` reads `next: { revalidate, tags }` off the request init. */
type NextRequestInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] }
}

type LooseThemeSchema = {
  i18n?: { staticContent?: Record<string, unknown> }
  inspector?: unknown[]
  settings?: {
    inputs?: { condition?: unknown }[]
    [key: string]: unknown
  }[]
}

function asThemeSchema(schema: unknown): LooseThemeSchema | undefined {
  return schema && typeof schema === 'object'
    ? (schema as LooseThemeSchema)
    : undefined
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Math.random().toString(36).slice(2)}`
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
  themeSchema?: unknown
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
    this.components = config.components
    registerWeaverseNextComponents(this.components)
    this.commerce = config.commerce
    this.requestContext = config.requestContext
    this.themeSchema = config.themeSchema
    // Seed schema defaults before merchant overrides, mirroring the root client.
    this.themeSettings = {
      ...generateDataFromSchema(config.themeSchema as SchemaType | undefined),
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

  loadPage = async (
    input: WeaverseNextLoadPageInput = {}
  ): Promise<WeaverseNextLoaderData | null> => {
    try {
      let {
        cache,
        projectId: routeProjectId,
        ...rest
      } = input as WeaverseNextServerLoadPageInput
      let effectiveProjectId =
        (typeof routeProjectId === 'string' && routeProjectId.trim()) ||
        (await this.resolveProjectId())

      // Propagate a route-level projectId override to the public configs *before*
      // running component loaders and returning, so `client.projectId`,
      // `args.weaverse.projectId`, and the runtime all observe the override.
      if (effectiveProjectId) {
        this.configs = this._buildPublicConfigs(effectiveProjectId)
      }

      // Studio "section preview" mode renders a single section from its presets
      // without a real page fetch — and must work even without a projectId.
      if (this._baseConfigs.isPreviewMode) {
        let previewData = this._generatePreviewData(effectiveProjectId || 'x')
        this.data = previewData
        return previewData
      }

      if (!effectiveProjectId) {
        throw new Error('Missing Weaverse projectId!')
      }

      // Build params: forward serializable load fields (type/handle/locale +
      // any extra), dropping undefined values, cache, and projectId.
      let params: Record<string, unknown> = {}
      for (let [key, value] of Object.entries(rest)) {
        if (value !== undefined) {
          params[key] = value
        }
      }

      let i18n = this.requestContext?.i18n ?? this.commerce?.storefront?.i18n
      let url = normalizeNextPageUrl(resolveRequestUrl(this.requestContext))
      let body = {
        projectId: effectiveProjectId,
        url,
        i18n,
        params,
        isDesignMode: this._baseConfigs.isDesignMode,
      }

      let apiUrl = `${this._baseConfigs.weaverseApiBase}/api/public/project`
      let userAgent = this.requestContext?.headers?.get('user-agent') ?? ''
      let payload = await this.fetchWithCache<Record<string, unknown>>(apiUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { ...JSON_HEADERS, 'X-Visitor-UA': userAgent },
        ...(cache ?? {}),
      })

      if (payload && typeof payload === 'object' && 'error' in payload) {
        let errorValue = (payload as { error?: unknown }).error
        if (typeof errorValue === 'string') {
          throw new Error(errorValue)
        }
      }

      let record = (
        payload && typeof payload === 'object' ? payload : {}
      ) as Record<string, unknown>
      let page = record.page as WeaverseNextPageData | undefined
      let project = record.project as
        | WeaverseNextLoaderData['project']
        | undefined
      let pageAssignment = record.pageAssignment as
        | WeaverseNextLoaderData['pageAssignment']
        | undefined

      if (!project) {
        project = {
          id: effectiveProjectId,
          name: 'Weaverse project not found.',
          weaverseShopId: '',
        }
      }
      if (!page) {
        page = this._generateFallbackPage(
          '<div style="text-align: center;">Please add new section to start.</div>'
        )
      }
      if (Array.isArray(page.items) && page.items.length === 0) {
        page.items.push({
          type: 'main',
          id: page.rootId || generateUuid(),
          data: {},
        })
      }

      let configs = {
        ...this._buildPublicConfigs(effectiveProjectId),
        requestInfo: buildWeaverseNextRequestInfo(this.requestContext),
      }

      let data: WeaverseNextLoaderData = {
        page,
        project,
        pageAssignment,
        configs,
      }

      // Run component loaders server-side so sections get their data.
      this.data = data
      let withLoaders = await runWeaverseComponentLoaders({
        client: this,
        data,
      })
      this.data = withLoaders ?? data
      return this.data
    } catch (error) {
      console.error('❌ Page load failed', {
        url: this.requestContext?.url,
        projectId: input.projectId || this.configs.projectId,
        message: error instanceof Error ? error.message : String(error),
      })
      return null
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
    let defaultThemeSettings = generateDataFromSchema(
      this.themeSchema as SchemaType | undefined
    )
    let staticContent = themeSchema?.i18n?.staticContent

    try {
      let projectId = await this.resolveProjectId()
      if (!projectId) {
        throw new Error('Missing Weaverse projectId!')
      }

      let { isDesignMode } = this._baseConfigs
      let url = `${this._baseConfigs.weaverseApiBase}/api/public/project_configs`
      let result = await this.fetchWithCache<WeaverseNextThemeSettingsResponse>(
        url,
        {
          method: 'POST',
          body: JSON.stringify({ projectId, isDesignMode }),
          headers: JSON_HEADERS,
          revalidate: options.revalidate,
          tags: options.tags,
        }
      )

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

      if (isDesignMode) {
        result = {
          ...result,
          schema: themeSchema
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
            : undefined,
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

export { getContextSearchParams }
