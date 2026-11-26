import { useSafeExternalStore } from '@weaverse/react'
import { createContext, type ReactNode, useContext, useMemo } from 'react'
import {
  createTranslate,
  getNestedKey,
  interpolate,
  type TranslateFunction,
} from '../utils/translate'
import type { TranslationStore } from '../utils/translation-store'

export { createTranslate, getNestedKey, interpolate, type TranslateFunction }

// ---------------------------------------------------------------------------
// Context & Provider
// ---------------------------------------------------------------------------

/** Translation function, stores, and locale overrides exposed by the provider. */
export interface TranslationValue {
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
export interface TranslationProviderProps {
  /** Theme-provided default-locale translation content. */
  staticContent: Record<string, unknown>
  /** Active-locale translations published by the merchant. */
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
  /** React content that can consume the translation context. */
  children: ReactNode
}

// No-op fallback for useSafeExternalStore when store is null (production).
// Module-level constants — stable references, zero allocation per render.
const EMPTY: Record<string, string> = {}
const NOOP_SUBSCRIBE = () => () => {}
const NOOP_SNAPSHOT = () => EMPTY

/**
 * Provider that wraps the app to expose the `t()` function.
 *
 * `withWeaverse` already renders it, so themes rarely use it directly. Use it
 * to provide `t()` to a tree outside the Weaverse root, such as a test or a
 * standalone component preview.
 *
 * - `staticContent`      – the theme's default locale JSON (from themeSchema.i18n)
 * - `merchantOverrides`  – locale-specific overrides fetched from the API
 * - `translationStore`   – optional store for live design-mode text overrides
 *   (the deprecated `themeTextStore` prop is accepted as a fallback)
 *
 * @example
 * ```tsx
 * import { TranslationProvider } from '@weaverse/hydrogen/react-router'
 * import staticContent from '~/i18n/en.json'
 *
 * <TranslationProvider staticContent={staticContent}>
 *   <CartTitle count={2} />
 * </TranslationProvider>
 * ```
 *
 * @category Components
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
 * Keys are dot paths into the theme's text (`cart.title` reads
 * `{ "cart": { "title": "..." } }`), and `t()` replaces `{{name}}`
 * placeholders with the matching `variables` value. It does not handle plurals
 * or number formatting. `t(key)` returns the first value it finds, highest
 * priority first:
 * 1. The external `t` passed to `withWeaverse(Layout, { t })` or
 *    `TranslationProvider`, unless it returns an empty string or the key
 *    unchanged.
 * 2. Unsaved edits the merchant is making in Studio's design mode.
 * 3. The merchant's translations for the active locale (`merchantOverrides`).
 * 4. The theme's default copy (`staticContent`, from `i18n.staticContent` in
 *    the theme schema).
 * 5. The key itself.
 *
 * Studio's translations always win over the bundled default copy, so editing
 * the theme's default JSON does not change a key the merchant has already
 * translated. `withWeaverse` reads `staticContent` and `merchantOverrides`
 * from the root loader's `weaverseTheme` (the `loadThemeSettings()` result).
 * Throws when no `TranslationProvider` is above it.
 *
 * @example
 * ```tsx
 * function CartTitle() {
 *   const { t } = useTranslation()
 *   return <h2>{t('cart.title')}</h2>
 * }
 * ```
 *
 * @category Hooks
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
