'use client'

import { useSafeExternalStore } from '@weaverse/react'
import { createContext, type ReactNode, useContext, useMemo } from 'react'
import { createTranslate, type TranslateFunction } from './translate'
import type { TranslationStore } from './translation-store'

// ---------------------------------------------------------------------------
// Context & Provider
// ---------------------------------------------------------------------------

/** Translation function and live override stores exposed by `useTranslation`. */
export interface TranslationValue {
  /** Active-locale translated keys loaded from the storefront API. */
  merchantOverrides: Record<string, unknown> | null
  /**
   * Translate a key with optional variable interpolation.
   *
   * Priority chain (highest wins):
   * 1. External `t`        (passed into `WeaverseNextRootProvider` / `TranslationProvider`)
   * 2. Design overrides   (live Builder edits from `TranslationStore`)
   * 3. `merchantOverrides` (DB/API overrides for the current locale)
   * 4. `staticContent`     (theme default JSON)
   * 5. The key itself      (fallback)
   *
   * @example
   * t('cart.title')                           // => "Cart"
   * t('badge.sale', { percentage: 15 })       // => "-15% Off"
   */
  t: TranslateFunction
  /**
   * Legacy name for the live design-mode translation store.
   *
   * @deprecated Migrate to {@link TranslationValue.translationStore}. This
   * alias points at the same store instance.
   */
  themeTextStore: TranslationStore | null
  /** Exposed so the runtime/Studio bridge can attach it to `internal`. */
  translationStore: TranslationStore | null
}

const TranslationContext = createContext<TranslationValue | null>(null)
TranslationContext.displayName = 'WeaverseNextTranslationContext'

/** Sources and content rendered by {@link TranslationProvider}. */
export interface TranslationProviderProps {
  /** React subtree that can call `useTranslation`. */
  children: ReactNode
  /** Active-locale static-text overrides loaded from Weaverse. */
  merchantOverrides?: Record<string, unknown>
  /** Default-locale static content from the theme schema. */
  staticContent: Record<string, unknown>
  /**
   * Optional external translation function.
   * When provided it becomes the **highest-priority** source:
   * if it returns a non-empty string that differs from the raw key,
   * that value is used; otherwise the internal resolution chain continues.
   */
  t?: TranslateFunction
  /**
   * Legacy prop name for the live translation store.
   *
   * @deprecated Migrate to {@link TranslationProviderProps.translationStore}.
   * Still accepted for backward compatibility; ignored when `translationStore`
   * is also provided.
   */
  themeTextStore?: TranslationStore | null
  /** Optional store for live design-mode text overrides from the builder. */
  translationStore?: TranslationStore | null
}

// No-op fallback for useSafeExternalStore when store is null (production).
// Module-level constants — stable references, zero allocation per render.
const EMPTY: Record<string, string> = {}
const NOOP_SUBSCRIBE = () => () => {
  // No-op unsubscribe for production/static renders without a translation store.
}
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
  let store = translationStore ?? themeTextStore ?? null

  // Subscribe to design-mode overrides. No-op when store is null (production).
  let designOverrides = useSafeExternalStore(
    store?.subscribe ?? NOOP_SUBSCRIBE,
    store?.getSnapshot ?? NOOP_SNAPSHOT,
    store?.getServerSnapshot ?? NOOP_SNAPSHOT
  )

  let value = useMemo<TranslationValue>(
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
 * Must be used inside a component wrapped by `WeaverseNextRootProvider` or
 * `TranslationProvider`.
 *
 * @example
 * ```tsx
 * function CartTitle() {
 *   let { t } = useTranslation()
 *   return <h2>{t('cart.title')}</h2>
 * }
 * ```
 */
export function useTranslation(): TranslationValue {
  let ctx = useContext(TranslationContext)
  if (!ctx) {
    throw new Error(
      'useTranslation must be used within <TranslationProvider>. Wrap your app with <WeaverseNextRootProvider>.'
    )
  }
  return ctx
}

// ---------------------------------------------------------------------------
// Deprecated aliases (backward compatibility — kept exported indefinitely)
// ---------------------------------------------------------------------------

/**
 * Legacy name for {@link TranslationProvider}.
 *
 * @deprecated Replace `ThemeTextProvider` with {@link TranslationProvider};
 * the props and runtime behavior are unchanged.
 */
export const ThemeTextProvider = TranslationProvider
/**
 * Legacy name for {@link useTranslation}.
 *
 * @deprecated Replace `useThemeText` with {@link useTranslation}; the return
 * value is unchanged.
 */
export const useThemeText = useTranslation
/**
 * Legacy name for {@link TranslationValue}.
 *
 * @deprecated Import {@link TranslationValue} instead.
 */
export type ThemeTextValue = TranslationValue
/**
 * Legacy name for {@link TranslationProviderProps}.
 *
 * @deprecated Import {@link TranslationProviderProps} instead.
 */
export type ThemeTextProviderProps = TranslationProviderProps
