export interface PageviewCoordinator {
  observeNavigation: (navigationIdentity: string) => void
  shouldFire: (navigationIdentity: string, pageId: string) => boolean
}

/**
 * Coordinate pageview deduplication across co-located runtime instances and
 * renderer remounts. A page can fire once per observed Next navigation.
 *
 * Dedupe state intentionally survives renderer unmounts. Clearing it on the
 * last unmount makes an ordinary same-URL remount indistinguishable from a
 * real navigation and can double-count. A different observed navigation
 * identity is the only signal that starts a fresh pageview set; a hard reload
 * naturally creates a new module instance.
 */
export function createPageviewCoordinator(): PageviewCoordinator {
  let currentNavigationIdentity: string | null = null
  let firedPageIds = new Set<string>()

  let observeNavigation = (navigationIdentity: string) => {
    if (currentNavigationIdentity === navigationIdentity) {
      return
    }
    currentNavigationIdentity = navigationIdentity
    firedPageIds.clear()
  }

  return {
    observeNavigation,
    shouldFire(navigationIdentity, pageId) {
      observeNavigation(navigationIdentity)
      if (firedPageIds.has(pageId)) {
        return false
      }
      firedPageIds.add(pageId)
      return true
    },
  }
}
