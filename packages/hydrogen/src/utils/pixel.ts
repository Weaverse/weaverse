// One pixel per page per navigation. A few facts shape the dedup:
//
// 1. Co-located instances: nested compositions mount multiple Weaverse
//    instances on one URL; each page is counted at most once.
// 2. The pixel FIRE effect runs once per instance mount (see `usePixel`), so
//    an instance never re-fires on its own — a navigation is a fresh mount.
// 3. `location.key` is stable per history entry. A back/forward POP restores
//    the entry's ORIGINAL key, and an in-place remount on the same entry
//    (e.g. the `data={null}` suppress/restore path in WeaverseHydrogenRoot)
//    keeps that same key. A REAL navigation is therefore a key CHANGE.
//
// `firedPageIds` is the set of pages already counted for the current
// navigation. It is forgotten in two ways:
//   - On a key TRANSITION reported by ANY mounted instance via
//     `observeNavigation` (driven by a per-navigation effect). A persistent
//     layout-level instance keeps observing across a detour through a
//     non-Weaverse route (cart, search, account), so a Back to the original
//     entry is recognised as a new navigation and the page re-counts — while
//     an in-place suppress/restore (no key change) does NOT re-count.
//   - When the LAST instance unmounts (`registerPixelInstance`), covering the
//     detour case where no instance survives to observe the key round-trip
//     (a page with no persistent layout going to /cart and back).
//
// Known tradeoff: React StrictMode's dev-only mount→cleanup→mount cycle
// resets state and double-fires in development — parity with the pre-dedupe
// behavior; production semantics are unaffected.
let currentNavigationKey: string | null = null
let firedPageIds = new Set<string>()
let mountedInstances = 0

/**
 * Record the navigation key seen by a mounted instance. A change of key is a
 * real navigation and forgets the previous navigation's fired pages; an
 * unchanged key (an in-place remount / suppress-restore on the same history
 * entry) leaves them intact, so the page is not double-counted.
 */
export function observeNavigation(navigationKey: string): void {
  if (navigationKey !== currentNavigationKey) {
    currentNavigationKey = navigationKey
    firedPageIds.clear()
  }
}

export function shouldFirePixel(
  navigationKey: string,
  pageId: string
): boolean {
  observeNavigation(navigationKey)
  if (firedPageIds.has(pageId)) {
    return false
  }
  firedPageIds.add(pageId)
  return true
}

/**
 * Track a mounted Weaverse instance; returns the unmount cleanup. When the
 * last instance unmounts, the navigation state is forgotten so a Back that
 * restores the same history entry counts again even if no instance survived
 * to observe the detour.
 */
export function registerPixelInstance(): () => void {
  mountedInstances += 1
  return () => {
    mountedInstances -= 1
    if (mountedInstances === 0) {
      currentNavigationKey = null
      firedPageIds.clear()
    }
  }
}
