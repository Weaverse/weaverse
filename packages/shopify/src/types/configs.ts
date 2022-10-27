export type OptionDisplayType =
  | 'dropdown'
  | 'button'
  | 'color'
  | 'variant-image'
  | 'custom-image'
export type OptionSize = 'sm' | 'md' | 'lg'
export type OptionShape = 'square' | 'round' | 'circle'

export interface OptionData {
  id: string
  name: string
  displayName: string
  type: OptionDisplayType
  size: OptionSize
  shape: OptionShape
}

export interface ColorPresets {
  id: string
  name: string
  value: string
}
export type SwatchImagePresets = ColorPresets
export type TypoPresetsValue = {
  [key: string]: string
}
export interface TypoPresets {
  id: string
  name: string
  value: TypoPresetsValue
}
export interface PresetsData {
  colors?: ColorPresets[]
  typography?: TypoPresets[]
  colorSwatches?: ColorPresets[]
  imageSwatches?: SwatchImagePresets[]
}

export interface ShopifyGlobalConfigs {
  shopData: {
    currency: string
    money_format: string
    primary_locale: string
  }
  swatches: OptionData[]
  presets: PresetsData
}

export interface WeaverseCartHelpers {
  subscribe: (event: string, callback: (data: any) => void) => void
  unsubscribe: (event: string, callback: (data: any) => void) => void
  notify: (event: string, data: any) => void
}
