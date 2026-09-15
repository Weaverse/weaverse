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
