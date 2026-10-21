/**
 * React and React Router integrations for rendering Weaverse content in
 * Shopify Hydrogen storefronts.
 *
 * @packageDocumentation
 */

import { getSelectedProductOptions as hydrogen_getSelectedProductOptions } from '@shopify/hydrogen'
import type { SelectedOptionInput } from '@shopify/hydrogen/storefront-api-types'
import {
  isBrowser,
  isIframe,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useWeaverse,
} from '@weaverse/react'

/**
 * Filter out Weaverse-specific query parameters from product options.
 * Removes `isDesignMode` and any parameters starting with `weaverse` prefix.
 *
 * @remarks
 * Delegates to Shopify Hydrogen's `getSelectedProductOptions`. All other
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
 * export async function loader({ request, context, params }: LoaderFunctionArgs) {
 *   const selectedOptions = getSelectedProductOptions(request)
 *   const { product } = await context.storefront.query(PRODUCT_QUERY, {
 *     variables: { handle: params.handle, selectedOptions },
 *   })
 *   return { product }
 * }
 * ```
 */
export function getSelectedProductOptions(
  request: Request
): SelectedOptionInput[] {
  let options = hydrogen_getSelectedProductOptions(request)
  return options.filter(
    ({ name }) => name !== 'isDesignMode' && !name.startsWith('weaverse')
  )
}

// Re-export all types and utilities from schema package
export * from '@weaverse/schema'
export * from './components'
export {
  getNestedKey,
  interpolate,
  // Deprecated aliases — kept for backward compatibility.
  ThemeTextProvider,
  type ThemeTextProviderProps,
  type ThemeTextValue,
  type TranslateFunction,
  // Canonical translation API.
  TranslationProvider,
  type TranslationProviderProps,
  type TranslationValue,
  useThemeText,
  useTranslation,
} from './hooks/translation-context'
// Export Hydrogen-specific hooks
export {
  createWeaverseDataContext,
  type RouteKeyedDataContext,
  useWeaverseDataContext,
  type WeaverseDataContext,
} from './hooks/use-weaverse-data-context'
// Export hydrogen-specific modules
export * from './seo'
export * from './types'
export * from './utils'
export type { WeaverseDataValue } from './utils/pick-weaverse-data'
export { ThemeTextStore, TranslationStore } from './utils/translation-store'
export type {
  ThemeSettingsStore,
  WeaverseThemeData,
} from './utils/use-theme-settings-store'
export * from './WeaverseHydrogenRoot'
export * from './weaverse-client'
// Re-export utilities from @weaverse/react
export {
  isBrowser,
  isIframe,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useWeaverse,
}
