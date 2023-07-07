import { useWeaverse } from '@weaverse/react'

export function useThemeSettings() {
  let weaverse = useWeaverse()
  let settings = weaverse?.internal?.project?.config?.theme
  let updateSettings = (newSettings: any) => {
    weaverse.internal.project.config.theme = Object.assign(
      {},
      settings,
      newSettings
    )
    weaverse.triggerUpdate()
  }
  return [settings, updateSettings]
}
