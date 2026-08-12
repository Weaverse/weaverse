'use client'

import {
  createContext,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  getSchemaStaticContent,
  WeaverseNextContext,
  type WeaverseNextContextValue,
} from './provider'
import { createWeaverseNextThemeSettingsStore } from './theme-settings-store'
import {
  type TranslateFunction,
  TranslationProvider,
} from './translation-context'
import { TranslationStore } from './translation-store'
import type {
  WeaverseNextThemeSchema,
  WeaverseNextThemeSettingsStore,
} from './types'

/** Root-scoped theme and translation stores adopted by route providers. */
export interface WeaverseNextRootContextValue {
  /** Active-locale static-text overrides shared with route-level providers. */
  merchantOverrides?: Record<string, unknown>
  /** Theme default locale JSON shared with route-level providers. */
  staticContent: Record<string, unknown>
  /** Root-scoped external store shared with route-level providers. */
  themeSettingsStore: WeaverseNextThemeSettingsStore
  /** Single live design-mode static-text override store for the whole session. */
  translationStore: TranslationStore
}

/**
 * Ambient root-scoped context. Route-level `WeaverseNextProvider` reads this to
 * adopt the shared theme settings store instead of creating its own.
 */
export const WeaverseNextRootContext =
  createContext<WeaverseNextRootContextValue | null>(null)

/** Root theme and translation data shared across the App Router tree. */
export interface WeaverseNextRootProviderProps {
  /** Application subtree, including global and route-level components. */
  children: ReactNode
  /** Root-loaded theme settings (published-mode fetch, no design-mode context). */
  initialThemeSettings?: Record<string, unknown>
  /** Active-locale static-text overrides from `loadThemeSettings().merchantOverrides`. */
  merchantOverrides?: Record<string, unknown>
  /** Public environment values exposed to the theme-settings store. */
  publicEnv?: Record<string, string | undefined>
  /**
   * Theme default locale JSON (`loadThemeSettings().staticContent`). Falls back
   * to `themeSchema.i18n.staticContent` when omitted.
   */
  staticContent?: Record<string, unknown>
  /** Optional external translation function (host i18n); highest priority in `t()`. */
  t?: TranslateFunction
  /** Theme schema associated with the initial settings. */
  themeSchema?: WeaverseNextThemeSchema
}

/**
 * Root-scoped client boundary that owns the single `WeaverseNextThemeSettingsStore`
 * for the whole app session, matching Hydrogen's `withWeaverse()` root store.
 * Mount once in `app/layout.tsx`, above `Header`/`Footer`/global modules and any
 * route-level `WeaverseNextProvider`.
 *
 * Also renders `WeaverseNextContext` with a minimal value so `useThemeSettings()`
 * works for components mounted directly under this provider, even without a
 * route-level `WeaverseNextProvider` above them.
 *
 * @example
 * ```tsx
 * <WeaverseNextRootProvider initialThemeSettings={theme.theme} themeSchema={theme.schema}>
 *   <Header />
 *   {children}
 *   <Footer />
 * </WeaverseNextRootProvider>
 * ```
 */
export function WeaverseNextRootProvider(props: WeaverseNextRootProviderProps) {
  let {
    children,
    initialThemeSettings,
    merchantOverrides,
    staticContent,
    t,
    themeSchema,
    publicEnv,
  } = props

  // `useRef`, not `useMemo`: a parent re-render must never replace this store —
  // it is the single instance Studio's `updateThemeSettings()` mutates in place.
  let storeRef = useRef<WeaverseNextThemeSettingsStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createWeaverseNextThemeSettingsStore({
      publicEnv,
      schema: themeSchema,
      settings: initialThemeSettings,
    })
  }
  let themeSettingsStore = storeRef.current

  // Same `useRef` rationale as the theme store: one live static-text store for
  // the whole session, which Builder's `updateStaticText()` RPC mutates in place
  // via `runtime.internal.translationStore`. A parent re-render must never swap
  // it, or design-mode overrides would be lost.
  let translationStoreRef = useRef<TranslationStore | null>(null)
  if (!translationStoreRef.current) {
    translationStoreRef.current = new TranslationStore()
  }
  let translationStore = translationStoreRef.current

  // If `initialThemeSettings` changes after mount (e.g. root revalidation),
  // update the existing store in place instead of replacing it. This is an
  // effect because external store updates are side effects; the initial render
  // is already seeded synchronously by store construction above.
  let appliedThemeSettingsRef = useRef(initialThemeSettings)
  useEffect(() => {
    if (
      initialThemeSettings &&
      appliedThemeSettingsRef.current !== initialThemeSettings
    ) {
      themeSettingsStore.updateThemeSettings(initialThemeSettings)
      appliedThemeSettingsRef.current = initialThemeSettings
    }
  }, [initialThemeSettings, themeSettingsStore])

  // Prefer an explicit `staticContent` prop (from `loadThemeSettings()`); fall
  // back to `themeSchema.i18n.staticContent`. Both resolve to referentially
  // stable objects, so memoizing the context values below stays effective.
  let resolvedStaticContent =
    staticContent ?? getSchemaStaticContent(themeSchema)

  // `themeSettingsStore` / `translationStore` are `useRef`-stable, so memoizing
  // on them (rather than recreating these plain objects every render) keeps
  // `useThemeSettings()` / `useTranslation()` consumers (Header, Footer, ...)
  // from re-rendering on every root re-render.
  let rootContextValue = useMemo<WeaverseNextRootContextValue>(
    () => ({
      merchantOverrides,
      staticContent: resolvedStaticContent,
      themeSettingsStore,
      translationStore,
    }),
    [
      merchantOverrides,
      resolvedStaticContent,
      themeSettingsStore,
      translationStore,
    ]
  )
  let contextValue = useMemo<WeaverseNextContextValue>(
    () => ({
      merchantOverrides,
      themeSettings: themeSettingsStore.getSnapshot(),
      themeSettingsStore,
      translationStore,
    }),
    [merchantOverrides, themeSettingsStore, translationStore]
  )

  return (
    <WeaverseNextRootContext.Provider value={rootContextValue}>
      <WeaverseNextContext.Provider value={contextValue}>
        <TranslationProvider
          merchantOverrides={merchantOverrides}
          staticContent={resolvedStaticContent}
          t={t}
          translationStore={translationStore}
        >
          {children}
        </TranslationProvider>
      </WeaverseNextContext.Provider>
    </WeaverseNextRootContext.Provider>
  )
}
