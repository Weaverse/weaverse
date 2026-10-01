import { useEffect } from 'react'

/** Event contract shared with Studio for revealing conditional theme DOM. */
export const THEME_ELEMENT_REVEAL_EVENT =
  'weaverse:theme-element-reveal' as const

/** Identifies the theme element that Studio needs to reveal. */
export interface ThemeElementRevealDetail {
  /** Must match the settings group outlineId. */
  id: string
}

/** Registers a DOM identity without creating a page item. */
export interface UseThemeElementOptions {
  /** Must match the settings group outlineId. */
  id: string
  /** Mounts or opens conditional DOM before Studio queries its marker. */
  onReveal?: () => void
}

/** Props for the real DOM boundary that Studio selects. */
export interface ThemeElementProps {
  /** Theme marker, deliberately separate from page-item data-wv-id. */
  'data-wv-theme-id': string
}

/**
 * Build the DOM marker consumed by the Studio bridge.
 */
export function getThemeElementProps(id: string): ThemeElementProps {
  return { 'data-wv-theme-id': id }
}

/**
 * Create the cross-runtime event Studio dispatches before querying conditional
 * or portal-based theme element DOM.
 */
export function createThemeElementRevealEvent(
  id: string
): CustomEvent<ThemeElementRevealDetail> {
  return new CustomEvent(THEME_ELEMENT_REVEAL_EVENT, { detail: { id } })
}

/**
 * Subscribe a reveal callback to one stable theme element ID.
 */
export function subscribeThemeElementReveal(
  id: string,
  onReveal: () => void,
  target?: EventTarget
): () => void {
  let eventTarget = target ?? (typeof window === 'undefined' ? null : window)
  if (!eventTarget) {
    return () => undefined
  }
  let handleReveal = (event: Event) => {
    let { detail } = event as CustomEvent<ThemeElementRevealDetail>
    if (detail?.id === id) {
      onReveal()
    }
  }
  eventTarget.addEventListener(THEME_ELEMENT_REVEAL_EVENT, handleReveal)
  return () => {
    eventTarget.removeEventListener(THEME_ELEMENT_REVEAL_EVENT, handleReveal)
  }
}

/**
 * Mark a theme-level DOM root as selectable and optionally reveal conditional
 * UI when Studio selects its Outline entry.
 */
export function useThemeElement({
  id,
  onReveal,
}: UseThemeElementOptions): ThemeElementProps {
  useEffect(() => {
    if (!onReveal) {
      return
    }
    return subscribeThemeElementReveal(id, onReveal)
  }, [id, onReveal])

  return getThemeElementProps(id)
}
