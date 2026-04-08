import { createContext, type ReactNode, useContext, useMemo } from 'react'

/**
 * Traverse a nested object by dot-path.
 *
 * @example
 * getNestedKey({ cart: { title: 'Cart' } }, 'cart.title') // => 'Cart'
 * getNestedKey({}, 'cart.title', 'fallback')              // => 'fallback'
 */
export function getNestedKey(
  obj: Record<string, unknown>,
  path: string,
  fallback?: string
): string | undefined {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return fallback
    }
    current = (current as Record<string, unknown>)[key]
  }

  if (typeof current === 'string') {
    return current
  }

  return fallback
}

/**
 * Replace `{{variable}}` patterns in a string with provided values.
 *
 * @example
 * interpolate('Hello {{name}}!', { name: 'World' }) // => 'Hello World!'
 * interpolate('-{{percentage}}% Off', { percentage: 15 }) // => '-15% Off'
 */
export function interpolate(
  template: string,
  variables?: Record<string, string | number>
): string {
  if (!variables) {
    return template
  }

  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = variables[key]
    return value === undefined ? match : String(value)
  })
}

// ---------------------------------------------------------------------------
// Context & Provider
// ---------------------------------------------------------------------------

/**
 * Signature for a translation function.
 */
export type TranslateFunction = (
  key: string,
  variables?: Record<string, string | number>
) => string

export type ThemeTextValue = {
  /**
   * Translate a key with optional variable interpolation.
   *
   * Priority chain (highest wins):
   * 1. External `t`        (passed into `withWeaverse` / `ThemeTextProvider`)
   * 2. `merchantOverrides` (DB overrides for the current locale)
   * 3. `staticContent`     (theme default JSON)
   * 4. The key itself      (fallback)
   *
   * @example
   * t('cart.title')                           // => "Cart"
   * t('badge.sale', { percentage: 15 })       // => "-15% Off"
   */
  t: TranslateFunction
}

const ThemeTextContext = createContext<ThemeTextValue | null>(null)
ThemeTextContext.displayName = 'WeaverseThemeTextContext'

export type ThemeTextProviderProps = {
  staticContent: Record<string, unknown>
  merchantOverrides?: Record<string, unknown>
  /**
   * Optional external translation function.
   * When provided it becomes the **highest-priority** source:
   * if it returns a non-empty string that differs from the raw key,
   * that value is used; otherwise the internal resolution chain continues.
   */
  t?: TranslateFunction
  children: ReactNode
}

/**
 * Provider that wraps the app to expose the `t()` function.
 *
 * - `staticContent`      – the theme's default locale JSON (from themeSchema.i18n)
 * - `merchantOverrides`  – locale-specific overrides fetched from the API
 */
export function ThemeTextProvider({
  staticContent,
  merchantOverrides,
  t: externalT,
  children,
}: ThemeTextProviderProps) {
  const value = useMemo<ThemeTextValue>(() => {
    const t: TranslateFunction = (key, variables) => {
      // Priority 1: external t (e.g. Shopify i18n, third-party library)
      if (externalT) {
        const external = externalT(key, variables)
        // Accept the external value unless it echoed the key unchanged
        if (external && external !== key) {
          return external
        }
      }

      // Priority 2: merchant overrides (locale-specific from DB)
      const override = merchantOverrides
        ? getNestedKey(merchantOverrides, key)
        : undefined

      // Priority 3: static content (theme default JSON)
      const staticValue = getNestedKey(staticContent, key)

      // Priority 4: key itself as fallback
      const raw = override ?? staticValue ?? key

      return interpolate(raw, variables)
    }

    return { t }
  }, [staticContent, merchantOverrides, externalT])

  return (
    <ThemeTextContext.Provider value={value}>
      {children}
    </ThemeTextContext.Provider>
  )
}

/**
 * Hook to access the theme text `t()` function.
 *
 * Must be used inside a component wrapped by `withWeaverse` or `ThemeTextProvider`.
 *
 * @example
 * ```tsx
 * function CartTitle() {
 *   const { t } = useThemeText()
 *   return <h2>{t('cart.title')}</h2>
 * }
 * ```
 */
export function useThemeText(): ThemeTextValue {
  const ctx = useContext(ThemeTextContext)
  if (!ctx) {
    throw new Error(
      'useThemeText must be used within <ThemeTextProvider>. Wrap your app with withWeaverse().'
    )
  }
  return ctx
}
