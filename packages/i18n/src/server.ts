import i18next, { type i18n, type TFunction } from 'i18next'
import ChainedBackend from 'i18next-chained-backend'
import HttpBackend from 'i18next-http-backend'
import resourcesToBackend from 'i18next-resources-to-backend'

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
 * Server-side i18n manager for Weaverse Hydrogen themes.
 *
 * Handles per-request i18next instance creation with a waterfall fallback:
 * 1. Remote CMS translations (apiUrl)
 * 2. Local/CDN translation files (localUrl)
 * 3. Bundled inline resources
 *
 * @example
 * ```typescript
 * // In server.ts
 * const weaverseI18n = new WeaverseI18nServer({
 *   supportedLngs: ["en", "vi"],
 *   fallbackLng: "en",
 *   defaultNS: "common",
 *   apiUrl: "https://api.weaverse.io/translations/{{lng}}/{{ns}}.json",
 *   localUrl: "/locales/{{lng}}/{{ns}}.json",
 * })
 *
 * // In a loader
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   const locale = weaverseI18n.getLocale(request)
 *   const t = await weaverseI18n.getFixedT(request)
 *   return { title: t("page.title"), locale }
 * }
 * ```
 */
export class WeaverseI18nServer {
  private _config: WeaverseI18nConfig

  constructor(config: WeaverseI18nConfig) {
    this._config = config
  }

  /**
   * Extract locale from the request.
   * Checks in order: URL path prefix → cookie → Accept-Language header → fallback.
   */
  getLocale(request: Request): string {
    let url = new URL(request.url)
    let pathSegments = url.pathname.split('/').filter(Boolean)
    let { supportedLngs, fallbackLng } = this._config

    // 1. URL path prefix: /vi/products → "vi"
    if (pathSegments.length > 0 && supportedLngs.includes(pathSegments[0])) {
      return pathSegments[0]
    }

    // 2. Cookie: lng=vi
    let cookieHeader = request.headers.get('Cookie') || ''
    let lngMatch = cookieHeader.match(/(?:^|;\s*)lng=([^;]+)/)
    if (lngMatch && supportedLngs.includes(lngMatch[1])) {
      return lngMatch[1]
    }

    // 3. Accept-Language header
    let acceptLang = request.headers.get('Accept-Language')
    if (acceptLang) {
      let preferred = this._parseAcceptLanguage(acceptLang)
      for (let lang of preferred) {
        if (supportedLngs.includes(lang)) {
          return lang
        }
        // Try base language (e.g., "en-US" → "en")
        let baseLang = lang.split('-')[0]
        if (supportedLngs.includes(baseLang)) {
          return baseLang
        }
      }
    }

    // 4. Fallback
    return fallbackLng
  }

  /**
   * Create a per-request i18next instance with the chained backend.
   * Returns a fully initialized i18n instance ready for translations.
   */
  async createInstance(
    request: Request,
    options?: { lng?: string; ns?: string | string[] }
  ): Promise<i18n> {
    let lng = options?.lng || this.getLocale(request)
    let ns = options?.ns || this._config.defaultNS

    let backends: unknown[] = []
    let backendOptions: Record<string, unknown>[] = []

    // Priority 1: Remote CMS translations
    if (this._config.apiUrl) {
      backends.push(HttpBackend)
      backendOptions.push({ loadPath: this._config.apiUrl })
    }

    // Priority 2: Local/CDN fallback files
    if (this._config.localUrl) {
      backends.push(HttpBackend)
      backendOptions.push({ loadPath: this._config.localUrl })
    }

    // Priority 3: Bundled inline resources
    if (this._config.bundledResources) {
      let resources = this._config.bundledResources
      backends.push(
        resourcesToBackend(
          (language: string, namespace: string) =>
            resources[language]?.[namespace] || {}
        )
      )
      backendOptions.push({})
    }

    let instance = i18next.createInstance()

    await instance.use(ChainedBackend).init({
      lng,
      ns,
      defaultNS: this._config.defaultNS,
      supportedLngs: this._config.supportedLngs,
      fallbackLng: this._config.fallbackLng,
      interpolation: { escapeValue: false },
      backend: {
        backends,
        backendOptions,
      },
    })

    return instance
  }

  /**
   * Convenience method: create an instance and return t() directly.
   * Useful in route loaders where only the translation function is needed.
   */
  async getFixedT(
    request: Request,
    ns?: string | string[]
  ): Promise<TFunction> {
    let instance = await this.createInstance(request, { ns })
    return instance.t.bind(instance)
  }

  /**
   * Parse Accept-Language header into sorted list of language tags.
   * e.g. "en-US,en;q=0.9,vi;q=0.8" → ["en-US", "en", "vi"]
   */
  private _parseAcceptLanguage(header: string): string[] {
    return header
      .split(',')
      .map((part) => {
        let [lang, quality] = part.trim().split(';q=')
        return {
          lang: lang.trim(),
          q: quality ? Number.parseFloat(quality) : 1,
        }
      })
      .sort((a, b) => b.q - a.q)
      .map((entry) => entry.lang)
  }
}
