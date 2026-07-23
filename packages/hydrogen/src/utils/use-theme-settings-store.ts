import { isBrowser } from '@weaverse/react'
import { createContext, useContext, useEffect, useRef } from 'react'
import { useRouteLoaderData } from 'react-router'
import type {
  HydrogenThemeSchema,
  HydrogenThemeSettings,
  PublicEnv,
} from '../types'

type WeaverseThemeData = {
  theme: HydrogenThemeSettings
  schema?: HydrogenThemeSchema
  publicEnv?: PublicEnv
}

/** Mutable, subscribable store for theme settings received from the root loader. */
export class ThemeSettingsStore {
  /** Current merged theme setting values. */
  settings: HydrogenThemeSettings = {}
  /** Theme schema exposed to Studio, when available. */
  schema?: HydrogenThemeSchema
  /** Storefront-safe environment values, when available. */
  publicEnv?: PublicEnv
  private listeners: Set<() => void> = new Set()
  private hasWarnedListenerCount = false
  private isDestroyed = false

  /** Creates a theme settings store from root-loader theme data. */
  constructor(data: WeaverseThemeData) {
    const { theme, schema, publicEnv } = data || {}
    this.settings = { ...theme }
    this.schema = schema
    this.publicEnv = publicEnv
    if (isBrowser) {
      window.__weaverseThemeSettingsStore = this
    }
  }

  /** Merges setting changes into the current snapshot and notifies subscribers. */
  updateThemeSettings = (newSettings: HydrogenThemeSettings) => {
    if (this.isDestroyed) {
      console.warn('ThemeSettingsStore: Cannot update destroyed store')
      return
    }

    this.settings = {
      ...this.settings,
      ...newSettings,
    }
    this.emit()
  }

  /** Returns the current client snapshot for `useSyncExternalStore`. */
  getSnapshot = () => this.settings

  /** Returns the current server snapshot for `useSyncExternalStore`. */
  getServerSnapshot = () => this.settings

  /** Subscribes to setting changes and returns an unsubscribe callback. */
  subscribe = (callback: () => void) => {
    if (this.isDestroyed) {
      console.warn('ThemeSettingsStore: Cannot subscribe to destroyed store')
      return () => {}
    }

    this.listeners.add(callback)

    if (!this.hasWarnedListenerCount && this.listeners.size > 500) {
      this.hasWarnedListenerCount = true
      console.warn(
        `ThemeSettingsStore: ${this.listeners.size} listeners detected. ` +
          'This may indicate a performance issue. Consider using fewer useThemeSettings() calls.'
      )
    }

    return () => {
      this.listeners.delete(callback)
    }
  }

  private emit = () => {
    if (this.isDestroyed) {
      return
    }

    const currentListeners = Array.from(this.listeners)

    for (const listener of currentListeners) {
      try {
        listener()
      } catch (error) {
        console.error('ThemeSettingsStore: Listener error', error)
      }
    }
  }

  /** Clears subscribers and detaches the browser-global store reference. */
  destroy = () => {
    if (this.isDestroyed) {
      return
    }

    this.listeners.clear()
    this.isDestroyed = true

    if (isBrowser && window.__weaverseThemeSettingsStore === this) {
      window.__weaverseThemeSettingsStore = undefined
    }
  }
}

export const ThemeSettingsStoreContext =
  createContext<ThemeSettingsStore | null>(null)
ThemeSettingsStoreContext.displayName = 'ThemeSettingsStoreContext'

export function useCreateThemeSettingsStore(): ThemeSettingsStore {
  const data = useRouteLoaderData('root') as {
    weaverseTheme: WeaverseThemeData
  }
  const storeRef = useRef<ThemeSettingsStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = new ThemeSettingsStore(data?.weaverseTheme)
  }

  const theme = data?.weaverseTheme?.theme
  useEffect(() => {
    if (storeRef.current && theme) {
      storeRef.current.updateThemeSettings(theme)
    }
  }, [theme])

  return storeRef.current
}

export function useThemeSettingsStore(): ThemeSettingsStore {
  const fromContext = useContext(ThemeSettingsStoreContext)
  const data = useRouteLoaderData('root') as {
    weaverseTheme: WeaverseThemeData
  }
  const fallbackRef = useRef<ThemeSettingsStore | null>(null)

  if (!(fallbackRef.current || fromContext)) {
    fallbackRef.current = new ThemeSettingsStore(data?.weaverseTheme)
  }

  const store = fromContext ?? fallbackRef.current!
  const theme = data?.weaverseTheme?.theme
  useEffect(() => {
    if (!fromContext && theme) {
      store.updateThemeSettings(theme)
    }
  }, [fromContext, store, theme])

  return store
}
