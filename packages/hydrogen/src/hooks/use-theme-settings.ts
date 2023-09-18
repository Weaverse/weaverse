import { useContext, useSyncExternalStore } from 'react'
import { ThemeProvider } from '~/context'
import type {
  HydrogenThemeSettings,
  WeaverseThemeSettingsStore,
  HydrogenThemeSchema,
  Localizations,
  PublicEnv,
} from '~/types'
export class ThemeSettingsStore implements WeaverseThemeSettingsStore {
  settings: HydrogenThemeSettings | null = null
  listeners: (() => void)[] = []
  countries: Localizations
  schema: HydrogenThemeSchema
  publicEnv?: PublicEnv

  constructor({
    theme,
    countries,
    schema,
    publicEnv,
  }: {
    theme: HydrogenThemeSettings
    countries: Localizations
    schema: HydrogenThemeSchema
    publicEnv?: PublicEnv
  }) {
    this.settings = theme
    this.countries = countries
    this.schema = schema
    this.publicEnv = publicEnv
  }
  updateThemeSettings = (newSettings: HydrogenThemeSettings) => {
    this.settings = { ...this.settings, ...newSettings }
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
    for (const listener of this.listeners) {
      listener()
    }
  }
}

export function useThemeSettings<T = HydrogenThemeSettings>() {
  let themeSettingsStore = useContext(ThemeProvider)

  let settings = useSyncExternalStore(
    themeSettingsStore.subscribe,
    themeSettingsStore.getSnapshot,
    themeSettingsStore.getServerSnapshot,
  )
  return settings as T
}
