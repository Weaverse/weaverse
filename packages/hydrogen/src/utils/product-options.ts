import {
  getSelectedProductOptions as hydrogen_getSelectedProductOptions,
  type SelectedOption,
} from '@shopify/hydrogen'

/**
 * Filter out Weaverse-specific query parameters from product options.
 * Removes `isDesignMode` and any parameters starting with `weaverse` prefix.
 *
 * @param request - The incoming HTTP request
 * @returns Filtered product options for Shopify Hydrogen
 *
 * @example
 * ```typescript
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   const selectedOptions = getSelectedProductOptions(request)
 *   // Use selectedOptions for product queries without Weaverse params
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
