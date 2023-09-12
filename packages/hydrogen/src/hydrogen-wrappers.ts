import { getSelectedProductOptions as hydrogen_getSelectedProductOptions } from '@shopify/hydrogen'
import { createContentSecurityPolicy as hydrogen_createContentSecurityPolicy } from '@shopify/hydrogen'
import { getWeaverseCsp } from './utils'

export function getSelectedProductOptions(request: Request) {
  let options = hydrogen_getSelectedProductOptions(request)
  return options.filter(
    ({ name }) => name !== 'isDesignMode' && !name.startsWith('weaverse'),
  )
}

export function createContentSecurityPolicy(
  request: Request,
  directives?: Record<string, string[] | string | boolean>,
) {
  let weaverseDirectives = getWeaverseCsp(request)
  return hydrogen_createContentSecurityPolicy({
    ...directives,
    ...weaverseDirectives,
  })
}
