import { useWeaverse } from '@weaverse/react'

export let useThemeSetting = () => {
  let weaverseCore = useWeaverse()
  let themeSetting = weaverseCore?.internal?.project?.config?.theme
  let updateThemeSetting = (settings: any) => {
    weaverseCore.internal.project.config.theme = Object.assign(
      {},
      themeSetting,
      settings
    )
    weaverseCore.triggerUpdate()
  }
  return { themeSetting, updateThemeSetting }
}
