import type * as Stitches from "@stitches/core"
import type { ForwardRefExoticComponent } from "react"
import type { stichesUtils } from "./utils"

export type TODO = any

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

export type BreakPoints = {
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

export interface ElementComponentProps extends ElementData {
  css: ElementCSS
  [key: string]: any
}

export interface WeaverseElement {
  Component: ForwardRefExoticComponent<ElementComponentProps>
  type: string
  schema?: ElementSchema
}
export interface ElementsMap {
  [key: string]: WeaverseElement
}

// Element types
export type CatalogGroup = "essential" | "composition" | "other"
export interface ElementCatalog {
  name: string
  icon?: string
  group?: CatalogGroup
  data?: ElementData[]
}

export type FlagType = "draggable" | "resizable" | "sortable" | "droppable" | "deletable" | "duplicable"
export type ElementFlags = Partial<Record<FlagType, boolean>>
export type ToolbarAction =
  | "duplicate"
  | "delete"
  | "edit-button"
  | "insert-link"
  | "select-template"
  | "copy-styles"
  | "paste-styles"

export interface ChildElement {
  label: string
  selector: string
}
export type ParentType = "container" | "layout" | "root"
export type GridSize = {
  rowSpan: number
  colSpan: number
}

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

export type AdvancedGroup = {
  type: AdvancedInput
}

export type BasicGroup = {
  type: "basic"
  label: string
  inputs: BasicInput[]
}

export type AdvancedInput =
  // Styles
  "border" | "alignment" | "background" | "dimensions" | "spacing" | "visibility"

export interface BasicInput {
  type: InputType
  label: string
  name: string // binding's name
  defaultValue?: string
  placeholder?: string
  helpText?: string
  /**
   * For `select` or `toggle-group` input
   */
  options?: { value: string; label: string; icon?: string; weight?: string }[]
  /**
   * For `range` input
   */
  min?: number
  max?: number
  step?: number
  /**
   * Only display if condition matches.
   *
   * Format: `bindingName.conditionalOperator.value`
   *
   * Supported operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`
   *
   * @example
   * `clickAction.eq.openLink`
   * `clickAction.neq.openLink`
   * `imagesPerRow.gt.1`
   */
  condition?: string
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
  | "custom.html"
  | "instagram"

declare global {
  interface Window {
    WeaverseStudioBridge: TODO
    weaverseShopifyProducts: TODO
    weaverseGlobalSettings: TODO
  }
}
