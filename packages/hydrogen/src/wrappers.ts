import { getSelectedProductOptions as hydrogen_getSelectedProductOptions } from '@shopify/hydrogen'

export function getSelectedProductOptions(request: Request) {
  let options = hydrogen_getSelectedProductOptions(request)
  return options.filter(
    ({ name }) => name !== 'isDesignMode' && !name.startsWith('weaverse'),
  )
}
