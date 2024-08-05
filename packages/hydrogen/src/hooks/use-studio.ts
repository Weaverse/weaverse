import {
  useLocation,
  useNavigate,
  useNavigation,
  useRevalidator,
} from '@remix-run/react'
import { loadScript } from '@weaverse/react'
import { useEffect } from 'react'
import type { WeaverseHydrogen } from '~/index'
import { useThemeSettingsStore } from './use-theme-settings'

export function useStudio(weaverse: WeaverseHydrogen) {
  let { revalidate } = useRevalidator()
  let navigation = useNavigation()
  let { pathname, search } = useLocation()
  let navigate = useNavigate()
  let themeSettingsStore = useThemeSettingsStore()
  let { isDesignMode, weaverseHost, weaverseVersion } = weaverse

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
          window.weaverseStudio?.init(weaverse)
        })
        .catch(console.error)
    }
  }, [pathname, search, navigation.state])
  usePixel(weaverse)
}


export function usePixel(context: WeaverseHydrogen) {
  let { projectId, pageId, weaverseHost, isDesignMode } = context
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!projectId || !pageId || !weaverseHost || isDesignMode) return
    let url = `${weaverseHost}/api/public/px`
    let img = new Image()
    img.onload = () => {}
    img.src = `${url}?projectId=${projectId}&pageId=${pageId}`
  }, [])
}
