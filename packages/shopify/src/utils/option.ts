import type { CSSProperties } from 'react'
import type {
  OptionDisplayType,
  OptionKey,
  ShopifyProduct,
  ShopifyProductOption,
  ShopifyProductVariant,
} from '~/types'
import { resizeImage } from './image'
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
  position: number,
  product: ShopifyProduct
) {
  if (/button|dropdown/.test(design)) return {}

  let colorSwatch = getSwatchValue('color', value)
  let imageSwatch = getSwatchValue('image', value)
  let bgImage = ''

  if (design === 'custom-image') {
    bgImage = `url(${imageSwatch})`
  }
  if (design === 'variant-image') {
    let variantImage = ''
    let variant = product.variants.find(
      (v) => v[`option${position}` as OptionKey] === value
    )
    if (variant?.featured_image) {
      variantImage = resizeImage(variant?.featured_image.src, '200x')
    } else if (variant?.image_id) {
      let image = product.images.find((i) => i.id === variant?.image_id)
      variantImage = resizeImage(image?.src || '', '200x')
    }
    bgImage = `url(${variantImage || imageSwatch})`
  }

  return {
    backgroundColor: colorSwatch,
    backgroundImage: bgImage,
    '--aspect-ratio': product.aspect_ratio || 1,
  } as CSSProperties
}
