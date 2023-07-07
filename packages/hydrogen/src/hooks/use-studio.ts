import { isIframe, loadScript } from '@weaverse/core'
import { useEffect } from 'react'
import type { HydrogenThemeSchema, WeaverseHydrogen } from '~/types'

export function useStudio(
  weaverse: WeaverseHydrogen,
  themeSchema: HydrogenThemeSchema
) {
  useEffect(() => {
    if (
      isIframe &&
      weaverse.isDesignMode &&
      !window.weaverseStudioInitialized
    ) {
      window.weaverseStudioInitialized = true
      weaverse.internal.themeSchema = themeSchema
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
