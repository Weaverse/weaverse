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
  overrides: Record<string, string> = {}
  private listeners: Set<() => void> = new Set()

  setOverrides = (overrides: Record<string, string>) => {
    this.overrides = { ...overrides }
    this.emit()
  }

  updateOverrides = (newOverrides: Record<string, string>) => {
    this.overrides = { ...this.overrides, ...newOverrides }
    this.emit()
  }

  getSnapshot = () => this.overrides

  getServerSnapshot = () => this.overrides

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
 * @deprecated Use {@link TranslationStore} instead. Kept as a backward-compatible
 * alias and will remain exported for existing integrations.
 */
export const ThemeTextStore = TranslationStore
/**
 * @deprecated Use {@link TranslationStore} instead. Kept as a backward-compatible
 * alias and will remain exported for existing integrations.
 */
export type ThemeTextStore = TranslationStore
