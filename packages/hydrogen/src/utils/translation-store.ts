/**
 * Minimal mutable store for design-mode static text overrides.
 *
 * useSyncExternalStore-compatible. Passed into TranslationProvider which
 * subscribes internally and merges overrides into merchantOverrides.
 * The studio bridge calls updateOverrides() via weaverse.internal.translationStore
 * (also exposed as the deprecated weaverse.internal.themeTextStore alias).
 *
 * Shape: flat Record<string, string> — dot-notation keys map to values
 * (e.g. "cart.title" → "Shopping Cart").
 */
export class TranslationStore {
  /** Current flat translation overrides keyed by dot-path. */
  overrides: Record<string, string> = {}
  private listeners: Set<() => void> = new Set()

  /** Replaces all overrides and notifies subscribers. */
  setOverrides = (overrides: Record<string, string>) => {
    this.overrides = { ...overrides }
    this.emit()
  }

  /** Merges changed overrides and notifies subscribers. */
  updateOverrides = (newOverrides: Record<string, string>) => {
    this.overrides = { ...this.overrides, ...newOverrides }
    this.emit()
  }

  /** Returns the current client snapshot for `useSyncExternalStore`. */
  getSnapshot = () => this.overrides

  /** Returns the current server snapshot for `useSyncExternalStore`. */
  getServerSnapshot = () => this.overrides

  /** Subscribes to override changes and returns an unsubscribe callback. */
  subscribe = (callback: () => void) => {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  private emit = () => {
    for (const listener of Array.from(this.listeners)) {
      try {
        listener()
      } catch (error) {
        console.error('TranslationStore: Listener error', error)
      }
    }
  }
}

/**
 * Legacy constructor alias retained for existing theme text integrations.
 * @deprecated Use {@link TranslationStore} instead. This alias remains available
 * for backward compatibility.
 */
export const ThemeTextStore = TranslationStore
/**
 * Legacy type alias retained for existing theme text integrations.
 * @deprecated Use {@link TranslationStore} instead. This alias remains available
 * for backward compatibility.
 */
export type ThemeTextStore = TranslationStore
