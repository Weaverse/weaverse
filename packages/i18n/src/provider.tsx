import i18next from 'i18next'
import type * as React from 'react'
import { useMemo } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import type { WeaverseI18nData } from './types'

/**
 * Props for the WeaverseI18nProvider component.
 */
export type WeaverseI18nProviderProps = {
  /** Serializable i18n data from the server loader (via `getI18nData()`) */
  data: WeaverseI18nData
  /** Child components that will have access to translations */
  children: React.ReactNode
}

/**
 * Provider component that wraps the application with i18next context.
 * Should be placed near the root of the app, inside the Hydrogen/React Router providers.
 *
 * Accepts serialized `data` from the server loader and creates a client-side
 * i18next instance automatically.
 *
 * @example
 * ```tsx
 * // In root.tsx
 * import { WeaverseI18nProvider } from "@weaverse/i18n"
 *
 * export default function App() {
 *   const { i18nData } = useLoaderData()
 *   return (
 *     <WeaverseI18nProvider data={i18nData}>
 *       <Outlet />
 *     </WeaverseI18nProvider>
 *   )
 * }
 * ```
 */
export function WeaverseI18nProvider({
  data,
  children,
}: WeaverseI18nProviderProps) {
  let instance = useMemo(() => {
    let i18n = i18next.createInstance()
    i18n.use(initReactI18next).init({
      lng: data.locale,
      resources: data.resources,
      interpolation: { escapeValue: false },
    })
    return i18n
  }, [data])

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>
}
