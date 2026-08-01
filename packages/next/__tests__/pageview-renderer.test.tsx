import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

let mocks = vi.hoisted(() => ({
  usePageview: vi.fn(),
}))

vi.mock('../src/use-pageview', () => ({
  usePageview: mocks.usePageview,
}))

import { WeaverseNextRenderer } from '../src/renderer'

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
})
