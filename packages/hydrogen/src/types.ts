import type { HydrogenContext, I18nBase } from '@shopify/hydrogen'
import type {
  AppLoadContext,
  LoaderFunctionArgs as RemixOxygenLoaderArgs,
} from '@shopify/remix-oxygen'
import type {
  BasicInput as CoreBasicInput,
  ElementData,
  ElementSchema,
  InputType,
  PositionInputValue,
  WeaverseCoreParams,
  WeaverseElement,
  WeaverseImage,
  WeaverseProjectDataType,
  WeaverseResourcePickerData,
  WeaverseVideo,
} from '@weaverse/react'
import type * as React from 'react'
import type { ForwardRefExoticComponent } from 'react'
import type { NavigateFunction } from 'react-router'
import type { WeaverseHydrogen } from './index'
import type { ThemeSettingsStore } from './utils/use-theme-settings-store'
import type { WeaverseClient } from './weaverse-client'
export type { InputType, PositionInputValue, WeaverseImage, WeaverseVideo }

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

export interface HydrogenComponentSchema extends ElementSchema {
  childTypes?: string[]
  inspector?: InspectorGroup[]
  settings?: InspectorGroup[]
  presets?: Omit<HydrogenComponentPresets, 'type'>
  limit?: number
  enabledOn?: {
    pages?: ('*' | PageType)[]
    groups?: ('*' | 'header' | 'footer' | 'body')[]
  }
}

export type BasicInput = Omit<CoreBasicInput, 'condition'> & {
  shouldRevalidate?: boolean
  condition?:
    | string
    | ((data: ElementData, weaverse: WeaverseHydrogen) => boolean)
}

export type HeadingInputType = 'heading'

export type HeadingInput = {
  type: HeadingInputType
  label: string
  [key: string]: any
}

export interface InspectorGroup {
  group: string
  inputs: (BasicInput | HeadingInput)[]
}

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

export type HydrogenComponentPresets = {
  type: string
  children?: HydrogenComponentPresets[]
  [key: string]: any
}

export interface HydrogenElement {
  Component:
    | ForwardRefExoticComponent<HydrogenComponentProps>
    | ((props: HydrogenComponentProps) => React.JSX.Element)
  type: string
  schema?: HydrogenComponentSchema
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
  inspector?: InspectorGroup[]
  settings?: InspectorGroup[]
  i18n?: {
    urlStructure: 'url-path' | 'subdomain' | 'top-level-domain'
    defaultLocale: WeaverseI18n
    shopLocales: WeaverseI18n[]
  }
}

export type PageType =
  | 'INDEX'
  | 'PRODUCT'
  | 'ALL_PRODUCTS'
  | 'COLLECTION'
  | 'COLLECTION_LIST'
  | 'PAGE'
  | 'BLOG'
  | 'ARTICLE'
  | 'CUSTOM'

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
    WEAVERSE_HOST: string
    WEAVERSE_API_KEY: string
  }
}
