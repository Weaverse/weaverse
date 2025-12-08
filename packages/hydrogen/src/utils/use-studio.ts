import { loadScript } from '@weaverse/react'
import { useEffect } from 'react'
import {
  useLocation,
  useNavigate,
  useNavigation,
  useRevalidator,
} from 'react-router'
import type { WeaverseHydrogen } from '~/index'
import { hasWeaverseStudio } from '~/types'
import { useThemeSettingsStore } from './use-theme-settings-store'

export function useStudio(weaverse: WeaverseHydrogen) {
  let { revalidate } = useRevalidator()
  let navigation = useNavigation()
  let { pathname, search } = useLocation()
  let navigate = useNavigate()
  let themeSettingsStore = useThemeSettingsStore()
  let { isDesignMode, weaverseHost, weaverseVersion, isPreviewMode } = weaverse

  // biome-ignore lint/correctness/useExhaustiveDependencies: only revalidate on pathname/search changes
  useEffect(() => {
    if (navigation.state === 'idle') {
      if (isPreviewMode) {
        let previewSrc = `${weaverseHost}/static/studio/hydrogen/preview.js?v=${weaverseVersion}`
        loadScript(previewSrc).catch(console.error)
      } else if (isDesignMode) {
        weaverse.internal = {
          ...weaverse.internal,
          navigate,
          revalidate,
          themeSettingsStore,
        }
        let studioSrc = `${weaverseHost}/static/studio/hydrogen/index.js?v=${weaverseVersion}`
        loadScript(studioSrc)
          .then(() => {
            if (hasWeaverseStudio(window)) {
              window.weaverseStudio.init(weaverse)
            }
          })
          .catch(console.error)
      }
    }
  }, [pathname, search, navigation.state])
  usePixel(weaverse)
}

export function usePixel(context: WeaverseHydrogen) {
  let { projectId, pageId, isDesignMode, weaverseHost } = context
  // biome-ignore lint/correctness/useExhaustiveDependencies: only track once on mount
  useEffect(() => {
    if (!(projectId && pageId) || isDesignMode) {
      return
    }
    let img = new Image()
    img.onload = () => img.remove()
    img.src = `${weaverseHost}/api/public/px?projectId=${projectId}&pageId=${pageId}`
  }, [])
}
