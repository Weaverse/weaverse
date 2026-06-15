export interface StudioMode {
  isDesignMode?: boolean
  isPreviewMode?: boolean
  isRevisionPreview?: boolean
  weaverseHost: string
  weaverseVersion: string
}

const DEFAULT_WEAVERSE_HOST = 'https://studio.weaverse.io'

/**
 * Build the Studio bridge script URL for the current mode, or `null` when the
 * storefront is not being previewed inside Weaverse Studio.
 *
 * This is the single gate that keeps the bridge off production storefronts:
 * a normal visitor's URL carries none of the design/preview markers, so the
 * result is `null` and no script is ever requested.
 *
 * Shared by the page-scoped `useStudio` (which also binds the page for
 * editing) and the root-level `useStudioConnect` (which only needs the script
 * to load so Studio's `checkWeaversePage()` handshake can answer on routes
 * with no Weaverse content).
 */
export function getStudioScriptSrc(mode: StudioMode): string | null {
  let {
    isDesignMode,
    isPreviewMode,
    isRevisionPreview,
    weaverseHost,
    weaverseVersion,
  } = mode
  let base = `${weaverseHost}/static/studio/hydrogen`
  let version = `?v=${weaverseVersion}`
  if (isRevisionPreview || isPreviewMode) {
    return `${base}/preview.js${version}`
  }
  if (isDesignMode) {
    return `${base}/index.js${version}`
  }
  return null
}

/**
 * Resolve the Studio bridge script URL from a URL query string — the markers
 * Studio attaches when it drives the preview iframe (`isDesignMode`,
 * `isPreviewMode`, `__revisionId`, `weaverseHost`, `weaverseVersion`) — or
 * `null` outside Studio.
 *
 * Pure (no DOM) so the root-level connect's production gate stays unit-testable
 * and needs no loader data.
 */
export function resolveStudioScriptSrc(search: string): string | null {
  let params = new URLSearchParams(search)
  return getStudioScriptSrc({
    isDesignMode: params.get('isDesignMode') === 'true',
    isPreviewMode: params.get('isPreviewMode') === 'true',
    isRevisionPreview: params.has('__revisionId'),
    weaverseHost: params.get('weaverseHost') || DEFAULT_WEAVERSE_HOST,
    weaverseVersion: params.get('weaverseVersion') || '',
  })
}
