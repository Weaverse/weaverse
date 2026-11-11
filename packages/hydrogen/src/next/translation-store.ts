/**
 * Minimal mutable store for design-mode static text overrides.
 *
 * `useSyncExternalStore`-compatible. Passed into {@link TranslationProvider}
 * (from `./translation-context`) which subscribes internally and layers
 * overrides on top of `merchantOverrides`/`staticContent`. The Studio bridge
 * calls `updateOverrides()` via `runtime.internal.translationStore` (also
 * exposed as the deprecated `runtime.internal.themeTextStore` alias) so live
 * static-text edits reach the runtime — identical surface to Hydrogen's store,
 * so Builder's existing static-text RPC works with `@weaverse/next` unchanged.
 *
 * Shape: flat `Record<string, string>` — dot-notation keys map to values
 * (e.g. "cart.title" → "Shopping Cart").
 */
export class TranslationStore {
  /** Current flat translation overrides keyed by dot path. */
  overrides: Record<string, string> = {}
  private readonly listeners: Set<() => void> = new Set()

  /** Replace every override and notify subscribers. */
  setOverrides = (overrides: Record<string, string>) => {
    this.overrides = { ...overrides }
    this.emit()
  }

  /** Merge changed overrides into the current values and notify subscribers. */
  updateOverrides = (newOverrides: Record<string, string>) => {
    this.overrides = { ...this.overrides, ...newOverrides }
    this.emit()
  }

  /** Return the current client-side override snapshot. */
  getSnapshot = () => this.overrides

  /** Return the override snapshot used during server rendering. */
  getServerSnapshot = () => this.overrides

  /** Subscribe to override changes and return an unsubscribe function. */
  subscribe = (callback: () => void) => {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  private readonly emit = () => {
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
 * Legacy constructor name for {@link TranslationStore}.
 *
 * @deprecated Replace `ThemeTextStore` with {@link TranslationStore}; the
 * store contract and runtime behavior are unchanged.
 */
export const ThemeTextStore = TranslationStore
/**
 * Legacy type name for {@link TranslationStore}.
 *
 * @deprecated Import {@link TranslationStore} instead.
 */
export type ThemeTextStore = TranslationStore
