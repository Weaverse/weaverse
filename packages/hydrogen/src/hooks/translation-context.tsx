import { useSafeExternalStore } from '@weaverse/react'
import { createContext, type ReactNode, useContext, useMemo } from 'react'
import type { TranslationStore } from '../utils/translation-store'

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

/** Translation function, stores, and locale overrides exposed by the provider. */
export type TranslationValue = {
  /**
   * Translate a key with optional variable interpolation.
   *
   * Priority chain (highest wins):
   * 1. External `t`        (passed into `withWeaverse` / `TranslationProvider`)
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
  translationStore: TranslationStore | null
  /**
   * @deprecated Use {@link TranslationValue.translationStore} instead. Kept as a
   * backward-compatible alias pointing at the same store instance.
   */
  themeTextStore: TranslationStore | null
  /** Active-locale translated keys loaded from the storefront API. */
  merchantOverrides: Record<string, unknown> | null
}

const TranslationContext = createContext<TranslationValue | null>(null)
TranslationContext.displayName = 'WeaverseTranslationContext'

/** Inputs accepted by {@link TranslationProvider}. */
export type TranslationProviderProps = {
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
  translationStore?: TranslationStore | null
  /**
   * @deprecated Use {@link TranslationProviderProps.translationStore} instead.
   * Still accepted for backward compatibility; ignored when `translationStore`
   * is also provided.
   */
  themeTextStore?: TranslationStore | null
  children: ReactNode
}

/**
 * Build the `t()` translation function over a fixed set of sources.
 *
 * Resolution order, highest priority first:
 * 1. `externalT`         – host i18n (e.g. Shopify), unless it echoes the key
 * 2. `designOverrides`   – live design-mode edits, flat dot-path keys
 * 3. `merchantOverrides` – locale overrides from the API, nested
 * 4. `staticContent`     – the theme's default locale JSON
 * 5. the key itself
 *
 * Design overrides are looked up per-key (own properties only) rather than
 * merged into `merchantOverrides`: a flat key like `cart.title` must override
 * exactly that leaf without wiping sibling keys (`cart.subtitle`), and a
 * per-key own-property lookup never builds nested objects from
 * merchant-controlled keys, so it cannot pollute `Object.prototype`.
 */
export function createTranslate(sources: {
  staticContent: Record<string, unknown>
  merchantOverrides?: Record<string, unknown>
  designOverrides?: Record<string, string>
  externalT?: TranslateFunction
}): TranslateFunction {
  const { staticContent, merchantOverrides, designOverrides, externalT } =
    sources
  return (key, variables) => {
    // Priority 1: external t (e.g. Shopify i18n, third-party library).
    if (externalT) {
      const external = externalT(key, variables)
      // Accept the external value unless it echoed the key unchanged.
      if (external && external !== key) {
        return external
      }
    }

    // Priority 2: live design-mode override (flat, keyed by exact dot-path,
    // own properties only so inherited keys never resolve to functions).
    const design =
      designOverrides && Object.hasOwn(designOverrides, key)
        ? designOverrides[key]
        : undefined
    // Priority 3: merchant overrides (nested). Priority 4: static content.
    const override = merchantOverrides
      ? getNestedKey(merchantOverrides, key)
      : undefined
    const staticValue = getNestedKey(staticContent, key)

    // Priority 5: the key itself as the final fallback.
    const raw = design ?? override ?? staticValue ?? key
    return interpolate(raw, variables)
  }
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
 * - `translationStore`   – optional store for live design-mode text overrides
 *   (the deprecated `themeTextStore` prop is accepted as a fallback)
 */
export function TranslationProvider({
  staticContent,
  merchantOverrides,
  t: externalT,
  translationStore,
  themeTextStore,
  children,
}: TranslationProviderProps) {
  // Canonical store, falling back to the deprecated `themeTextStore` prop.
  const store = translationStore ?? themeTextStore ?? null

  // Subscribe to design-mode overrides. No-op when store is null (production).
  const designOverrides = useSafeExternalStore(
    store?.subscribe ?? NOOP_SUBSCRIBE,
    store?.getSnapshot ?? NOOP_SNAPSHOT,
    store?.getServerSnapshot ?? NOOP_SNAPSHOT
  )

  const value = useMemo<TranslationValue>(
    () => ({
      t: createTranslate({
        staticContent,
        merchantOverrides,
        designOverrides,
        externalT,
      }),
      translationStore: store,
      // Deprecated alias — same instance, kept for backward compatibility.
      themeTextStore: store,
      merchantOverrides: merchantOverrides ?? null,
    }),
    [staticContent, merchantOverrides, designOverrides, externalT, store]
  )

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

/**
 * Hook to access the translation `t()` function.
 *
 * Must be used inside a component wrapped by `withWeaverse` or `TranslationProvider`.
 *
 * @example
 * ```tsx
 * function CartTitle() {
 *   const { t } = useTranslation()
 *   return <h2>{t('cart.title')}</h2>
 * }
 * ```
 */
export function useTranslation(): TranslationValue {
  const ctx = useContext(TranslationContext)
  if (!ctx) {
    throw new Error(
      'useTranslation must be used within <TranslationProvider>. Wrap your app with withWeaverse().'
    )
  }
  return ctx
}

// ---------------------------------------------------------------------------
// Deprecated aliases (backward compatibility — kept exported indefinitely)
// ---------------------------------------------------------------------------

/**
 * Legacy name for {@link TranslationProvider}.
 * @deprecated Use {@link TranslationProvider} instead.
 */
export const ThemeTextProvider = TranslationProvider
/**
 * Legacy name for {@link useTranslation}.
 * @deprecated Use {@link useTranslation} instead.
 */
export const useThemeText = useTranslation
/**
 * Legacy name for {@link TranslationValue}.
 * @deprecated Use {@link TranslationValue} instead.
 */
export type ThemeTextValue = TranslationValue
/**
 * Legacy name for {@link TranslationProviderProps}.
 * @deprecated Use {@link TranslationProviderProps} instead.
 */
export type ThemeTextProviderProps = TranslationProviderProps
