import type { CSSProperties } from 'react'
import type {
  OptionDisplayType,
  ShopifyProductOption,
  ShopifyProductVariant,
} from '~/types'
import { getSwatchValue, optionRadiusSizeMap, optionSizeMap } from './swatch'

export function getOptionsGroupConfigs(option: ShopifyProductOption) {
  let { swatches } = window.weaverseShopifyConfigs || {}
  let optionConfig = swatches?.find((sw) => sw.name === option.name)
  let optionDisplayName = option.name
  let optionDesign: OptionDisplayType = 'button'
  let style = {}
  if (optionConfig) {
    let { displayName, type, size, shape } = optionConfig
    optionDisplayName = displayName
    optionDesign = type
    if (type !== 'dropdown') {
      style = {
        '--size': optionSizeMap[type]![size],
        '--radius': optionRadiusSizeMap[shape],
      }
    }
  }

  return {
    optionDisplayName,
    optionDesign,
    style,
  }
}

export function getOptionItemStyle(
  value: string,
  design: OptionDisplayType,
  selectedVariant: ShopifyProductVariant | null
) {
  if (/button|dropdown/.test(design)) return {}

  let colorSwatch = getSwatchValue('color', value)
  let imageSwatch = getSwatchValue('image', value)
  let bgImage = ''
  if (design === 'custom-image') {
    bgImage = `url(${imageSwatch})`
  }
  if (design === 'variant-image') {
    let variantImage = selectedVariant?.featured_image?.src
    let bgImage = variantImage || imageSwatch
    bgImage = `url(${bgImage})`
  }
  let style: CSSProperties = {
    backgroundColor: colorSwatch,
    backgroundImage: bgImage,
  }

  return style
}
