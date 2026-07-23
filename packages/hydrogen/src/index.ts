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
export function getSelectedProductOptions(
  request: Request
): SelectedOptionInput[] {
  let options = hydrogen_getSelectedProductOptions(request)
  return options.filter(
    ({ name }) => name !== 'isDesignMode' && !name.startsWith('weaverse')
  )
}

/** Placeholder asset URLs for component schema defaults and theme previews. */
export const IMAGES_PLACEHOLDERS = {
  /** White Weaverse logo placeholder. */
  logo_white:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-logo-w-600x200.svg',
  /** Black Weaverse logo placeholder. */
  logo_black:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-logo-k-600x200.svg',
  /** Generic square image placeholder. */
  image:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-image-1024x1024.svg',
  /** First landscape banner placeholder. */
  banner_1:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-lifestyle-1-1800x900.svg',
  /** Second landscape banner placeholder. */
  banner_2:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-lifestyle-2-1800x900.svg',
  /** Hats collection placeholder. */
  collection_1:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-hats-1024x1024.svg',
  /** Shoes collection placeholder. */
  collection_2:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-shoes-1024x1024.svg',
  /** Glasses collection placeholder. */
  collection_3:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-glasses-1024x1024.svg',
  /** Lamps collection placeholder. */
  collection_4:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-lamps-1024x1024.svg',
  /** Bags collection placeholder. */
  collection_5:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-bags-1024x1024.svg',
  /** Watches collection placeholder. */
  collection_6:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-watches-1024x1024.svg',
  /** Third watch product placeholder. */
  product_1:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-watch-3-1024x1024.svg',
  /** Second bag product placeholder. */
  product_2:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-bag-2-1024x1024.svg',
  /** First shoe product placeholder. */
  product_3:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-shoe-1-1024x1024.svg',
  /** Second lamp product placeholder. */
  product_4:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-lamp-2-1024x1024.svg',
  /** First glasses product placeholder. */
  product_5:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-glasses-1-1024x1024.svg',
  /** First lamp product placeholder. */
  product_6:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-lamp-1-1024x1024.svg',
  /** Second glasses product placeholder. */
  product_7:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-glasses-2-1024x1024.svg',
  /** Third hat product placeholder. */
  product_8:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-hat-3-1024x1024.svg',
  /** First bag product placeholder. */
  product_9:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-bag-1-1024x1024.svg',
  /** Second shoe product placeholder. */
  product_10:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-shoe-2-1024x1024.svg',
  /** Second hat product placeholder. */
  product_11:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-hat-2-1024x1024.svg',
  /** Third glasses product placeholder. */
  product_12:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-glasses-3-1024x1024.svg',
  /** Third shoe product placeholder. */
  product_13:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-shoe-3-1024x1024.svg',
  /** Third bag product placeholder. */
  product_14:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-bag-3-1024x1024.svg',
  /** First hat product placeholder. */
  product_15:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-hat-1-1024x1024.svg',
  /** Third lamp product placeholder. */
  product_16:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-lamp-3-1024x1024.svg',
  /** First watch product placeholder. */
  product_17:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-watch-1-1024x1024.svg',
  /** Second watch product placeholder. */
  product_18:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-watch-2-1024x1024.svg',
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
