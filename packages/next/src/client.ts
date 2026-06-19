import { registerWeaverseNextComponents } from './registry'
import type {
  WeaverseNextClient,
  WeaverseNextClientConfig,
  WeaverseNextCommerceContext,
  WeaverseNextComponent,
  WeaverseNextLoaderData,
  WeaverseNextLoadPageInput,
  WeaverseNextRequestContext,
  WeaverseNextStorefront,
} from './types'

/**
 * Request-safe Weaverse client for Next.js. Holds the component registry, theme
 * data, request/commerce context, and the currently loaded page payload.
 *
 * Unlike Hydrogen's `WeaverseClient`, it never receives a React Router
 * `Request`/`LoaderFunctionArgs`. Network I/O is delegated to `fetchPage` /
 * `fetchThemeSettings` injected through config, keeping v0 testable without
 * real Weaverse API calls.
 */
class NextClient implements WeaverseNextClient {
  projectId: string
  components: WeaverseNextComponent[]
  themeSchema?: unknown
  themeSettings: Record<string, unknown>
  requestContext?: WeaverseNextRequestContext
  commerce?: WeaverseNextCommerceContext
  data: WeaverseNextLoaderData | null = null
  dataContext: Record<string, unknown> = {}

  private readonly _fetchPage?: WeaverseNextClientConfig['fetchPage']
  private readonly _fetchThemeSettings?: WeaverseNextClientConfig['fetchThemeSettings']

  constructor(config: WeaverseNextClientConfig) {
    this.projectId = config.projectId
    this.components = config.components
    registerWeaverseNextComponents(this.components)
    this.themeSchema = config.themeSchema
    this.themeSettings = config.themeSettings ?? {}
    this.requestContext = config.requestContext
    this.commerce = config.commerce
    this._fetchPage = config.fetchPage
    this._fetchThemeSettings = config.fetchThemeSettings
  }

  /** Compatibility alias so loaders can call `weaverse.storefront.query(...)`. */
  get storefront(): WeaverseNextStorefront | undefined {
    return this.commerce?.storefront
  }

  loadPage = (
    input: WeaverseNextLoadPageInput = {}
  ): Promise<WeaverseNextLoaderData | null> => {
    if (!this._fetchPage) {
      throw new Error(
        '[WeaverseNextClient] loadPage requires a `fetchPage` function in client config.'
      )
    }
    return this._fetchPage(input)
  }

  loadThemeSettings = (
    context?: WeaverseNextRequestContext
  ): Promise<unknown> => {
    if (!this._fetchThemeSettings) {
      throw new Error(
        '[WeaverseNextClient] loadThemeSettings requires a `fetchThemeSettings` function in client config.'
      )
    }
    return this._fetchThemeSettings(context ?? this.requestContext)
  }
}

/**
 * Create a {@link WeaverseNextClient} from explicit config.
 *
 * @example
 * ```ts
 * let client = createWeaverseNextClient({
 *   projectId: process.env.WEAVERSE_PROJECT_ID!,
 *   components,
 *   commerce: { storefront },
 *   fetchPage: async ({ type, handle }) => fetchWeaversePage({ type, handle }),
 * })
 * ```
 */
export function createWeaverseNextClient(
  config: WeaverseNextClientConfig
): WeaverseNextClient {
  return new NextClient(config)
}
