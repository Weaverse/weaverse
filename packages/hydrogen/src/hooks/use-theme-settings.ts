import { useRouteLoaderData } from '@remix-run/react'
import { isBrowser, EventEmitter } from '@weaverse/react'
import { useSyncExternalStore } from 'react'
import type {
  HydrogenThemeSchema,
  HydrogenThemeSettings,
  Localizations,
  PublicEnv,
  RootRouteData,
} from '~/types'

export class ThemeSettingsStore extends EventEmitter{
  settings: HydrogenThemeSettings = {}
  countries?: Localizations
  schema?: HydrogenThemeSchema
  publicEnv?: PublicEnv

  constructor(data: RootRouteData['weaverseTheme']) {
    super()
    let { theme, countries, schema, publicEnv } = data || {}
    this.settings = { ...theme }
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
    this.emit(this.settings)
  }


  getSnapshot = () => {
    return this.settings
  }

  getServerSnapshot = () => {
    return this.settings
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
