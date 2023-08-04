// TODO: make @weaverse/react framework agnostic and then move this code to @weaverse/react
import type { Weaverse } from '@weaverse/react'
import { isIframe, loadScript } from '@weaverse/react'
import { useEffect } from 'react'

export let useStudio = (weaverseCore: Weaverse) => {
  useEffect(() => {
    if (weaverseCore.isDesignMode && isIframe && !window.weaverseStudio) {
      let host = weaverseCore.weaverseHost
      let version = weaverseCore.weaverseVersion || Date.now()
      loadScript(`${host}/assets/studio/studio-bridge.js?v=${version}`).then(
        () => window?.createWeaverseStudioBridge(weaverseCore),
      )
    }
  }, [])
}
