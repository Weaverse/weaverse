import { useSafeExternalStore } from '@weaverse/react'
import { createContext, type ReactNode, useContext, useMemo } from 'react'
import type { ThemeTextStore } from '../utils/theme-text-store'

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
   * 2. `merchantOverrides` (DB overrides for the current locale + design overrides)
   * 3. `staticContent`     (theme default JSON)
   * 4. The key itself      (fallback)
   *
   * @example
   * t('cart.title')                           // => "Cart"
   * t('badge.sale', { percentage: 15 })       // => "-15% Off"
   */
  t: TranslateFunction
  /** Exposed for useStudio to attach to weaverse.internal. Null in production. */
  themeTextStore: ThemeTextStore | null
  /** Active-locale translated keys loaded from the storefront API. */
  merchantOverrides: Record<string, unknown> | null
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
  /** Optional store for live design-mode text overrides from the builder. */
  themeTextStore?: ThemeTextStore | null
  children: ReactNode
}

/**
 * Convert flat dot-notation keys to a nested object structure.
 *
 * @example
 * unflattenKeys({ "cart.title": "Cart", "cart.empty": "Empty" })
 * // => { cart: { title: "Cart", empty: "Empty" } }
 */
function unflattenKeys(flat: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [dotPath, value] of Object.entries(flat)) {
    const keys = dotPath.split('.')
    let current: Record<string, unknown> = result
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {}
      }
      current = current[k] as Record<string, unknown>
    }
    current[keys[keys.length - 1]] = value
  }
  return result
}

// No-op fallback for useSafeExternalStore when store is null (production).
// Module-level constants — stable references, zero allocation per render.
const EMPTY: Record<string, string> = {}
const NOOP_SUBSCRIBE = () => () => {}
const NOOP_SNAPSHOT = () => EMPTY

/**
 * Provider that wraps the app to expose the `t()` function.
 *
 * - `staticContent`      – the theme's default locale JSON (from themeSchema.i18n)
 * - `merchantOverrides`  – locale-specific overrides fetched from the API
 * - `themeTextStore`     – optional store for live design-mode text overrides
 */
export function ThemeTextProvider({
  staticContent,
  merchantOverrides,
  t: externalT,
  themeTextStore,
  children,
}: ThemeTextProviderProps) {
  // Subscribe to design-mode overrides. No-op when store is null (production).
  const designOverrides = useSafeExternalStore(
    themeTextStore?.subscribe ?? NOOP_SUBSCRIBE,
    themeTextStore?.getSnapshot ?? NOOP_SNAPSHOT,
    themeTextStore?.getServerSnapshot ?? NOOP_SNAPSHOT
  )

  // Merge design overrides into merchantOverrides when present.
  // Design overrides are flat ("cart.title": "value") but merchantOverrides
  // are nested ({cart: {title: "value"}}), so unflatten before merging.
  // Guard preserves original ref when empty → useMemo deps unchanged.
  const mergedOverrides =
    designOverrides !== EMPTY && Object.keys(designOverrides).length > 0
      ? { ...merchantOverrides, ...unflattenKeys(designOverrides) }
      : merchantOverrides

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

      // Priority 2: merchant overrides (+ design overrides merged in)
      const override = mergedOverrides
        ? getNestedKey(mergedOverrides, key)
        : undefined

      // Priority 3: static content (theme default JSON)
      const staticValue = getNestedKey(staticContent, key)

      // Priority 4: key itself as fallback
      const raw = override ?? staticValue ?? key

      return interpolate(raw, variables)
    }

    return {
      t,
      themeTextStore: themeTextStore ?? null,
      merchantOverrides: merchantOverrides ?? null,
    }
  }, [
    staticContent,
    merchantOverrides,
    mergedOverrides,
    externalT,
    themeTextStore,
  ])

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
