/**
 * Next.js App Router rendering, provider, Studio, translation, and schema APIs.
 *
 * When migrating from `@weaverse/hydrogen`, replace route-loader context with
 * {@link WeaverseNextProvider} props and render page data with
 * {@link WeaverseNextRenderer}. Import server-only fetching and route-handler
 * helpers from `@weaverse/next/server`.
 *
 * @packageDocumentation
 */

// Re-export schema authoring + runtime hooks for migration ergonomics.

// Runtime hooks from @weaverse/react (item store + editor instance).
export {
  isBrowser,
  isIframe,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useWeaverse,
} from '@weaverse/react'
export * from '@weaverse/schema'
export { createWeaverseNextClient } from './client'
export {
  useThemeSettings,
  useWeaverseCommerce,
  useWeaversePageData,
  useWeaverseRootData,
} from './hooks'
export type { WeaverseNextItem } from './item'
export {
  type RunComponentLoadersArgs,
  runWeaverseComponentLoaders,
} from './loader'
export {
  WeaverseNextProvider,
  type WeaverseNextProviderProps,
} from './provider'
export {
  WeaverseNextRenderer,
  type WeaverseNextRendererProps,
} from './renderer'
export { buildWeaverseNextRequestInfo } from './request-info'
export {
  DEFAULT_REVALIDATE_ENDPOINT,
  type RevalidateItemRuntimeLike,
  revalidateWeaverseNextItem,
} from './revalidate-item'
export {
  type WeaverseNextRootContextValue,
  WeaverseNextRootProvider,
  type WeaverseNextRootProviderProps,
} from './root-provider'
export {
  bindWeaverseNextStudioRuntime,
  createWeaverseNextRuntime,
  type WeaverseNextRenderablePage,
  WeaverseNextRuntime,
} from './runtime'
export {
  formatWeaverseNextSeoMetadata,
  getWeaverseNextSeoMetadata,
  type NextOpenGraph,
  type NextTwitter,
  type WeaverseNextSeoInput,
  type WeaverseNextSeoMetadata,
  type WeaverseNextSeoPageContainer,
} from './seo'
export {
  WeaverseNextStudioBridge,
  type WeaverseNextStudioBridgeProps,
} from './studio-bridge'
export {
  type LoadWeaverseNextStudioScriptOptions,
  loadWeaverseNextStudioScript,
  WeaverseNextStudioConnect,
  type WeaverseNextStudioConnectProps,
} from './studio-connect'
export {
  type CreateWeaverseNextStudioInternalsOptions,
  createWeaverseNextStudioInternals,
  type WeaverseNextRouterLike,
  type WeaverseNextStudioInternals,
} from './studio-router'
export {
  type ResolveWeaverseNextStudioScriptSrcOptions,
  resolveWeaverseNextStudioScriptSrc,
} from './studio-script-src'
export {
  type CreateWeaverseNextThemeSettingsStoreOptions,
  createWeaverseNextThemeSettingsStore,
} from './theme-settings-store'
export {
  type CreateTranslateSources,
  createTranslate,
  getNestedKey,
  interpolate,
  ThemeTextProvider,
  type ThemeTextProviderProps,
  type ThemeTextValue,
  type TranslateFunction,
  TranslationProvider,
  type TranslationProviderProps,
  type TranslationValue,
  useThemeText,
  useTranslation,
} from './translation-context'
export { ThemeTextStore, TranslationStore } from './translation-store'
export type {
  WeaverseArticle,
  WeaverseBlog,
  WeaverseCollection,
  WeaverseMetaObject,
  WeaverseNextCacheConfig,
  WeaverseNextClient,
  WeaverseNextClientConfig,
  WeaverseNextCommerceContext,
  WeaverseNextComponent,
  WeaverseNextComponentData,
  WeaverseNextComponentLoaderArgs,
  WeaverseNextComponentProps,
  WeaverseNextCustomPageEntry,
  WeaverseNextFetchCustomPagesOptions,
  WeaverseNextI18n,
  WeaverseNextLoaderData,
  WeaverseNextLoadPageInput,
  WeaverseNextPageAssignment,
  WeaverseNextPageData,
  WeaverseNextRequestContext,
  WeaverseNextRequestInfo,
  WeaverseNextRuntimeConfig,
  WeaverseNextRuntimeInternal,
  WeaverseNextStorefront,
  WeaverseNextThemeSchema,
  WeaverseNextThemeSchemaGroup,
  WeaverseNextThemeSchemaInput,
  WeaverseNextThemeSettingsStore,
  WeaverseNextTranslationChanges,
  WeaverseNextTranslationEntry,
  WeaverseNextTranslationItemEntry,
  WeaverseNextTranslationMap,
  WeaverseNextTranslationMapEntry,
  WeaverseProduct,
} from './types'
export {
  useWeaverseNextStudioInternals,
  WeaverseNextStudio,
  type WeaverseNextStudioProps,
} from './use-weaverse-next-studio'
export { generateDataFromSchema } from './utils'
