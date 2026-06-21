'use client'

import { createContext, type ReactNode, useMemo } from 'react'
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

  let themeSettingsValue =
    themeSettings ?? client?.themeSettings ?? EMPTY_THEME_SETTINGS
  let themeSettingsStore = useMemo(
    () =>
      createWeaverseNextThemeSettingsStore({
        schema: client?.themeSchema,
        settings: themeSettingsValue,
      }),
    [client?.themeSchema, themeSettingsValue]
  )

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
