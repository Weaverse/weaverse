import {
  useLocation,
  useNavigate,
  useRevalidator,
  useNavigation,
} from '@remix-run/react'
import { loadScript } from '@weaverse/react'
import { useEffect } from 'react'
import { useThemeContext } from './use-theme-context'
import type { WeaverseHydrogen } from '~/index'

export function useStudio(weaverse: WeaverseHydrogen) {
  let { revalidate } = useRevalidator()
  const navigation = useNavigation()
  let { pathname, search } = useLocation()
  let navigate = useNavigate()
  let themeSettingsStore = useThemeContext()
  let { isDesignMode, weaverseHost, weaverseVersion } = weaverse
  useEffect(() => {
    if (navigation.state === 'idle' && isDesignMode) {
      weaverse.internal = {
        ...weaverse.internal,
        navigate,
        revalidate,
        themeSettingsStore,
      }
      let studioSrc = `${weaverseHost}/static/studio/hydrogen/index.js?v=${weaverseVersion}`
      loadScript(studioSrc)
        .then(() => {
          window.weaverseStudio.init(weaverse)
        })
        .catch(console.error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search, navigation.state])
}
