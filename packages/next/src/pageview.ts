interface PageShowEvent {
  readonly persisted: boolean
}

/**
 * Coordinate pageview deduplication across co-located runtime instances and
 * renderer remounts. A page can fire once per observed Next navigation.
 *
 * Dedupe state intentionally survives renderer unmounts. Clearing it on the
 * last unmount makes an ordinary same-URL remount indistinguishable from a
 * real navigation and can double-count. A different observed navigation
 * identity or persisted `pageshow` event starts a fresh pageview set; a hard
 * reload naturally creates a new module instance.
 */
export function createPageviewCoordinator() {
  let currentNavigationIdentity: string | null = null
  let firedPageIds = new Set<string>()
  let currentPageShowEvent: PageShowEvent | null = null

  let observeNavigation = (navigationIdentity: string) => {
    if (currentNavigationIdentity === navigationIdentity) {
      return
    }
    currentNavigationIdentity = navigationIdentity
    firedPageIds.clear()
  }

  let observePageShow = (event: PageShowEvent) => {
    if (!event.persisted || currentPageShowEvent === event) {
      return
    }
    currentPageShowEvent = event
    firedPageIds.clear()
  }

  return {
    observeNavigation,
    observePageShow,
    shouldFire(navigationIdentity: string, pageId: string) {
      observeNavigation(navigationIdentity)
      if (firedPageIds.has(pageId)) {
        return false
      }
      firedPageIds.add(pageId)
      return true
    },
  }
}
