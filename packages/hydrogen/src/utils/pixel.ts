// One pixel per page per navigation. Two facts shape the dedup:
//
// 1. Co-located instances: nested compositions mount multiple Weaverse
//    instances of the same page on one URL; only the first should count.
// 2. The pixel effect runs once per instance mount (see `usePixel`), so a
//    given instance never re-fires — a navigation is always a fresh mount.
//
// `firedPageIds` is scoped to the current navigation key and reset on a key
// TRANSITION. `mountCounts` tracks how many instances of each pageId are
// currently mounted; when the LAST instance of a pageId unmounts we forget
// its fired state. That second mechanism is what makes a detour-and-Back to
// the SAME history entry (`location.key` restored unchanged) count the
// revisit: without the per-page refcount, a persistent layout-level Weaverse
// instance would keep the navigation state alive across the detour and
// wrongly suppress the page's revisit pixel.
//
// Known tradeoff: React StrictMode's dev-only mount→cleanup→mount cycle
// double-fires in development — parity with the pre-dedupe behavior;
// production semantics are unaffected.
let currentNavigationKey: string | null = null
let firedPageIds = new Set<string>()
let mountCounts = new Map<string, number>()

export function shouldFirePixel(
  navigationKey: string,
  pageId: string
): boolean {
  if (navigationKey !== currentNavigationKey) {
    currentNavigationKey = navigationKey
    firedPageIds.clear()
  }
  if (firedPageIds.has(pageId)) {
    return false
  }
  firedPageIds.add(pageId)
  return true
}

/**
 * Track a mounted Weaverse instance for `pageId`; returns the unmount
 * cleanup. Call before `shouldFirePixel` so the navigation state's lifetime
 * is bounded by "at least one instance of this page is on screen". When the
 * last instance of a pageId unmounts, its fired state is dropped so a Back
 * navigation that restores the same history entry re-counts it — even while
 * another Weaverse instance stays mounted across the detour.
 */
export function registerPixelInstance(pageId: string): () => void {
  mountCounts.set(pageId, (mountCounts.get(pageId) ?? 0) + 1)
  return () => {
    let next = (mountCounts.get(pageId) ?? 1) - 1
    if (next > 0) {
      mountCounts.set(pageId, next)
      return
    }
    mountCounts.delete(pageId)
    firedPageIds.delete(pageId)
  }
}
