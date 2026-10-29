/**
 * React Router adapter of the Weaverse SDK for Hydrogen 2026.10+ storefronts:
 * the request-scoped client, root rendering, Studio connection, SEO and
 * commerce helpers. Re-exports the core and the React bindings, so a theme
 * imports everything from this entry.
 *
 * @packageDocumentation
 */

export {
  TranslationProvider,
  type TranslationProviderProps,
  type TranslationValue,
  useTranslation,
} from './hooks/translation-context'
export * from './index'
export * from './react'
export { getWeaverseSeoMeta, type WeaverseSeoInput } from './seo'
export type { RouteLoaderArgs } from './types'
export { getSelectedProductOptions } from './utils/product-options'
export {
  useThemeSettings,
  WeaverseHydrogenRoot,
  type WeaverseHydrogenRootErrorProps,
  type WeaverseHydrogenRootProps,
  type WithWeaverseOptions,
  withWeaverse,
} from './WeaverseHydrogenRoot'
export {
  type BuilderApiCacheTarget,
  type FetchCustomPagesOptions,
  WeaverseClient,
  type WeaverseFetchWithCacheOptions,
} from './weaverse-client'
