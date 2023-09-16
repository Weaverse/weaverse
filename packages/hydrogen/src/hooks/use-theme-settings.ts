import { useLoaderData } from '@remix-run/react'
import { isBrowser } from '@weaverse/react'
import { useEffect, useSyncExternalStore } from 'react'
import type { HydrogenThemeSettings, WeaverseThemeSettingsStore } from '~/types'

let settings: HydrogenThemeSettings | null = null
let listeners: (() => void)[] = []

let themeSettingsStore: WeaverseThemeSettingsStore = {
  updateThemeSettings(newSettings: HydrogenThemeSettings) {
    settings = { ...settings, ...newSettings }
    emitChange()
  },
  subscribe(listener: () => void) {
    listeners = [...listeners, listener]
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  },
  getSnapshot() {
    return settings
  },
  getServerSnapshot() {
    return settings
  },
}

function emitChange() {
  for (let listener of listeners) {
    listener()
  }
}

if (isBrowser) {
  window.__weaverseThemeSettingsStore = themeSettingsStore
}

export function useThemeSettings<T = HydrogenThemeSettings>() {
  let settings = useSyncExternalStore(
    themeSettingsStore.subscribe,
    themeSettingsStore.getSnapshot,
    themeSettingsStore.getServerSnapshot,
  )
  let { weaverseTheme } = useLoaderData()

  useEffect(() => {
    if (weaverseTheme) {
      let settings = weaverseTheme.theme
      if (settings) {
        themeSettingsStore.updateThemeSettings(settings)
      }
    } else {
      console.warn(
        `'weaverseTheme' should be returned from root loader in order to get global settings from 'useThemeSettings'.`,
      )
    }
  }, [weaverseTheme])

  return settings as T
}
