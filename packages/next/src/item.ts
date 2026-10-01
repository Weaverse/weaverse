import type { ElementData } from '@weaverse/react'
import { Weaverse, WeaverseItemStore } from '@weaverse/react'
import type { WeaverseNextRuntime } from './runtime'
import type {
  WeaverseNextComponentData,
  WeaverseNextTranslationItemEntry,
} from './types'
import { generateDataFromSchema } from './utils'

/**
 * Spread a serialized item's nested `data` field into top-level props — the
 * shape the shared `@weaverse/react` renderer expects. Top-level fields win
 * over nested ones, matching the constructor's original
 * `Object.assign(store, schemaDefaults, data, rest)` merge order. Flat payloads
 * with no nested `data` pass through unchanged.
 */
function flattenItemData(update: Omit<ElementData, 'id' | 'type'>) {
  let { data, ...rest } = update
  if (!(data && typeof data === 'object' && !Array.isArray(data))) {
    return rest
  }
  return { ...data, ...rest }
}

/**
 * While set, item `setData()` queues its subscriber notification here instead
 * of emitting synchronously. `createWeaverseNextRuntime()` runs during React
 * render (the renderer's `useMemo`), and constructing a runtime makes core's
 * `initProject()` call `setData()` on reused item instances (locale/client
 * navigation) — emitting to `useSyncExternalStore` subscribers mid-render
 * trips React's setState-in-render warning. Data is still applied
 * synchronously; only the emit is deferred.
 */
let deferredItemUpdates: Set<WeaverseNextItem> | null = null

/**
 * Run `create` with item update emissions deferred, returning its result and
 * the items whose `setData()` fired meanwhile. The caller is responsible for
 * calling `triggerUpdate()` on them once React has committed.
 */
export function collectDeferredItemUpdates<T>(
  create: () => T
): [T, WeaverseNextItem[]] {
  let previousQueue = deferredItemUpdates
  let queue = new Set<WeaverseNextItem>()
  deferredItemUpdates = queue
  try {
    return [create(), [...queue]]
  } finally {
    deferredItemUpdates = previousQueue
  }
}

/**
 * Item store that flattens the serialized item's nested `data` field onto the
 * store and seeds schema defaults — same shape Hydrogen produces, so the
 * shared `@weaverse/react` renderer can spread props at the top level.
 */
export class WeaverseNextItem extends WeaverseItemStore {
  /** Browser runtime that owns this item store. */
  declare weaverse: WeaverseNextRuntime

  /**
   * Cached merged snapshot (base `_store` + translations). Reset whenever the
   * `_store` ref or the item's translation entry ref changes, so
   * `useSyncExternalStore` sees a stable object between unrelated re-renders.
   */
  private _cachedSnapshot: ElementData | null = null
  private _snapshotStoreRef: ElementData | null = null
  private _snapshotTranslationRef: WeaverseNextTranslationItemEntry | null =
    null

  /** Create an item store from serialized component data and its runtime. */
  constructor(initialData: WeaverseNextComponentData, weaverse: Weaverse) {
    super(initialData as ElementData, weaverse)
    let schemaData = generateDataFromSchema(this.Element?.schema)
    Object.assign(this._store, schemaData, flattenItemData(initialData))
  }

  /**
   * Flatten nested `data` on updates exactly like the constructor does. Core's
   * `initProject()` calls `setData(item)` when a new runtime serves a page
   * whose item instances already exist (e.g. locale/client navigation), and
   * the inherited shallow merge would leave stale top-level props behind.
   * Assigning through the inherited `data` setter swaps the `_store` ref,
   * which invalidates the memoized snapshot below. The subscriber emit is
   * queued instead of fired when a render-phase deferral is active (see
   * `collectDeferredItemUpdates`).
   */
  setData = (update: Omit<ElementData, 'id' | 'type'>) => {
    this.data = flattenItemData(update)
    if (deferredItemUpdates) {
      deferredItemUpdates.add(this)
    } else {
      this.triggerUpdate()
    }
    return this.data
  }

  /**
   * Overlay item-level translations onto the base store when the runtime is in
   * translation mode. Mirrors Hydrogen's `WeaverseHydrogenItem.getSnapShot()`:
   * memoized by `_store` ref + translation entry ref so the returned object is
   * referentially stable, and a fast path that returns the base store untouched
   * when the item has no translations.
   */
  getSnapShot = (): ElementData => {
    let base = this._store
    let translations = this.weaverse.translationMap[this._id]

    // No translations → return the base store directly (fast path).
    if (!translations) {
      return base
    }

    // Reuse the cached merge while both the store and translation refs hold.
    if (
      this._cachedSnapshot &&
      this._snapshotStoreRef === base &&
      this._snapshotTranslationRef === translations
    ) {
      return this._cachedSnapshot
    }

    let merged = { ...base }
    for (let [key, entry] of Object.entries(translations)) {
      if (entry.translatedValue !== undefined) {
        merged[key] = entry.translatedValue
      }
    }

    this._cachedSnapshot = merged
    this._snapshotStoreRef = base
    this._snapshotTranslationRef = translations
    return merged
  }
}

/**
 * Register the Next item constructor globally. Idempotent: calling it more than
 * once is safe. Invoked by the renderer before it builds a Weaverse instance.
 */
export function ensureNextItemConstructor() {
  if (
    !Weaverse.ItemConstructor ||
    Weaverse.ItemConstructor === WeaverseItemStore ||
    Weaverse.ItemConstructor === WeaverseNextItem
  ) {
    Weaverse.ItemConstructor = WeaverseNextItem
  }
}
