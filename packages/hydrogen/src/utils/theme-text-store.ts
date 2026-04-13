/**
 * Minimal mutable store for design-mode static text overrides.
 *
 * useSyncExternalStore-compatible. Passed into ThemeTextProvider which
 * subscribes internally and merges overrides into merchantOverrides.
 * The studio bridge calls updateOverrides() via weaverse.internal.themeTextStore.
 *
 * Shape: flat Record<string, string> — dot-notation keys map to values
 * (e.g. "cart.title" → "Shopping Cart").
 */
export class ThemeTextStore {
  overrides: Record<string, string> = {}
  private listeners: Set<() => void> = new Set()

  updateOverrides = (newOverrides: Record<string, string>) => {
    console.log('🚀 ~ ThemeTextStore ~ listeners:', this.listeners)

    console.log('🚀 ~ ThemeTextStore ~ newOverrides:', newOverrides)
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
        console.error('ThemeTextStore: Listener error', error)
      }
    }
  }
}
