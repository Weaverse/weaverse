import { isBrowser } from '@weaverse/react'
import { createContext, useContext, useEffect, useRef } from 'react'
import { useRouteLoaderData } from 'react-router'
import type {
  HydrogenThemeSchema,
  HydrogenThemeSettings,
  PublicEnv,
} from '~/types'

type WeaverseThemeData = {
  theme: HydrogenThemeSettings
  schema?: HydrogenThemeSchema
  publicEnv?: PublicEnv
}

export class ThemeSettingsStore {
  settings: HydrogenThemeSettings = {}
  schema?: HydrogenThemeSchema
  publicEnv?: PublicEnv
  private listeners: Set<() => void> = new Set()
  private hasWarnedListenerCount = false
  private isDestroyed = false

  constructor(data: WeaverseThemeData) {
    const { theme, schema, publicEnv } = data || {}
    this.settings = { ...theme }
    this.schema = schema
    this.publicEnv = publicEnv
    if (isBrowser) {
      window.__weaverseThemeSettingsStore = this
    }
  }

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

  getSnapshot = () => this.settings

  getServerSnapshot = () => this.settings

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
