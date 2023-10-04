import type {
  AdvancedGroupType,
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
  ToggleGroupConfigs,
  WeaverseCSSProperties,
  WeaverseCoreParams,
  WeaverseProjectDataType,
} from '@weaverse/react'
import type { ThirdPartyIntegration } from './shopify'

export type {
  AdvancedGroupType,
  ElementCSS,
  RangeInputConfigs,
  SelectInputConfigs,
  ToggleGroupConfigs,
  WeaverseCSSProperties,
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
  | 'children-sort'
  | 'data-sort'
  | 'information'
  | 'custom.html'
  | 'product-swatches'
  | 'instagram'

export type AdditionalInputConfigs =
  | CoreAdditionalInputConfigs
  | ChildrenSortInputConfigs
  | DataSortInputConfigs

export interface ChildrenSortInputConfigs {
  actions: SortableItemAction[]
}

export type SortableItemAction =
  | 'add'
  | 'edit'
  | 'duplicate'
  | 'delete'
  | 'toggle-visibility'

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

export interface WeaverseShopifyParams
  extends Omit<WeaverseCoreParams, 'ItemConstructor'> {
  thirdPartyIntegration?: ThirdPartyIntegration[]
  elementSchemas?: ElementSchema[]
  ssrMode?: boolean
  data: WeaverseShopifySectionData
}
