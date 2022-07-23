import type { ForwardRefExoticComponent } from "react"
import { stichesUtils } from "./utils/styles"

export interface ProjectDataType {
  items: WeaverseElementData[]
  rootId: string
  script: {
    css: string
    js: string
  }
}

export type WeaverseType = {
  mediaBreakPoints?: any
  appUrl?: string
  projectKey?: string
  projectData?: ProjectDataType
  isDesignMode?: boolean
  ssrMode?: boolean
}

export type TODO = any
export type WeaverseElementMap = {
  [key: string]: WeaverseElement
}

export type WeaverseElement = {
  Component: ForwardRefExoticComponent<any>
  type: string
  schema?: WeaverseElementSchema
}

export type CatalogGroup = "essential" | "composition" | "other"

export type WeaverseElementCatalog = {
  name: string
  icon?: string
  group?: CatalogGroup
}

export type ElementFlags = "draggable" | "resizable" | "sortable"

export type WeaverseElementFlags = {
  [key in ElementFlags]?: boolean
}

export type ToolbarAction =
  | "duplicate"
  | "delete"
  | "edit-button"
  | "insert-link"
  | "select-template"
  | "copy-styles"
  | "paste-styles"

export type WeaverseChildElement = {
  label: string
  selector: string
}

export type ElementParentType = "container" | "layout" | "root"

export type ElementGridSize = {
  rowSpan: number
  colSpan: number
}

export type WeaverseElementSchema = {
  type: string
  parentType: ElementParentType
  gridSize?: ElementGridSize
  title: string
  inspector?: ElementInspector
  toolbar?: (ToolbarAction | ToolbarAction[])[]
  subElements?: WeaverseChildElement[]
  catalog?: WeaverseElementCatalog // Element catalog
  flags?: WeaverseElementFlags
}
export type WeaverseElementData = {
  id: string
  type: string
  childIds?: (string | number)[] | undefined
  css?: WeaverseElementCSS
  [key: string]: any
}

export type WeaverseCSSProperties = React.CSSProperties | Record<keyof typeof stichesUtils, string | number>
export type CSS = WeaverseCSSProperties | { [selector: string]: CSS }
export type WeaverseElementCSS = {
  "@desktop"?: CSS
  "@mobile"?: CSS
}

export type ElementInspector = {
  settings?: InspectorInput[]
  styles?: InspectorInput[]
}

export type InspectorInput = {
  type: InputType
  label?: string
  name?: string // binding property name
  defaultValue?: string
  helpText?: string // display help text
  options?: TODO[] // select options
  conditions?: TODO[] // only display if conditions are met, eg. {  name: 'productDataLoaded', value: true }
  [key: string]: TODO // other properties, implement later
}

export type InputType =
  | "select"
  | "checkbox"
  | "radio"
  | "range"
  | "button"
  | "image"
  | "file"
  | "hidden"
  | "alignment"
  | "color"
  | "dimensions"
  | "flex"
  | "grid"
  | "input"
  | "switch"
  | "spacing"
  | "textarea"
  | "visibility"
  | "border"
  | "background"
  | "typography"
  | "shadow"
  | "position"
  | "overflow"
  | "display"
  | "other"

declare global {
  interface Window {
    WeaverseStudioBridge: TODO
    weaverseShopifyProducts: TODO
  }
}
