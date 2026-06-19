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
  WeaverseNextStorefront,
  WeaverseProduct,
} from './types'
