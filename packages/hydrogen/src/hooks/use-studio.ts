import { useNavigate, useRevalidator } from '@remix-run/react'
import { isIframe, loadScript } from '@weaverse/react'
import { useEffect } from 'react'
import type { WeaverseHydrogen } from '~/index'
import { useThemeContext } from './use-theme-context'

export function useStudio(weaverse: WeaverseHydrogen) {
  let { revalidate } = useRevalidator()
  let navigate = useNavigate()
  let themeSettingsStore = useThemeContext()
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
  }, [weaverse.requestInfo])
}
