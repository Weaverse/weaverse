import { describe, expect, it } from 'vitest'
import { normalizeDesignModeRequestInfo } from '../src/utils/studio-request-info'

const baseParams = {
  data: { id: 'page-1', name: 'Product', rootId: 'root', items: [] },
  dataContext: {},
  internal: { pageAssignment: { type: 'PRODUCT' }, project: {} },
  isDesignMode: true,
  pageId: 'page-1',
  projectId: 'project-1',
  requestInfo: {
    i18n: { country: 'US', language: 'EN' },
    pathname: '/_root.data',
    queries: {},
    search: '?_routes=routes/product',
  },
  weaverseApiBase: 'https://studio.weaverse.io',
  weaverseApiKey: 'key',
  weaverseHost: 'https://studio.weaverse.io',
  weaverseVersion: '5.14.0',
} as any

describe('normalizeDesignModeRequestInfo', () => {
  it('should_use_browser_location_for_design_mode_data_revalidation_requests', () => {
    let normalized = normalizeDesignModeRequestInfo(baseParams, {
      pathname: '/products/blue-shirt',
      search: '?Color=Blue',
    })

    expect(normalized.requestInfo.pathname).toBe('/products/blue-shirt')
    expect(normalized.requestInfo.search).toBe('?Color=Blue')
    expect(normalized.requestInfo.queries).toEqual({ Color: 'Blue' })
  })

  it('should_replace_data_request_queries_with_browser_location_queries', () => {
    let normalized = normalizeDesignModeRequestInfo(baseParams, {
      pathname: '/products/blue-shirt',
      search: '?available=true&Color=Blue',
    })

    expect(normalized.requestInfo.queries).toEqual({
      Color: 'Blue',
      available: true,
    })
  })

  it('should_preserve_server_request_info_outside_design_mode', () => {
    let normalized = normalizeDesignModeRequestInfo(
      { ...baseParams, isDesignMode: false },
      {
        pathname: '/products/blue-shirt',
        search: '?Color=Blue',
      }
    )

    expect(normalized.requestInfo.pathname).toBe('/_root.data')
    expect(normalized.requestInfo.search).toBe('?_routes=routes/product')
  })
})
