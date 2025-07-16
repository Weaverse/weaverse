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
import type { WeaverseHydrogen } from './index'
import type { ThemeSettingsStore } from './utils/use-theme-settings-store'
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

export interface AllCacheOptions {
  mode?: string
  maxAge?: number
  staleWhileRevalidate?: number
  sMaxAge?: number
  staleIfError?: number
}

export type ComponentLoaderArgs<T = any, E = any> = {
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

export interface HydrogenElement {
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
}

export interface HydrogenComponent<T extends HydrogenComponentProps = any> {
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

export interface WeaverseLoaderData {
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

export interface HydrogenThemeSchema {
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
  page: HydrogenPageData
  project: HydrogenProjectType
  pageAssignment: HydrogenPageAssignment
  error?: string
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
  interface Env {
    WEAVERSE_PROJECT_ID: string
    WEAVERSE_HOST: string
    WEAVERSE_API_KEY: string
  }
}

declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    weaverse: WeaverseClient
  }
}

declare module '@shopify/hydrogen' {
  interface HydrogenEnv {
    WEAVERSE_PROJECT_ID: string
    WEAVERSE_HOST?: string
    WEAVERSE_API_KEY: string
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
