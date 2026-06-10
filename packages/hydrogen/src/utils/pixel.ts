// One pixel per page per navigation. Nested compositions mount multiple
// Weaverse instances on one URL (and React StrictMode re-runs mount
// effects); both would otherwise double-count the same impression.
//
// `location.key` is stable per history entry, so a back/forward POP
// restores the entry's ORIGINAL key — a persistent "seen keys" set would
// suppress those revisits. Instead, remember only the current key and
// reset on every key change: any navigation (push, replace, or pop)
// transitions the key and counts again, while re-mounts and co-located
// duplicates within one navigation dedupe.
let currentNavigationKey: string | null = null
let firedPageIds = new Set<string>()

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
