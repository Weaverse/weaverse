import { useTranslation } from 'react-i18next'

/**
 * Simple wrapper around `useTranslation` from react-i18next.
 * Provides a consistent API surface for Weaverse themes.
 *
 * @param ns - Optional namespace to scope translations
 * @returns The result of `useTranslation(ns)`
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t } = useWeaverseT("product")
 *   return <h1>{t("title")}</h1>
 * }
 * ```
 */
export function useWeaverseT(ns?: string) {
  return useTranslation(ns)
}

/**
 * Hook that returns a function to prefix paths with the current locale.
 * Automatically skips prefixing for the default/fallback locale.
 *
 * @example
 * ```tsx
 * function CartLink() {
 *   const prefixPath = usePrefixPath()
 *   return <a href={prefixPath("/cart")}>Cart</a>
 *   // English (default): /cart
 *   // Vietnamese: /vi/cart
 * }
 * ```
 */
export function usePrefixPath() {
  let { i18n } = useTranslation()
  let locale = i18n.language

  // Resolve fallback language (can be string or array)
  let fallbackLng = i18n.options?.fallbackLng
  let defaultLocale: string | undefined
  if (typeof fallbackLng === 'string') {
    defaultLocale = fallbackLng
  } else if (Array.isArray(fallbackLng)) {
    defaultLocale = fallbackLng[0]
  }

  return (path: string): string => {
    // Don't prefix for the default locale
    if (locale === defaultLocale) {
      return path
    }
    let normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `/${locale}${normalizedPath}`
  }
}

/**
 * Hook for backward compatibility with existing Weaverse theme settings.
 *
 * Returns `{ t, i18n, tOrSetting }` where `tOrSetting` prioritizes
 * legacy hardcoded setting values over i18n translations.
 * This allows theme authors to gradually adopt i18n without breaking
 * existing strings configured in Weaverse theme settings.
 *
 * @param ns - Optional namespace
 *
 * @example
 * ```tsx
 * function HeroSection({ heading }: { heading?: string }) {
 *   const { tOrSetting } = useLegacyT("hero")
 *   return <h1>{tOrSetting("heading", heading)}</h1>
 *   // If heading prop is "Welcome!" → returns "Welcome!"
 *   // If heading prop is empty → returns t("heading") from i18n
 * }
 * ```
 */
export function useLegacyT(ns?: string) {
  let { t, i18n } = useTranslation(ns)

  /**
   * Returns the legacy setting value if present and non-empty,
   * otherwise falls back to the i18n translation for the key.
   */
  function tOrSetting(key: string, settingValue?: string | null): string {
    if (settingValue != null && settingValue.trim() !== '') {
      return settingValue
    }
    return t(key)
  }

  return { t, i18n, tOrSetting }
}
