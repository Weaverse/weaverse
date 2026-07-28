import type {
  WeaverseNextThemeSchema,
  WeaverseNextThemeSettingsStore,
} from './types'

/** Initial values for a root-scoped theme-settings store. */
export interface CreateWeaverseNextThemeSettingsStoreOptions {
  /** Public environment values exposed alongside the store. */
  publicEnv?: Record<string, string | undefined>
  /** Theme schema associated with the settings. */
  schema?: WeaverseNextThemeSchema
  /** Initial setting values. */
  settings?: Record<string, unknown>
}

/**
 * Small external store shape compatible with the Studio bridge and React's
 * `useSyncExternalStore` contract. The bridge calls `updateThemeSettings` during
 * live theme edits, so keep that method name stable.
 */
export function createWeaverseNextThemeSettingsStore(
  options: CreateWeaverseNextThemeSettingsStoreOptions = {}
): WeaverseNextThemeSettingsStore {
  let listeners = new Set<() => void>()
  let store: WeaverseNextThemeSettingsStore = {
    publicEnv: options.publicEnv,
    schema: options.schema,
    settings: { ...(options.settings ?? {}) },
    getServerSnapshot: () => store.settings,
    getSnapshot: () => store.settings,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    updateThemeSettings: (next: Record<string, unknown>) => {
      store.settings = { ...store.settings, ...next }
      for (let listener of listeners) {
        listener()
      }
    },
  }

  return store
}
