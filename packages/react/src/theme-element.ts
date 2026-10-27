import {
  getThemeElementProps,
  THEME_ELEMENT_HIDDEN_EVENT,
  THEME_ELEMENT_HIDE_EVENT,
  THEME_ELEMENT_REVEAL_EVENT,
  type ThemeElementEventDetail,
  type ThemeElementProps,
} from '@weaverse/schema'
import { useEffect, useRef } from 'react'

/** Options for {@link useThemeElement}. */
export interface UseThemeElementOptions {
  /** The theme settings group's `outlineId`. */
  id: string
  /** Called when Studio asks the theme to hide this element. */
  onHide?: () => void
  /** Called when Studio asks the theme to show this element. */
  onReveal?: () => void
}

interface ThemeElementHandlers {
  onHide?: () => void
  onReveal?: () => void
}

/**
 * Calls the current handlers when a Studio request for `id` reaches `target`.
 * Returns the unsubscribe function.
 */
export function subscribeThemeElementRequests(
  target: EventTarget,
  id: string,
  getHandlers: () => ThemeElementHandlers
): () => void {
  let listener = (event: Event) => {
    let detail = (event as CustomEvent<ThemeElementEventDetail>).detail
    if (detail?.id !== id) {
      return
    }
    let handlers = getHandlers()
    if (event.type === THEME_ELEMENT_REVEAL_EVENT) {
      handlers.onReveal?.()
    } else {
      handlers.onHide?.()
    }
  }
  target.addEventListener(THEME_ELEMENT_REVEAL_EVENT, listener)
  target.addEventListener(THEME_ELEMENT_HIDE_EVENT, listener)
  return () => {
    target.removeEventListener(THEME_ELEMENT_REVEAL_EVENT, listener)
    target.removeEventListener(THEME_ELEMENT_HIDE_EVENT, listener)
  }
}

/**
 * Marks the DOM rendered for a theme settings group and lets Studio ask the
 * theme to show or hide it. Spread the returned props on the element's root.
 *
 * @param options - The group's `outlineId` and optional reveal/hide handlers.
 * @returns Props carrying the `data-wv-theme-id` marker.
 */
export function useThemeElement({
  id,
  onReveal,
  onHide,
}: UseThemeElementOptions): ThemeElementProps {
  let handlers = useRef<ThemeElementHandlers>({ onReveal, onHide })

  useEffect(() => {
    handlers.current = { onReveal, onHide }
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    return subscribeThemeElementRequests(window, id, () => handlers.current)
  }, [id])

  return getThemeElementProps(id)
}

/**
 * Tells Studio that the element for `id` closed itself, for example through
 * its close button or Escape, so Studio can drop a selection it no longer
 * shows.
 *
 * @param id - The theme settings group's `outlineId`.
 */
export function notifyThemeElementHidden(id: string): void {
  if (typeof window === 'undefined') {
    return
  }
  window.dispatchEvent(
    new CustomEvent<ThemeElementEventDetail>(THEME_ELEMENT_HIDDEN_EVENT, {
      detail: { id },
    })
  )
}
