import { useWeaverse } from '@weaverse/react'
import type { HydrogenProjectConfig, WeaverseHydrogen } from '~/types'

type WeaverseThemeSettings = HydrogenProjectConfig['theme']

export function useThemeSettings<T = WeaverseThemeSettings>() {
  let weaverse = useWeaverse<WeaverseHydrogen>()
  let settings = weaverse?.internal?.project?.config?.theme
  return settings as T
}
