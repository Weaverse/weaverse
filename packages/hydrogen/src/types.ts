/// <reference types="@remix-run/dev" />
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

export type TODO = any
declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    waitUntil: ExecutionContext['waitUntil']
    session: TODO
    storefront: TODO
    env: TODO
  }
}

export type WeaverseLoaderArgs = LoaderArgs & {
  data: any
  configs: { projectId: string; weaverseHost: string }
}

export interface HydrogenComponentData
  extends Omit<ElementData, 'childIds' | 'css'> {
  id: string
  type: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  parentId: string
  children: { id: string }[]
  loaderData: unknown
  data: Record<string, unknown>
}

export type ComponentFlags = Partial<Record<'isSection', boolean>>

export interface HydrogenComponentSchema
  extends Omit<ElementSchema, 'parentTypes' | 'flags' | 'inspector'> {
  flags?: ComponentFlags
  childTypes?: string[]
  inspector: InspectorGroup[]
  presets?: Omit<HydrogenComponentPresets, 'type'>
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

export interface WeaverseHydrogen
  extends Omit<
    Weaverse,
    'itemInstances' | 'elementInstances' | 'registerElement'
  > {
  itemInstances: Map<string | number, HydrogenComponentInstance>
  elementInstances: Map<string, HydrogenElement>
  registerElement(element: HydrogenElement): void
}

export type HydrogenComponentPresets = {
  type: string
  children?: HydrogenComponentPresets[]
}

export interface HydrogenElement {
  Component: ForwardRefExoticComponent<HydrogenComponentProps>
  type: string
  schema?: HydrogenComponentSchema
}

export interface HydrogenComponentInstance
  extends Omit<WeaverseItemStore, '_flags' | 'data' | 'Element'> {
  get _element(): HTMLElement | null
  get _flags(): ComponentFlags
  get Element(): HydrogenElement | undefined
  get data(): HydrogenComponentData
  _store: HydrogenComponentData
}

export interface HydrogenComponent<T = HydrogenComponentProps> {
  default: ForwardRefExoticComponent<T>
  schema: HydrogenComponentSchema
  loader?: (args: WeaverseLoaderArgs) => Promise<unknown>
}

export type HydrogenPageConfigs = {
  projectId: string
  weaverseHost: string
  version?: string
  isDesignMode?: boolean
  [key: string]: any
}

export interface HydrogenPageData {
  page: any
  configs: HydrogenPageConfigs
}

export type WeaverseHydrogenLoaderData = {
  weaverseData?: HydrogenPageData
  [key: string]: any
}
export interface WeaverseHydrogenRootProps {
  components: Record<string, HydrogenComponent>
  data: WeaverseHydrogenLoaderData
  themeSchema?: InspectorGroup[]
}
