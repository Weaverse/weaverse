import type {
  WeaverseElement,
  WeaverseResourcePickerData,
} from '@weaverse/react'
import type { PageType, SchemaType } from '@weaverse/schema'
import type { ComponentType, ForwardRefExoticComponent, ReactNode } from 'react'

export interface WeaverseNextRequestInfo {
  i18n?: WeaverseNextI18n
  pathname: string
  queries: Record<string, string | boolean>
  search: string
}

export interface WeaverseNextThemeSettingsStore {
  getServerSnapshot: () => Record<string, unknown>
  getSnapshot: () => Record<string, unknown>
  publicEnv?: Record<string, string | undefined>
  schema?: unknown
  settings: Record<string, unknown>
  subscribe: (listener: () => void) => () => void
  updateThemeSettings: (next: Record<string, unknown>) => void
}

export interface WeaverseNextRuntimeInternal {
  merchantOverrides?: unknown
  navigate?: (
    to: string,
    options?: { preventScrollReset?: boolean } | Record<string, unknown>
  ) => void
  pageAssignment?: unknown
  project?: unknown
  revalidate?: (options?: unknown) => Promise<void> | void
  themeSettingsStore?: WeaverseNextThemeSettingsStore
  themeTextStore?: unknown
}

export interface WeaverseNextRuntimeConfig {
  client?: WeaverseNextClient
  data: WeaverseNextLoaderData
  dataContext?: Record<string, unknown>
  navigate?: WeaverseNextRuntimeInternal['navigate']
  revalidate?: WeaverseNextRuntimeInternal['revalidate']
  themeSettingsStore?: WeaverseNextThemeSettingsStore
}

/**
 * Locale/market info passed through to component loaders and the Storefront
 * client. Kept structurally close to Hydrogen's `WeaverseI18n` but without the
 * `@shopify/hydrogen` `I18nBase` dependency so the adapter stays framework
 * neutral.
 */
export interface WeaverseNextI18n {
  country?: string
  label?: string
  language?: string
  locale?: string
  pathPrefix?: string
  [key: string]: unknown
}

/**
 * Minimal Storefront client shape required by component loaders. The host app
 * provides this (public or private token mode); Weaverse never owns it.
 */
export interface WeaverseNextStorefront {
  i18n?: WeaverseNextI18n
  query: (query: string, options?: unknown) => Promise<unknown>
  [key: string]: unknown
}

/**
 * App-provided commerce context. `storefront` is the only v0 must-have; cart
 * and customer-account stay app-owned and are passed through untouched.
 */
export interface WeaverseNextCommerceContext {
  cart?: unknown
  customerAccount?: unknown
  storefront?: WeaverseNextStorefront
  [key: string]: unknown
}

/**
 * Explicit, framework-neutral replacement for React Router's
 * `LoaderFunctionArgs`. Built by the Next route/page from params + headers +
 * searchParams instead of an implicit loader context.
 */
export interface WeaverseNextRequestContext {
  handle?: string
  headers?: Headers
  i18n?: WeaverseNextI18n
  isDesignMode?: boolean
  isPreviewMode?: boolean
  isRevisionPreview?: boolean
  pageType?: PageType
  pathname?: string
  searchParams?: URLSearchParams
  sectionType?: string
  url?: URL | string
  [key: string]: unknown
}

/** A single serialized item in a Weaverse page tree. */
export interface WeaverseNextComponentData {
  children?: WeaverseNextComponentData[] | { id: string }[]
  data?: Record<string, unknown>
  id: string
  /** Attached by {@link runWeaverseComponentLoaders} after a loader runs. */
  loaderData?: unknown
  type: string
  [key: string]: unknown
}

/** Serialized page tree fetched from Weaverse. */
export interface WeaverseNextPageData {
  id: string
  items: WeaverseNextComponentData[]
  name?: string
  rootId?: string
  [key: string]: unknown
}

/**
 * Top-level payload returned by `client.loadPage`. Kept close to Hydrogen's
 * `WeaverseLoaderData` so registered components stay portable.
 */
export interface WeaverseNextLoaderData {
  configs?: Record<string, unknown>
  page: WeaverseNextPageData
  pageAssignment?: Record<string, unknown>
  project?: Record<string, unknown>
  [key: string]: unknown
}

/** Props injected into every registered Weaverse component. */
export interface WeaverseNextComponentProps<L = unknown>
  extends Partial<WeaverseElement> {
  children?: ReactNode
  className?: string
  loaderData?: L
  [key: string]: unknown
}

/**
 * Arguments passed to a component `loader`. `commerce.storefront` is the
 * explicit contract; `weaverse.storefront` exists as a compatibility alias for
 * Pilot-style loaders that call `weaverse.storefront.query(...)`.
 */
export interface WeaverseNextComponentLoaderArgs<TData = unknown> {
  commerce?: WeaverseNextCommerceContext
  context?: WeaverseNextRequestContext
  data: TData
  weaverse: WeaverseNextClient
}

/** Registered component module shape: `default` + `schema` + optional `loader`. */
export interface WeaverseNextComponent<
  TProps extends WeaverseNextComponentProps = WeaverseNextComponentProps,
> {
  default: ComponentType<TProps> | ForwardRefExoticComponent<TProps>
  loader?: (args: WeaverseNextComponentLoaderArgs) => Promise<unknown>
  schema: SchemaType
}

/** Input for `client.loadPage`. The Next route maps `params` → `type/handle`. */
export interface WeaverseNextLoadPageInput {
  handle?: string
  locale?: string
  type?: PageType
  [key: string]: unknown
}

export interface WeaverseNextClientConfig {
  commerce?: WeaverseNextCommerceContext
  components: WeaverseNextComponent[]
  /**
   * Injected page fetcher. v0 delegates network I/O to the host app so the
   * adapter can be tested without real Weaverse API calls.
   */
  fetchPage?: (
    input: WeaverseNextLoadPageInput
  ) => Promise<WeaverseNextLoaderData | null>
  /** Injected theme-settings fetcher. */
  fetchThemeSettings?: (
    context?: WeaverseNextRequestContext
  ) => Promise<unknown>
  projectId: string
  requestContext?: WeaverseNextRequestContext
  themeSchema?: unknown
  themeSettings?: Record<string, unknown>
}

/**
 * Request-safe client returned by {@link createWeaverseNextClient}. Holds the
 * registry/config plus the currently loaded page data, and is the object passed
 * to component loaders as `weaverse`.
 */
export interface WeaverseNextClient {
  commerce?: WeaverseNextCommerceContext
  components: WeaverseNextComponent[]
  /** Currently loaded page payload (set by `loadPage`). */
  data: WeaverseNextLoaderData | null
  /** Data-connector context handed to the React renderer. */
  dataContext: Record<string, unknown>
  loadPage: (
    input?: WeaverseNextLoadPageInput
  ) => Promise<WeaverseNextLoaderData | null>
  loadThemeSettings: (context?: WeaverseNextRequestContext) => Promise<unknown>
  projectId: string
  requestContext?: WeaverseNextRequestContext
  /** Compatibility alias for `commerce.storefront`. */
  storefront?: WeaverseNextStorefront
  themeSchema?: unknown
  themeSettings: Record<string, unknown>
}

export type WeaverseProduct = WeaverseResourcePickerData
export type WeaverseCollection = WeaverseResourcePickerData
