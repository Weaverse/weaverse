/**
 * Next.js App Router rendering, provider, Studio, translation, and schema APIs.
 *
 * When migrating from `@weaverse/hydrogen`, replace route-loader context with
 * {@link WeaverseNextProvider} props and render page data with
 * {@link WeaverseNextRenderer}. Import server-only fetching and route-handler
 * helpers from `@weaverse/next/server`.
 *
 * @packageDocumentation
 * @module main
 */

// Re-export schema authoring for migration ergonomics.
export * from '@weaverse/schema'
// Client code (components, hooks, runtime, and the `@weaverse/react`
// re-exports) comes by name from `./client-boundary`, which the build emits as
// its own `'use client'` file. Every other value export below is server-safe,
// so a Server Component can import this entry.
export {
  bindWeaverseNextStudioRuntime,
  createWeaverseNextClient,
  createWeaverseNextRuntime,
  loadWeaverseNextStudioScript,
  ThemeTextProvider,
  TranslationProvider,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useThemeSettings,
  useThemeText,
  useTranslation,
  useWeaverse,
  useWeaverseCommerce,
  useWeaverseNextStudioInternals,
  useWeaversePageData,
  useWeaverseRootData,
  WeaverseNextProvider,
  WeaverseNextRenderer,
  WeaverseNextRootProvider,
  WeaverseNextRuntime,
  WeaverseNextStudio,
  WeaverseNextStudioBridge,
  WeaverseNextStudioConnect,
} from './client-boundary'
export type { WeaverseNextItem } from './item'
export {
  type RunComponentLoadersArgs,
  runWeaverseComponentLoaders,
} from './loader'
export type { WeaverseNextProviderProps } from './provider'
export type { WeaverseNextRendererProps } from './renderer'
export { buildWeaverseNextRequestInfo } from './request-info'
export {
  buildWeaverseNextRevalidateRouteContext,
  DEFAULT_REVALIDATE_ENDPOINT,
  type RevalidateItemRuntimeLike,
  revalidateWeaverseNextItem,
  type WeaverseNextRevalidateRouteContext,
} from './revalidate-item'
export type {
  WeaverseNextRootContextValue,
  WeaverseNextRootProviderProps,
} from './root-provider'
export type { WeaverseNextRenderablePage } from './runtime'
export {
  formatWeaverseNextSeoMetadata,
  getWeaverseNextSeoMetadata,
  type NextOpenGraph,
  type NextTwitter,
  type WeaverseNextSeoInput,
  type WeaverseNextSeoMetadata,
  type WeaverseNextSeoPageContainer,
} from './seo'
export type { WeaverseNextStudioBridgeProps } from './studio-bridge'
export type {
  LoadWeaverseNextStudioScriptOptions,
  WeaverseNextStudioConnectProps,
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
  type TranslateFunction,
} from './translate'
export type {
  ThemeTextProviderProps,
  ThemeTextValue,
  TranslationProviderProps,
  TranslationValue,
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
export type { WeaverseNextStudioProps } from './use-weaverse-next-studio'
export { generateDataFromSchema, isBrowser, isIframe } from './utils'
