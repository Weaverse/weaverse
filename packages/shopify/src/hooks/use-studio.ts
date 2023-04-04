// TODO: make @weaverse/react framework agnostic and then move this code to @weaverse/react
import type { Weaverse } from '@weaverse/core'
import { isIframe, loadScript } from '@weaverse/core'
import { useEffect } from 'react'

export let useStudio = (weaverseCore: Weaverse) => {
  console.log('useStudio', weaverseCore)
  useEffect(() => {
    if (weaverseCore.isDesignMode && isIframe) {
      loadScript(
        `${weaverseCore.weaverseHost}/assets/studio/studio-bridge.js`
      ).then(() => {
        // @ts-ignore
        window?.createWeaverseStudioBridge(weaverseCore)
        setTimeout(() => {
          weaverseCore.triggerUpdate()
        }, 2000)
      })
    }
  }, [])
}
