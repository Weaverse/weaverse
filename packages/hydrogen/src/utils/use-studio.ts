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
import { useThemeText } from '../hooks/theme-text-context'
import { registerPixelInstance, shouldFirePixel } from './pixel'
import { useThemeSettingsStore } from './use-theme-settings-store'

const STUDIO_READY_POLL_MS = 50
const STUDIO_READY_TIMEOUT_MS = 5000

/**
 * Resolve once `window.weaverseStudio` is available, or `null` on timeout.
 * The studio script sets the global when it *executes*; `loadScript` can
 * resolve earlier for tags it did not create (e.g. SSR-injected markup),
 * so never assume readiness right after the script promise settles.
 */
function waitForStudio(): Promise<Window['weaverseStudio'] | null> {
  return new Promise((resolve) => {
    let startedAt = Date.now()
    function check() {
      if (hasWeaverseStudio(window)) {
        return resolve(window.weaverseStudio)
      }
      if (Date.now() - startedAt >= STUDIO_READY_TIMEOUT_MS) {
        console.warn('[Weaverse] Studio script did not initialize in time')
        return resolve(null)
      }
      setTimeout(check, STUDIO_READY_POLL_MS)
    }
    check()
  })
}

export function useStudio(weaverse: WeaverseHydrogen) {
  let { revalidate } = useRevalidator()
  let navigation = useNavigation()
  let { pathname, search } = useLocation()
  let navigate = useNavigate()
  let themeSettingsStore = useThemeSettingsStore()
  let { themeTextStore, merchantOverrides } = useThemeText()
  let {
    isDesignMode,
    weaverseHost,
    weaverseVersion,
    isPreviewMode,
    isRevisionPreview,
  } = weaverse

  // biome-ignore lint/correctness/useExhaustiveDependencies: only revalidate on pathname/search changes
  useEffect(() => {
    if (navigation.state === 'idle') {
      if (isRevisionPreview || isPreviewMode) {
        let previewSrc = `${weaverseHost}/static/studio/hydrogen/preview.js?v=${weaverseVersion}`
        loadScript(previewSrc).catch(console.error)
      } else if (isDesignMode) {
        weaverse.internal = {
          ...weaverse.internal,
          navigate,
          revalidate,
          merchantOverrides,
          themeSettingsStore,
          themeTextStore,
        }
        let studioSrc = `${weaverseHost}/static/studio/hydrogen/index.js?v=${weaverseVersion}`
        loadScript(studioSrc)
          .then(waitForStudio)
          .then((studio) => studio?.init(weaverse))
          .catch(console.error)
      }
    }
  }, [pathname, search, navigation.state])
  usePixel(weaverse)
}

export function usePixel(context: WeaverseHydrogen) {
  let { projectId, pageId, isDesignMode, weaverseHost } = context
  let { key: navigationKey } = useLocation()
  // biome-ignore lint/correctness/useExhaustiveDependencies: only track once on mount
  useEffect(() => {
    if (!(projectId && pageId) || isDesignMode) {
      return
    }
    // Register BEFORE deciding to fire: the navigation state must live
    // exactly as long as some Weaverse instance is mounted (see pixel.ts).
    let unregister = registerPixelInstance()
    if (shouldFirePixel(navigationKey, pageId)) {
      let img = new Image()
      img.onload = () => img.remove()
      img.src = `${weaverseHost}/api/public/px?projectId=${projectId}&pageId=${pageId}`
    }
    return unregister
  }, [])
}
