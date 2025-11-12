import type {
  CachingStrategy,
  HydrogenContext,
  I18nBase,
} from '@shopify/hydrogen'
import type {
  AppLoadContext,
  LoaderFunctionArgs as RemixOxygenLoaderArgs,
} from '@shopify/remix-oxygen'
import type {
  ElementData,
  PositionInputValue,
  WeaverseCoreParams,
  WeaverseElement,
  WeaverseImage,
  WeaverseProjectDataType,
  WeaverseResourcePickerData,
  WeaverseVideo,
} from '@weaverse/react'
import type {
  // Enhanced type exports from schema package
  BasicInput,
  HeadingInput,
  InputType,
  InspectorGroup,
  PageType,
  ComponentPresets as SchemaComponentPresets,
  SchemaType,
  SchemaValidationIssue,
  SchemaValidationResult,
} from '@weaverse/schema'
import { isValidSchema } from '@weaverse/schema'
import type * as React from 'react'
import type { ForwardRefExoticComponent } from 'react'
import type { NavigateFunction } from 'react-router'
import type { ThemeSettingsStore } from './utils/use-theme-settings-store'
import type { WeaverseHydrogen } from './WeaverseHydrogenRoot'
import type { WeaverseClient } from './weaverse-client'

// Re-export types from schema for backward compatibility and convenience
export type {
  PositionInputValue,
  WeaverseImage,
  WeaverseVideo,
  PageType,
  InspectorGroup,
  // Enhanced type exports
  BasicInput,
  HeadingInput,
  InputType,
  SchemaValidationResult,
  SchemaValidationIssue,
}

// Re-export CachingStrategy from Hydrogen for convenience
export type { CachingStrategy } from '@shopify/hydrogen'

export type ComponentLoaderArgs<T = any, _E = any> = {
  data: T
  weaverse: WeaverseClient
}

export interface RouteLoaderArgs extends RemixOxygenLoaderArgs {
  context: AppLoadContext & {
    weaverse: WeaverseClient
  }
}

export interface HydrogenComponentData extends ElementData {
  data?: { [key: string]: any }
  children?: { id: string }[]
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

/**
 * Optimized: Use Zod-inferred SchemaType directly instead of extending
 * This ensures perfect type consistency with the schema validation
 */
export type HydrogenComponentSchema = SchemaType

export interface HydrogenComponentProps<L = any> extends WeaverseElement {
  className?: string
  loaderData?: L
  children?: React.JSX.Element[]
}

export type WeaverseLoaderRequestInfo = {
  search: string
  pathname: string
  queries: { [key: string]: string | boolean }
  i18n: WeaverseI18n
}

export type HydrogenThemeSettings = {
  [key: string]: any
}

export type HydrogenProjectType = {
  id: string
  weaverseShopId: string
  name: string
  [key: string]: any
}

export type WeaverseInternal = {
  pageAssignment: HydrogenPageAssignment
  project: HydrogenProjectType
  navigate: NavigateFunction
  revalidate: () => void
  themeSettingsStore: ThemeSettingsStore
}

/**
 * Optimized: Use direct type alias to maintain consistency
 */
export type HydrogenComponentPresets = SchemaComponentPresets

export type HydrogenElement = {
  Component:
    | ForwardRefExoticComponent<HydrogenComponentProps>
    | ((props: HydrogenComponentProps) => React.JSX.Element)
  type: string
  schema?: HydrogenComponentSchema
  /** Optional data loader function for server-side data fetching */
  loader?: (args: ComponentLoaderArgs) => Promise<unknown>
}

export interface WeaverseHydrogenParams
  extends Omit<WeaverseCoreParams, 'ItemConstructor'> {
  data: HydrogenPageData
  pageId: string
  internal: Partial<WeaverseInternal>
  requestInfo: WeaverseLoaderRequestInfo
  projectId: string
  weaverseHost: string
  weaverseApiBase: string
  weaverseApiKey: string
  weaverseVersion?: string
  isDesignMode?: boolean
  isPreviewMode?: boolean
  sectionType?: string
  dataContext?: Record<string, unknown> | null
}

export type HydrogenComponent<T extends HydrogenComponentProps = any> = {
  default: ForwardRefExoticComponent<T> | ((props: T) => React.JSX.Element)
  schema: HydrogenComponentSchema
  /** Optional data loader function for server-side data fetching */
  loader?: (args: ComponentLoaderArgs) => Promise<unknown>
}

export type WeaverseStudioQueries = {
  weaverseProjectId: string
  weaverseApiKey: string
  weaverseHost: string
  weaverseVersion: string
  isDesignMode: boolean
  isPreviewMode?: boolean
  sectionType?: string
}

export type PublicEnv = {
  PUBLIC_STORE_DOMAIN: string
  PUBLIC_STOREFRONT_API_TOKEN: string
}

export type WeaverseProjectConfigs = {
  projectId: string
  weaverseHost: string
  weaverseApiBase: string
  weaverseApiKey: string
  weaverseVersion?: string
  isDesignMode?: boolean
  isPreviewMode?: boolean
  sectionType?: string
  publicEnv?: PublicEnv
}

export type HydrogenPageAssignment = {
  projectId: string
  type: PageType
  handle: string
  locale: string
}

export type WeaverseLoaderData = {
  configs: Omit<WeaverseProjectConfigs, 'publicEnv'> & {
    requestInfo: WeaverseLoaderRequestInfo
  }
  page: HydrogenPageData
  project: HydrogenProjectType
  pageAssignment?: HydrogenPageAssignment
}

export interface HydrogenPageData extends WeaverseProjectDataType {
  id: string
  name: string
  items: HydrogenComponentData[]
  __cacheId?: string
  [key: string]: any
}

export type WeaverseI18n = I18nBase & {
  label?: string
  pathPrefix?: string
  [key: string]: any
}

export type HydrogenThemeSchema = {
  info: {
    name: string
    version: string
    author: string
    authorProfilePhoto: string
    documentationUrl: string
    supportUrl: string
  }
  /** @deprecated Use settings instead */
  inspector?: InspectorGroup[]
  settings?: InspectorGroup[]
  i18n?: {
    urlStructure: 'url-path' | 'subdomain' | 'top-level-domain'
    defaultLocale: WeaverseI18n
    shopLocales: WeaverseI18n[]
  }
}

export type FetchProjectRequestBody = {
  projectId: string
  url: string
  i18n?: WeaverseI18n
  params?: {
    type?: PageType
    locale?: string
    handle?: string
  }
  isDesignMode?: boolean
}

export type FetchProjectPayload = {
  page?: HydrogenPageData // Page might be missing for some routes
  project?: HydrogenProjectType // Project might be missing in error cases
  pageAssignment?: HydrogenPageAssignment // PageAssignment might be missing
  error?: string
  [key: string]: any // Allow additional properties from API response
}

/**
 * Project identifier value - can be static string or dynamic function.
 *
 * **Static String**: Direct project ID reference
 * ```ts
 * 'project-abc-123'
 * ```
 *
 * **Synchronous Function**: Returns project ID based on request context
 * ```ts
 * () => {
 *   const host = new URL(request.url).hostname
 *   return PROJECT_MAP[host] || 'default-project'
 * }
 * ```
 *
 * **Asynchronous Function**: Async project resolution (must be awaited before passing)
 * ```ts
 * async () => {
 *   return await database.getProjectId(userId)
 * }
 * ```
 */
export type ProjectIdValue = string | (() => string) | (() => Promise<string>)

/**
 * Type guard for detecting function-based projectId.
 *
 * Used internally by WeaverseClient constructor to determine
 * if projectId needs evaluation or can be used directly.
 */
export function isProjectIdFunction(
  projectId: ProjectIdValue | undefined
): projectId is (() => string) | (() => Promise<string>) {
  return typeof projectId === 'function'
}

/**
 * Extended WeaverseClient constructor arguments supporting multi-project architecture.
 *
 * @example Static project (existing pattern - backward compatible)
 * ```ts
 * const weaverse = new WeaverseClient({
 *   ...hydrogenContext,
 *   projectId: 'project-default-123'
 * })
 * ```
 *
 * @example Dynamic project selection (new capability)
 * ```ts
 * const weaverse = new WeaverseClient({
 *   ...hydrogenContext,
 *   projectId: () => {
 *     const origin = new URL(request.url).origin
 *     if (origin === 'https://mystore.se') return process.env.WEAVERSE_PROJECT_SWEDEN!
 *     if (origin === 'https://mystore.fr') return process.env.WEAVERSE_PROJECT_FRANCE!
 *     return process.env.WEAVERSE_PROJECT_ID!
 *   }
 * })
 * ```
 *
 * **Priority Chain** (highest to lowest):
 * 1. URL query parameter: `?weaverseProjectId=...` (design mode, preview mode)
 * 2. Function result (if function provided)
 * 3. Explicit string value (if string provided)
 * 4. Environment variable: `WEAVERSE_PROJECT_ID` (Hydrogen env or process.env)
 * 5. Empty string (triggers validation error in methods)
 *
 * **Function Requirements**:
 * - Must return non-empty string
 * - Can access request via closure for routing decisions
 * - Evaluated once per WeaverseClient instance (request-scoped)
 * - Async functions must be awaited before passing to constructor
 * - Should handle edge cases (missing headers, invalid domains, etc.)
 *
 * **Request Context Access**:
 * Functions access request via closure from constructor arguments.
 */
export type WeaverseClientArgs = HydrogenContext & {
  /**
   * React components registered with Weaverse CMS.
   * Each component must have a schema defining its properties and settings.
   */
  components: HydrogenComponent[]

  /**
   * Theme schema defining global theme settings (colors, fonts, layouts).
   * Used to generate default theme configuration and validate theme data.
   */
  themeSchema: HydrogenThemeSchema

  /**
   * Incoming HTTP request object from React Router loader.
   * Provides access to URL, headers, cookies for dynamic routing decisions.
   */
  request: Request

  /**
   * Hydrogen cache instance for content caching.
   *Supports multi-tenant caching with project-specific cache keys.
   */
  cache: Cache

  /**
   * Project identifier for loading content from Weaverse CMS.
   *
   * **Value Types**:
   * - Static string: 'project-123' (existing usage)
   * - Synchronous function: () => determineProject(request)
   * - Asynchronous function: async () => await getProject(request) (must be awaited)
   *
   * **Backward Compatibility**:
   * - Optional parameter (defaults to environment variable)
   * - Existing code without projectId continues to work unchanged
   *
   * **Cache Isolation**:
   * ProjectId is included in cache keys to prevent cross-project content pollution.
   * Each project's content is cached separately, ensuring multi-tenant isolation.
   */
  projectId?: ProjectIdValue

  /**
   * Fetch timeout in milliseconds for API requests.
   * Defaults to 10000ms (10 seconds) if not specified.
   * Useful for adjusting based on network conditions or deployment environment.
   *
   * @default 10000
   * @example
   * ```typescript
   * new WeaverseClient({
   *   // ... other args
   *   fetchTimeoutMs: 5000 // 5 second timeout
   * })
   * ```
   */
  fetchTimeoutMs?: number
}

export type WeaverseProduct = WeaverseResourcePickerData
export type WeaverseCollection = WeaverseResourcePickerData
export type WeaverseBlog = WeaverseResourcePickerData
export type WeaverseArticle = WeaverseResourcePickerData
export type WeaverseMetaObject = WeaverseResourcePickerData

/**
 * Response types for improved type safety
 */

// Response wrapper from withCache.fetch
export type WithCacheFetchResponse<T> = {
  data: T
  response: Response
}

// Theme settings response structure
export type ThemeSettingsResponse = {
  theme?: HydrogenThemeSettings
  schema?: HydrogenThemeSchema
  publicEnv?: PublicEnv
  _error?: string
  _loadFailed?: boolean
}

// Direct fetch response structure
export type DirectFetchResponse<T = unknown> = {
  data?: T
  error?: string
}

// Cache response validation function type
export type CacheResponseValidator<T = unknown> = (
  response: WithCacheFetchResponse<T> | T
) => boolean

// Weaverse Error class for better error handling
export class WeaverseError extends Error {
  public readonly code: string
  public readonly statusCode?: number
  public readonly context?: Record<string, unknown>

  constructor(
    message: string,
    code = 'WEAVERSE_ERROR',
    statusCode?: number,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'WeaverseError'
    this.code = code
    this.statusCode = statusCode
    this.context = context

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WeaverseError)
    }
  }
}

/**
 * Validation result type for project ID validation.
 * Returns validation status with optional error message.
 */
export type ProjectIdValidationResult = {
  valid: boolean
  error?: string
}

/**
 * Type guards for response validation
 */

export function isWithCacheFetchResponse<T>(
  response: unknown
): response is WithCacheFetchResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'response' in response
  )
}

export function isFetchProjectPayload(
  payload: unknown
): payload is FetchProjectPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'page' in payload &&
    'project' in payload &&
    'pageAssignment' in payload
  )
}

export function hasError(response: unknown): response is { error: string } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as Record<string, unknown>).error === 'string'
  )
}

export function isThemeSettingsResponse(
  data: unknown
): data is ThemeSettingsResponse {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const record = data as Record<string, unknown>
  return (
    'theme' in record &&
    typeof record.theme === 'object' &&
    record.theme !== null
  )
}

/**
 * Enhanced type utilities for better development experience
 */
export type HydrogenSchemaValidationResult =
  SchemaValidationResult<HydrogenComponentSchema>

/**
 * Type guard to check if a schema is valid.
 * Leverages validation from @weaverse/schema package which provides
 * comprehensive Zod-based validation with the ElementSchema.
 *
 * @param schema - Unknown value to validate
 * @returns True if schema is a valid HydrogenComponentSchema
 *
 * @example
 * ```typescript
 * if (isValidHydrogenSchema(userInput)) {
 *   // userInput is now typed as HydrogenComponentSchema
 *   console.log(userInput.type)
 * }
 * ```
 */
export function isValidHydrogenSchema(
  schema: unknown
): schema is HydrogenComponentSchema {
  // Use the comprehensive validation from @weaverse/schema package
  return isValidSchema(schema)
}

/**
 * Type-safe helper to create component schemas with validation
 */
export type CreateHydrogenSchemaOptions = {
  title: string
  type: string
  limit?: number
  settings?: InspectorGroup[]
  childTypes?: string[]
  enabledOn?: {
    pages?: PageType[]
    groups?: ('*' | 'header' | 'footer' | 'body')[]
  }
  presets?: {
    children?: SchemaComponentPresets[]
    [key: string]: any
  }
}

declare global {
  interface Window {
    __weaverse: WeaverseHydrogen
    __weaverses: Record<string, WeaverseHydrogen>
    __weaverseThemeSettingsStore: ThemeSettingsStore
  }
}

declare module '@shopify/remix-oxygen' {
  interface AppLoadContext {
    weaverse: WeaverseClient
  }
}

declare module '@shopify/hydrogen' {
  interface HydrogenEnv {
    WEAVERSE_PROJECT_ID: string
    WEAVERSE_HOST?: string
    WEAVERSE_API_BASE?: string
    WEAVERSE_API_KEY: string
    PUBLIC_STORE_DOMAIN: string
    PUBLIC_STOREFRONT_API_TOKEN: string
    PUBLIC_GOOGLE_GTM_ID: string
    JUDGEME_PRIVATE_API_TOKEN: string
    CUSTOM_COLLECTION_BANNER_METAFIELD: string
    METAOBJECT_COLORS_TYPE: string
    METAOBJECT_COLOR_NAME_KEY: string
    METAOBJECT_COLOR_VALUE_KEY: string
    KLAVIYO_PRIVATE_API_TOKEN: string
    PUBLIC_SHOPIFY_INBOX_SHOP_ID: string
  }
}

/**
 * Parameters for loadPage method supporting route-level project override.
 *
 * @example Basic usage (uses client-level project)
 * ```ts
 * const weaverseData = await weaverse.loadPage({
 *   type: 'PRODUCT',
 *   handle: params.productHandle
 * })
 * ```
 *
 * @example Route-level project override
 * ```ts
 * export async function loader({ params, context }: LoaderFunctionArgs) {
 *   const { weaverse } = context
 *
 *   // Use special campaign project for this route only
 *   const weaverseData = await weaverse.loadPage({
 *     type: 'PRODUCT',
 *     handle: params.productHandle,
 *     projectId: process.env.WEAVERSE_PROJECT_CAMPAIGN  // Override
 *   })
 *
 *   return { weaverseData }
 * }
 * ```
 */
export type LoadPageParams = {
  /**
   * Page type to load from Weaverse CMS.
   *
   * Determines which template to use for rendering the page.
   * Falls back to 'INDEX' if not specified or if page type doesn't exist.
   *
   * @default 'INDEX'
   */
  type?: PageType

  /**
   * Locale for internationalization.
   *
   * Format: IETF BCP 47 language tag (e.g., 'en-US', 'fr-FR', 'de-DE')
   * Used to load locale-specific content and translations.
   */
  locale?: string

  /**
   * Page handle for dynamic pages.
   *
   * Identifies specific resource within page type:
   * - Product handle: 'red-sneakers'
   * - Collection handle: 'summer-sale'
   * - Page handle: 'about-us'
   * - Article handle: 'how-to-style-sneakers'
   */
  handle?: string

  /**
   * Cache strategy override for this specific page load.
   *
   * Overrides default cache strategy for special use cases:
   * - Fresh content for checkout pages (no cache)
   * - Long-lived cache for static pages (1 hour+)
   * - Short-lived cache for frequently updated content (5 minutes)
   */
  strategy?: CachingStrategy

  /**
   * Optional project override for this specific page load.
   *
   * **Precedence**: Route-level projectId takes precedence over client-level projectId.
   *
   * **Use Cases**:
   * - Campaign landing pages with custom content
   * - VIP customer experiences with dedicated projects
   * - A/B testing specific pages without changing global config
   * - Seasonal promotions with limited-time content
   *
   * **Validation**:
   * - Must be non-empty string
   * - Validated before API call
   * - Falls back to client-level projectId if undefined
   * - Does NOT support function (string only)
   *
   * **Cache Isolation**:
   * Override projectId is included in cache key, ensuring separate caches
   * for different projects even on the same route.
   *
   * @example Campaign page override
   * ```ts
   * const campaignData = await weaverse.loadPage({
   *   type: 'PAGE',
   *   handle: 'summer-sale',
   *   projectId: process.env.WEAVERSE_PROJECT_CAMPAIGN
   * })
   * ```
   */
  projectId?: string
}
