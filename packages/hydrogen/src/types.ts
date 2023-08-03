/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type { LoaderArgs } from '@shopify/remix-oxygen'
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
import type { STORE_PAGES } from './context'

export type TODO = any
declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    waitUntil: ExecutionContext['waitUntil']
    session: TODO
    storefront: TODO
    env: TODO
    cart: TODO
  }
}

export type WeaverseLoaderArgs = LoaderArgs & {
  itemData: HydrogenComponentData
  configs: { projectId: string; weaverseHost: string }
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

export type WeaverseLoaderRequestInfo = {
  params: any
  pathname: string
  search: string
}

export interface WeaverseHydrogen
  extends Omit<
    Weaverse,
    'itemInstances' | 'elementInstances' | 'registerElement' | 'data'
  > {
  itemInstances: Map<string | number, HydrogenComponentInstance>
  elementInstances: Map<string, HydrogenElement>
  registerElement(element: HydrogenElement): void
  internal: WeaverseInternal
  data: WeaverseStorefrontData
  requestInfo: WeaverseLoaderRequestInfo
}

export type WeaverseStorefrontData = {
  id?: string
  rootId: string
  name: string
  items: HydrogenComponentData[]
}

export type HydrogenProjectConfig = {
  theme: Record<string, any>
}

export type HydrogenProjectType = {
  id: string
  weaverseShopId: string
  name: string
  config: HydrogenProjectConfig
  [key: string]: any
}

export type WeaverseInternal = {
  themeSchema: HydrogenThemeSchema
  pageAssignment: HydrogenPageAssignment
  project: HydrogenProjectType
  navigate: NavigateFunction
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
}

export interface HydrogenComponentInstance
  extends Omit<WeaverseItemStore, '_flags' | 'data' | 'Element'> {
  get _element(): HTMLElement | null
  get Element(): HydrogenElement | undefined
  get data(): HydrogenComponentData
  _store: HydrogenComponentData
}

export interface HydrogenComponent<T extends HydrogenComponentProps = any> {
  default: ForwardRefExoticComponent<T>
  schema: HydrogenComponentSchema
  loader?: (args: WeaverseLoaderArgs) => Promise<unknown>
}

export type HydrogenPageConfigs = {
  projectId: string
  weaverseHost: string
  version?: string
  isDesignMode?: boolean
  requestInfo: WeaverseLoaderRequestInfo
  [key: string]: any
}

export type HydrogenPageAssignment = {
  projectId: string
  type: PageType
  handle: string
  locale: string
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

type RelativeRoutingType = 'route' | 'path'
type To = string | Partial<Path>
type Path = {
  /**
   * A URL pathname, beginning with a /.
   */
  pathname: string
  /**
   * A URL search string, beginning with a ?.
   */
  search: string
  /**
   * A URL fragment identifier, beginning with a #.
   */
  hash: string
}

type NavigateOptions = {
  replace?: boolean
  state?: any
  preventScrollReset?: boolean
  relative?: RelativeRoutingType
}

export type NavigateFunction = (to: To, options?: NavigateOptions) => void

export interface WeaverseHydrogenRootProps {
  weaverseData: WeaverseLoaderData
  components: HydrogenComponent[]
  themeSchema: HydrogenThemeSchema
  navigate: NavigateFunction
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

export type WeaverseLoaderConfigs = {
  type: PageType
  locale?: string
  handle?: string
}
