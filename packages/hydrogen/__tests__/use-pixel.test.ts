import { afterEach, describe, expect, it } from 'vitest'
import { registerPixelInstance, shouldFirePixel } from '../src/utils/pixel'

// Track registrations so each test ends with zero mounted instances —
// the module then forgets its navigation state (the unmount-reset path).
let cleanups: (() => void)[] = []
function mountInstance() {
  let unregister = registerPixelInstance()
  let wrapped = () => {
    unregister()
    cleanups = cleanups.filter((c) => c !== wrapped)
  }
  cleanups.push(wrapped)
  return wrapped
}
afterEach(() => {
  for (let cleanup of [...cleanups]) {
    cleanup()
  }
})

describe('shouldFirePixel', () => {
  it('should_fire_once_per_page_per_navigation', () => {
    mountInstance()
    expect(shouldFirePixel('nav-1', 'page-a')).toBe(true)
    // Second co-located instance of the same page must not double-count.
    expect(shouldFirePixel('nav-1', 'page-a')).toBe(false)
  })

  it('should_count_each_co_located_page_separately', () => {
    mountInstance()
    mountInstance()
    expect(shouldFirePixel('nav-2', 'page-layout')).toBe(true)
    expect(shouldFirePixel('nav-2', 'page-child')).toBe(true)
    expect(shouldFirePixel('nav-2', 'page-child')).toBe(false)
  })

  it('should_count_back_forward_revisits_between_weaverse_pages', () => {
    // location.key is stable per history entry: A → B → Back POPs to A's
    // ORIGINAL key. The key transition (not novelty) marks the navigation.
    let unmountA = mountInstance()
    expect(shouldFirePixel('key-a', 'page-a')).toBe(true)
    unmountA()
    let unmountB = mountInstance()
    expect(shouldFirePixel('key-b', 'page-b')).toBe(true)
    unmountB()
    mountInstance()
    expect(shouldFirePixel('key-a', 'page-a')).toBe(true)
    expect(shouldFirePixel('key-a', 'page-a')).toBe(false)
  })

  it('should_count_revisits_after_detouring_through_non_weaverse_routes', () => {
    // Weaverse page A → cart (no Weaverse instance, key never observed by
    // this module) → Back to A with the SAME stored key. The unmount of
    // the last instance must forget the navigation state.
    let unmountA = mountInstance()
    expect(shouldFirePixel('key-a', 'page-a')).toBe(true)
    unmountA()
    // ...visitor is on /cart; nothing registered...
    mountInstance()
    expect(shouldFirePixel('key-a', 'page-a')).toBe(true)
  })

  it('should_keep_state_while_a_nested_layout_instance_stays_mounted', () => {
    // /help/contact → /help/other: the layout's instance never unmounts,
    // so state must NOT reset on the child swap alone — the new child
    // fires via its key transition, and duplicates still dedupe.
    mountInstance()
    let unmountChild = mountInstance()
    expect(shouldFirePixel('key-a', 'page-layout')).toBe(true)
    expect(shouldFirePixel('key-a', 'page-contact')).toBe(true)
    unmountChild()
    mountInstance()
    expect(shouldFirePixel('key-b', 'page-other')).toBe(true)
    expect(shouldFirePixel('key-b', 'page-other')).toBe(false)
  })
})
