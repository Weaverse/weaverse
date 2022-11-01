import type * as Stitches from "@stitches/core"
import type { ForwardRefExoticComponent } from "react"
import type { stichesUtils } from "./utils"

// Project types
export interface ProjectDataType {
  items: ElementData[]
  rootId: string
  script: {
    css: string
    js: string
  }
  pageId?: string // for standalone app, we have pageId for the page that we're editing
}

export interface InitializeData {
  id: string
  handle: string
  data: ProjectDataType
  published: boolean
  projectKey?: string
  studioUrl?: string
}

export interface BreakPoints {
  mobile: string
  desktop: string
}

// Weaverse types
export interface WeaverseType {
  mediaBreakPoints?: BreakPoints
  appUrl?: string
  projectKey?: string
  projectData?: ProjectDataType
  isDesignMode?: boolean
  ssrMode?: boolean
}

export interface WeaverseElement {
  Component: ForwardRefExoticComponent<any>
  type: string
  schema?: ElementSchema
  defaultCss?: ElementCSS
  permanentCss?: ElementCSS
}

// Element types
export type CatalogGroup = "essential" | "composition" | "shopify"
export interface ElementCatalog {
  name: string
  icon?: string
  group?: CatalogGroup
  data?: ElementDataInCatalog[]
}
export interface ElementDataInCatalog extends Omit<ElementData, "id"> {
  id: string | number
}

export type FlagType = "draggable" | "resizable" | "sortable" | "ignoreShortcutKeys" | "hasContextMenu"
export type ElementFlags = Partial<Record<FlagType, boolean>>

export interface ChildElement {
  label: string
  selector: string
}
export type ParentType =
  | "container"
  | "layout"
  | "root"
  | "product-details"
  | "product-info"
  | "collection.box"
  | "collection-box"
  | "article-box"
  | "article-list"
  | "slider"
  | "tab"
  | "accordion"
  | "accordion.wrapper"
export type GridSize = {
  rowSpan: number
  colSpan: number
}
export type ToolbarAction =
  | "general-settings"
  | "edit-text"
  | "duplicate"
  | "delete"
  | "copy-styles"
  | "paste-styles"
  | "move-up"
  | "move-down"
  | "toggle-visibility"
export interface ElementSchema {
  title: string
  type: string
  parentType: ParentType
  gridSize?: GridSize
  inspector?: ElementInspector
  toolbar?: (ToolbarAction | ToolbarAction[])[]
  childElements?: ChildElement[]
  catalog?: ElementCatalog
  flags?: ElementFlags
}

export interface ElementData {
  id: string
  type: string
  childIds?: (string | number)[]
  css?: ElementCSS
  [key: string]: any
}

export type WeaverseCSSProperties = Stitches.CSS & Partial<Record<keyof typeof stichesUtils, string | number>>
export type ChildElementCSS = Partial<{
  [selector: string]: WeaverseCSSProperties & ChildElementCSS
}>
export interface ElementCSS {
  "@desktop"?: WeaverseCSSProperties | ChildElementCSS
  "@mobile"?: WeaverseCSSProperties | ChildElementCSS
}

export interface ElementInspector {
  settings?: (AdvancedGroup | BasicGroup)[]
  styles?: (AdvancedGroup | BasicGroup)[]
}

export interface AdvancedGroup {
  groupType: AdvancedGroupType
  useData?: boolean
}

export interface BasicGroup {
  groupType: "basic"
  groupHeader: string
  inputs: BasicInput[]
}

export type AdvancedGroupType =
  // Styles
  "border" | "alignment" | "background" | "dimensions" | "spacing" | "typography" | "visibility" | "shadows-and-effects"

export interface BasicInput<ConfigsType = AdditionalInputConfigs> {
  type: InputType
  label?: string
  binding?: "style" | "data"
  /**
   * The key of the value in the element data or styles
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
}

export type AdditionalInputConfigs = SelectInputConfigs | ToggleGroupConfigs | RangeInputConfigs | SortableInputConfigs

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
}

export interface SortableInputConfigs {
  visibleType?: boolean
}

export type InputType =
  // Basic inputs
  | "color"
  | "datepicker"
  | "image"
  | "range"
  | "select"
  | "sortable"
  | "switch"
  | "text"
  | "textarea"
  | "toggle-group"
  // Element inputs
  | "form"
  | "product"
  | "product-swatches"
  | "custom.html"
  | "instagram"
  | "collection-list"
  | "collection"
  | "article-list"

declare global {
  interface Window {
    WeaverseStudioBridge: any
    Blinkloader: any
  }
}
