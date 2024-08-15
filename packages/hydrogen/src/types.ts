// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type { NavigateFunction } from '@remix-run/react'
import type { HydrogenContext, I18nBase } from '@shopify/hydrogen'
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types'
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
import type { ForwardRefExoticComponent } from 'react'

import type { STORE_PAGES } from './context'
import type { ThemeSettingsStore } from './hooks/use-theme-settings'
import type { WeaverseClient } from './weaverse-client'

import type { WeaverseHydrogen } from './index'
export type { InputType, PositionInputValue, WeaverseImage, WeaverseVideo }

export type Locale = {
  language: LanguageCode
  country: CountryCode
  label: string
  currency: CurrencyCode
}

export type Localizations = { [key: string]: Locale }

export interface AllCacheOptions {
  mode?: string
  maxAge?: number
  staleWhileRevalidate?: number
  sMaxAge?: number
  staleIfError?: number
}

export type ComponentLoaderArgs<T = any, E = any> = {
  data: T
  weaverse: Omit<WeaverseClient, 'env'> & { env: E }
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

export type HydrogenToolbarAction =
  | 'general-settings'
  | 'global-section'
  | 'move-up'
  | 'move-down'
  | 'toggle-visibility'
  | 'duplicate'
  | 'delete'

export interface HydrogenComponentSchema extends ElementSchema {
  childTypes?: string[]
  inspector: InspectorGroup[]
  presets?: Omit<HydrogenComponentPresets, 'type'>
  limit?: number
  enabledOn?: {
    pages?: ('*' | PageType)[]
    groups?: ('*' | 'header' | 'footer' | 'body')[]
  }
  toolbar?: (HydrogenToolbarAction | HydrogenToolbarAction[])[]
}

export type BasicInput = CoreBasicInput & {
  shouldRevalidate?: boolean
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

export type I18nLocale = Locale & {
  pathPrefix: string
}

export type WeaverseLoaderRequestInfo = {
  search: string
  pathname: string
  queries: { [key: string]: string | boolean }
  i18n: I18nBase
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
  Component: ForwardRefExoticComponent<HydrogenComponentProps>
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
  default: ForwardRefExoticComponent<T>
  schema: HydrogenComponentSchema
  loader?: (args: ComponentLoaderArgs) => Promise<unknown>
}

export type WeaverseStudioQueries = {
  weaverseProjectId: string
  weaverseApiKey: string
  weaverseHost: string
  weaverseVersion: string
  isDesignMode: boolean
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
  publicEnv?: PublicEnv
}

export type HydrogenPageAssignment = {
  projectId: string
  type: PageType
  handle: string
  locale: string
}

export type HydrogenPageConfigs = Omit<WeaverseProjectConfigs, 'publicEnv'> & {
  requestInfo: WeaverseLoaderRequestInfo
}

export interface WeaverseLoaderData {
  configs: HydrogenPageConfigs
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

export interface WeaverseHydrogenRootProps {
  components: HydrogenComponent[]
  errorComponent?: React.FC<{ error: { message: string; stack?: string } }>
}

export type HydrogenThemeInfo = {
  name: string
  version: string
  author: string
  authorProfilePhoto: string
  documentationUrl: string
  supportUrl: string
}

export interface HydrogenThemeSchema {
  info: HydrogenThemeInfo
  inspector: InspectorGroup[]
}

export type PageType = keyof typeof STORE_PAGES

export type PageAssignmentParams = {
  type?: PageType
  locale?: string
  handle?: string
}

export type LoadPageParams = PageAssignmentParams & {
  strategy?: AllCacheOptions
}

export type FetchProjectRequestBody = {
  projectId: string
  url: string
  i18n?: I18nBase
  params?: PageAssignmentParams
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
  countries?: Localizations
  themeSchema: HydrogenThemeSchema
  request: Request
  cache: Cache
}

export type FetchWithCacheOptions = RequestInit & {
  strategy?: AllCacheOptions
}

export type RootRouteData = {
  weaverseTheme?: {
    theme: HydrogenThemeSettings
    countries?: Localizations
    schema?: HydrogenThemeSchema
    publicEnv?: PublicEnv
  }
  [key: string]: any
}

export type OptionDisplayType =
  | 'dropdown'
  | 'button'
  | 'color'
  | 'variant-image'
  | 'custom-image'
export type OptionSize = 'sm' | 'md' | 'lg'
export type OptionShape = 'square' | 'round' | 'circle'

export type OptionData = {
  id: string
  name: string
  displayName: string
  type: OptionDisplayType
  size: OptionSize
  shape: OptionShape
}

export type SwatchesConfigs = {
  options: OptionData[]
  swatches: {
    colors: ColorSwatch[]
    images: ImageSwatch[]
  }
}

export type ColorSwatch = {
  id: string
  name: string
  value: string
}
export type ImageSwatch = {
  id: string
  name: string
  value: WeaverseImage | string
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
