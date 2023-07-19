import { isIframe, loadScript } from '@weaverse/core'
import { useEffect } from 'react'
import type {
  HydrogenThemeSchema,
  NavigateFunction,
  WeaverseHydrogen,
} from '~/types'

export function useStudio(
  weaverse: WeaverseHydrogen,
  themeSchema: HydrogenThemeSchema,
  navigate: NavigateFunction
) {
  useEffect(() => {
    let init = checkStudioInitialized(weaverse)
    if (isIframe && weaverse.isDesignMode && !init) {
      window.__initializedWeaverseStudios[weaverse.pageId] = true
      weaverse.internal.themeSchema = themeSchema
      weaverse.internal.navigate = navigate

      let host = weaverse.weaverseHost
      let version = weaverse.weaverseVersion || Date.now()
      loadScript(`${host}/assets/studio/studio-bridge.js?v=${version}`).then(
        () => {
          window?.createWeaverseStudioBridge(weaverse)
          setTimeout(() => {
            weaverse.triggerUpdate()
          }, 2000)
        }
      )
    }
    window.__weaverse = weaverse
  }, [weaverse])
}

function checkStudioInitialized(weaverseInit: WeaverseHydrogen) {
  window.__initializedWeaverseStudios =
    window.__initializedWeaverseStudios || {}
  let { pageId } = weaverseInit
  let initialized = window.__initializedWeaverseStudios?.[pageId]
  if (initialized) {
    return true
  }
  return false
}
