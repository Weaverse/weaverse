import { useNavigate, useRevalidator } from '@remix-run/react'
import { isIframe, loadScript } from '@weaverse/react'
import { useContext, useEffect } from 'react'
import type { WeaverseHydrogen } from '~/types'
import { ThemeProvider } from '~/context'

export function useStudio(weaverse: WeaverseHydrogen) {
  let navigate = useNavigate()
  let { revalidate } = useRevalidator()
  let themeSettingsStore = useContext(ThemeProvider)
  let { isDesignMode, weaverseHost, weaverseVersion } = weaverse
  let isStudio = isIframe && isDesignMode && weaverseHost && weaverseVersion
  useEffect(() => {
    if (isStudio) {
      weaverse.internal = {
        ...weaverse.internal,
        navigate,
        revalidate,
        themeSettingsStore,
      }
      window.__weaverse = weaverse
      if (window.weaverseStudio) {
        window.weaverseStudio.init(weaverse)
      } else {
        let studioSrc = `${weaverseHost}/assets/studio/hydrogen/index.js?v=${weaverseVersion}`
        loadScript(studioSrc)
      }
    }
  }, [weaverse])
}
