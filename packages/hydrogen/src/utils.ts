import type { Weaverse } from '@weaverse/core'
import { isIframe, loadScript } from '@weaverse/core'
import { useEffect } from 'react'

// TODO: make @weaverse/react framework agnostic and then move this code to @weaverse/react
export let useStudio = (weaverseCore: Weaverse) => {
  useEffect(() => {
    if (
      weaverseCore.isDesignMode &&
      isIframe &&
      !window.weaverseStudioInitialized
    ) {
      console.log('useStudio', weaverseCore)
      window.weaverseStudioInitialized = true
      let host = weaverseCore.weaverseHost
      let version = weaverseCore.weaverseVersion || Date.now()
      loadScript(`${host}/assets/studio/studio-bridge.js?v=${version}`).then(
        () => {
          // @ts-ignore
          window?.createWeaverseStudioBridge(weaverseCore)
          setTimeout(() => {
            weaverseCore.triggerUpdate()
          }, 2000)
        }
      )
    }
  }, [])
}
