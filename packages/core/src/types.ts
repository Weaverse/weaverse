import type { ForwardRefExoticComponent } from "react"
import type { stichesUtils } from "./utils/styles"
import type * as Stitches from "@stitches/core"

export type TODO = any

// Project types
export interface ProjectDataType {
  items: ElementData[]
  rootId: string
  script: {
    css: string
    js: string
  }
}

// Weaverse types
export interface WeaverseType {
  mediaBreakPoints?: any
  appUrl?: string
  projectKey?: string
  projectData?: ProjectDataType
  isDesignMode?: boolean
  ssrMode?: boolean
}

export type WeaverseElement = {
  Component: ForwardRefExoticComponent<any>
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

export type FlagType = "draggable" | "resizable" | "sortable" | "droppable"
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
  | "alignment"
  | "background"
  | "border"
  | "countdown"
  | "dimensions"
  // Elements
  | "form"
  | "product"
  | "spacing"
  | "visibility"

export interface BasicInput {
  type: InputType
  label: string
  name: string // binding's name
  defaultValue?: string
  placeholder?: string
  helpText?: string
  // For `select` input
  options?: { value: string; label: string }[]
  // For `range` input
  min?: number
  max?: number
  step?: number
  // Only display if condition matches (eg: if `clickAction` is `"open-link"`)
  conditions?: TODO[]
}

export type InputType =
  | "instagram"
  | "select"
  | "radio"
  | "range"
  | "button"
  | "image"
  | "color"
  | "text"
  | "switch"
  | "textarea"

declare global {
  interface Window {
    WeaverseStudioBridge: TODO
    weaverseShopifyProducts: TODO
    weaverseGlobalSettings: TODO
  }
}
