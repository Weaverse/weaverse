import type { Resource } from 'i18next'

/**
 * Configuration for the WeaverseI18nServer.
 */
export type WeaverseI18nConfig = {
  /** Supported language codes, e.g. ["en", "vi", "fr"] */
  supportedLngs: string[]
  /** Fallback language when detection fails */
  fallbackLng: string
  /** Default namespace(s) for translations */
  defaultNS: string | string[]
  /** Remote CMS translations endpoint (Weaverse API) — highest priority */
  apiUrl?: string
  /** Local/CDN translations endpoint (bundled with theme) — second priority */
  localUrl?: string
  /** Optional inline resources to use as final fallback */
  bundledResources?: Record<string, Record<string, Record<string, string>>>
}

/**
 * Serializable i18n state that can be safely passed from server loaders
 * to client components via React Router / Remix.
 *
 * Use this instead of passing a raw i18next instance, which cannot survive
 * JSON serialization across the server → client boundary.
 */
export type WeaverseI18nData = {
  /** Detected locale for the current request */
  locale: string
  /** Loaded translation resources keyed by language → namespace → key → value */
  resources: Resource
}
