'use client'

import { useContext, useSyncExternalStore } from 'react'
import { WeaverseNextContext } from './provider'
import type { WeaverseNextCommerceContext } from './types'

const OUTSIDE_PROVIDER_ERROR = 'must be used inside a <WeaverseNextProvider>.'

function useWeaverseNextContext(hookName: string) {
  let context = useContext(WeaverseNextContext)
  if (!context) {
    throw new Error(`[@weaverse/next] ${hookName} ${OUTSIDE_PROVIDER_ERROR}`)
  }
  return context
}

/**
 * Read explicit root/global data passed to the provider. Next-native
 * replacement for `useRouteLoaderData('root')`.
 */
export function useWeaverseRootData<T = unknown>(): T {
  return useWeaverseNextContext('useWeaverseRootData').rootData as T
}

/**
 * Read explicit page/route commerce data passed to the provider. Next-native
 * replacement for section-level `useLoaderData()`.
 */
export function useWeaversePageData<T = unknown>(): T {
  return useWeaverseNextContext('useWeaversePageData').pageData as T
}

/** Read the app-provided commerce context (storefront/cart/customer). */
export function useWeaverseCommerce<T = WeaverseNextCommerceContext>(): T {
  return useWeaverseNextContext('useWeaverseCommerce').commerce as T
}

/**
 * Read live Weaverse theme settings. The Studio bridge updates the provider's
 * external store via `updateThemeSettings`, so components re-render during live
 * design-mode edits.
 */
export function useThemeSettings<T = Record<string, unknown>>(): T {
  let { themeSettingsStore } = useWeaverseNextContext('useThemeSettings')
  return useSyncExternalStore(
    themeSettingsStore.subscribe,
    themeSettingsStore.getSnapshot,
    themeSettingsStore.getServerSnapshot
  ) as T
}
