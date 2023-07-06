import { isIframe, loadScript } from '@weaverse/core'
import { useEffect } from 'react'
import type { WeaverseHydrogen } from '..'

export function useStudio(weaverseCore: WeaverseHydrogen, themeSchema?: any) {
  useEffect(() => {
    if (
      weaverseCore.isDesignMode &&
      isIframe &&
      !window.weaverseStudioInitialized
    ) {
      window.weaverseStudioInitialized = true
      weaverseCore.internal.themeSchema = themeSchema
      let host = weaverseCore.weaverseHost
      let version = weaverseCore.weaverseVersion || Date.now()
      loadScript(`${host}/assets/studio/studio-bridge.js?v=${version}`).then(
        () => {
          window?.createWeaverseStudioBridge(weaverseCore)
          setTimeout(() => {
            weaverseCore.triggerUpdate()
          }, 2000)
        }
      )
    }
    window.__weaverse = weaverseCore
  }, [weaverseCore])
}
