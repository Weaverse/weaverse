import { describe, expect, it } from 'vitest'
import type { WeaverseHydrogenParams } from '../src/types'
import { normalizeRequestInfo } from '../src/utils/studio-request-info'

// Test fixture only exercises the requestInfo branch — the remaining
// WeaverseHydrogenParams fields are irrelevant here, so an unchecked cast
// keeps the fixture small without disabling checks at the call sites.
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
} as unknown as WeaverseHydrogenParams

describe('normalizeRequestInfo', () => {
  it('should_use_browser_location_for_design_mode_data_revalidation_requests', () => {
    let normalized = normalizeRequestInfo(baseParams, {
      pathname: '/products/blue-shirt',
      search: '?Color=Blue',
    })

    expect(normalized.requestInfo.pathname).toBe('/products/blue-shirt')
    expect(normalized.requestInfo.search).toBe('?Color=Blue')
    expect(normalized.requestInfo.queries).toEqual({ Color: 'Blue' })
  })

  it('should_replace_data_request_queries_with_browser_location_queries', () => {
    let normalized = normalizeRequestInfo(baseParams, {
      pathname: '/products/blue-shirt',
      search: '?available=true&Color=Blue',
    })

    expect(normalized.requestInfo.queries).toEqual({
      Color: 'Blue',
      available: true,
    })
  })

  it('should_normalize_live_theme_revalidation_requests_to_browser_location', () => {
    let normalized = normalizeRequestInfo(
      { ...baseParams, isDesignMode: false },
      {
        pathname: '/products/blue-shirt',
        search: '?Color=Blue',
      }
    )

    expect(normalized.requestInfo.pathname).toBe('/products/blue-shirt')
    expect(normalized.requestInfo.search).toBe('?Color=Blue')
    expect(normalized.requestInfo.queries).toEqual({ Color: 'Blue' })
  })

  it('should_return_params_unchanged_when_already_matching_browser_location', () => {
    let params = {
      ...baseParams,
      requestInfo: {
        ...baseParams.requestInfo,
        pathname: '/products/blue-shirt',
        search: '?Color=Blue',
      },
    }

    let normalized = normalizeRequestInfo(params, {
      pathname: '/products/blue-shirt',
      search: '?Color=Blue',
    })

    expect(normalized).toBe(params)
  })

  it('should_preserve_server_request_info_without_browser_location', () => {
    let normalized = normalizeRequestInfo(baseParams, undefined)

    expect(normalized.requestInfo.pathname).toBe('/_root.data')
    expect(normalized.requestInfo.search).toBe('?_routes=routes/product')
  })
})
