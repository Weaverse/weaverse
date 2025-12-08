import { isBrowser } from '@weaverse/react'
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
  private readonly MAX_LISTENERS = 100
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
    // Notify all listeners
    this.emit()
  }

  getSnapshot = () => this.settings

  getServerSnapshot = () => this.settings

  subscribe = (callback: () => void) => {
    if (this.isDestroyed) {
      console.warn('ThemeSettingsStore: Cannot subscribe to destroyed store')
      return () => {}
    }

    if (this.listeners.size >= this.MAX_LISTENERS) {
      console.warn(
        `ThemeSettingsStore: Maximum listeners (${this.MAX_LISTENERS}) exceeded. ` +
          'Possible memory leak detected.'
      )
      return () => {}
    }

    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  private emit = () => {
    if (this.isDestroyed) return

    // Create a copy of listeners to avoid issues if listeners are modified during iteration
    const currentListeners = Array.from(this.listeners)

    for (const listener of currentListeners) {
      try {
        listener()
      } catch (error) {
        console.error('ThemeSettingsStore: Listener error', error)
      }
    }
  }

  // Method to properly clean up the store
  destroy = () => {
    if (this.isDestroyed) return

    this.listeners.clear()
    this.isDestroyed = true

    if (isBrowser && window.__weaverseThemeSettingsStore === this) {
      window.__weaverseThemeSettingsStore = undefined
    }
  }
}

export function useThemeSettingsStore() {
  const data = useRouteLoaderData('root') as {
    weaverseTheme: WeaverseThemeData
  }
  if (isBrowser && window.__weaverseThemeSettingsStore) {
    return window.__weaverseThemeSettingsStore
  }
  return new ThemeSettingsStore(data?.weaverseTheme)
}
