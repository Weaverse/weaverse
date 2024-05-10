import { useRouteLoaderData } from '@remix-run/react'
import { isBrowser } from '@weaverse/react'
import { useSyncExternalStore } from 'react'
import type {
  HydrogenThemeSchema,
  HydrogenThemeSettings,
  Localizations,
  PublicEnv,
  RootRouteData,
} from '~/types'

export class ThemeSettingsStore {
  settings: HydrogenThemeSettings = {}
  listeners: (() => void)[] = []
  countries?: Localizations
  schema?: HydrogenThemeSchema
  publicEnv?: PublicEnv

  constructor(data: RootRouteData['weaverseTheme']) {
    let { theme, countries, schema, publicEnv } = data || {}
    this.settings = { ...theme } || {}
    this.countries = countries
    this.schema = schema
    this.publicEnv = publicEnv
    if (isBrowser) {
      window.__weaverseThemeSettingsStore = this
    }
  }

  updateThemeSettings = (newSettings: HydrogenThemeSettings) => {
    this.settings = {
      ...this.settings,
      ...newSettings,
    }
    this.emitChange()
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners = [...this.listeners, listener]
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  getSnapshot = () => {
    return this.settings
  }

  getServerSnapshot = () => {
    return this.settings
  }

  emitChange = () => {
    for (let listener of this.listeners) {
      listener()
    }
  }
}

export function useThemeSettingsStore() {
  let data = useRouteLoaderData('root') as RootRouteData
  if (isBrowser && window.__weaverseThemeSettingsStore) {
    return window.__weaverseThemeSettingsStore
  }
  return new ThemeSettingsStore(data?.weaverseTheme)
}

export function useThemeSettings<T = HydrogenThemeSettings>() {
  let themeSettingsStore = useThemeSettingsStore()
  let settings = useSyncExternalStore(
    themeSettingsStore.subscribe,
    themeSettingsStore.getSnapshot,
    themeSettingsStore.getServerSnapshot,
  )
  return settings as T
}
