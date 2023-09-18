/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type { NavigateFunction, Params } from '@remix-run/react'
import type { Storefront, createWithCache } from '@shopify/hydrogen'
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types'
import type {
  AppLoadContext,
  LoaderArgs as RemixOxygenLoaderArgs,
} from '@shopify/remix-oxygen'
import type {
  BasicInput,
  ElementData,
  ElementSchema,
  Weaverse,
  WeaverseElement,
  WeaverseItemStore,
} from '@weaverse/react'
import type React from 'react'
import type { ForwardRefExoticComponent } from 'react'
import type { WeaverseClient } from './client'
import type { STORE_PAGES } from './context'

export type Locale = {
  language: LanguageCode
  country: CountryCode
  label: string
  currency: CurrencyCode
}

export type Localizations = Record<string, Locale>

export interface AllCacheOptions {
  mode?: string
  maxAge?: number
  staleWhileRevalidate?: number
  sMaxAge?: number
  staleIfError?: number
}

export type ComponentLoaderArgs = RemixOxygenLoaderArgs & {
  itemData: HydrogenComponentData
}

export interface RouteLoaderArgs extends RemixOxygenLoaderArgs {
  context: AppLoadContext & {
    weaverse: WeaverseClient
  }
}

export interface HydrogenComponentData
  extends Omit<ElementData, 'childIds' | 'css'> {
  id: string
  type: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  children: { id: string }[]
  data: Record<string, any>
}

export type HydrogenToolbarAction =
  | 'general-settings'
  | 'settings-level-2'
  | 'duplicate'
  | 'delete'

export interface HydrogenComponentSchema
  extends Omit<
    ElementSchema,
    | 'parentTypes'
    | 'flags'
    | 'inspector'
    | 'gridSize'
    | 'childElements'
    | 'catalog'
    | 'toolbar'
  > {
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

export interface InspectorGroup {
  group: string
  inputs: BasicInput[]
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
  params: Params
  search: string
  pathname: string
  queries: Record<string, string | boolean>
  i18n: I18nLocale
}

type WeaverseCore = Omit<
  Weaverse,
  'itemInstances' | 'elementInstances' | 'registerElement' | 'data'
>

export interface WeaverseHydrogen extends WeaverseCore {
  itemInstances: Map<string | number, HydrogenComponentInstance>
  elementInstances: Map<string, HydrogenElement>

  registerElement(element: HydrogenElement): void

  internal: WeaverseInternal
  data: WeaverseStorefrontData
  requestInfo: WeaverseLoaderRequestInfo
}

export type WeaverseStorefrontData = {
  id?: string
  __cachedId?: string
  rootId: string
  name: string
  items: HydrogenComponentData[]
}

export type HydrogenThemeSettings = {
  [key: string]: string | number | boolean
}

export type HydrogenProjectConfig = {
  theme: HydrogenThemeSettings
}

export type HydrogenProjectType = {
  id: string
  weaverseShopId: string
  name: string
  config: HydrogenProjectConfig
  [key: string]: any
}

export type WeaverseThemeConfigs = {
  schema: HydrogenThemeSchema
  countries: Localizations
}

export type WeaverseInternal = {
  themeConfigs: WeaverseThemeConfigs
  pageAssignment: HydrogenPageAssignment
  project: HydrogenProjectType
  navigate: NavigateFunction
  revalidate: () => void
  publicEnv?: PublicEnv
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

export interface WeaverseHydrogenInit extends WeaverseProjectConfigs {
  data: HydrogenPageData
  pageId: string
  platformType: 'shopify-hydrogen'
  internal: Partial<WeaverseInternal>
  requestInfo: WeaverseLoaderRequestInfo
}

export interface HydrogenComponentInstance
  extends Omit<WeaverseItemStore, '_flags' | 'data' | 'Element'> {
  get _element(): HTMLElement | null

  get Element(): HydrogenElement | undefined

  get data(): HydrogenComponentData

  _store: HydrogenComponentData
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

export type HydrogenPageData = {
  id: string
  name: string
  rootId: string
  items: HydrogenComponentData[]
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

export type PageLoadParams = {
  type?: PageType
  locale?: string
  handle?: string
}

export type FetchProjectRequestBody = {
  projectId: string
  url: string
  countries: Localizations
  i18n?: I18nLocale
  params?: PageLoadParams
  isDesignMode?: boolean
}

export type FetchProjectPayload = {
  page: HydrogenPageData
  project: HydrogenProjectType
  pageAssignment: HydrogenPageAssignment
}

export type WeaverseThemeSettingsStore = {
  updateThemeSettings(newSettings: HydrogenThemeSettings): void
  subscribe(listener: () => void): () => void
  getSnapshot(): HydrogenThemeSettings | null
  getServerSnapshot(): HydrogenThemeSettings | null
}

export type HydrogenThemeEnv = {
  WEAVERSE_PROJECT_ID: string
  WEAVERSE_HOST: string
  PUBLIC_STORE_DOMAIN: string
  PUBLIC_STOREFRONT_API_TOKEN: string
}

export type WeaverseClientArgs = {
  withCache: ReturnType<typeof createWithCache>
  configs: WeaverseProjectConfigs
  storefront: Storefront<I18nLocale>
  components: HydrogenComponent[]
  countries?: Localizations
  themeSchema: HydrogenThemeSchema
}

export type FetchWithCacheOptions = RequestInit & {
  strategy?: AllCacheOptions
}

declare global {
  interface Window {
    __weaverse: WeaverseHydrogen
    __weaverses: WeaverseHydrogen[]
    __weaverseThemeSettingsStore: WeaverseThemeSettingsStore
  }
}
