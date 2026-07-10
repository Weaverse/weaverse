import type {
  WeaverseElement,
  WeaverseResourcePickerData,
} from '@weaverse/react'
import type { PageSEOData, PageType, SchemaType } from '@weaverse/schema'
import type { ComponentType, ForwardRefExoticComponent, ReactNode } from 'react'
import type { TranslationStore } from './translation-store'

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

/**
 * Page assignment payload returned by `/api/public/project` and preserved on
 * loader data so the Builder Studio save pipeline receives the same shape it
 * gets from Hydrogen (`{ projectId, type, locale, handle }`, plus optional
 * inherited/fallback `meta`). Kept framework-neutral: `type` accepts a known
 * {@link PageType} or any string, and `meta` preserves inherited/fallback
 * metadata (unknown fields included) without asserting a strict shape.
 */
export interface WeaverseNextPageAssignment {
  handle: string
  locale: string
  /** Inherited/fallback page metadata; unknown fields preserved as-is. */
  meta?: {
    depth?: number
    inherited?: boolean
    sourceProjectId?: string
    [key: string]: unknown
  }
  projectId: string
  type: PageType | string
}

export interface WeaverseNextRuntimeInternal {
  /** Active-locale static-text overrides fetched from the API (nested). */
  merchantOverrides?: Record<string, unknown>
  navigate?: (
    to: string,
    options?: { preventScrollReset?: boolean } | Record<string, unknown>
  ) => void
  pageAssignment?: WeaverseNextPageAssignment
  project?: unknown
  revalidate?: (options?: unknown) => Promise<void> | void
  /**
   * Studio per-item loader revalidation. Builder feature-detects this and
   * prefers it over the legacy `revalidate()` (`router.refresh()`) flow; it
   * must reject on failure so Builder can fall back.
   */
  revalidateItem?: (draftItem: WeaverseNextComponentData) => Promise<void>
  themeSettingsStore?: WeaverseNextThemeSettingsStore
  /**
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

export interface WeaverseNextRuntimeConfig {
  client?: WeaverseNextClient
  data: WeaverseNextLoaderData
  dataContext?: Record<string, unknown>
  /** Active-locale static-text overrides threaded onto `internal`. */
  merchantOverrides?: Record<string, unknown>
  navigate?: WeaverseNextRuntimeInternal['navigate']
  revalidate?: WeaverseNextRuntimeInternal['revalidate']
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
  originalValue: string
  translatedValue: string
}

/** Per-item translation fields, keyed by field name. */
export type WeaverseNextTranslationItemEntry = {
  [key: string]: WeaverseNextTranslationMapEntry
}

/**
 * Translation map sent from Builder alongside page data in design mode.
 * Keyed by item ID, each value maps field names to translation entries.
 */
export type WeaverseNextTranslationMap = {
  [itemId: string]: WeaverseNextTranslationItemEntry
}

/** A single translation entry for save payloads. */
export interface WeaverseNextTranslationEntry {
  deleted?: boolean
  itemId: string
  key: string
  originalValue: string
  translatedValue: string
}

/** Result of collecting translation changes for the save flow. */
export type WeaverseNextTranslationChanges = {
  languageId: string
  entries: WeaverseNextTranslationEntry[]
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
  /** Page-level SEO metadata published by Weaverse Builder. */
  seo?: PageSEOData | null
  [key: string]: unknown
}

/**
 * Top-level payload returned by `client.loadPage`. Kept close to Hydrogen's
 * `WeaverseLoaderData` so registered components stay portable.
 */
export interface WeaverseNextLoaderData {
  configs?: Record<string, unknown>
  page: WeaverseNextPageData
  pageAssignment?: WeaverseNextPageAssignment
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
export type WeaverseBlog = WeaverseResourcePickerData
export type WeaverseArticle = WeaverseResourcePickerData
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
  revalidate?: number | false
  tags?: string[]
}

/**
 * Public, client-safe Weaverse config bundle. Mirrors Hydrogen's
 * `WeaverseProjectConfigs` minus server secrets — `weaverseApiKey` is never
 * included so it cannot leak into serialized loader data.
 */
export interface WeaverseNextConfigs {
  isDesignMode: boolean
  isPreviewMode: boolean
  isRevisionPreview: boolean
  projectId: string
  publicEnv: Record<string, string | undefined>
  sectionType: string
  weaverseApiBase: string
  weaverseHost: string
  weaversePublicApiBase: string
  weaverseVersion: string
}

/**
 * Resolved base configs derived from request context + env. Includes the
 * server-only `weaverseApiKey`, so this stays internal to the server client and
 * is never serialized into loader data.
 */
export interface WeaverseNextBaseConfigs {
  envProjectId: string
  isDesignMode: boolean
  isPreviewMode: boolean
  isRevisionPreview: boolean
  publicEnv: Record<string, string | undefined>
  queryProjectId: string
  sectionType: string
  weaverseApiBase: string
  weaverseApiKey: string
  weaverseHost: string
  weaverseVersion: string
}

/** Theme settings payload returned by {@link WeaverseNextServerClient.loadThemeSettings}. */
export interface WeaverseNextThemeSettingsResponse {
  _error?: string
  _loadFailed?: boolean
  merchantOverrides?: Record<string, unknown>
  publicEnv?: Record<string, string | undefined>
  schema?: unknown
  staticContent?: Record<string, unknown>
  theme?: Record<string, unknown>
  [key: string]: unknown
}

/**
 * Options for {@link WeaverseNextServerClient.loadThemeSettings}. Cache knobs
 * only — the server client always reads the request context it was created
 * with, so there is no per-call context override.
 */
export interface WeaverseNextThemeSettingsOptions
  extends WeaverseNextCacheConfig {}

export interface WeaverseNextCustomPageEntry {
  changeFrequency?: 'daily' | 'weekly' | 'monthly'
  handle: string
  lastModified: string
  locale: string | null
  path: string
  priority?: number
}

export interface WeaverseNextFetchCustomPagesOptions
  extends WeaverseNextCacheConfig {
  limit?: number
  locale?: string
}

/**
 * Config for {@link createWeaverseNextServerClient}. Unlike
 * {@link WeaverseNextClientConfig} (which delegates network I/O to injected
 * fetchers), the server client performs the real Weaverse API fetch itself, so
 * it accepts request context, env, and cache options instead.
 */
export interface WeaverseNextServerClientConfig {
  cache?: WeaverseNextCacheConfig
  commerce?: WeaverseNextCommerceContext
  components: WeaverseNextComponent[]
  /** Plain env map; falls back to `process.env` for any missing key. */
  env?: Record<string, string | undefined>
  /** Custom `fetch` (mainly for tests); defaults to the global `fetch`. */
  fetch?: typeof fetch
  /** Per-request network timeout in ms. Defaults to 10s. */
  fetchTimeoutMs?: number
  projectId?: WeaverseNextProjectId
  requestContext?: WeaverseNextRequestContext
  themeSchema?: unknown
  themeSettings?: Record<string, unknown>
  /** Optional override for the resolved Weaverse public API base. */
  weaverseApiBase?: string
  /** Optional override for the resolved Weaverse host. */
  weaverseHost?: string
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
  fetchCustomPages: (
    options?: WeaverseNextFetchCustomPagesOptions
  ) => Promise<WeaverseNextCustomPageEntry[]>
  fetchWithCache: <T = unknown>(
    url: string,
    options?: WeaverseNextFetchOptions
  ) => Promise<T>
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
