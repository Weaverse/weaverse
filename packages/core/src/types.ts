import type { CSSProperties, ForwardRefExoticComponent } from 'react'
import type { IconName } from './icon-name'

/** Actions that can be displayed in an element's Studio toolbar. */
export type ToolbarAction =
  | 'general-settings'
  | 'settings-level-2'
  | 'duplicate'
  | 'delete'
  | 'global-sections'

/** Advanced style groups available in the Studio settings panel. */
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

/** Preset positions supported by position inputs. */
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

/**
 * Input controls supported by legacy Core schemas.
 *
 * @remarks Prefer the equivalent input types from `@weaverse/schema` for new
 * schemas. This type remains available for backward compatibility.
 */
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

/** CSS properties accepted by Weaverse elements. */
export type WeaverseCSSProperties = CSSProperties

/** Nested CSS rules keyed by a child selector. */
export type ChildElementCSS = Partial<{
  /** Styles for a nested child selector. */
  [selector: string]: WeaverseCSSProperties & ChildElementCSS
}>

/** A resource selected by its numeric identifier and handle. */
export type WeaverseResourcePickerData = {
  /** The resource's numeric identifier. */
  id: number
  /** The resource's URL-friendly handle. */
  handle: string
}

/** Image metadata returned by a Weaverse image input. */
export type WeaverseImage = {
  /** The image identifier. */
  id: string
  /** The image URL. */
  url: string
  /** Alternative text for the image. */
  altText: string
  /** The intrinsic image width in pixels. */
  width: number
  /** The intrinsic image height in pixels. */
  height: number
  /** A lightweight URL suitable for previews. */
  previewSrc: string
}

/** Video metadata returned by a Weaverse video input. */
export type WeaverseVideo = {
  /** The video identifier. */
  id: string
  /** The video URL. */
  url: string
  /** Alternative text for the video. */
  altText: string
  /** The intrinsic video width in pixels. */
  width: number
  /** The intrinsic video height in pixels. */
  height: number
  /** A lightweight URL suitable for previews. */
  previewSrc: string
}

/** Additional configuration accepted by configurable input controls. */
export type AdditionalInputConfigs =
  | SelectInputConfigs
  | ToggleGroupConfigs
  | RangeInputConfigs

/** Responsive CSS assigned to a Weaverse element. */
export type ElementCSS = {
  /** Styles applied at the desktop breakpoint. */
  '@desktop'?: WeaverseCSSProperties | ChildElementCSS
  /** Styles applied at the mobile breakpoint. */
  '@mobile'?: WeaverseCSSProperties | ChildElementCSS
}

/** Serialized data for one element in a Weaverse project. */
export type ElementData = {
  /** The unique element identifier. */
  id: string
  /** The registered element type. */
  type: string
  /** Component-specific settings and metadata. */
  [key: string]: any
}

/** Runtime metadata attached to a rendered Weaverse element. */
export type WeaverseElement = {
  /** The React component registered for the element. */
  Component: ForwardRefExoticComponent<any>
  /** The registered element type. */
  type: string
  /** The unique element identifier used in rendered markup. */
  'data-wv-id': string
  /** The element type used in rendered markup. */
  'data-wv-type': string
}

/**
 * Minimal legacy schema metadata for an element.
 *
 * @remarks Prefer `SchemaType` from `@weaverse/schema` for new schemas. This
 * type remains available for backward compatibility.
 */
export type ElementSchema = {
  /** The human-readable element title. */
  title: string
  /** The unique element type. */
  type: string
}

/** Media query values used for responsive element styles. */
export type BreakPoints = {
  /** The media query used for mobile styles. */
  mobile: string
  /** The media query used for desktop styles. */
  desktop: string
}

/** Serialized project data consumed by the Core runtime. */
export type WeaverseProjectDataType = {
  /** The optional project or page identifier. */
  id?: string
  /** All serialized elements in the project. */
  items: ElementData[]
  /** The identifier of the project's root element. */
  rootId: string
}

/** Options used to initialize the Weaverse Core runtime. */
export type WeaverseCoreParams = {
  /** Custom media queries for responsive element styles. */
  mediaBreakPoints?: BreakPoints
  /** Base URL of the Weaverse Studio host. */
  weaverseHost?: string
  /** Weaverse runtime version exposed to integrations. */
  weaverseVersion?: string
  /** Identifier of the project being rendered. */
  projectId: string
  /** Initial serialized project data. */
  data: WeaverseProjectDataType
  /** Whether the runtime is connected to Studio design mode. */
  isDesignMode?: boolean
}

/** Describes a legacy Studio input bound to element data or styles. */
export type BasicInput<ConfigsType = AdditionalInputConfigs> = {
  /** The input control to render. */
  type: InputType
  /** The element data or style property updated by the input. */
  name: string
  /** The label shown in Studio. */
  label?: string
  /** Additional control-specific configuration. */
  configs?: ConfigsType
  /** An expression controlling whether the input is displayed. */
  condition?: string
  /** The value used when the setting has not been customized. */
  defaultValue?:
    | string
    | number
    | boolean
    | Partial<WeaverseImage>
    | {
        /** Structured input data keyed by field name. */
        [x: string]: any
      }
  /** Placeholder text shown by supported controls. */
  placeholder?: string
  /** Supporting text shown alongside the input. */
  helpText?: string
}

/** Configuration for a legacy select input. */
export type SelectInputConfigs = {
  /** Choices displayed by the input. */
  options?: {
    /** The value stored when the option is selected. */
    value: string
    /** The option label shown in Studio. */
    label: string
  }[]
}

/** Configuration for a legacy toggle-group input. */
export type ToggleGroupConfigs = {
  /** Choices displayed by the input. */
  options?: {
    /** The value stored when the option is selected. */
    value: string
    /** The option label shown in Studio. */
    label: string
    /** An optional icon displayed with the option. */
    icon?: IconName
  }[]
}

/** Configuration for a legacy range input. */
export type RangeInputConfigs = {
  /** The smallest selectable value. */
  min?: number
  /** The largest selectable value. */
  max?: number
  /** The increment between selectable values. */
  step?: number
  /** The unit displayed beside the value. */
  unit?: string
}

declare global {
  interface Window {
    weaverseStudio: any
  }
}
