import type { OptionDisplayType, OptionShape, OptionSize } from '~/types'

export let optionSizeMap: Partial<
  Record<OptionDisplayType, Record<OptionSize, string>>
> = {
  button: { sm: '32px', md: '40px', lg: '48px' },
  color: { sm: '32px', md: '40px', lg: '48px' },
  'custom-image': { sm: '32px', md: '40px', lg: '48px' },
  'variant-image': { sm: '32px', md: '40px', lg: '48px' },
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
    let fallbackBgColor = value.toLocaleLowerCase()
    let colorSwatch = colorSwatches.find(
      ({ name }) => name.toLowerCase() === value.toLowerCase()
    )
    return colorSwatch?.value || fallbackBgColor
  }
  let imageSwatch = imageSwatches.find(
    ({ name }) => name.toLowerCase() === value.toLowerCase()
  )
  return imageSwatch?.value || value
}
