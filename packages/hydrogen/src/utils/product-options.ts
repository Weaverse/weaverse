import {
  getSelectedProductOptions as hydrogen_getSelectedProductOptions,
  type SelectedOption,
} from '@shopify/hydrogen'

/**
 * Filter out Weaverse-specific query parameters from product options.
 * Removes `isDesignMode` and any parameters starting with `weaverse` prefix.
 *
 * @remarks
 * Delegates to Shopify Hydrogen 2026.10's `getSelectedProductOptions`. The
 * Next.js adapter has no equivalent; a Next.js storefront reads product
 * options from its own route search params. All other
 * parameter names are kept exactly as they appear in the URL, so
 * `?option[Color]=Blue` yields `{ name: 'option[Color]', value: 'Blue' }`.
 *
 * @category Utilities
 * @param request - The incoming HTTP request
 * @returns Filtered product options for Shopify Hydrogen
 *
 * @example
 * ```ts
 * // ?Color=Blue&Size=XL&isDesignMode=true
 * // => [{ name: 'Color', value: 'Blue' }, { name: 'Size', value: 'XL' }]
 * import { Cache } from '@shopify/hydrogen'
 * import { getSelectedProductOptions } from '@weaverse/hydrogen/react-router'
 *
 * export async function loader({ request, context, params }: Route.LoaderArgs) {
 *   const selectedOptions = getSelectedProductOptions(request)
 *   const { data, errors } = await context.storefront.graphql(PRODUCT_QUERY, {
 *     variables: { handle: params.handle, selectedOptions },
 *     cache: Cache.short(),
 *   })
 *   if (errors?.length) throw new Error(errors[0].message)
 *   return { product: data?.product }
 * }
 * ```
 */
export function getSelectedProductOptions(request: Request): SelectedOption[] {
  let options = hydrogen_getSelectedProductOptions({
    searchParams: new URL(request.url).searchParams,
  })
  return options.filter(
    ({ name }) => name !== 'isDesignMode' && !name.startsWith('weaverse')
  )
}
