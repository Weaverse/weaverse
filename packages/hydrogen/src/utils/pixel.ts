// One pixel per page per navigation entry. Nested compositions mount
// multiple Weaverse instances on one URL (and React StrictMode re-runs
// mount effects); both would otherwise double-count the same impression.
// Back/forward navigation gets a fresh `location.key`, so revisits count.
let firedPixels = new Set<string>()

export function shouldFirePixel(
  navigationKey: string,
  pageId: string
): boolean {
  let key = `${navigationKey}:${pageId}`
  if (firedPixels.has(key)) {
    return false
  }
  firedPixels.add(key)
  return true
}
