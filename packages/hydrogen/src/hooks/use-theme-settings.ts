import { useSyncExternalStore } from 'react'
import type {
  HydrogenThemeSchema,
  HydrogenThemeSettings,
  Localizations,
  PublicEnv,
  RootRouteData,
} from '~/types'
import { useThemeContext } from './use-theme-context'

export class ThemeSettingsStore {
  static settings: HydrogenThemeSettings | null = null
  listeners: (() => void)[] = []
  countries?: Localizations
  schema?: HydrogenThemeSchema
  publicEnv?: PublicEnv

  constructor(data: RootRouteData['weaverseTheme']) {
    let { theme, countries, schema, publicEnv } = data || {}
    if (!ThemeSettingsStore.settings) {
      ThemeSettingsStore.settings = theme || {}
    } else {
      ThemeSettingsStore.settings = {
        ...theme,
        ...ThemeSettingsStore.settings,
      }
    }
    this.countries = countries
    this.schema = schema
    this.publicEnv = publicEnv
  }

  updateThemeSettings = (newSettings: HydrogenThemeSettings) => {
    ThemeSettingsStore.settings = {
      ...ThemeSettingsStore.settings,
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
    return ThemeSettingsStore.settings
  }

  getServerSnapshot = () => {
    return ThemeSettingsStore.settings
  }

  emitChange = () => {
    for (let listener of this.listeners) {
      listener()
    }
  }
}

export function useThemeSettings<T = HydrogenThemeSettings>() {
  let themeSettingsStore = useThemeContext()
  let settings = useSyncExternalStore(
    themeSettingsStore.subscribe,
    themeSettingsStore.getSnapshot,
    themeSettingsStore.getServerSnapshot,
  )
  return settings as T
}
