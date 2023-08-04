import { useWeaverse } from '@weaverse/react'
import type { WeaverseHydrogen } from '~/types'

export function useThemeSettings() {
  let weaverse = useWeaverse<WeaverseHydrogen>()
  let settings = weaverse?.internal?.project?.config?.theme
  let updateSettings = (newSettings: any) => {
    weaverse.internal.project.config.theme = Object.assign(
      {},
      settings,
      newSettings,
    )
    weaverse.triggerUpdate()
  }
  return [settings, updateSettings]
}
