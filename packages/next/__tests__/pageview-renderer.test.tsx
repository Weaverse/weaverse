import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

let mocks = vi.hoisted(() => ({
  usePageview: vi.fn(),
}))

vi.mock('../src/use-pageview', () => ({
  usePageview: mocks.usePageview,
}))

import { WeaverseNextRenderer, WeaverseNextRootProvider } from '../src/index'

describe('WeaverseNextRenderer pageview integration', () => {
  afterEach(() => {
    mocks.usePageview.mockClear()
  })

  it('should_keep_pageview_tracker_inside_an_sdk_owned_suspense_boundary', () => {
    // Arrange
    let renderer = <WeaverseNextRenderer data={null} />

    // Act
    let html = renderToString(renderer)

    // Assert
    expect(mocks.usePageview).toHaveBeenCalledWith(null)
    expect(html).toBe('<!--$--><!--/$-->')
  })

  it('should_observe_navigation_from_persistent_root_without_a_route_renderer', () => {
    // Arrange
    let root = (
      <WeaverseNextRootProvider>
        <main>Cart</main>
      </WeaverseNextRootProvider>
    )

    // Act
    let html = renderToString(root)

    // Assert
    expect(mocks.usePageview).toHaveBeenCalledOnce()
    expect(mocks.usePageview).toHaveBeenCalledWith(null)
    expect(html).toContain('<main>Cart</main>')
  })
})
