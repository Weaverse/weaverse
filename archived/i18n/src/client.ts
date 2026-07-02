import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Simple wrapper around `useTranslation` from react-i18next.
 * Provides a consistent API surface for Weaverse themes.
 *
 * @deprecated Use `useTranslation` from `react-i18next` directly.
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

  return useCallback(
    (path: string): string => {
      // Don't prefix for the default locale
      if (locale === defaultLocale) {
        return path
      }
      let normalizedPath = path.startsWith('/') ? path : `/${path}`
      return `/${locale}${normalizedPath}`
    },
    [locale, defaultLocale]
  )
}
