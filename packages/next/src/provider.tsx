'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { WeaverseNextRootContext } from './root-provider'
import { createWeaverseNextThemeSettingsStore } from './theme-settings-store'
import type {
  WeaverseNextClient,
  WeaverseNextCommerceContext,
  WeaverseNextThemeSettingsStore,
} from './types'

const EMPTY_THEME_SETTINGS: Record<string, unknown> = {}

/**
 * Value carried by {@link WeaverseNextContext}. Holds the explicit data
 * boundaries that replace React Router's `useLoaderData` /
 * `useRouteLoaderData` inside sections.
 */
export interface WeaverseNextContextValue {
  client?: WeaverseNextClient
  commerce?: WeaverseNextCommerceContext
  pageData?: unknown
  rootData?: unknown
  themeSettings: Record<string, unknown>
  themeSettingsStore: WeaverseNextThemeSettingsStore
}

/**
 * Null sentinel default lets hooks detect usage outside the provider and throw
 * a clear error instead of silently returning empty data.
 */
export const WeaverseNextContext =
  createContext<WeaverseNextContextValue | null>(null)

export interface WeaverseNextProviderProps {
  children: ReactNode
  client?: WeaverseNextClient
  /** App-provided commerce context (storefront/cart/customer). */
  commerce?: WeaverseNextCommerceContext
  /** Explicit page/route commerce data (replaces section-level `useLoaderData`). */
  pageData?: unknown
  /** Explicit root/global data (replaces `useRouteLoaderData('root')`). */
  rootData?: unknown
  /** Theme settings override; falls back to `client.themeSettings`. */
  themeSettings?: Record<string, unknown>
}

/**
 * Client boundary that supplies explicit root/page/commerce data to Weaverse
 * sections. Next-native replacement for `withWeaverse` + route loader data —
 * no React Router route matches are emulated.
 *
 * In App Router, create/pass `client` only from a client component wrapper. A
 * `WeaverseNextClient` contains functions and component references, so it is
 * not serializable across a Server Component → Client Component boundary.
 *
 * @example
 * ```tsx
 * 'use client'
 *
 * <WeaverseNextProvider client={client} rootData={rootData} pageData={pageData} commerce={commerce}>
 *   <WeaverseNextRenderer />
 * </WeaverseNextProvider>
 * ```
 */
export function WeaverseNextProvider(props: WeaverseNextProviderProps) {
  let { children, client, rootData, pageData, commerce, themeSettings } = props
  let rootContext = useContext(WeaverseNextRootContext)

  let themeSettingsValue =
    themeSettings ?? client?.themeSettings ?? EMPTY_THEME_SETTINGS

  // Fallback store for apps that don't mount `WeaverseNextRootProvider`. Not
  // created at all when a root store is present, so exactly one
  // `WeaverseNextThemeSettingsStore` exists per page load either way.
  let ownThemeSettingsStore = useMemo(() => {
    if (rootContext) {
      return null
    }
    return createWeaverseNextThemeSettingsStore({
      schema: client?.themeSchema,
      settings: themeSettingsValue,
    })
  }, [rootContext, client?.themeSchema, themeSettingsValue])

  let themeSettingsStore =
    rootContext?.themeSettingsStore ??
    (ownThemeSettingsStore as WeaverseNextThemeSettingsStore)

  // When adopting the root store, route-supplied theme data augments it in
  // place (merge), never replaces it — Studio and root `Header`/`Footer` must
  // keep observing the same instance. Guarded so a stable `themeSettingsValue`
  // across re-renders doesn't re-merge/re-notify every render.
  //
  // This runs in an effect, not render: mutating a store shared outside this
  // component's subtree is a side effect, and render functions must stay
  // pure under concurrent React (retried/discarded renders, StrictMode
  // double-invocation). The root's initial theme is authoritative for SSR;
  // a route's `themeSettings`/`client.themeSettings` override applies after
  // client mount instead of racing a render-phase store mutation. Apps that
  // don't mount `WeaverseNextRootProvider` are unaffected — `themeSettings`
  // still renders synchronously on SSR via `ownThemeSettingsStore` below.
  let mergedIntoRootRef = useRef<Record<string, unknown> | undefined>(undefined)
  useEffect(() => {
    if (
      rootContext &&
      themeSettingsValue !== EMPTY_THEME_SETTINGS &&
      mergedIntoRootRef.current !== themeSettingsValue
    ) {
      rootContext.themeSettingsStore.updateThemeSettings(themeSettingsValue)
      mergedIntoRootRef.current = themeSettingsValue
    }
  }, [rootContext, themeSettingsValue])

  // Do not depend on `themeSettingsValue` here. In fallback mode it is already
  // represented by a new `themeSettingsStore`; in root-adoption mode the
  // post-mount merge effect notifies `useThemeSettings()` subscribers. Including
  // it would recreate this context with a stale root snapshot before the effect
  // fires, causing an avoidable extra render.
  let value = useMemo<WeaverseNextContextValue>(
    () => ({
      client,
      rootData,
      pageData,
      commerce: commerce ?? client?.commerce,
      themeSettings: themeSettingsStore.getSnapshot(),
      themeSettingsStore,
    }),
    [client, rootData, pageData, commerce, themeSettingsStore]
  )

  return (
    <WeaverseNextContext.Provider value={value}>
      {children}
    </WeaverseNextContext.Provider>
  )
}
