import type { WeaverseHydrogenParams } from '../types'
import type { WeaverseHydrogen } from '../WeaverseHydrogenRoot'

/**
 * Apply a fresh loader payload to a reused Weaverse instance.
 *
 * With requestInfo normalized to the browser URL, same-URL revalidations
 * (cart mutations, `useRevalidator()`, locale-neutral re-fetches) reuse the
 * cached `window.__weaverses[pageId]` instance instead of constructing a new
 * one — which preserves section state, but would silently drop the fresh
 * `data`/`dataContext` the loaders just returned. Sync them here.
 *
 * Design mode is excluded by the caller: Studio owns the instance data there
 * (unsaved drafts must not be clobbered) and applies updates via
 * `refreshStudio` instead.
 *
 * Change detection uses JSON comparison — loader payloads are
 * wire-serialized, so key order is stable between runs; a false mismatch
 * only costs one extra re-render.
 */
export function syncReusedInstance(
  weaverse: WeaverseHydrogen,
  params: WeaverseHydrogenParams
) {
  weaverse.requestInfo = params.requestInfo
  weaverse.internal = params.internal

  let dataChanged =
    JSON.stringify(weaverse.data) !== JSON.stringify(params.data)
  let contextChanged =
    JSON.stringify(weaverse.dataContext ?? null) !==
    JSON.stringify(params.dataContext ?? null)

  if (contextChanged) {
    // Assign before notifying any item store: components resolve data
    // connectors against `weaverse.dataContext` at render time, so the
    // fresh context must be in place when re-renders flush.
    weaverse.dataContext = params.dataContext ?? null
  }
  if (dataChanged) {
    // State-preserving: existing item stores receive `setData` (and emit),
    // missing ones are created — no full instance teardown.
    weaverse.setProjectData(params.data)
  } else if (contextChanged) {
    // Context-only change: memoized item components subscribe to their item
    // store snapshot, and snapshot identity follows the `_store` reference —
    // a bare `triggerUpdate()` would notify with an identical snapshot and
    // `useSyncExternalStore` would skip the re-render. `setData({})` swaps
    // the store reference so connectors re-resolve against the new context.
    for (const { id } of params.data?.items || []) {
      weaverse.itemInstances.get(id)?.setData({})
    }
  }
  if (dataChanged || contextChanged) {
    weaverse.triggerUpdate()
  }
}
