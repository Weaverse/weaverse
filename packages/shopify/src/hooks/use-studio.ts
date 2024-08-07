import { isIframe, loadScript } from '@weaverse/react'
import { useEffect } from 'react'

import type { WeaverseShopify } from '~/index'

export function useStudio(weaverse: WeaverseShopify) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let { isDesignMode, weaverseHost, weaverseVersion } = weaverse
    if (isDesignMode && isIframe && !window.weaverseStudio) {
      let version = weaverseVersion || Date.now()
      let studioScriptSrc = `${weaverseHost}/static/studio/studio-bridge.js?v=${version}`
      loadScript(studioScriptSrc)
        .then(() => window?.createWeaverseStudioBridge(weaverse))
        .catch(console.error)
    }
  }, [])
}
