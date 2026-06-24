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
export type {
  InspectorGroup,
  PageType,
  SchemaType,
} from '@weaverse/schema'
export { createSchema } from '@weaverse/schema'
export { createWeaverseNextClient } from './client'
export {
  useThemeSettings,
  useWeaverseCommerce,
  useWeaversePageData,
  useWeaverseRootData,
} from './hooks'
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
  bindWeaverseNextStudioRuntime,
  createWeaverseNextRuntime,
  WeaverseNextRuntime,
} from './runtime'
export {
  WeaverseNextStudioBridge,
  type WeaverseNextStudioBridgeProps,
} from './studio-bridge'
export {
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
export type {
  WeaverseCollection,
  WeaverseNextClient,
  WeaverseNextClientConfig,
  WeaverseNextCommerceContext,
  WeaverseNextComponent,
  WeaverseNextComponentData,
  WeaverseNextComponentLoaderArgs,
  WeaverseNextComponentProps,
  WeaverseNextI18n,
  WeaverseNextLoaderData,
  WeaverseNextLoadPageInput,
  WeaverseNextPageData,
  WeaverseNextRequestContext,
  WeaverseNextRequestInfo,
  WeaverseNextRuntimeConfig,
  WeaverseNextRuntimeInternal,
  WeaverseNextStorefront,
  WeaverseNextThemeSettingsStore,
  WeaverseProduct,
} from './types'
export {
  useWeaverseNextStudioInternals,
  WeaverseNextStudio,
  type WeaverseNextStudioProps,
} from './use-weaverse-next-studio'
