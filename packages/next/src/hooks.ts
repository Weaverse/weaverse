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
 *
 * @category Hooks
 */
export function useWeaverseRootData<T = unknown>(): T {
  return useWeaverseNextContext('useWeaverseRootData').rootData as T
}

/**
 * Read explicit page/route commerce data passed to the provider. Next-native
 * replacement for section-level `useLoaderData()`.
 *
 * @category Hooks
 */
export function useWeaversePageData<T = unknown>(): T {
  return useWeaverseNextContext('useWeaversePageData').pageData as T
}

/**
 * Read the app-provided commerce context (storefront/cart/customer).
 *
 * @category Hooks
 */
export function useWeaverseCommerce<T = WeaverseNextCommerceContext>(): T {
  return useWeaverseNextContext('useWeaverseCommerce').commerce as T
}

/**
 * Read live Weaverse theme settings. The Studio bridge updates the provider's
 * external store via `updateThemeSettings`, so components re-render during live
 * design-mode edits.
 *
 * Pass your theme settings type as `T`. Call it from a Client Component under
 * {@link WeaverseNextRootProvider} or {@link WeaverseNextProvider}.
 *
 * @example
 * ```tsx
 * 'use client'
 *
 * import { useThemeSettings } from '@weaverse/next'
 *
 * type ThemeSettings = { colorPrimary: string; navHeightMobile: number }
 *
 * export function Header() {
 *   let settings = useThemeSettings<ThemeSettings>()
 *   return (
 *     <header
 *       style={{
 *         height: `${settings.navHeightMobile}rem`,
 *         backgroundColor: settings.colorPrimary,
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * 'use client'
 *
 * import { useThemeSettings } from '@weaverse/next'
 *
 * export function GlobalStyle() {
 *   let { bodyBaseSize, headingBaseSize } = useThemeSettings()
 *   return (
 *     <style>
 *       {`:root { --body-base-size: ${bodyBaseSize}px; --heading-base-size: ${headingBaseSize}px; }`}
 *     </style>
 *   )
 * }
 * ```
 *
 * @category Hooks
 */
export function useThemeSettings<T = Record<string, unknown>>(): T {
  let { themeSettingsStore } = useWeaverseNextContext('useThemeSettings')
  return useSyncExternalStore(
    themeSettingsStore.subscribe,
    themeSettingsStore.getSnapshot,
    themeSettingsStore.getServerSnapshot
  ) as T
}
