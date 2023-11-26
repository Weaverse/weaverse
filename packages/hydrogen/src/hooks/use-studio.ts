import { useNavigate, useRevalidator } from '@remix-run/react'
import { isIframe, loadScript } from '@weaverse/react'
import { useEffect } from 'react'

import { useThemeContext } from './use-theme-context'

import type { WeaverseHydrogen } from '~/index'

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
        let studioSrc = `${weaverseHost}/static/studio/hydrogen/index.js?v=${weaverseVersion}`
        loadScript(studioSrc)
      }
    }
  }, [weaverse.requestInfo])
}
