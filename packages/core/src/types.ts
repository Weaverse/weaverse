import type * as Stitches from "@stitches/core"
import type { ForwardRefExoticComponent } from "react"
import type { WeaverseItemStore } from "./core"
import type { stitchesUtils } from "./utils/stitches"

export interface WeaverseProjectDataType {
  items: ElementData[]
  rootId: string
}

export interface BreakPoints {
  mobile: string
  desktop: string
}
export type PlatformTypeEnum = "shopify-section" | "shopify-hydrogen" | "nextjs"

export interface WeaverseCoreParams {
  mediaBreakPoints?: BreakPoints
  weaverseHost?: string
  weaverseVersion?: string
  projectId: string
  data: WeaverseProjectDataType
  isDesignMode?: boolean
  platformType?: PlatformTypeEnum
  ItemConstructor: typeof WeaverseItemStore
}

export interface WeaverseElement {
  Component: ForwardRefExoticComponent<any>
  type: string
  // schema?: ElementSchema
  // defaultCss?: ElementCSS
  // permanentCss?: ElementCSS
  // extraData?: ElementExtraData
}

// export type FlagType =
//   | "draggable"
//   | "resizable"
//   | "sortable"
//   | "ignoreShortcutKeys"
//   | "hasContextMenu"
//   | "isSortableContext"
//   | "mustHaveChildren"
// export type ElementFlags = Partial<Record<FlagType, boolean>>

// export type ChildElementSelector = string | string[]

// export interface ChildElement {
//   label: string
//   selector: ChildElementSelector
// }
// export type ParentType = "container" | "layout" | "root" | "product-details" | "product-info" | "slideshow" | "slide"

// export type GridSize = {
//   rowSpan: number
//   colSpan: number
// }
export type ToolbarAction =
  | "general-settings"
  | "settings-level-2"
  // | "text-presets"
  // | "ai-assistant"
  // | "scale-text"
  | "duplicate"
  | "delete"
// | "copy-styles"
// | "paste-styles"
// | "move-up"
// | "move-down"
// | "next-slide"
// | "prev-slide"
// | "change-background"
// | "toggle-visibility"
// | "more-actions"

export interface ElementSchema {
  title: string
  type: string
  // parentTypes: ParentType[]
  // gridSize?: GridSize
  // inspector?: ElementInspector
  // toolbar?: (ToolbarAction | ToolbarAction[])[]
  // childElements?: ChildElement[]
  // catalog?: ElementCatalog
  // flags?: ElementFlags
}

export interface ElementData {
  id: string
  type: string
  // childIds?: (string | number)[]
  // css?: ElementCSS
  [key: string]: any
}

// export interface ElementExtraData {
//   [key: string]: unknown
// }

export type WeaverseCSSProperties = Stitches.CSS & Partial<Record<keyof typeof stitchesUtils, string | number>>
export type ChildElementCSS = Partial<{
  [selector: string]: WeaverseCSSProperties & ChildElementCSS
}>
export interface ElementCSS {
  "@desktop"?: WeaverseCSSProperties | ChildElementCSS
  "@mobile"?: WeaverseCSSProperties | ChildElementCSS
}

// export interface ElementInspector {
//   settings?: (AdvancedGroup | BasicGroup)[]
//   styles?: (AdvancedGroup | BasicGroup)[]
// }

// export interface AdvancedGroup {
//   groupType: AdvancedGroupType
// }

// export interface BasicGroup {
//   groupType: "basic"
//   groupHeader: string
//   inputs: BasicInput[]
// }

export type AdvancedGroupType =
  // Styles
  | "border"
  | "alignment"
  | "background"
  | "dimensions"
  | "spacing"
  | "typography"
  | "visibility"
  | "shadows-and-effects"
  | "layout-background"

export interface BasicInput<ConfigsType = AdditionalInputConfigs> {
  type: InputType
  label?: string
  // binding?: "style" | "data"
  /**
   * The key of the value of the element data or styles
   * @example
   * // Bind to `element.data.title`
   * name: "title"
   * // Bind to `element.css["@desktop"].backgroundColor`
   * name: "backgroundColor"
   */
  name?: string
  /**
   * Additional options for inputs that require more configuration
   */
  configs?: ConfigsType
  /**
   * Only display if condition matches.
   *
   * Format: `dataBindingKey.conditionalOperator.value`
   *
   * Supported operators: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`
   *
   * @example
   * `clickAction.eq.openLink`
   * `clickAction.ne.openLink`
   * `imagesPerRow.gt.1`
   */
  condition?: string
  defaultValue?: string | number | boolean
  placeholder?: string
  helpText?: string
  // shouldRevalidate?: boolean
}

export type AdditionalInputConfigs =
  | SelectInputConfigs
  | ToggleGroupConfigs
  | RangeInputConfigs
  | ChildrenSortInputConfigs
// | DataSortInputConfigs

export interface SelectInputConfigs {
  options?: { value: string; label: string; icon?: string; weight?: string }[]
}

export interface ToggleGroupConfigs {
  options?: { value: string; label: string; icon?: string; weight?: string }[]
}

export interface RangeInputConfigs {
  min?: number
  max?: number
  step?: number
  unit?: string
}

export type SortableItemAction = "add" | "edit" | "duplicate" | "delete" | "toggle-visibility"
export interface ChildrenSortInputConfigs {
  actions: SortableItemAction[]
}

// export interface DataSortInputConfigs {
//   prop: string
//   defaultData: object
//   inspector: string
// }

export type InputType =
  // Basic inputs
  | "color"
  | "datepicker"
  | "image"
  | "range"
  | "select"
  | "children-sort"
  | "switch"
  | "text"
  | "textarea"
  | "toggle-group"
  | "position"
// Element inputs
// | "data-sort"
// | "information"
// | "product"
// | "product-list"
// | "product-swatches"
// | "text-editor"
// | "custom.html"
// | "instagram"
// | "collection-list"
// | "collection"
// | "article-list"
// | "map-autocomplete"

declare global {
  interface Window {
    Blinkloader: any
    weaverseStudio: any
  }
}
