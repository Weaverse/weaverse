import { useWeaverse } from '@weaverse/react'
import type { HydrogenThemeSettings, WeaverseHydrogen } from '~/types'

export function useThemeSettings<T = HydrogenThemeSettings>() {
  let weaverse = useWeaverse<WeaverseHydrogen>()
  let settings = weaverse?.internal?.project?.config?.theme
  return settings as T
}
