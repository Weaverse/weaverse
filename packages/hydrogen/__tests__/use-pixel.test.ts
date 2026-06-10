import { describe, expect, it } from 'vitest'
import { shouldFirePixel } from '../src/utils/pixel'

describe('shouldFirePixel', () => {
  it('should_fire_once_per_page_per_navigation', () => {
    expect(shouldFirePixel('nav-1', 'page-a')).toBe(true)
    // Second co-located instance of the same page (or a StrictMode
    // re-mount) must not double-count the impression.
    expect(shouldFirePixel('nav-1', 'page-a')).toBe(false)
  })

  it('should_count_each_co_located_page_separately', () => {
    expect(shouldFirePixel('nav-2', 'page-layout')).toBe(true)
    expect(shouldFirePixel('nav-2', 'page-child')).toBe(true)
    expect(shouldFirePixel('nav-2', 'page-child')).toBe(false)
  })

  it('should_count_back_forward_revisits_that_restore_the_original_key', () => {
    // location.key is stable per history entry: visiting A, pushing to B,
    // then pressing Back POPs to A's ORIGINAL key. The key transition (not
    // key novelty) is what marks a new navigation.
    expect(shouldFirePixel('key-a', 'page-a')).toBe(true)
    expect(shouldFirePixel('key-b', 'page-b')).toBe(true)
    expect(shouldFirePixel('key-a', 'page-a')).toBe(true)
    // Within the restored entry, duplicates still dedupe.
    expect(shouldFirePixel('key-a', 'page-a')).toBe(false)
  })
})
