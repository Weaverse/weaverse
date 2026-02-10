import type { i18n } from 'i18next'
import type * as React from 'react'
import { I18nextProvider } from 'react-i18next'

/**
 * Props for the WeaverseI18nProvider component.
 */
export type WeaverseI18nProviderProps = {
  /** Initialized i18next instance (typically from WeaverseI18nServer.createInstance) */
  i18n: i18n
  /** Child components that will have access to translations */
  children: React.ReactNode
}

/**
 * Provider component that wraps the application with i18next context.
 * Should be placed near the root of the app, inside the Hydrogen/React Router providers.
 *
 * @example
 * ```tsx
 * // In root.tsx
 * import { WeaverseI18nProvider } from "@weaverse/i18n"
 *
 * export default function App() {
 *   const { i18nInstance } = useLoaderData()
 *   return (
 *     <WeaverseI18nProvider i18n={i18nInstance}>
 *       <Outlet />
 *     </WeaverseI18nProvider>
 *   )
 * }
 * ```
 */
export function WeaverseI18nProvider({
  i18n,
  children,
}: WeaverseI18nProviderProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
