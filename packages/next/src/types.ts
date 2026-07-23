import type {
  WeaverseElement,
  WeaverseResourcePickerData,
} from '@weaverse/react'
import type {
  InspectorGroup,
  PageSEOData,
  PageType,
  SchemaType,
} from '@weaverse/schema'
import type { ComponentType, ForwardRefExoticComponent, ReactNode } from 'react'
import type { TranslationStore } from './translation-store'

/** Request metadata exposed to the Studio runtime. */
export interface WeaverseNextRequestInfo {
  /** Locale and market information for the current request. */
  i18n?: WeaverseNextI18n
  /** URL pathname without the query string. */
  pathname: string
  /** Query parameters, with `true` and `false` converted to booleans. */
  queries: Record<string, string | boolean>
  /** Serialized query string, including the leading `?` when non-empty. */
  search: string
}

/** External store used by React and Studio for live theme-setting updates. */
export interface WeaverseNextThemeSettingsStore {
  /** Return the theme-settings snapshot during server rendering. */
  getServerSnapshot: () => Record<string, unknown>
  /** Return the current theme-settings snapshot. */
  getSnapshot: () => Record<string, unknown>
  /** Public environment values exposed with the theme settings. */
  publicEnv?: Record<string, string | undefined>
  /** Theme schema associated with this store. */
  schema?: WeaverseNextThemeSchema
  /** Current merged theme-setting values. */
  settings: Record<string, unknown>
  /** Subscribe to setting changes and return an unsubscribe function. */
  subscribe: (listener: () => void) => () => void
  /** Merge setting changes into the current snapshot and notify subscribers. */
  updateThemeSettings: (next: Record<string, unknown>) => void
}

/**
 * Page assignment payload returned by `/api/public/project` and preserved on
 * loader data so the Builder Studio save pipeline receives the same shape it
 * gets from Hydrogen (`{ projectId, type, locale, handle }`, plus optional
 * inherited/fallback `meta`). Kept framework-neutral: `type` accepts a known
 * {@link PageType} or any string, and `meta` preserves inherited/fallback
 * metadata (unknown fields included) without asserting a strict shape.
 */
export interface WeaverseNextPageAssignment {
  /** Assigned page handle. */
  handle: string
  /** Assigned locale, or an empty string when the API omits it. */
  locale: string
  /** Inherited/fallback page metadata; unknown fields preserved as-is. */
  meta?: {
    depth?: number
    inherited?: boolean
    sourceProjectId?: string
    [key: string]: unknown
  }
  /** Project that owns the assignment. */
  projectId: string
  /** Assigned Weaverse page type. */
  type: PageType | string
}

/** Mutable integration callbacks and data exposed to the Studio bridge. */
export interface WeaverseNextRuntimeInternal {
  /** Active-locale static-text overrides fetched from the API (nested). */
  merchantOverrides?: Record<string, unknown>
  /** Navigate the preview while preserving React Router-compatible options. */
  navigate?: (
    to: string,
    options?: { preventScrollReset?: boolean } | Record<string, unknown>
  ) => void
  /** Assignment metadata used by Studio save operations. */
  pageAssignment?: WeaverseNextPageAssignment
  /** Raw project payload associated with the loaded page. */
  project?: unknown
  /** Refresh server-rendered route data. */
  revalidate?: (options?: unknown) => Promise<void> | void
  /**
   * Studio per-item loader revalidation. Builder feature-detects this and
   * prefers it over the legacy `revalidate()` (`router.refresh()`) flow; it
   * must reject on failure so Builder can fall back.
   */
  revalidateItem?: (draftItem: WeaverseNextComponentData) => Promise<void>
  /** Live theme-settings store used by Studio. */
  themeSettingsStore?: WeaverseNextThemeSettingsStore
  /**
   * Legacy name for the live translation store.
   *
   * @deprecated Use {@link WeaverseNextRuntimeInternal.translationStore}
   * instead. Same instance, kept so Builder's existing `updateStaticText()`
   * RPC (which reads `internal.themeTextStore`) works with Next unchanged.
   */
  themeTextStore?: TranslationStore
  /**
   * Live design-mode static-text override store. Builder's `updateStaticText()`
   * RPC mutates it via `updateOverrides()`; the `TranslationProvider` observing
   * the same instance re-renders `useTranslation()` consumers.
   */
  translationStore?: TranslationStore
}

/** Configuration used to create or reuse a browser-side Weaverse runtime. */
export interface WeaverseNextRuntimeConfig {
  /** Client that supplied the page and request context. */
  client?: WeaverseNextClient
  /** Loaded Weaverse page payload. */
  data: WeaverseNextLoaderData
  /** Data-connector values available while rendering the page. */
  dataContext?: Record<string, unknown>
  /** Active-locale static-text overrides threaded onto `internal`. */
  merchantOverrides?: Record<string, unknown>
  /** Preview navigation callback, normally derived from Next's router. */
  navigate?: WeaverseNextRuntimeInternal['navigate']
  /** Route revalidation callback, normally backed by `router.refresh()`. */
  revalidate?: WeaverseNextRuntimeInternal['revalidate']
  /** Existing root-scoped theme-settings store to reuse. */
  themeSettingsStore?: WeaverseNextThemeSettingsStore
  /** Root/route-owned translation store to attach to `internal`. */
  translationStore?: TranslationStore
}

// ─── Item-level translation sidecar types (design mode) ──────────────
//
// Kept structurally aligned with Hydrogen's `TranslationMapEntry` /
// `TranslationItemEntry` / `TranslationMap` / `TranslationEntry` /
// `TranslationChanges` so Builder Studio's item-translation RPC contract works
// against `@weaverse/next` unchanged. Values stay strings for now; broaden to
// object values only when Builder image handling forces it (with tests).

/** A single translated field for one item. */
export interface WeaverseNextTranslationMapEntry {
  /** Source-language value used to detect changes. */
  originalValue: string
  /** Current translated value. */
  translatedValue: string
}

/** Per-item translation fields, keyed by field name. */
export interface WeaverseNextTranslationItemEntry {
  /** Translation entry keyed by component setting name. */
  [key: string]: WeaverseNextTranslationMapEntry
}

/**
 * Translation map sent from Builder alongside page data in design mode.
 * Keyed by item ID, each value maps field names to translation entries.
 */
export interface WeaverseNextTranslationMap {
  /** Translated fields keyed by Weaverse item ID. */
  [itemId: string]: WeaverseNextTranslationItemEntry
}

/** A single translation entry for save payloads. */
export interface WeaverseNextTranslationEntry {
  /** Whether the persisted translation should be removed. */
  deleted?: boolean
  /** Weaverse item that owns the translated field. */
  itemId: string
  /** Namespaced field key, such as `data.heading`. */
  key: string
  /** Source-language value used to detect changes. */
  originalValue: string
  /** Value to persist for the target language. */
  translatedValue: string
}

/** Result of collecting translation changes for the save flow. */
export interface WeaverseNextTranslationChanges {
  /** Changed translation entries ready for the Studio save payload. */
  entries: WeaverseNextTranslationEntry[]
  /** Target language identifier used by Weaverse. */
  languageId: string
}

/**
 * Locale/market info passed through to component loaders and the Storefront
 * client. Kept structurally close to Hydrogen's `WeaverseI18n` but without the
 * `@shopify/hydrogen` `I18nBase` dependency so the adapter stays framework
 * neutral.
 */
export interface WeaverseNextI18n {
  /** ISO country or market code. */
  country?: string
  /** Human-readable locale label. */
  label?: string
  /** ISO language code. */
  language?: string
  /** Combined locale identifier, such as `en-US`. */
  locale?: string
  /** Locale prefix used in storefront paths. */
  pathPrefix?: string
  /** Additional host-defined locale metadata. */
  [key: string]: unknown
}

/**
 * Theme schema shape accepted by the Next adapter. Mirrors Hydrogen's
 * `HydrogenThemeSchema` but keeps locale data framework-neutral via
 * {@link WeaverseNextI18n} instead of Shopify Hydrogen's `I18nBase`.
 */
export interface WeaverseNextThemeSchemaInput {
  condition?: unknown
  defaultValue?: unknown
  name?: string
  [key: string]: unknown
}

export interface WeaverseNextThemeSchemaGroup {
  group?: string
  inputs?: WeaverseNextThemeSchemaInput[]
  [key: string]: unknown
}

/** Framework-neutral theme schema consumed by the Next adapter. */
export interface WeaverseNextThemeSchema {
  /** Theme localization configuration and default static content. */
  i18n?: {
    defaultLocale?: WeaverseNextI18n
    shopLocales?: WeaverseNextI18n[]
    staticContent?: Record<string, unknown>
    /** Enable the translation UI in Builder. */
    translation?: boolean
    urlStructure?: 'url-path' | 'subdomain' | 'top-level-domain'
    [key: string]: unknown
  }
  /** Theme identity, version, support, and documentation metadata. */
  info?: {
    author?: string
    authorProfilePhoto?: string
    documentationUrl?: string
    name?: string
    supportUrl?: string
    version?: string
    [key: string]: unknown
  }
  /**
   * Legacy theme-setting groups.
   *
   * @deprecated Migrate the same groups to {@link WeaverseNextThemeSchema.settings}.
   */
  inspector?: (InspectorGroup | WeaverseNextThemeSchemaGroup)[]
  /** Theme-setting groups displayed in Builder. */
  settings?: (InspectorGroup | WeaverseNextThemeSchemaGroup)[]
  /** Additional schema metadata preserved for forward compatibility. */
  [key: string]: unknown
}

/**
 * Minimal Storefront client shape required by component loaders. The host app
 * provides this (public or private token mode); Weaverse never owns it.
 */
export interface WeaverseNextStorefront {
  /** Locale and market used for Storefront API queries. */
  i18n?: WeaverseNextI18n
  /** Execute a Storefront API GraphQL query. */
  query: (query: string, options?: unknown) => Promise<unknown>
  /** Additional methods supplied by the commerce integration. */
  [key: string]: unknown
}

/**
 * App-provided commerce context. `storefront` is the only v0 must-have; cart
 * and customer-account stay app-owned and are passed through untouched.
 */
export interface WeaverseNextCommerceContext {
  /** Host-defined cart client or state. */
  cart?: unknown
  /** Host-defined customer account client or state. */
  customerAccount?: unknown
  /** Storefront API client used by component loaders. */
  storefront?: WeaverseNextStorefront
  /** Additional host-defined commerce services. */
  [key: string]: unknown
}

/**
 * Explicit, framework-neutral replacement for React Router's
 * `LoaderFunctionArgs`. Built by the Next route/page from params + headers +
 * searchParams instead of an implicit loader context.
 */
export interface WeaverseNextRequestContext {
  /** Route handle used for page assignment. */
  handle?: string
  /** Incoming request headers. */
  headers?: Headers
  /** Locale and market information for this request. */
  i18n?: WeaverseNextI18n
  /** Whether the request is rendered inside Builder Studio. */
  isDesignMode?: boolean
  /** Whether the request renders a component preview. */
  isPreviewMode?: boolean
  /** Whether the request renders a saved revision. */
  isRevisionPreview?: boolean
  /** Weaverse page type resolved by the route. */
  pageType?: PageType
  /** Request pathname when a complete URL is unavailable. */
  pathname?: string
  /** Request query parameters. */
  searchParams?: URLSearchParams
  /** Component type requested for section preview mode. */
  sectionType?: string
  /** Complete request URL, when available. */
  url?: URL | string
  /** Additional request-scoped values passed to component loaders. */
  [key: string]: unknown
}

/** A single serialized item in a Weaverse page tree. */
export interface WeaverseNextComponentData {
  /** Inline child items or references to items in the page's flat item list. */
  children?: WeaverseNextComponentData[] | { id: string }[]
  /** Authored component setting values. */
  data?: Record<string, unknown>
  /** Stable Weaverse item identifier. */
  id: string
  /** Attached by {@link runWeaverseComponentLoaders} after a loader runs. */
  loaderData?: unknown
  /** Registered component schema type. */
  type: string
  /** Additional serialized item metadata. */
  [key: string]: unknown
}

/** Serialized page tree fetched from Weaverse. */
export interface WeaverseNextPageData {
  /** Stable Weaverse page identifier. */
  id: string
  /** Flat serialized component tree. */
  items: WeaverseNextComponentData[]
  /** Display name assigned in Builder. */
  name?: string
  /** Root component item ID. */
  rootId?: string
  /** Page-level SEO metadata published by Weaverse Builder. */
  seo?: PageSEOData | null
  /** Additional page metadata returned by the API. */
  [key: string]: unknown
}

/**
 * Top-level payload returned by `client.loadPage`. Kept close to Hydrogen's
 * `WeaverseLoaderData` so registered components stay portable.
 */
export interface WeaverseNextLoaderData {
  /** Client-safe runtime configuration returned with the page. */
  configs?: Record<string, unknown>
  /** Serialized page to render. */
  page: WeaverseNextPageData
  /** Assignment used by Studio when saving the page. */
  pageAssignment?: WeaverseNextPageAssignment
  /** Public project metadata returned by Weaverse. */
  project?: Record<string, unknown>
  /** Additional loader values supplied by the host app. */
  [key: string]: unknown
}

/** Props injected into every registered Weaverse component. */
export interface WeaverseNextComponentProps<L = unknown>
  extends Partial<WeaverseElement> {
  /** Nested rendered component content. */
  children?: ReactNode
  /** Optional CSS class supplied by the renderer or component settings. */
  className?: string
  /** Result returned by the registered component loader. */
  loaderData?: L
  /** Authored component settings and renderer-provided values. */
  [key: string]: unknown
}

/**
 * Arguments passed to a component `loader`. `commerce.storefront` is the
 * explicit contract; `weaverse.storefront` exists as a compatibility alias for
 * Pilot-style loaders that call `weaverse.storefront.query(...)`.
 */
export interface WeaverseNextComponentLoaderArgs<TData = unknown> {
  /** Request-scoped commerce clients and state. */
  commerce?: WeaverseNextCommerceContext
  /** Explicit Next request context. */
  context?: WeaverseNextRequestContext
  /** Component settings merged over schema defaults. */
  data: TData
  /** Request-scoped Weaverse client. */
  weaverse: WeaverseNextClient
}

/** Registered component module shape: `default` + `schema` + optional `loader`. */
export interface WeaverseNextComponent<
  TProps extends WeaverseNextComponentProps = WeaverseNextComponentProps,
> {
  /** React component rendered for this registration. */
  default: ComponentType<TProps> | ForwardRefExoticComponent<TProps>
  /** Optional server-side data loader for each component item. */
  loader?: (args: WeaverseNextComponentLoaderArgs) => Promise<unknown>
  /** Builder schema identifying the component and its settings. */
  schema: SchemaType
}

/** Input for `client.loadPage`. The Next route maps `params` → `type/handle`. */
export interface WeaverseNextLoadPageInput {
  /** Page handle resolved from the route. */
  handle?: string
  /** Locale used to select the assigned page. */
  locale?: string
  /** Weaverse page type to load. */
  type?: PageType
  /** Additional page-resolution parameters sent to Weaverse. */
  [key: string]: unknown
}

/** Configuration for the fetcher-injected root-entry client. */
export interface WeaverseNextClientConfig {
  /** Commerce services passed to component loaders. */
  commerce?: WeaverseNextCommerceContext
  /** Component modules available to the renderer and loaders. */
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
  /** Weaverse project to load. */
  projectId: string
  /** Request metadata passed to component loaders and the runtime. */
  requestContext?: WeaverseNextRequestContext
  /** Theme schema used to derive default settings. */
  themeSchema?: WeaverseNextThemeSchema
  /** Merchant theme settings merged over schema defaults. */
  themeSettings?: Record<string, unknown>
}

/**
 * Request-safe client returned by {@link createWeaverseNextClient}. Holds the
 * registry/config plus the currently loaded page data, and is the object passed
 * to component loaders as `weaverse`.
 */
export interface WeaverseNextClient {
  /** Commerce services passed to component loaders. */
  commerce?: WeaverseNextCommerceContext
  /** Registered component modules. */
  components: WeaverseNextComponent[]
  /** Currently loaded page payload (set by `loadPage`). */
  data: WeaverseNextLoaderData | null
  /** Data-connector context handed to the React renderer. */
  dataContext: Record<string, unknown>
  /** Load a page and return its serialized renderer payload. */
  loadPage: (
    input?: WeaverseNextLoadPageInput
  ) => Promise<WeaverseNextLoaderData | null>
  /** Load the project's theme settings. */
  loadThemeSettings: (context?: WeaverseNextRequestContext) => Promise<unknown>
  /** Active Weaverse project identifier. */
  projectId: string
  /** Request metadata associated with this client. */
  requestContext?: WeaverseNextRequestContext
  /** Compatibility alias for `commerce.storefront`. */
  storefront?: WeaverseNextStorefront
  /** Theme schema used by the current project. */
  themeSchema?: WeaverseNextThemeSchema
  /** Theme settings with schema defaults applied. */
  themeSettings: Record<string, unknown>
}

/** Product selected with a Weaverse resource-picker setting. */
export type WeaverseProduct = WeaverseResourcePickerData
/** Collection selected with a Weaverse resource-picker setting. */
export type WeaverseCollection = WeaverseResourcePickerData
/** Blog selected with a Weaverse resource-picker setting. */
export type WeaverseBlog = WeaverseResourcePickerData
/** Article selected with a Weaverse resource-picker setting. */
export type WeaverseArticle = WeaverseResourcePickerData
/** Metaobject selected with a Weaverse resource-picker setting. */
export type WeaverseMetaObject = WeaverseResourcePickerData

// ─── Server client (`@weaverse/next/server`) ──────────────────────────────

/**
 * Project identifier accepted by {@link WeaverseNextServerClientConfig}. Either
 * a static string or a (possibly async) resolver that reads the request
 * context — matching Hydrogen's static/dynamic projectId support.
 */
export type WeaverseNextProjectId =
  | string
  | ((
      context?: WeaverseNextRequestContext
    ) => string | Promise<string> | undefined)

/** Simple Next.js fetch cache options used for published-mode requests. */
export interface WeaverseNextCacheConfig {
  /** Maps to Next's `fetch(..., { next: { revalidate } })`. */
  revalidate?: number | false
  /** Maps to Next's `fetch(..., { next: { tags } })`. */
  tags?: string[]
}

/**
 * Per-request fetch options for {@link WeaverseNextServerClient.fetchWithCache}.
 * Plain `RequestInit` plus the same simple Next cache knobs as
 * {@link WeaverseNextCacheConfig}, so callers never need to import `next/*`.
 */
export interface WeaverseNextFetchOptions extends RequestInit {
  /** Next.js time-based revalidation interval, or `false` for indefinite caching. */
  revalidate?: number | false
  /** Next.js cache tags associated with the request. */
  tags?: string[]
}

/**
 * Public, client-safe Weaverse config bundle. Mirrors Hydrogen's
 * `WeaverseProjectConfigs` minus server secrets — `weaverseApiKey` is never
 * included so it cannot leak into serialized loader data.
 */
export interface WeaverseNextConfigs {
  /** Whether the request is rendered inside Builder Studio. */
  isDesignMode: boolean
  /** Whether the request renders a component preview. */
  isPreviewMode: boolean
  /** Whether the request renders a saved revision. */
  isRevisionPreview: boolean
  /** Effective Weaverse project identifier. */
  projectId: string
  /** Environment values safe to expose to client components. */
  publicEnv: Record<string, string | undefined>
  /** Component type requested for section preview mode. */
  sectionType: string
  /** Base URL used for public Weaverse data requests. */
  weaverseApiBase: string
  /** Trusted Studio origin. */
  weaverseHost: string
  /** Public API base retained for Hydrogen-compatible consumers. */
  weaversePublicApiBase: string
  /** Studio asset version requested by Builder. */
  weaverseVersion: string
}

/**
 * Resolved base configs derived from request context + env. Includes the
 * server-only `weaverseApiKey`, so this stays internal to the server client and
 * is never serialized into loader data.
 */
export interface WeaverseNextBaseConfigs {
  /** Project ID read from `WEAVERSE_PROJECT_ID`. */
  envProjectId: string
  /** Whether the request is rendered inside Builder Studio. */
  isDesignMode: boolean
  /** Whether the request renders a component preview. */
  isPreviewMode: boolean
  /** Whether the request renders a saved revision. */
  isRevisionPreview: boolean
  /** Environment values safe to expose to client components. */
  publicEnv: Record<string, string | undefined>
  /** Project ID read from the request query string. */
  queryProjectId: string
  /** Component type requested for section preview mode. */
  sectionType: string
  /** Base URL used for public Weaverse data requests. */
  weaverseApiBase: string
  /** Server-only API key read from the request or environment. */
  weaverseApiKey: string
  /** Trusted Studio origin. */
  weaverseHost: string
  /** Studio asset version requested by Builder. */
  weaverseVersion: string
}

/** Theme settings payload returned by {@link WeaverseNextServerClient.loadThemeSettings}. */
export interface WeaverseNextThemeSettingsResponse {
  /** Error message returned with fallback settings after a failed load. */
  _error?: string
  /** Whether remote theme settings failed to load. */
  _loadFailed?: boolean
  /** Active-locale static-text overrides. */
  merchantOverrides?: Record<string, unknown>
  /** Environment values safe to expose to the browser in design mode. */
  publicEnv?: Record<string, string | undefined>
  /** Serializable theme schema returned in design mode. */
  schema?: WeaverseNextThemeSchema
  /** Default-locale static content from the theme schema. */
  staticContent?: Record<string, unknown>
  /** Theme-setting values with schema defaults applied. */
  theme?: Record<string, unknown>
  /** Additional project configuration returned by Weaverse. */
  [key: string]: unknown
}

/**
 * Options for {@link WeaverseNextServerClient.loadThemeSettings}. Cache knobs
 * only — the server client always reads the request context it was created
 * with, so there is no per-call context override.
 */
export interface WeaverseNextThemeSettingsOptions
  extends WeaverseNextCacheConfig {}

/** Published custom-page record suitable for a Next.js sitemap entry. */
export interface WeaverseNextCustomPageEntry {
  /** Suggested sitemap change frequency. */
  changeFrequency?: 'daily' | 'weekly' | 'monthly'
  /** Custom page handle. */
  handle: string
  /** ISO timestamp of the latest page update. */
  lastModified: string
  /** Assigned locale, or `null` for the default locale. */
  locale: string | null
  /** Storefront pathname for the custom page. */
  path: string
  /** Suggested sitemap priority. */
  priority?: number
}

/** Pagination, locale, and cache options for fetching custom pages. */
export interface WeaverseNextFetchCustomPagesOptions
  extends WeaverseNextCacheConfig {
  /** Maximum page count requested from each API call. */
  limit?: number
  /** Only return custom pages assigned to this locale. */
  locale?: string
}

/**
 * Config for {@link createWeaverseNextServerClient}. Unlike
 * {@link WeaverseNextClientConfig} (which delegates network I/O to injected
 * fetchers), the server client performs the real Weaverse API fetch itself, so
 * it accepts request context, env, and cache options instead.
 */
export interface WeaverseNextServerClientConfig {
  /** Default Next.js cache options for Weaverse API requests. */
  cache?: WeaverseNextCacheConfig
  /** Commerce services passed to component loaders. */
  commerce?: WeaverseNextCommerceContext
  /** Component modules available to server-side loaders. */
  components: WeaverseNextComponent[]
  /** Plain env map; falls back to `process.env` for any missing key. */
  env?: Record<string, string | undefined>
  /** Custom `fetch` (mainly for tests); defaults to the global `fetch`. */
  fetch?: typeof fetch
  /** Per-request network timeout in ms. Defaults to 10s. */
  fetchTimeoutMs?: number
  /** Static project ID or request-aware project resolver. */
  projectId?: WeaverseNextProjectId
  /** Explicit request metadata used for config and page resolution. */
  requestContext?: WeaverseNextRequestContext
  /** Theme schema used to derive default settings and preview data. */
  themeSchema?: WeaverseNextThemeSchema
  /** Merchant theme settings merged over schema defaults. */
  themeSettings?: Record<string, unknown>
  /** Optional override for the resolved Weaverse public API base. */
  weaverseApiBase?: string
  /** Optional override for the resolved Weaverse host. */
  weaverseHost?: string
  /** Studio asset version override. */
  weaverseVersion?: string
}

/**
 * Server-side Weaverse client returned by {@link createWeaverseNextServerClient}.
 * Closes the gap with Hydrogen's `context.weaverse.loadPage(...)` by performing
 * the real Weaverse API fetch in Next server components/route handlers. It is
 * also assignable to {@link WeaverseNextClient} so it can be passed straight to
 * `runWeaverseComponentLoaders` and the renderer/runtime.
 */
export interface WeaverseNextServerClient extends WeaverseNextClient {
  /** Public, client-safe resolved configs (no server secrets). */
  configs: WeaverseNextConfigs
  /** Fetch every published custom page, primarily for sitemap generation. */
  fetchCustomPages: (
    options?: WeaverseNextFetchCustomPagesOptions
  ) => Promise<WeaverseNextCustomPageEntry[]>
  /** Fetch JSON with Next.js cache controls and the configured timeout. */
  fetchWithCache: <T = unknown>(
    url: string,
    options?: WeaverseNextFetchOptions
  ) => Promise<T>
  /** Resolve, fetch, and run component loaders for a Weaverse page. */
  loadPage: (
    input?: WeaverseNextLoadPageInput
  ) => Promise<WeaverseNextLoaderData | null>
  /**
   * Load theme settings. Pass cache options (`revalidate` / `tags`) only — the
   * request context is the one the client was created with, so there is no
   * per-call context override. The parameter is typed broadly purely to stay
   * assignable to the base {@link WeaverseNextClient.loadThemeSettings}; any
   * non-cache fields are ignored.
   */
  loadThemeSettings: (
    options?: WeaverseNextThemeSettingsOptions | WeaverseNextRequestContext
  ) => Promise<WeaverseNextThemeSettingsResponse>
  /** Resolve the effective projectId (query → function → string → env). */
  resolveProjectId: () => Promise<string>
}

/** Input for {@link WeaverseNextServerClient.loadPage}. */
export interface WeaverseNextServerLoadPageInput
  extends WeaverseNextLoadPageInput {
  /** Per-call cache override merged over the client-level `cache` config. */
  cache?: WeaverseNextCacheConfig
  /** Route-level project override (multi-project), like Hydrogen. */
  projectId?: string
}
