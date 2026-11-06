import { createContext, useContext } from 'react'
import { useSafeExternalStore } from './renderer'

/** What the merchant has selected in Weaverse Studio. */
export type StudioSelection = {
  /** ID of the selected page item, or `null`. */
  selectedItemId: string | null
  /**
   * Name of the selected theme settings group, exactly as declared in the
   * schema `group` field, or `null`.
   */
  selectedThemeGroup: string | null
}

const NO_SELECTION: StudioSelection = Object.freeze({
  selectedItemId: null,
  selectedThemeGroup: null,
})

/**
 * Holds the Studio selection for one storefront root. The Studio bridge writes
 * it; themes read it through {@link useStudioSelection}.
 */
export class StudioSelectionStore {
  private selection: StudioSelection = NO_SELECTION
  private readonly listeners = new Set<() => void>()

  /** Returns the current selection; the same object until it changes. */
  getSnapshot = (): StudioSelection => this.selection

  /** Returns the empty selection rendered on the server and at hydration. */
  getServerSnapshot = (): StudioSelection => NO_SELECTION

  /**
   * Registers a change listener.
   *
   * @param listener - Called after each selection change.
   * @returns A function that removes the listener.
   */
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Replaces the selection and notifies listeners when a value changed. An item
   * and a theme group are mutually exclusive, so a selection naming both is
   * rejected and leaves the store unchanged.
   *
   * @param next - The new selection.
   */
  setSelection = (next: StudioSelection) => {
    let { selectedItemId, selectedThemeGroup } = next
    if (selectedItemId !== null && selectedThemeGroup !== null) {
      console.error(
        '[Weaverse] A Studio selection cannot name both an item and a theme group'
      )
      return
    }
    let current = this.selection
    if (
      current.selectedItemId === selectedItemId &&
      current.selectedThemeGroup === selectedThemeGroup
    ) {
      return
    }
    this.selection =
      selectedItemId === null && selectedThemeGroup === null
        ? NO_SELECTION
        : Object.freeze({ selectedItemId, selectedThemeGroup })
    for (let listener of this.listeners) {
      listener()
    }
  }
}

/** Provides the root's {@link StudioSelectionStore}; set by each adapter. */
export let StudioSelectionStoreContext =
  createContext<StudioSelectionStore | null>(null)

const DETACHED_STORE = new StudioSelectionStore()

/**
 * Returns what the merchant has selected in Weaverse Studio: a page item ID or
 * a theme settings group name, never both. Both are `null` on the storefront,
 * during server rendering and outside a Weaverse root.
 *
 * @returns The current Studio selection.
 *
 * @example
 * ```tsx
 * function NewsletterPopup() {
 *   const { selectedThemeGroup } = useStudioSelection()
 *   const open = selectedThemeGroup === 'Newsletter Popup'
 *   // ...
 * }
 * ```
 */
export function useStudioSelection(): StudioSelection {
  let store = useContext(StudioSelectionStoreContext) ?? DETACHED_STORE
  return useSafeExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  )
}
