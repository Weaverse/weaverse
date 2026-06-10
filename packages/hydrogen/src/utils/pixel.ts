// One pixel per page per navigation. Nested compositions mount multiple
// Weaverse instances on one URL; both would otherwise double-count the
// same impression.
//
// Two mechanisms cooperate:
//
// 1. Key TRANSITIONS (not novelty): `location.key` is stable per history
//    entry, so a back/forward POP restores the entry's ORIGINAL key. We
//    remember only the current key and reset on change — any navigation
//    between Weaverse pages counts again.
// 2. Instance lifetime: navigating to a route WITHOUT a Weaverse instance
//    (cart, search, account) never calls into this module, so the stored
//    key would still match on Back and wrongly suppress the revisit. When
//    the last registered instance unmounts, forget the navigation state.
//
// Known tradeoff: React StrictMode's dev-only mount→cleanup→mount cycle
// resets the state and double-fires in development — parity with the
// pre-dedupe behavior; production semantics are unaffected.
let currentNavigationKey: string | null = null
let firedPageIds = new Set<string>()
let mountedInstances = 0

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
 * Track the mounted Weaverse instance; returns the unmount cleanup.
 * Call before `shouldFirePixel` so the navigation state's lifetime is
 * bounded by "at least one Weaverse instance is on screen".
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
