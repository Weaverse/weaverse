import type {
  AdvancedGroupType,
  ChildrenSortInputConfigs,
  AdditionalInputConfigs as CoreAdditionalInputConfigs,
  BasicInput as CoreBasicInput,
  ElementData as CoreElementData,
  ElementSchema as CoreElementSchema,
  InputType as CoreInputType,
  ToolbarAction as CoreToolbarAction,
  WeaverseElement as CoreWeaverseElement,
  ElementCSS,
  RangeInputConfigs,
  SelectInputConfigs,
  SortableItemAction,
  ToggleGroupConfigs,
  WeaverseCSSProperties,
  WeaverseCoreParams,
  WeaverseItemStore,
  WeaverseProjectDataType,
} from '@weaverse/react'
import type { ThirdPartyIntegration } from './shopify'

export type {
  AdvancedGroupType,
  ChildrenSortInputConfigs,
  ElementCSS,
  RangeInputConfigs,
  SelectInputConfigs,
  SortableItemAction,
  ToggleGroupConfigs,
  WeaverseCSSProperties,
  WeaverseItemStore,
  WeaverseProjectDataType,
}

export interface WeaverseElement extends CoreWeaverseElement {
  schema?: ElementSchema
  defaultCss?: ElementCSS
  permanentCss?: ElementCSS
  extraData?: {
    [key: string]: unknown
  }
}

export interface ElementData extends CoreElementData {
  childIds?: (string | number)[]
  css?: ElementCSS
}

export type CatalogGroup = 'essential' | 'composition' | 'shopify'
export interface ElementCatalog {
  name: string
  icon?: string
  group?: CatalogGroup
  data?: ElementDataInCatalog[]
}

export type ParentType =
  | 'container'
  | 'layout'
  | 'root'
  | 'product-details'
  | 'product-info'
  | 'slideshow'
  | 'slide'

export type GridSize = {
  rowSpan: number
  colSpan: number
}

export type ToolbarAction =
  | CoreToolbarAction
  | 'text-presets'
  | 'ai-assistant'
  | 'scale-text'
  | 'copy-styles'
  | 'paste-styles'
  | 'move-up'
  | 'move-down'
  | 'next-slide'
  | 'prev-slide'
  | 'change-background'
  | 'toggle-visibility'
  | 'more-actions'

export type FlagType =
  | 'draggable'
  | 'resizable'
  | 'sortable'
  | 'ignoreShortcutKeys'
  | 'hasContextMenu'
  | 'isSortableContext'
  | 'mustHaveChildren'

export type ElementFlags = Partial<Record<FlagType, boolean>>

export type ChildElementSelector = string | string[]

export interface ChildElement {
  label: string
  selector: ChildElementSelector
}

export interface ElementInspector {
  settings?: (AdvancedGroup | BasicGroup)[]
  styles?: (AdvancedGroup | BasicGroup)[]
}

export interface AdvancedGroup {
  groupType: AdvancedGroupType
}

export interface BasicGroup {
  groupType: 'basic'
  groupHeader: string
  inputs: BasicInput[]
}

export type InputType =
  | CoreInputType
  | 'data-sort'
  | 'information'
  | 'product'
  | 'product-list'
  | 'product-swatches'
  | 'text-editor'
  | 'custom.html'
  | 'instagram'
  | 'collection-list'
  | 'collection'
  | 'article-list'
  | 'map-autocomplete'

export type AdditionalInputConfigs =
  | CoreAdditionalInputConfigs
  | DataSortInputConfigs

export interface DataSortInputConfigs {
  prop: string
  defaultData: object
  inspector: string
}
export interface BasicInput<T = AdditionalInputConfigs>
  extends Omit<CoreBasicInput, 'type' | 'configs'> {
  type: InputType
  binding?: 'data' | 'style'
  configs?: T
}
export interface ElementSchema extends CoreElementSchema {
  parentTypes: ParentType[]
  gridSize?: GridSize
  inspector?: ElementInspector
  toolbar?: (ToolbarAction | ToolbarAction[])[]
  childElements?: ChildElement[]
  catalog?: ElementCatalog
  flags?: ElementFlags
}
export interface ElementDataInCatalog extends Omit<ElementData, 'id'> {
  id: string | number
}

export interface WeaverseShopifySectionData extends WeaverseProjectDataType {
  script?: {
    css: string
    js: string
  }
}

export interface WeaverseShopifyParams extends WeaverseCoreParams {
  thirdPartyIntegration?: ThirdPartyIntegration[]
  elementSchemas?: ElementSchema[]
  ssrMode?: boolean
  data: WeaverseShopifySectionData
}
