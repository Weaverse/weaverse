import type { HydrogenContext, I18nBase } from '@shopify/hydrogen'
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

export type AllCacheOptions = {
  mode?:
    | 'must-revalidate'
    | 'no-cache'
    | 'no-store'
    | 'private'
    | 'public'
    | string
  maxAge?: number
  staleWhileRevalidate?: number
  sMaxAge?: number
  staleIfError?: number
}

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
  pageAssignment: HydrogenPageAssignment
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

export type WeaverseClientArgs = HydrogenContext & {
  components: HydrogenComponent[]
  themeSchema: HydrogenThemeSchema
  request: Request
  cache: Cache
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
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as any).theme !== undefined
  )
}

/**
 * Enhanced type utilities for better development experience
 */
export type HydrogenSchemaValidationResult =
  SchemaValidationResult<HydrogenComponentSchema>

/**
 * Type guard to check if a schema is valid
 */
export function isValidHydrogenSchema(
  schema: unknown
): schema is HydrogenComponentSchema {
  // We can leverage the validation from the schema package
  return (
    typeof schema === 'object' &&
    schema !== null &&
    'type' in schema &&
    'title' in schema
  )
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
