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
import { getStudioScriptSrc, resolveStudioScriptSrc } from './studio-script-src'
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

/**
 * Load the Studio bridge script on *every* design/preview render — including
 * routes with no Weaverse page (404s, error boundaries, non-Weaverse routes).
 *
 * The bridge registers its RPC endpoint and `window.weaverseStudio` the moment
 * the script executes — independent of any page binding — so Studio's
 * `checkWeaversePage()` handshake is answered instead of timing out. Without
 * this, a content-less route never loads the script and Studio reports a false
 * "Connection lost" instead of "this page has no Weaverse content set up".
 *
 * Reads mode + host/version from the URL query params Studio attaches when it
 * drives the iframe, so it needs no loader data and works on error pages.
 * Mounted via {@link withWeaverse}, which must be the root route's `Layout`
 * export so the bridge renders even when a route's `ErrorBoundary` replaces the
 * page (404s, loader/render errors). Outside Studio (no design/preview params)
 * it is a no-op, and `loadScript` is idempotent, so it coexists with the
 * page-scoped {@link useStudio}.
 */
export function useStudioConnect() {
  let { search } = useLocation()
  useEffect(() => {
    // Loopback Studio hosts are only honored when the storefront itself is
    // loopback (see resolveStudioScriptSrc), so pass the document's hostname.
    let hostname = typeof window === 'undefined' ? '' : window.location.hostname
    let src = resolveStudioScriptSrc(search, hostname)
    if (src) {
      loadScript(src).catch(console.error)
    }
  }, [search])
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
    if (navigation.state !== 'idle') {
      return
    }
    let src = getStudioScriptSrc({
      isDesignMode,
      isPreviewMode,
      isRevisionPreview,
      weaverseHost,
      weaverseVersion,
    })
    if (!src) {
      return
    }
    if (isRevisionPreview || isPreviewMode) {
      loadScript(src).catch(console.error)
    } else {
      weaverse.internal = {
        ...weaverse.internal,
        navigate,
        revalidate,
        merchantOverrides,
        themeSettingsStore,
        themeTextStore,
      }
      loadScript(src)
        .then(waitForStudio)
        .then((studio) => studio?.init(weaverse))
        .catch(console.error)
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
