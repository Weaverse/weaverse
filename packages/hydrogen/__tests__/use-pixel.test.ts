import { afterEach, describe, expect, it } from 'vitest'
import { registerPixelInstance, shouldFirePixel } from '../src/utils/pixel'

// Each mounted instance mirrors `usePixel`: register(pageId) THEN decide to
// fire. Track registrations so every test ends with zero mounted instances —
// the module then fully forgets its navigation state.
let cleanups: (() => void)[] = []
function mountInstance(navigationKey: string, pageId: string) {
  let unregister = registerPixelInstance(pageId)
  let fired = shouldFirePixel(navigationKey, pageId)
  let unmount = () => {
    unregister()
    cleanups = cleanups.filter((c) => c !== unmount)
  }
  cleanups.push(unmount)
  return { fired, unmount }
}
afterEach(() => {
  for (let cleanup of [...cleanups]) {
    cleanup()
  }
})

describe('shouldFirePixel', () => {
  it('should_fire_once_per_page_per_navigation', () => {
    // Two co-located instances of the same page must not double-count.
    let first = mountInstance('nav-1', 'page-a')
    let second = mountInstance('nav-1', 'page-a')
    expect(first.fired).toBe(true)
    expect(second.fired).toBe(false)
  })

  it('should_count_each_co_located_page_separately', () => {
    let layout = mountInstance('nav-2', 'page-layout')
    let child = mountInstance('nav-2', 'page-child')
    let childDup = mountInstance('nav-2', 'page-child')
    expect(layout.fired).toBe(true)
    expect(child.fired).toBe(true)
    expect(childDup.fired).toBe(false)
  })

  it('should_count_back_forward_revisits_between_weaverse_pages', () => {
    // location.key is stable per history entry: A → B → Back POPs to A's
    // ORIGINAL key. Each page fully unmounts before the next mounts.
    let a = mountInstance('key-a', 'page-a')
    expect(a.fired).toBe(true)
    a.unmount()
    let b = mountInstance('key-b', 'page-b')
    expect(b.fired).toBe(true)
    b.unmount()
    let aRevisit = mountInstance('key-a', 'page-a')
    let aRevisitDup = mountInstance('key-a', 'page-a')
    expect(aRevisit.fired).toBe(true)
    expect(aRevisitDup.fired).toBe(false)
  })

  it('should_count_revisits_after_detouring_through_non_weaverse_routes', () => {
    // Weaverse page A → cart (no Weaverse instance, key never observed by
    // this module) → Back to A with the SAME stored key. The page's last
    // instance unmounted, so its fired state was forgotten.
    let a = mountInstance('key-a', 'page-a')
    expect(a.fired).toBe(true)
    a.unmount()
    // ...visitor is on /cart; nothing registered...
    let aRevisit = mountInstance('key-a', 'page-a')
    expect(aRevisit.fired).toBe(true)
  })

  it('should_keep_state_while_a_nested_layout_instance_stays_mounted', () => {
    // /help/contact → /help/other: the layout's instance never unmounts,
    // so state must NOT reset on the child swap alone — the new child fires
    // via its key transition, and duplicates still dedupe.
    let layout = mountInstance('key-a', 'page-layout')
    let contact = mountInstance('key-a', 'page-contact')
    expect(layout.fired).toBe(true)
    expect(contact.fired).toBe(true)
    contact.unmount()
    let other = mountInstance('key-b', 'page-other')
    let otherDup = mountInstance('key-b', 'page-other')
    expect(other.fired).toBe(true)
    expect(otherDup.fired).toBe(false)
  })

  it('should_count_a_revisit_after_a_detour_while_a_layout_instance_persists', () => {
    // The regression: a persistent layout-level Weaverse instance never
    // unmounts, so the old single global mounted-instance counter never hit
    // zero and never reset. A Back to the SAME history entry (key-a
    // unchanged) then wrongly suppressed the page's revisit pixel.
    let layout = mountInstance('key-a', 'page-layout')
    let a = mountInstance('key-a', 'page-a')
    expect(layout.fired).toBe(true)
    expect(a.fired).toBe(true)
    // Navigate A → /cart: the page instance unmounts, the layout persists.
    a.unmount()
    // /cart has no Weaverse instance; nothing registered, key unobserved.
    // Back → /a restores key-a while the layout is still mounted.
    let aRevisit = mountInstance('key-a', 'page-a')
    expect(aRevisit.fired).toBe(true)
    // A co-located duplicate on the revisit still dedupes.
    let aRevisitDup = mountInstance('key-a', 'page-a')
    expect(aRevisitDup.fired).toBe(false)
  })
})
