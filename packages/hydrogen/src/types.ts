// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type { NavigateFunction } from '@remix-run/react'
import type { Storefront } from '@shopify/hydrogen'
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
} from '@weaverse/react'
import type React from 'react'
import type { ForwardRefExoticComponent } from 'react'

import type { STORE_PAGES } from './context'
import type { ThemeSettingsStore } from './hooks/use-theme-settings'
import type { WeaverseClient } from './weaverse-client'

import type { WeaverseHydrogen } from './index'
export type { InputType, PositionInputValue, WeaverseImage }

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

export type ComponentLoaderArgs<T = any> = {
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

export type HydrogenToolbarAction =
  | 'general-settings'
  | 'settings-level-2'
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
  i18n: I18nLocale
}

export type WeaverseStorefrontData = {
  id?: string
  rootId: string
  name: string
  items: HydrogenComponentData[]
}

export type HydrogenThemeSettings = {
  [key: string]: any
}

export type HydrogenProjectConfig = {
  theme: HydrogenThemeSettings
}

export type HydrogenProjectType = {
  id: string
  weaverseShopId: string
  name: string
  [key: string]: any
}

export type WeaverseThemeConfigs = {
  schema: HydrogenThemeSchema
  countries: Localizations
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
  loader?: HydrogenComponentLoaderFunction
}

export interface WeaverseHydrogenParams
  extends Omit<WeaverseCoreParams, 'ItemConstructor'> {
  data: HydrogenPageData
  pageId: string
  internal: Partial<WeaverseInternal>
  requestInfo: WeaverseLoaderRequestInfo
}

export type HydrogenComponentLoaderFunction = (
  args: ComponentLoaderArgs,
) => Promise<unknown>

export interface HydrogenComponent<T extends HydrogenComponentProps = any> {
  default: ForwardRefExoticComponent<T>
  schema: HydrogenComponentSchema
  loader?: HydrogenComponentLoaderFunction
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
  i18n?: I18nLocale
  params?: PageAssignmentParams
  isDesignMode?: boolean
}

export type FetchProjectPayload = {
  page: HydrogenPageData
  project: HydrogenProjectType
  pageAssignment: HydrogenPageAssignment
  error?: string
}

export type HydrogenThemeEnv = {
  WEAVERSE_PROJECT_ID: string
  WEAVERSE_API_KEY: string
  WEAVERSE_HOST: string
  PUBLIC_STORE_DOMAIN: string
  PUBLIC_STOREFRONT_API_TOKEN: string
}

export type WeaverseClientArgs = {
  request: Request
  cache: Cache
  waitUntil: ExecutionContext['waitUntil']
  env: HydrogenThemeEnv
  storefront: Storefront<I18nLocale>
  components: HydrogenComponent[]
  countries?: Localizations
  themeSchema: HydrogenThemeSchema
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

export type WeaverseProduct = WeaverseResourcePickerData
export type WeaverseCollection = WeaverseResourcePickerData
export type WeaverseBlog = WeaverseResourcePickerData
export type WeaverseArticle = WeaverseResourcePickerData

declare global {
  interface Window {
    __weaverse: WeaverseHydrogen
    __weaverses: Record<string, WeaverseHydrogen>
  }
}
