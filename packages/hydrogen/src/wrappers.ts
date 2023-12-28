import { getSelectedProductOptions as hydrogen_getSelectedProductOptions } from '@shopify/hydrogen'
import type { SelectedOptionInput } from '@shopify/hydrogen/storefront-api-types'

export function getSelectedProductOptions(
  request: Request,
): SelectedOptionInput[] {
  let options = hydrogen_getSelectedProductOptions(request)
  return options.filter(
    ({ name }) => name !== 'isDesignMode' && !name.startsWith('weaverse'),
  )
}
