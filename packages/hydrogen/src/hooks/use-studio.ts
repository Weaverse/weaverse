import { isIframe, loadScript } from '@weaverse/react'
import { useEffect } from 'react'
import { useRevalidator, useNavigate } from '@remix-run/react'
import type { HydrogenThemeSchema, WeaverseHydrogen } from '~/types'

export function useStudio(
  weaverse: WeaverseHydrogen,
  themeSchema: HydrogenThemeSchema,
) {
  let revalidator = useRevalidator()
  let navigate = useNavigate()
  console.log('revalidator', revalidator)

  useEffect(() => {
    let initialized = checkStudioInitialized(weaverse)
    if (isIframe && weaverse.isDesignMode && !initialized) {
      window.__initializedWeaverseStudios[weaverse.pageId] = true
      weaverse.internal.themeSchema = themeSchema
      weaverse.internal.navigate = navigate
      weaverse.internal.revalidator = revalidator

      let host = weaverse.weaverseHost
      let version = weaverse.weaverseVersion || Date.now()
      loadScript(`${host}/assets/studio/studio-bridge.js?v=${version}`).then(
        () => {
          window?.createWeaverseStudioBridge(weaverse)
          setTimeout(() => {
            weaverse.triggerUpdate()
          }, 2000)
        },
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
