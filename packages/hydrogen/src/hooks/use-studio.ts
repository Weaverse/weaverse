import type { Weaverse } from '@weaverse/core'
import { isIframe, loadScript } from '@weaverse/core'
import { useEffect } from 'react'

export function useStudio(weaverseCore: Weaverse) {
  useEffect(() => {
    if (
      weaverseCore.isDesignMode &&
      isIframe &&
      !window.weaverseStudioInitialized
    ) {
      window.weaverseStudioInitialized = true
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
    window.requestAnimationFrame(() => {
      window.__weaverse = weaverseCore
    })
    // setTimeout(() => {
    //   // weaverseCore.stitchesInstance?.reset()
    //   window.__weaverse = weaverseCore
    // }, 1)
  }, [])
}
