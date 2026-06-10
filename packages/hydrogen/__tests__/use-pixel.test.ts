import { describe, expect, it } from 'vitest'
import { shouldFirePixel } from '../src/utils/pixel'

describe('shouldFirePixel', () => {
  it('should_fire_once_per_page_per_navigation_entry', () => {
    expect(shouldFirePixel('nav-1', 'page-a')).toBe(true)
    // Second co-located instance of the same page (or a StrictMode
    // re-mount) must not double-count the impression.
    expect(shouldFirePixel('nav-1', 'page-a')).toBe(false)
  })

  it('should_count_each_co_located_page_separately', () => {
    expect(shouldFirePixel('nav-2', 'page-layout')).toBe(true)
    expect(shouldFirePixel('nav-2', 'page-child')).toBe(true)
  })

  it('should_count_revisits_with_a_fresh_navigation_key', () => {
    expect(shouldFirePixel('nav-3', 'page-a')).toBe(true)
    // Back/forward navigation produces a new location.key — revisits count.
    expect(shouldFirePixel('nav-4', 'page-a')).toBe(true)
  })
})
