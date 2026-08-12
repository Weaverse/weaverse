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
  ComponentAvailabilityContext,
  ComponentGroup,
  HeadingInput,
  InputType,
  InspectorGroup,
  PageSEOData,
  PageType,
  Resolvable,
  ComponentPresets as SchemaComponentPresets,
  SchemaType,
  SchemaValidationIssue,
  SchemaValidationResult,
} from '@weaverse/schema'
import { isValidSchema } from '@weaverse/schema'
import type * as React from 'react'
import type { ForwardRefExoticComponent } from 'react'
import type { NavigateFunction } from 'react-router'
import type { TranslationStore } from './utils/translation-store'
import type { ThemeSettingsStore } from './utils/use-theme-settings-store'
import type { WeaverseHydrogen } from './WeaverseHydrogenRoot'
import type { WeaverseClient } from './weaverse-client'

// Re-export CachingStrategy from Hydrogen for convenience
export type { CachingStrategy } from '@shopify/hydrogen'
// Re-export types from schema for backward compatibility and convenience
export type {
  // Enhanced type exports
  BasicInput,
  ComponentAvailabilityContext,
  ComponentGroup,
  HeadingInput,
  InputType,
  InspectorGroup,
  PageType,
  PositionInputValue,
  Resolvable,
  SchemaValidationIssue,
  SchemaValidationResult,
  WeaverseImage,
  WeaverseVideo,
}

/** Arguments passed to a component's server-side loader. */
export type ComponentLoaderArgs<T = any, _E = any> = {
  /** Persisted component data merged with schema defaults. */
  data: T
  /** Request-scoped client available to the component loader. */
  weaverse: WeaverseClient
}

/** Application load context initialized with a request-scoped Weaverse client. */
export interface WeaverseRouteAppLoadContext extends AppLoadContext {
  /** Client used to load Weaverse content for the current request. */
  weaverse: WeaverseClient
}

/** React Router loader arguments whose app context includes the Weaverse client. */
export interface RouteLoaderArgs extends RemixOxygenLoaderArgs {
  /** Request-scoped application context with the initialized Weaverse client. */
  context: WeaverseRouteAppLoadContext
}

/** Primitive value accepted in a component's persisted data. */
export type ComponentDataValue = string | number | boolean | undefined | null

/** Reference to a direct child component instance. */
export interface HydrogenChildComponentReference {
  /** Unique identifier of the child component instance. */
  id: string
}

/** Serialized component instance returned in a Weaverse page. */
export interface HydrogenComponentData extends ElementData {
  /** References to direct child component instances. */
  children?: HydrogenChildComponentReference[]
  /** ISO timestamp recording when the component instance was created. */
  createdAt?: string
  /** Persisted component setting values and structured payloads. */
  data?: Record<string, ComponentDataValue | Record<string, unknown>>
  /** ISO timestamp recording soft deletion, when applicable. */
  deletedAt?: string
  /** Unique component instance identifier. */
  id: string
  /** Registered component type used to select its renderer. */
  type: string
  /** ISO timestamp recording the latest component update. */
  updatedAt?: string
}

/**
 * Optimized: Use Zod-inferred SchemaType directly instead of extending
 * This ensures perfect type consistency with the schema validation
 */
export type HydrogenComponentSchema = SchemaType

/** Props supplied by Weaverse when rendering a registered Hydrogen component. */
export interface HydrogenComponentProps<L = any> extends WeaverseElement {
  /** Rendered child component instances. */
  children?: React.JSX.Element[]
  /** Optional CSS class passed through by the renderer. */
  className?: string
  /** Result returned by the component's server-side loader. */
  loaderData?: L
}

/** Normalized request details attached to loader data for Studio navigation. */
export type WeaverseLoaderRequestInfo = {
  /** URL search string, including the leading question mark when present. */
  search: string
  /** Storefront request pathname. */
  pathname: string
  /** Parsed request query parameters. */
  queries: {
    /** Query parameter value keyed by parameter name. */
    [key: string]: string | boolean
  }
  /** Locale used to load the page. */
  i18n: WeaverseI18n
}

/** Published theme setting values keyed by schema setting name. */
export type HydrogenThemeSettings = {
  /** Published theme setting value keyed by schema setting name. */
  [key: string]: any
}

/** Project metadata returned with a Weaverse page payload. */
export type HydrogenProjectType = {
  /** Unique Weaverse project identifier. */
  id: string
  /** Identifier of the Shopify shop connected to the project. */
  weaverseShopId: string
  /** Human-readable project name. */
  name: string
  /** Additional project metadata returned by the content API. */
  [key: string]: any
}

/** Runtime services and project metadata exposed to Weaverse integrations. */
export type WeaverseInternal = {
  /** Route assignment for the rendered Weaverse page. */
  pageAssignment: HydrogenPageAssignment
  /** Metadata for the active Weaverse project. */
  project: HydrogenProjectType
  /** React Router navigation function, attached in design mode. */
  navigate: NavigateFunction
  /** Revalidates the active React Router data routes. */
  revalidate: () => void
  /** Mutable theme settings store used by Studio. */
  themeSettingsStore: ThemeSettingsStore
  /** Mutable translation store used by Studio, when translations are enabled. */
  translationStore?: TranslationStore | null
  /** @deprecated Use translationStore instead. */
  themeTextStore?: TranslationStore | null
  /** Active-locale merchant translation overrides. */
  merchantOverrides?: Record<string, unknown> | null
}

/**
 * Optimized: Use direct type alias to maintain consistency
 */
export type HydrogenComponentPresets = SchemaComponentPresets

/** Registered runtime definition for a Hydrogen component type. */
export type HydrogenElement = {
  /** React renderer for this registered component type. */
  Component:
    | ForwardRefExoticComponent<HydrogenComponentProps>
    | ((props: HydrogenComponentProps) => React.JSX.Element)
  /** Unique component type matching the component schema. */
  type: string
  /** Component schema used for settings, defaults, and availability. */
  schema?: HydrogenComponentSchema
  /** Optional data loader function for server-side data fetching. */
  loader?: (args: ComponentLoaderArgs) => Promise<unknown>
}

/** Initialization parameters for a request-scoped {@link WeaverseHydrogen} runtime. */
export interface WeaverseHydrogenParams
  extends Omit<WeaverseCoreParams, 'ItemConstructor'> {
  /** Page content used to initialize component instances. */
  data: HydrogenPageData
  /** Route loader data made available to component data bindings. */
  dataContext?: Record<string, unknown> | null
  /** Runtime services and metadata available to integrations. */
  internal: Partial<WeaverseInternal>
  /** Whether the page is running inside the visual editor. */
  isDesignMode?: boolean
  /** Whether a component preview is being rendered. */
  isPreviewMode?: boolean
  /** Whether a saved page revision is being previewed. */
  isRevisionPreview?: boolean
  /** Identifier of the page being rendered. */
  pageId: string
  /** Identifier of the Weaverse project supplying content. */
  projectId: string
  /** Normalized URL and locale information for this request. */
  requestInfo: WeaverseLoaderRequestInfo
  /** Component type requested by section preview mode. */
  sectionType?: string
  /** Base URL used for public Weaverse API requests. */
  weaverseApiBase: string
  /**
   * API key read from environment/configuration for storefront requests or
   * supplied by Studio requests while editing and previewing.
   */
  weaverseApiKey: string
  /** Origin used for Weaverse Studio assets and editor communication. */
  weaverseHost: string
  /**
   * Public data API origin. Keep `weaverseHost` for Studio scripts/editor
   * assets; point this at the Cloudflare proxy (`https://api.weaverse.io`)
   * when edge caching is enabled.
   */
  weaversePublicApiBase?: string
  /** Optional Studio asset version used by preview integrations. */
  weaverseVersion?: string
}

/** Export shape for a renderable component, its schema, and optional loader. */
export type HydrogenComponent<T extends HydrogenComponentProps = any> = {
  /** React renderer exported by the component module. */
  default: ForwardRefExoticComponent<T> | ((props: T) => React.JSX.Element)
  /** Schema exported by the component module. */
  schema: HydrogenComponentSchema
  /** Optional data loader function for server-side data fetching. */
  loader?: (args: ComponentLoaderArgs) => Promise<unknown>
}

/** Weaverse Studio query parameters recognized by the Hydrogen runtime. */
export type WeaverseStudioQueries = {
  /** Project identifier selected by Studio for this request. */
  weaverseProjectId: string
  /** API key passed by Studio for design and preview requests. */
  weaverseApiKey: string
  /** Studio origin serving editor assets and APIs. */
  weaverseHost: string
  /** Studio asset version requested by the editor. */
  weaverseVersion: string
  /** Whether the request is for the visual editor. */
  isDesignMode: boolean
  /** Whether the request renders a component preview. */
  isPreviewMode?: boolean
  /** Component type requested for section preview. */
  sectionType?: string
}

/** Storefront-safe environment values exposed with theme settings. */
export type PublicEnv = {
  /** Public Shopify storefront domain. */
  PUBLIC_STORE_DOMAIN: string
  /** Public Storefront API access token. */
  PUBLIC_STOREFRONT_API_TOKEN: string
}

/** Resolved project, API endpoint, and rendering-mode configuration. */
export type WeaverseProjectConfigs = {
  /** Identifier of the Weaverse project supplying content. */
  projectId: string
  /** Origin used for Studio assets and editor communication. */
  weaverseHost: string
  /** Base URL used for public Weaverse content API requests. */
  weaverseApiBase: string
  /** Explicit public data API origin, when separately configured. */
  weaversePublicApiBase?: string
  /**
   * API key read from environment/configuration for storefront requests or
   * supplied by Studio requests while editing and previewing.
   */
  weaverseApiKey: string
  /** Optional Studio asset version. */
  weaverseVersion?: string
  /** Whether the request is running inside the visual editor. */
  isDesignMode?: boolean
  /** Whether the request renders a component preview. */
  isPreviewMode?: boolean
  /** Whether the request previews a saved page revision. */
  isRevisionPreview?: boolean
  /** Component type requested for section preview. */
  sectionType?: string
  /** Storefront-safe environment values exposed with theme settings. */
  publicEnv?: PublicEnv
}

/** Assignment describing which project page handles a storefront route. */
export type HydrogenPageAssignment = {
  /** Project identifier owning the assigned page. */
  projectId: string
  /** Storefront page type matched by the assignment. */
  type: PageType
  /** Route or resource handle matched by the assignment. */
  handle: string
  /** Locale matched by the assignment. */
  locale: string
  /** Inheritance details when the assignment comes from another project. */
  meta?: {
    /** Whether the assignment was inherited. */
    inherited: boolean
    /** Project identifier where the assignment originated. */
    sourceProjectId: string
    /** Number of inheritance levels traversed. */
    depth: number
  }
}

/** Complete payload returned by {@link WeaverseClient.loadPage}. */
export type WeaverseLoaderData = {
  /** Resolved runtime configuration and normalized request details. */
  configs: Omit<WeaverseProjectConfigs, 'publicEnv'> & {
    /** Normalized URL and locale information for the request. */
    requestInfo: WeaverseLoaderRequestInfo
  }
  /** Published page content to render. */
  page: HydrogenPageData
  /** Metadata for the project supplying the page. */
  project: HydrogenProjectType
  /** Route assignment that selected the page, when available. */
  pageAssignment?: HydrogenPageAssignment
}

/** Published Weaverse page content consumed by the Hydrogen renderer. */
export interface HydrogenPageData extends WeaverseProjectDataType {
  /** Internal cache identifier attached by the content API when available. */
  __cacheId?: string
  /** Unique page identifier. */
  id: string
  /** Serialized component instances belonging to the page. */
  items: HydrogenComponentData[]
  /** Human-readable page name. */
  name: string
  /**
   * Page-level SEO metadata published by Weaverse Builder. `null` when
   * the page has no `PageSeo` row; absent on revision snapshots that
   * predate the SEO feature. Themes should treat both as "no Weaverse
   * override".
   */
  seo?: PageSEOData | null
  /** Additional page fields supplied by the content API. */
  [key: string]: any
}

/** Locale metadata used when requesting localized Weaverse content. */
export type WeaverseI18n = I18nBase & {
  /** Human-readable locale label displayed in Studio. */
  label?: string
  /** Locale path prefix used by the storefront router. */
  pathPrefix?: string
  /** Additional locale metadata supplied by the storefront. */
  [key: string]: any
}

/** Theme metadata, global settings, and localization configuration. */
export type HydrogenThemeSchema = {
  /** Theme identity, author, and support metadata. */
  info: {
    /** Human-readable theme name. */
    name: string
    /** Theme version displayed in Studio. */
    version: string
    /** Theme author name. */
    author: string
    /** URL of the theme author's profile image. */
    authorProfilePhoto: string
    /** URL of the theme documentation. */
    documentationUrl: string
    /** URL where merchants can request theme support. */
    supportUrl: string
  }
  /** @deprecated Use settings instead. */
  inspector?: InspectorGroup[]
  /** Groups of global theme settings exposed in Studio. */
  settings?: InspectorGroup[]
  /** Theme localization configuration. */
  i18n?: {
    /** Strategy used to encode the locale in storefront URLs. */
    urlStructure: 'url-path' | 'subdomain' | 'top-level-domain'
    /** Locale used when no localized route is selected. */
    defaultLocale: WeaverseI18n
    /** Locales enabled for the connected Shopify shop. */
    shopLocales: WeaverseI18n[]
    /** Default-locale static translation content. */
    staticContent?: Record<string, unknown>
    /** Enable the translation UI in the builder. */
    translation?: boolean
  }
}

/** Request body sent to the Weaverse project content endpoint. */
export type FetchProjectRequestBody = {
  /** Identifier of the project to load. */
  projectId: string
  /** Normalized storefront URL being resolved. */
  url: string
  /** Storefront locale for localized content. */
  i18n?: WeaverseI18n
  /** Optional route-specific page lookup parameters. */
  params?: {
    /** Storefront page type to load. */
    type?: PageType
    /** Locale override for this page lookup. */
    locale?: string
    /** Resource or custom-page handle to load. */
    handle?: string
  }
  /** Whether draft editor content should be returned. */
  isDesignMode?: boolean
}

/** Project content response before it is normalized into loader data. */
export type FetchProjectPayload = {
  /** Published or draft page content; absent when no page matches. */
  page?: HydrogenPageData
  /** Project metadata; absent in some error responses. */
  project?: HydrogenProjectType
  /** Assignment that selected the page, when one matched. */
  pageAssignment?: HydrogenPageAssignment
  /** API error message, when the request could not be fulfilled. */
  error?: string
  /** Additional fields returned by compatible API versions. */
  [key: string]: any
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

/** Product selected through a Weaverse resource-picker setting. */
export type WeaverseProduct = WeaverseResourcePickerData
/** Collection selected through a Weaverse resource-picker setting. */
export type WeaverseCollection = WeaverseResourcePickerData
/** Blog selected through a Weaverse resource-picker setting. */
export type WeaverseBlog = WeaverseResourcePickerData
/** Article selected through a Weaverse resource-picker setting. */
export type WeaverseArticle = WeaverseResourcePickerData
/** Metaobject selected through a Weaverse resource-picker setting. */
export type WeaverseMetaObject = WeaverseResourcePickerData

/** Response returned by Hydrogen's cached fetch helper. */
export type WithCacheFetchResponse<T> = {
  /** Parsed response payload. */
  data: T
  /** Underlying Fetch API response. */
  response: Response
}

/** Theme configuration returned by the Weaverse project API. */
export type ThemeSettingsResponse = {
  /** Published theme setting values. */
  theme?: HydrogenThemeSettings
  /** Theme schema included for Studio editing. */
  schema?: HydrogenThemeSchema
  /** Storefront-safe environment values included in design mode. */
  publicEnv?: PublicEnv
  /** Theme's default locale JSON from `themeSchema.i18n.staticContent`. */
  staticContent?: Record<string, unknown>
  /** Locale-specific merchant overrides from the API. */
  merchantOverrides?: Record<string, unknown>
  /** Diagnostic message when loading fell back to schema defaults. */
  _error?: string
  /** Whether remote theme settings failed to load. */
  _loadFailed?: boolean
}

/**
 * Legacy data-or-error response shape retained for compatibility.
 *
 * The client's current direct-fetch implementation uses
 * {@link WithCacheFetchResponse} internally instead of returning this shape.
 */
export type DirectFetchResponse<T = unknown> = {
  /** Parsed payload when the legacy request succeeded. */
  data?: T
  /** Error message when the legacy request failed. */
  error?: string
}

/** Predicate used to decide whether a fetched response may be cached. */
export type CacheResponseValidator<T = unknown> = (
  response: WithCacheFetchResponse<T> | T
) => boolean

/** Error raised by Weaverse requests with a stable code and optional context. */
export class WeaverseError extends Error {
  /** Machine-readable error code. */
  public readonly code: string
  /** HTTP status associated with the failure, when available. */
  public readonly statusCode?: number
  /** Structured diagnostic details for logging and error handling. */
  public readonly context?: Record<string, unknown>

  /** Creates a Weaverse request error with a stable code and diagnostics. */
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
  /** Whether the project identifier passed validation. */
  valid: boolean
  /** Validation error message when `valid` is false. */
  error?: string
}

/** Published custom page entry suitable for sitemap generation. */
export interface CustomPageEntry {
  /** Suggested sitemap update frequency. */
  changeFrequency?: 'daily' | 'weekly' | 'monthly'
  /** Weaverse custom page handle. */
  handle: string
  /** ISO timestamp of the latest published update. */
  lastModified: string
  /** Locale code, or `null` for the project's default locale. */
  locale: string | null
  /** Storefront path for the custom page. */
  path: string
  /** Optional sitemap priority from zero to one. */
  priority?: number
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

/** Checks whether a value contains the required project response fields. */
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

/** Response containing an error message returned by a Weaverse request. */
export interface WeaverseErrorResponse {
  /** Human-readable request failure message. */
  error: string
}

/** Checks whether a response contains a string error message. */
export function hasError(response: unknown): response is WeaverseErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as Record<string, unknown>).error === 'string'
  )
}

/** Checks whether a value contains a theme settings object. */
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

/** Type-safe component schema authoring options. */
export type CreateHydrogenSchemaOptions = {
  /** Human-readable component title displayed in Studio. */
  title: string
  /** Unique component type used for registration and persisted items. */
  type: string
  /** Maximum number of instances allowed in the containing scope. */
  limit?: number
  /** Inspector groups defining editable component settings. */
  settings?: InspectorGroup[]
  /** Component types allowed as direct children. */
  childTypes?: string[]
  /**
   * Legacy page and placement availability restrictions.
   *
   * @deprecated Use `enabled` instead. Convert the arrays to checks in an
   * `enabled` resolver, for example:
   * `enabled: ({page, group}) => pages.includes(page.type) &&
   * (groups.includes('*') || groups.includes(group))`.
   */
  enabledOn?: {
    /** Page types where the component can be inserted. */
    pages?: PageType[]
    /** Placement groups where the component can be inserted; `*` allows all. */
    groups?: ('*' | 'header' | 'footer' | 'body')[]
  }
  /** Static or context-aware component availability rule. */
  enabled?: Resolvable<boolean, ComponentAvailabilityContext>
  /** Default component data and optional nested component presets. */
  presets?: {
    /** Components inserted as children by the preset. */
    children?: SchemaComponentPresets[]
    /** Additional default setting value keyed by setting name. */
    [key: string]: any
  }
}

// Extended window interface for hydrogen-specific globals
declare global {
  interface Window {
    __weaverse?: WeaverseHydrogen
    __weaverses?: Record<string, WeaverseHydrogen>
    __weaverseThemeSettingsStore?: ThemeSettingsStore
  }
}

/** Browser bridge exposed by Weaverse Studio in design and preview modes. */
export interface WeaverseStudio {
  /** Connects Studio to a newly created Hydrogen runtime. */
  init: (weaverse: WeaverseHydrogen) => void
  /** Refreshes Studio after the active runtime configuration changes. */
  refreshStudio: (params: WeaverseHydrogenParams) => void
}

/** Browser window after the Weaverse Studio bridge has initialized. */
export interface WeaverseStudioWindow extends Window {
  /** Studio bridge used to initialize and refresh the Hydrogen runtime. */
  weaverseStudio: WeaverseStudio
}

/** Checks whether the browser window exposes the Weaverse Studio bridge. */
export function hasWeaverseStudio(
  window: Window
): window is WeaverseStudioWindow {
  return 'weaverseStudio' in window && typeof window.weaverseStudio === 'object'
}

declare module '@shopify/remix-oxygen' {
  interface AppLoadContext {
    weaverse: WeaverseClient
  }
}

declare module '@shopify/hydrogen' {
  interface HydrogenEnv {
    CUSTOM_COLLECTION_BANNER_METAFIELD: string
    JUDGEME_PRIVATE_API_TOKEN: string
    KLAVIYO_PRIVATE_API_TOKEN: string
    METAOBJECT_COLOR_NAME_KEY: string
    METAOBJECT_COLOR_VALUE_KEY: string
    METAOBJECT_COLORS_TYPE: string
    PUBLIC_GOOGLE_GTM_ID: string
    PUBLIC_SHOPIFY_INBOX_SHOP_ID: string
    PUBLIC_STORE_DOMAIN: string
    PUBLIC_STOREFRONT_API_TOKEN: string
    WEAVERSE_API_KEY: string
    WEAVERSE_HOST?: string
    WEAVERSE_PROJECT_ID: string
    WEAVERSE_PUBLIC_API_BASE?: string
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

// ─── Translation sidecar types (design mode) ─────────────────────────

/** A single translated field for one item. */
export interface TranslationMapEntry {
  /** Source-locale value used to detect subsequent content changes. */
  originalValue: string
  /** Localized value rendered for the target locale. */
  translatedValue: string
}

/** Per-item translation fields, keyed by field name */
export type TranslationItemEntry = {
  /** Translation entry keyed by component field name. */
  [key: string]: TranslationMapEntry
}

/**
 * Translation map sent from the builder alongside page data in design mode.
 * Keyed by item ID, each value maps field names to translation entries.
 */
export type TranslationMap = {
  /** Translated fields keyed by component instance identifier. */
  [itemId: string]: TranslationItemEntry
}

/** A single translation entry for save payloads. */
export interface TranslationEntry {
  /** Marks an existing translation for deletion. */
  deleted?: boolean
  /** Identifier of the component instance owning the field. */
  itemId: string
  /** Dot-path to the translated component field. */
  key: string
  /** Source-locale value used to detect content changes. */
  originalValue: string
  /** Localized value to persist. */
  translatedValue: string
}

/** Result of collecting translation changes for the save flow */
export type TranslationChanges = {
  /** Builder language identifier receiving the changes. */
  languageId: string
  /** Translation entries to create, update, or delete. */
  entries: TranslationEntry[]
}
