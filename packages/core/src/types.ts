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
}
export type ToolbarAction = "general-settings" | "settings-level-2" | "duplicate" | "delete"

export interface ElementSchema {
  title: string
  type: string
}

export interface ElementData {
  id: string
  type: string
  [key: string]: any
}

export type WeaverseCSSProperties = Stitches.CSS & Partial<Record<keyof typeof stitchesUtils, string | number>>
export type ChildElementCSS = Partial<{
  [selector: string]: WeaverseCSSProperties & ChildElementCSS
}>

export interface ElementCSS {
  "@desktop"?: WeaverseCSSProperties | ChildElementCSS
  "@mobile"?: WeaverseCSSProperties | ChildElementCSS
}

export type AdvancedGroupType =
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
  /**
   * The key of the value of the element data or styles
   * @example
   * // Bind to `element.data.title`
   * name: "title"
   * // Bind to `element.css["@desktop"].backgroundColor`
   * name: "backgroundColor"
   */
  name: string
  label?: string
  /**
   * Additional options for inputs that require more configuration
   */
  configs?: ConfigsType
  /**
   * Only display if condition matches.
   *
   * Format: `bindingName.conditionalOperator.value`
   *
   * Supported operators: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`
   *
   * @example
   * `clickAction.eq.openLink`
   * `clickAction.ne.openLink`
   * `imagesPerRow.gt.1`
   */
  condition?: string
  defaultValue?: string | number | boolean | Partial<WeaverseImage>
  placeholder?: string
  helpText?: string
}

export type WeaverseResourcePickerData = {
  id: number
  handle: string
}

export type WeaverseImage = {
  id: string
  url: string
  alt: string
  width: number
  height: number
}

export type AdditionalInputConfigs = SelectInputConfigs | ToggleGroupConfigs | RangeInputConfigs

export interface SelectInputConfigs {
  options?: { value: string; label: string }[]
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

export type PositionInputValue =
  | "top left"
  | "top center"
  | "top right"
  | "center left"
  | "center center"
  | "center right"
  | "bottom left"
  | "bottom center"
  | "bottom right"

export type InputType =
  | "blog"
  | "collection"
  | "collection-list"
  | "color"
  | "datepicker"
  | "image"
  | "map-autocomplete"
  | "position"
  | "product"
  | "product-list"
  | "range"
  | "richtext"
  | "select"
  | "switch"
  | "text"
  | "textarea"
  | "toggle-group"

declare global {
  interface Window {
    Blinkloader: any
    weaverseStudio: any
  }
}
