import type { WeaverseNextComponentData } from './types'

export const DEFAULT_REVALIDATE_ENDPOINT = '/api/weaverse/revalidate'

/**
 * Minimal runtime surface the in-place apply needs. Structural (not the
 * concrete `WeaverseNextRuntime` class) so unit tests can drive it with a
 * plain mock.
 */
export interface RevalidateItemRuntimeLike {
  itemInstances: Map<
    string,
    {
      setData: (update: Record<string, unknown>) => unknown
    }
  >
}

/**
 * Studio per-item loader revalidation: POST the unsaved draft item to the
 * app's revalidate route (see `createWeaverseNextRevalidateHandler`) and apply
 * the returned `loaderData` to the live item instance in place.
 *
 * No `router.refresh()` is involved, so the RSC tree is never re-applied — no
 * page remount, no scroll reset, and the draft payload never touches the URL.
 *
 * Throws on any failure (missing route, non-OK response, unknown item) so the
 * Builder Studio bridge can detect the miss and fall back to its legacy
 * refresh-based revalidation for this window.
 */
export async function revalidateWeaverseNextItem(
  runtime: RevalidateItemRuntimeLike,
  draftItem: WeaverseNextComponentData,
  endpoint: string = DEFAULT_REVALIDATE_ENDPOINT
): Promise<void> {
  let instance = runtime.itemInstances.get(draftItem.id)
  if (!instance) {
    throw new Error(
      `[weaverse-next] No live item instance for "${draftItem.id}".`
    )
  }

  let response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draftItem }),
  })
  if (!response.ok) {
    throw new Error(
      `[weaverse-next] Revalidate endpoint responded ${response.status}.`
    )
  }

  let { loaderData } = (await response.json()) as { loaderData?: unknown }
  // The item's settings were already mutated by the Studio edit; only the
  // loader payload needs applying. `setData` merges and notifies subscribers,
  // and the new `loaderData` identity is what Builder's revalidation poll
  // observes for completion.
  instance.setData({ loaderData: loaderData ?? null })
}
