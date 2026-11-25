/**
 * Internal surface of `@weaverse/hydrogen` for Weaverse's own tools (Builder,
 * CLI). Undocumented and not covered by semver: themes import from
 * `@weaverse/hydrogen/react-router` instead.
 *
 * @packageDocumentation
 */

import {
  isBrowser,
  isIframe,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useWeaverse,
} from '@weaverse/react'

// Re-export all types and utilities from schema package
export * from '@weaverse/schema'
export * from './components'
export {
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
export { getNestedKey } from './utils/nested-key'
export type { WeaverseDataValue } from './utils/pick-weaverse-data'
export { getSelectedProductOptions } from './utils/product-options'
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
