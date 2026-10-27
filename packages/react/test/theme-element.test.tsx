import {
  THEME_ELEMENT_HIDDEN_EVENT,
  THEME_ELEMENT_HIDE_EVENT,
  THEME_ELEMENT_REVEAL_EVENT,
} from '@weaverse/schema'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  notifyThemeElementHidden,
  subscribeThemeElementRequests,
  useThemeElement,
} from '../src/theme-element'

function request(target: EventTarget, type: string, id: string) {
  target.dispatchEvent(new CustomEvent(type, { detail: { id } }))
}

describe('subscribeThemeElementRequests', () => {
  it('should_call_only_the_matching_handler_when_a_request_names_its_id', () => {
    let target = new EventTarget()
    let onReveal = vi.fn()
    let onHide = vi.fn()
    subscribeThemeElementRequests(target, 'popup', () => ({ onReveal, onHide }))

    request(target, THEME_ELEMENT_REVEAL_EVENT, 'header')
    request(target, THEME_ELEMENT_REVEAL_EVENT, 'popup')
    request(target, THEME_ELEMENT_HIDE_EVENT, 'popup')

    expect([onReveal.mock.calls.length, onHide.mock.calls.length]).toEqual([
      1, 1,
    ])
  })

  it('should_use_the_latest_handlers_when_they_change_after_subscribing', () => {
    let target = new EventTarget()
    let first = vi.fn()
    let latest = vi.fn()
    let handlers = { onReveal: first }
    subscribeThemeElementRequests(target, 'popup', () => handlers)

    handlers = { onReveal: latest }
    request(target, THEME_ELEMENT_REVEAL_EVENT, 'popup')

    expect([first.mock.calls.length, latest.mock.calls.length]).toEqual([0, 1])
  })

  it('should_stop_calling_handlers_when_unsubscribed', () => {
    let target = new EventTarget()
    let onReveal = vi.fn()
    let unsubscribe = subscribeThemeElementRequests(target, 'popup', () => ({
      onReveal,
    }))

    unsubscribe()
    request(target, THEME_ELEMENT_REVEAL_EVENT, 'popup')

    expect(onReveal).not.toHaveBeenCalled()
  })
})

describe('useThemeElement', () => {
  it('should_render_the_marker_without_touching_window_when_rendered_on_the_server', () => {
    function Header() {
      return <header {...useThemeElement({ id: 'header' })} />
    }

    let html = renderToString(<Header />)

    expect(html).toBe('<header data-wv-theme-id="header"></header>')
  })
})

describe('notifyThemeElementHidden', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should_dispatch_a_hidden_notification_with_the_id_when_a_window_exists', () => {
    let target = new EventTarget()
    vi.stubGlobal('window', target)
    let received: unknown[] = []
    target.addEventListener(THEME_ELEMENT_HIDDEN_EVENT, (event) => {
      received.push((event as CustomEvent).detail)
    })

    notifyThemeElementHidden('popup')

    expect(received).toEqual([{ id: 'popup' }])
  })
})
