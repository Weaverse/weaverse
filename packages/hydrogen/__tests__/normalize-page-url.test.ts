import { describe, expect, it } from 'vitest'
import { normalizePageUrl } from '../src/utils/normalize-page-url'

describe('normalizePageUrl', () => {
  it('should_strip_tracking_params_so_equivalent_urls_share_one_cache_key', () => {
    const plain = normalizePageUrl('https://shop.com/products/shirt')
    const tracked = normalizePageUrl(
      'https://shop.com/products/shirt?utm_source=fb&utm_campaign=x&fbclid=abc123&gclid=z'
    )

    expect(tracked).toBe(plain)
    expect(plain).toBe('https://shop.com/products/shirt')
  })

  it('should_keep_weaverse_control_params_and_sort_them', () => {
    const normalized = normalizePageUrl(
      'https://shop.com/?weaverseHost=https%3A%2F%2Fstudio.weaverse.io&utm_source=fb&isDesignMode=true&__revisionId=rev-1'
    )

    expect(normalized).toBe(
      'https://shop.com/?__revisionId=rev-1&isDesignMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io'
    )
  })

  it('should_produce_identical_keys_regardless_of_param_order', () => {
    const a = normalizePageUrl(
      'https://shop.com/help?isDesignMode=true&__revisionId=r1'
    )
    const b = normalizePageUrl(
      'https://shop.com/help?__revisionId=r1&isDesignMode=true'
    )

    expect(a).toBe(b)
  })

  it('should_preserve_pathname_used_for_handle_resolution', () => {
    expect(normalizePageUrl('https://shop.com/help/contact?sort=asc')).toBe(
      'https://shop.com/help/contact'
    )
  })

  it('should_strip_the_react_router_data_suffix_so_client_nav_shares_the_document_key', () => {
    expect(normalizePageUrl('https://shop.com/products/shirt.data')).toBe(
      'https://shop.com/products/shirt'
    )
    expect(normalizePageUrl('https://shop.com/.data')).toBe('https://shop.com/')
  })

  it('should_keep_data_strip_independent_of_kept_control_params', () => {
    expect(
      normalizePageUrl(
        'https://shop.com/products/shirt.data?isDesignMode=true&utm_source=fb'
      )
    ).toBe('https://shop.com/products/shirt?isDesignMode=true')
  })

  it('should_return_input_unchanged_when_not_an_absolute_url', () => {
    expect(normalizePageUrl('/relative/path?x=1')).toBe('/relative/path?x=1')
  })
})
