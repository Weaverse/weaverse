import type { CSSProperties } from 'react'

export type OptionDisplayType =
  | 'dropdown'
  | 'button'
  | 'color'
  | 'variant-image'
  | 'custom-image'
export type OptionSize = 'sm' | 'md' | 'lg'
export type OptionShape = 'square' | 'round' | 'circle'

export interface OptionStyle extends CSSProperties {
  '--size'?: string
  '--radius'?: string
}

export type OptionData = {
  id: string
  name: string
  displayName: string
  type: OptionDisplayType
  size: OptionSize
  shape: OptionShape
}

export type ColorPresets = {
  id: string
  name: string
  value: string
}
export type SwatchImagePresets = ColorPresets
export type TypoPresetsValue = {
  [key: string]: string
}
export type TypoPresets = {
  id: string
  name: string
  value: TypoPresetsValue
}
export type PresetsData = {
  colors?: ColorPresets[]
  typography?: TypoPresets[]
  colorSwatches?: ColorPresets[]
  imageSwatches?: SwatchImagePresets[]
}

export type ShopifyGlobalConfigs = {
  shopData: {
    name: string
    currency: string
    money_format: string
    money_with_currency_format: string
    products_count: number
    product_handle: string
    product_id: number
    template: string
    template_name: string
    request: {
      design_mode: boolean
      host: string
      origin: string
      page_type: string
      path: string
    }
    url: string
    secure_url: string
    domain: string
    permanent_domain: string
    primary_locale: string
    shop_locale: {
      published_locales: {
        shop_locale: {
          locale: string
          enabled: boolean
          primary: boolean
          published: boolean
        }
      }[]
      current: string
      primary: string
    }
    routes: {
      all_products_collection_url: string
      cart_add_url: string
      cart_change_url: string
      cart_clear_url: string
      cart_update_url: string
      cart_url: string
      collections_url: string
      predictive_search_url: string
      product_recommendations_url: string
      root_url: string
      search_url: string
    }
  }
  swatches: OptionData[]
  presets: PresetsData
}

export type WeaverseCartHelpers = {
  subscribe: (event: string, callback: (data: any) => void) => void
  unsubscribe: (event: string, callback: (data: any) => void) => void
  notify: (event: string, data: any) => void
}
