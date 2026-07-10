import type { ElementData } from '@weaverse/react'
import { Weaverse, WeaverseItemStore } from '@weaverse/react'
import type { WeaverseNextRuntime } from './runtime'
import type {
  WeaverseNextComponentData,
  WeaverseNextTranslationItemEntry,
} from './types'
import { generateDataFromSchema } from './utils'

/**
 * Item store that flattens the serialized item's nested `data` field onto the
 * store and seeds schema defaults — same shape Hydrogen produces, so the
 * shared `@weaverse/react` renderer can spread props at the top level.
 */
export class WeaverseNextItem extends WeaverseItemStore {
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

  constructor(initialData: WeaverseNextComponentData, weaverse: Weaverse) {
    super(initialData as ElementData, weaverse)
    let { data, ...rest } = initialData
    let schemaData = generateDataFromSchema(this.Element?.schema)
    Object.assign(this._store, schemaData, data, rest)
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
