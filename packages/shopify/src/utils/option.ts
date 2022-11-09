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
import { getVariantFromOptionArray, getVariantOptions } from './variant'

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
  type: OptionDisplayType,
  position: number,
  product: ShopifyProduct
) {
  if (/button|dropdown/.test(type)) return {}

  let colorSwatch = getSwatchValue('color', value)
  let imageSwatch = getSwatchValue('image', value)
  let bgImage = ''

  if (type === 'custom-image') {
    bgImage = `url(${imageSwatch})`
  }
  if (type === 'variant-image') {
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
    if (variantImage || imageSwatch) {
      bgImage = `url(${variantImage || imageSwatch})`
    }
  }

  return {
    backgroundColor: colorSwatch || value.toLocaleLowerCase(),
    backgroundImage: bgImage,
    '--aspect-ratio': product.aspect_ratio || 1,
  } as CSSProperties
}

export function getSoldOutAndUnavailableState(
  value: string,
  position: number,
  product: ShopifyProduct,
  selectedOptions: string[]
) {
  let state = { soldOut: false, unavailable: false }
  if (selectedOptions.length) {
    let maxOptions = product.options.length
    let matchVariants = []
    if (position === maxOptions) {
      let options = Array.from(selectedOptions)
      options[maxOptions - 1] = value
      matchVariants.push(getVariantFromOptionArray(product, options))
    } else {
      matchVariants = product.variants.filter((v) => {
        let variantOpts = getVariantOptions(v)
        return (
          variantOpts[position - 1] === value &&
          variantOpts[position - 2] === selectedOptions[position - 2]
        )
      })
    }
    matchVariants = matchVariants.filter(Boolean)
    if (matchVariants.length) {
      state.soldOut = matchVariants.every((v) => v.available === false)
    } else {
      state.unavailable = true
    }
  }
  return state
}
