import type * as Stitches from '@stitches/core'
import type { ForwardRefExoticComponent } from 'react'
import type { IconName } from './icon-name'
import type { stitchesUtils } from './utils/stitches'

// Simple types
export type PlatformTypeEnum = 'shopify-section' | 'shopify-hydrogen' | 'nextjs'
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
export type InputType =
  | 'blog'
  | 'collection'
  | 'collection-list'
  | 'color'
  | 'datepicker'
  | 'image'
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
  | 'swatches'
  | 'metaobject'
  | 'url'

// Complex types
export type WeaverseCSSProperties = Stitches.CSS &
  Partial<Record<keyof typeof stitchesUtils, string | number>>
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
}
export type AdditionalInputConfigs =
  | SelectInputConfigs
  | ToggleGroupConfigs
  | RangeInputConfigs

export interface ElementCSS {
  '@desktop'?: WeaverseCSSProperties | ChildElementCSS
  '@mobile'?: WeaverseCSSProperties | ChildElementCSS
}

export interface ElementData {
  id: string
  type: string
  [key: string]: any
}

export interface WeaverseElement {
  Component: ForwardRefExoticComponent<any>
  type: string
  'data-wv-id': string
  'data-wv-type': string
}

export interface ElementSchema {
  title: string
  type: string
}

export interface BreakPoints {
  mobile: string
  desktop: string
}

export interface WeaverseProjectDataType {
  id?: string
  items: ElementData[]
  rootId: string
}

export interface WeaverseCoreParams {
  mediaBreakPoints?: BreakPoints
  weaverseHost?: string
  weaverseVersion?: string
  projectId: string
  data: WeaverseProjectDataType
  isDesignMode?: boolean
  platformType?: PlatformTypeEnum
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
export interface BasicInput<ConfigsType = AdditionalInputConfigs> {
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

export interface SelectInputConfigs {
  options?: { value: string; label: string }[]
}

export interface ToggleGroupConfigs {
  options?: { value: string; label: string; icon?: IconName }[]
}

export interface RangeInputConfigs {
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
