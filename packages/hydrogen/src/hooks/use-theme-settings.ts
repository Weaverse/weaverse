import { useRouteLoaderData } from "@remix-run/react"
import { isBrowser, EventEmitter } from "@weaverse/react"
import { useSyncExternalStore } from "react"
import type {
  HydrogenThemeSchema,
  HydrogenThemeSettings,
  PublicEnv,
} from "~/types"

type WeaverseThemeData = {
  theme: HydrogenThemeSettings
  schema?: HydrogenThemeSchema
  publicEnv?: PublicEnv
}

export class ThemeSettingsStore extends EventEmitter {
  settings: HydrogenThemeSettings = {}
  schema?: HydrogenThemeSchema
  publicEnv?: PublicEnv

  constructor(data: WeaverseThemeData) {
    super()
    let { theme, schema, publicEnv } = data || {}
    this.settings = { ...theme }
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
  let data = useRouteLoaderData("root") as { weaverseTheme: WeaverseThemeData }
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
    themeSettingsStore.getServerSnapshot
  )
  return settings as T
}
