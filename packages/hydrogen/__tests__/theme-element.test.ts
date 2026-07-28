import { describe, expect, it, vi } from 'vitest'
import {
  createThemeElementRevealEvent,
  getThemeElementProps,
  subscribeThemeElementReveal,
} from '../src/hooks/use-theme-element'

describe('theme element contract', () => {
  it('should_return_dom_marker_when_id_is_provided', () => {
    let props = getThemeElementProps('header')

    expect(props).toEqual({ 'data-wv-theme-id': 'header' })
  })

  it('should_invoke_reveal_when_event_id_matches', () => {
    let target = new EventTarget()
    let onReveal = vi.fn()
    subscribeThemeElementReveal('header', onReveal, target)

    target.dispatchEvent(createThemeElementRevealEvent('header'))

    expect(onReveal).toHaveBeenCalledTimes(1)
  })

  it('should_ignore_reveal_when_event_id_differs', () => {
    let target = new EventTarget()
    let onReveal = vi.fn()
    subscribeThemeElementReveal('header', onReveal, target)

    target.dispatchEvent(createThemeElementRevealEvent('footer'))

    expect(onReveal).not.toHaveBeenCalled()
  })

  it('should_stop_revealing_when_unsubscribed', () => {
    let target = new EventTarget()
    let onReveal = vi.fn()
    let unsubscribe = subscribeThemeElementReveal('header', onReveal, target)
    unsubscribe()

    target.dispatchEvent(createThemeElementRevealEvent('header'))

    expect(onReveal).not.toHaveBeenCalled()
  })
})
