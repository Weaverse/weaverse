import type { OptionDisplayType, OptionShape, OptionSize } from '~/types'

export let optionSizeMap: Partial<
  Record<OptionDisplayType, Record<OptionSize, string>>
> = {
  button: { sm: '32px', md: '40px', lg: '48px' },
  color: { sm: '32px', md: '40px', lg: '48px' },
  'custom-image': { sm: '32px', md: '40px', lg: '48px' },
  'variant-image': { sm: '55px', md: '75px', lg: '85px' },
}

export let optionRadiusSizeMap: Record<OptionShape, string> = {
  round: '4px',
  circle: '100%',
  square: '0px',
}

export function getSwatchValue(type: 'color' | 'image', value: string) {
  let { presets } = window.weaverseShopifyConfigs || {}
  let { colorSwatches = [], imageSwatches = [] } = presets
  if (type === 'color') {
    let colorSwatch = colorSwatches.find(
      ({ name }) => name.toLowerCase() === value.toLowerCase()
    )
    return colorSwatch?.value
  }
  let imageSwatch = imageSwatches.find(
    ({ name }) => name.toLowerCase() === value.toLowerCase()
  )
  return imageSwatch?.value
}
