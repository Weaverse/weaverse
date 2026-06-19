'use client'

import { createContext, type ReactNode, useMemo } from 'react'
import type { WeaverseNextClient, WeaverseNextCommerceContext } from './types'

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
 * @example
 * ```tsx
 * <WeaverseNextProvider client={client} rootData={rootData} pageData={pageData} commerce={commerce}>
 *   <WeaverseNextRenderer />
 * </WeaverseNextProvider>
 * ```
 */
export function WeaverseNextProvider(props: WeaverseNextProviderProps) {
  let { children, client, rootData, pageData, commerce, themeSettings } = props

  let value = useMemo<WeaverseNextContextValue>(
    () => ({
      client,
      rootData,
      pageData,
      commerce: commerce ?? client?.commerce,
      themeSettings: themeSettings ?? client?.themeSettings ?? {},
    }),
    [client, rootData, pageData, commerce, themeSettings]
  )

  return (
    <WeaverseNextContext.Provider value={value}>
      {children}
    </WeaverseNextContext.Provider>
  )
}
