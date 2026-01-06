import type { CSSProperties, ForwardRefExoticComponent } from 'react'
import type { IconName } from './icon-name'

// Simple types
export type ToolbarAction =
  | 'general-settings'
  | 'settings-level-2'
  | 'duplicate'
  | 'delete'
  | 'global-sections'
export type AdvancedGroupType =
  | 'border'
  | 'alignment'
  | 'background'
  | 'dimensions'
  | 'spacing'
  | 'typography'
  | 'visibility'
  | 'shadows-and-effects'
  | 'layout-background'
export type PositionInputValue =
  | 'top left'
  | 'top center'
  | 'top right'
  | 'center left'
  | 'center center'
  | 'center right'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right'
// InputType is now defined in @weaverse/schema
// This is kept for backward compatibility
export type InputType =
  | 'blog'
  | 'collection'
  | 'collection-list'
  | 'color'
  | 'datepicker'
  | 'image'
  | 'video'
  | 'map-autocomplete'
  | 'position'
  | 'product'
  | 'product-list'
  | 'range'
  | 'richtext'
  | 'select'
  | 'switch'
  | 'text'
  | 'textarea'
  | 'toggle-group'
  | 'metaobject'
  | 'url'

// Complex types
// WeaverseCSSProperties now maps directly to React.CSSProperties
// Previously used Stitches CSS-in-JS system (removed in v5.8.4)
export type WeaverseCSSProperties = CSSProperties
export type ChildElementCSS = Partial<{
  [selector: string]: WeaverseCSSProperties & ChildElementCSS
}>
export type WeaverseResourcePickerData = { id: number; handle: string }
export type WeaverseImage = {
  id: string
  url: string
  altText: string
  width: number
  height: number
  previewSrc: string
}
export type WeaverseVideo = {
  id: string
  url: string
  altText: string
  width: number
  height: number
  previewSrc: string
}
export type AdditionalInputConfigs =
  | SelectInputConfigs
  | ToggleGroupConfigs
  | RangeInputConfigs

export type ElementCSS = {
  '@desktop'?: WeaverseCSSProperties | ChildElementCSS
  '@mobile'?: WeaverseCSSProperties | ChildElementCSS
}

export type ElementData = {
  id: string
  type: string
  [key: string]: any
}

export type WeaverseElement = {
  Component: ForwardRefExoticComponent<any>
  type: string
  'data-wv-id': string
  'data-wv-type': string
}

// ElementSchema is now defined in @weaverse/schema as SchemaType
// This is kept for backward compatibility
export type ElementSchema = {
  title: string
  type: string
}

export type BreakPoints = {
  mobile: string
  desktop: string
}

export type WeaverseProjectDataType = {
  id?: string
  items: ElementData[]
  rootId: string
}

export type WeaverseCoreParams = {
  mediaBreakPoints?: BreakPoints
  weaverseHost?: string
  weaverseVersion?: string
  projectId: string
  data: WeaverseProjectDataType
  isDesignMode?: boolean
}

/**
 * BasicInput interface
 *
 * @property {InputType} type - The type of the input
 * @property {string} name - The key of the value of the element data or styles
 * @property {string} [label] - The label of the input
 * @property {ConfigsType} [configs] - Additional options for inputs that require more configuration
 *
 * @example
 * // Bind to `element.data.title`
 * name: "title"
 * // Bind to `element.css["@desktop"].backgroundColor`
 * name: "backgroundColor"
 */
export type BasicInput<ConfigsType = AdditionalInputConfigs> = {
  type: InputType
  name: string
  label?: string
  configs?: ConfigsType
  condition?: string
  defaultValue?:
    | string
    | number
    | boolean
    | Partial<WeaverseImage>
    | { [x: string]: any }
  placeholder?: string
  helpText?: string
}

// Input config types are now defined in @weaverse/schema
// These are kept for backward compatibility
export type SelectInputConfigs = {
  options?: { value: string; label: string }[]
}

export type ToggleGroupConfigs = {
  options?: { value: string; label: string; icon?: IconName }[]
}

export type RangeInputConfigs = {
  min?: number
  max?: number
  step?: number
  unit?: string
}

declare global {
  interface Window {
    weaverseStudio: any
  }
}
