import type { Metadata } from 'next'
import { describe, expect, it, vi } from 'vitest'
import { createSchema } from '../src/index'
import {
  createWeaverseNextServerClient,
  formatWeaverseNextSeoMetadata,
  getWeaverseNextConfigs,
  getWeaverseNextSeoMetadata,
  normalizeNextPageUrl,
  resolveRequestUrl,
} from '../src/server'
import type {
  WeaverseNextComponentLoaderArgs,
  WeaverseNextComponentProps,
} from '../src/types'

// ─── Helpers ──────────────────────────────────────────────────────────

function jsonResponse(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: async () => data,
  } as unknown as Response
}

/** A `fetch` double that records calls and returns a queued payload. */
function makeFetch(payload: unknown, { ok = true, status = 200 } = {}) {
  return vi.fn(async () =>
    jsonResponse(payload, ok, status)
  ) as unknown as typeof fetch & { mock: { calls: unknown[][] } }
}

/**
 * A `fetch` double that picks its payload by matching a URL fragment, so
 * parallel calls (project configs + translations) can return different data.
 * A URL with no matching entry rejects, standing in for an API failure.
 */
function makeRoutedFetch(routes: Record<string, unknown>) {
  return vi.fn((url: string) => {
    let match = Object.keys(routes).find((fragment) => url.includes(fragment))
    if (!match) {
      throw new Error(`No route for ${url}`)
    }
    return Promise.resolve(jsonResponse(routes[match]))
  }) as unknown as typeof fetch & { mock: { calls: [string, RequestInit][] } }
}

const Hero = (props: WeaverseNextComponentProps) => (
  <section>{props.heading as string}</section>
)
Hero.displayName = 'Hero'
const heroComponent = {
  default: Hero,
  schema: createSchema({ type: 'hero', title: 'Hero' }),
}

function makePagePayload() {
  return {
    page: {
      id: 'page-1',
      rootId: 'item-root',
      items: [{ id: 'item-root', type: 'hero', data: { heading: 'Hi' } }],
    },
    project: { id: 'project-record', name: 'Shop', weaverseShopId: 'shop-1' },
    pageAssignment: {
      projectId: 'proj-123',
      type: 'INDEX',
      locale: '',
      handle: '',
    },
  }
}

// ─── 1. projectId resolution priority ─────────────────────────────────

describe('createWeaverseNextServerClient projectId resolution', () => {
  it('should_prefer_query_param_over_function_string_and_env', async () => {
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: () => 'from-function',
      env: { WEAVERSE_PROJECT_ID: 'from-env' },
      requestContext: {
        searchParams: new URLSearchParams('weaverseProjectId=from-query'),
      },
    })
    expect(await client.resolveProjectId()).toBe('from-query')
    expect(client.projectId).toBe('from-query')
  })

  it('should_prefer_function_over_string_and_env_and_support_async', async () => {
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: async () => 'from-async-function',
      env: { WEAVERSE_PROJECT_ID: 'from-env' },
    })
    expect(await client.resolveProjectId()).toBe('from-async-function')
  })

  it('should_use_static_string_when_no_query_or_function', async () => {
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'static-id',
      env: { WEAVERSE_PROJECT_ID: 'from-env' },
    })
    expect(await client.resolveProjectId()).toBe('static-id')
    expect(client.projectId).toBe('static-id')
  })

  it('should_fall_back_to_env_when_nothing_else_provided', async () => {
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      env: { WEAVERSE_PROJECT_ID: 'from-env' },
    })
    expect(await client.resolveProjectId()).toBe('from-env')
  })
})

// ─── 2. loadPage request + response shape ─────────────────────────────

describe('createWeaverseNextServerClient loadPage', () => {
  it('should_post_expected_url_body_and_return_configs_requestInfo', async () => {
    let fetchMock = makeFetch(makePagePayload())
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
      requestContext: {
        url: 'https://shop.example/products/hat?utm_source=x',
        i18n: { country: 'US', language: 'EN' },
      },
    })

    let data = await client.loadPage({ type: 'PRODUCT', handle: 'hat' })

    // Endpoint
    let [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe('https://api.weaverse.io/api/public/project')
    expect(init.method).toBe('POST')

    // Body: tracking params stripped from url; params forwarded; projectId set.
    let body = JSON.parse(init.body as string)
    expect(body.projectId).toBe('proj-123')
    expect(body.url).toBe('https://shop.example/products/hat')
    expect(body.params).toEqual({ type: 'PRODUCT', handle: 'hat' })
    expect(body.i18n).toEqual({ country: 'US', language: 'EN' })
    expect(body.isDesignMode).toBe(false)

    // Returned loader data carries Studio-compatible requestInfo + public config.
    expect(data?.page.id).toBe('page-1')
    expect(data?.project).toEqual({
      id: 'project-record',
      name: 'Shop',
      weaverseShopId: 'shop-1',
    })
    let configs = data?.configs as Record<string, unknown>
    expect(configs.projectId).toBe('proj-123')
    // requestInfo mirrors the *actual* request (tracking params kept); only the
    // API body url above is normalized.
    expect(configs.requestInfo).toEqual({
      pathname: '/products/hat',
      search: '?utm_source=x',
      queries: { utm_source: 'x' },
      i18n: { country: 'US', language: 'EN' },
    })
    // Server secret must never appear in client-facing configs.
    expect(configs.weaverseApiKey).toBeUndefined()
  })

  it('should_preserve_design_mode_draft_item_param_for_loader_revalidation', async () => {
    let fetchMock = makeFetch(makePagePayload())
    let draftItem = JSON.stringify({
      id: 'resource-section',
      type: 'resource-picker-smoke',
      data: { product: { handle: 'new-product' } },
    })
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
      requestContext: {
        url: `https://shop.example/?isDesignMode=true&_rsc=abc&weaverseDraftItem=${encodeURIComponent(
          draftItem
        )}&utm_source=drop`,
      },
    })

    await client.loadPage()

    let [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    let body = JSON.parse(init.body as string)
    let url = new URL(body.url)
    expect(body.url).toBe(
      `https://shop.example/?isDesignMode=true&weaverseDraftItem=${encodeURIComponent(
        draftItem
      )}`
    )
    expect(url.searchParams.get('weaverseDraftItem')).toBe(draftItem)
    expect(url.searchParams.has('_rsc')).toBe(false)
    expect(url.searchParams.has('utm_source')).toBe(false)
  })

  it('should_return_save_compatible_pageAssignment_with_inherited_meta', async () => {
    let fetchMock = makeFetch({
      ...makePagePayload(),
      pageAssignment: {
        projectId: 'proj-123',
        type: 'COLLECTION',
        locale: 'en-us',
        handle: 'sale',
        meta: {
          inherited: true,
          sourceProjectId: 'parent-project',
          depth: 1,
          fallbackReason: 'parent-default',
        },
      },
    })
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
      requestContext: { url: 'https://shop.example/collections/sale' },
    })

    let data = await client.loadPage({ type: 'COLLECTION', handle: 'sale' })

    expect(data?.pageAssignment).toEqual({
      projectId: 'proj-123',
      type: 'COLLECTION',
      locale: 'en-us',
      handle: 'sale',
      meta: {
        inherited: true,
        sourceProjectId: 'parent-project',
        depth: 1,
        fallbackReason: 'parent-default',
      },
    })
  })

  it('should_normalize_nullish_pageAssignment_locale_to_empty_string', async () => {
    let fetchMock = makeFetch({
      ...makePagePayload(),
      pageAssignment: {
        projectId: 'proj-123',
        type: 'PAGE',
        locale: null,
        handle: '/abcxyz',
      },
    })
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
      requestContext: { url: 'https://shop.example/abcxyz' },
    })

    let data = await client.loadPage({ type: 'PAGE', handle: '/abcxyz' })

    expect(data?.pageAssignment).toEqual({
      projectId: 'proj-123',
      type: 'PAGE',
      locale: '',
      handle: '/abcxyz',
    })
  })

  it('should_use_no_store_cache_in_design_mode', async () => {
    let fetchMock = makeFetch(makePagePayload())
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
      cache: { revalidate: 120, tags: ['weaverse'] },
      requestContext: { url: 'https://shop.example/', isDesignMode: true },
    })

    await client.loadPage()

    let [, init] = fetchMock.mock.calls[0] as [
      string,
      RequestInit & { next?: unknown },
    ]
    expect(init.cache).toBe('no-store')
    expect(init.next).toBeUndefined()
    expect(JSON.parse(init.body as string).isDesignMode).toBe(true)
  })

  it('should_use_configured_next_revalidate_and_tags_in_published_mode', async () => {
    let fetchMock = makeFetch(makePagePayload())
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
      cache: { revalidate: 120, tags: ['weaverse'] },
      requestContext: { url: 'https://shop.example/' },
    })

    await client.loadPage()

    let [, init] = fetchMock.mock.calls[0] as [
      string,
      RequestInit & { next?: { revalidate?: number; tags?: string[] } },
    ]
    expect(init.cache).toBeUndefined()
    expect(init.next).toEqual({ revalidate: 120, tags: ['weaverse'] })
  })

  it('should_run_component_loader_with_weaverse_storefront_alias', async () => {
    let queryResult = { products: [{ id: 1 }] }
    let query = vi.fn().mockResolvedValue(queryResult)
    let storefront = { query, i18n: { country: 'US', language: 'EN' } }
    let received: WeaverseNextComponentLoaderArgs | null = null

    let featured = {
      default: Hero,
      schema: createSchema({ type: 'featured', title: 'Featured' }),
      loader: async (args: WeaverseNextComponentLoaderArgs) => {
        received = args
        await args.weaverse.storefront?.query('query Alias { id }')
        return queryResult
      },
    }
    let fetchMock = makeFetch({
      page: {
        id: 'page-1',
        items: [{ id: 'f1', type: 'featured', data: {} }],
      },
      project: { id: 'p', name: 'Shop', weaverseShopId: 's' },
    })
    let client = createWeaverseNextServerClient({
      components: [featured],
      projectId: 'proj-123',
      commerce: { storefront },
      fetch: fetchMock,
      requestContext: { url: 'https://shop.example/' },
    })

    let data = await client.loadPage()

    expect(received).not.toBeNull()
    expect(
      (received as unknown as WeaverseNextComponentLoaderArgs).weaverse
        .storefront
    ).toBe(storefront)
    expect(query).toHaveBeenCalledWith('query Alias { id }')
    expect(data?.page.items[0].loaderData).toEqual(queryResult)
  })

  it('should_return_fallback_page_when_payload_has_no_page', async () => {
    let fetchMock = makeFetch({
      project: { id: 'p', name: 'Shop', weaverseShopId: 's' },
    })
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
      requestContext: { url: 'https://shop.example/' },
    })

    let data = await client.loadPage()
    expect(data?.page.items[0].type).toBe('main')
  })

  it('should_return_null_when_fetch_fails', async () => {
    let error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    let fetchMock = vi
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
      requestContext: { url: 'https://shop.example/' },
    })

    expect(await client.loadPage()).toBeNull()
    error.mockRestore()
  })

  it('should_propagate_route_level_projectId_to_client_loader_and_configs', async () => {
    let received: WeaverseNextComponentLoaderArgs | null = null
    let featured = {
      default: Hero,
      schema: createSchema({ type: 'featured', title: 'Featured' }),
      loader: (args: WeaverseNextComponentLoaderArgs) => {
        received = args
        return Promise.resolve({})
      },
    }
    let fetchMock = makeFetch({
      page: { id: 'page-1', items: [{ id: 'f1', type: 'featured', data: {} }] },
      project: { id: 'p', name: 'Shop', weaverseShopId: 's' },
    })
    let client = createWeaverseNextServerClient({
      components: [featured],
      projectId: 'client-id',
      fetch: fetchMock,
      requestContext: { url: 'https://shop.example/' },
    })

    let data = await client.loadPage({ projectId: 'route-id' })

    // Request body targets the route override, not the client default.
    let [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(JSON.parse(init.body as string).projectId).toBe('route-id')

    // client.projectId, loader's `weaverse.projectId`, and returned configs all
    // reflect the override.
    expect(client.projectId).toBe('route-id')
    expect(
      (received as unknown as WeaverseNextComponentLoaderArgs).weaverse
        .projectId
    ).toBe('route-id')
    expect((data?.configs as Record<string, unknown>).projectId).toBe(
      'route-id'
    )
  })
})

// ─── 2b. preview mode ─────────────────────────────────────────────────

describe('createWeaverseNextServerClient preview mode', () => {
  it('should_return_synthetic_preview_data_without_fetching', async () => {
    let fetchMock = makeFetch(makePagePayload())
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
      requestContext: {
        url: 'https://shop.example/?isPreviewMode=true&sectionType=hero',
      },
    })

    let data = await client.loadPage()

    // No page fetch in preview mode.
    expect(
      (fetchMock as unknown as { mock: { calls: unknown[] } }).mock.calls
    ).toHaveLength(0)

    expect(data?.page.id).toBe('weaverse-preview-page')
    let configs = data?.configs as Record<string, unknown>
    expect(configs.isPreviewMode).toBe(true)
    expect(configs.weaverseHost).toBe('https://studio.weaverse.io')
    expect(configs.requestInfo).toBeDefined()

    // The requested section is materialized under the `main` root.
    let main = data?.page.items.find((item) => item.type === 'main')
    expect((main?.children as { id: string }[])?.length).toBe(1)
    expect(data?.page.items.some((item) => item.type === 'hero')).toBe(true)
  })

  it('should_work_in_preview_mode_without_a_projectId', async () => {
    let fetchMock = makeFetch(makePagePayload())
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      fetch: fetchMock,
      requestContext: {
        isPreviewMode: true,
        sectionType: 'hero',
        url: 'https://shop.example/',
      },
    })

    let data = await client.loadPage()

    expect(
      (fetchMock as unknown as { mock: { calls: unknown[] } }).mock.calls
    ).toHaveLength(0)
    expect(data).not.toBeNull()
    // Harmless placeholder id when no real project is resolved.
    expect(data?.project?.id).toBe('x')
    expect((data?.configs as Record<string, unknown>).isPreviewMode).toBe(true)
  })
})

// ─── 3. loadThemeSettings ─────────────────────────────────────────────

const themeSchema = {
  type: 'theme',
  settings: [
    {
      group: 'Layout',
      inputs: [
        { type: 'range', name: 'pageWidth', defaultValue: 1200 },
        { type: 'text', name: 'topbarText', defaultValue: 'Default topbar' },
      ],
    },
  ],
  i18n: { staticContent: { greeting: 'Hello' } },
}

describe('createWeaverseNextServerClient loadThemeSettings', () => {
  it('should_merge_schema_defaults_with_remote_overrides_and_static_content', async () => {
    let fetchMock = makeFetch({ theme: { topbarText: 'Remote topbar' } })
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      themeSchema,
      fetch: fetchMock,
      requestContext: { url: 'https://shop.example/' },
    })

    let result = await client.loadThemeSettings()

    let [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toBe('https://api.weaverse.io/api/public/project_configs')
    expect(JSON.parse(init.body as string)).toEqual({
      projectId: 'proj-123',
      isDesignMode: false,
    })
    expect(result.theme).toEqual({
      pageWidth: 1200,
      topbarText: 'Remote topbar',
    })
    expect(result.staticContent).toEqual({ greeting: 'Hello' })
  })

  it('should_preserve_merchant_overrides_returned_by_the_api', async () => {
    // Arrange — the storefront API returns locale-specific overrides alongside
    // the theme; the server client must pass them through untouched so the root
    // provider can feed them into the translation chain.
    let fetchMock = makeFetch({
      theme: { topbarText: 'Remote topbar' },
      merchantOverrides: { cart: { title: 'Panier' } },
    })
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      themeSchema,
      fetch: fetchMock,
      requestContext: { url: 'https://shop.example/' },
    })

    // Act
    let result = await client.loadThemeSettings()

    // Assert — merchant overrides preserved; static content still injected.
    expect(result.merchantOverrides).toEqual({ cart: { title: 'Panier' } })
    expect(result.staticContent).toEqual({ greeting: 'Hello' })
  })

  it('should_fetch_locale_merchant_overrides_when_schema_and_request_locale_exist', async () => {
    // Arrange
    let fetchMock = makeRoutedFetch({
      project_configs: { theme: { topbarText: 'Remote topbar' } },
      'translation/static': { cart: { title: 'Panier' } },
    })
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      themeSchema,
      fetch: fetchMock,
      requestContext: {
        url: 'https://shop.example/',
        i18n: { language: 'FR', country: 'CA' },
      },
    })

    // Act
    let result = await client.loadThemeSettings()

    // Assert
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://studio.weaverse.io/api/translation/static?projectId=proj-123&locale=fr-ca'
    )
    expect(result.merchantOverrides).toEqual({ cart: { title: 'Panier' } })
  })

  it('should_skip_merchant_overrides_fetch_when_request_has_no_locale', async () => {
    let fetchMock = makeFetch({ theme: {} })
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      themeSchema,
      fetch: fetchMock,
      requestContext: {
        url: 'https://shop.example/',
        i18n: { language: 'FR' },
      },
    })

    await client.loadThemeSettings()

    expect(fetchMock.mock.calls).toHaveLength(1)
  })

  it('should_skip_merchant_overrides_fetch_when_theme_schema_has_no_i18n', async () => {
    let fetchMock = makeFetch({ theme: {} })
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      themeSchema: { type: 'theme', settings: [] },
      fetch: fetchMock,
      requestContext: {
        url: 'https://shop.example/',
        i18n: { language: 'FR', country: 'CA' },
      },
    })

    await client.loadThemeSettings()

    expect(fetchMock.mock.calls).toHaveLength(1)
  })

  it('should_still_return_theme_when_merchant_overrides_fetch_fails', async () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    let fetchMock = makeRoutedFetch({
      project_configs: {
        theme: { topbarText: 'Remote topbar' },
        merchantOverrides: { cart: { title: 'API fallback' } },
      },
    })
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      themeSchema,
      fetch: fetchMock,
      requestContext: {
        url: 'https://shop.example/',
        i18n: { language: 'FR', country: 'CA' },
      },
    })

    let result = await client.loadThemeSettings()

    expect(result._loadFailed).toBeUndefined()
    expect(result.theme).toEqual({
      pageWidth: 1200,
      topbarText: 'Remote topbar',
    })
    expect(result.merchantOverrides).toEqual({
      cart: { title: 'API fallback' },
    })
    warn.mockRestore()
  })

  it('should_return_fallback_with_defaults_when_api_fails', async () => {
    let error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    let fetchMock = vi
      .fn()
      .mockRejectedValue(new Error('boom')) as unknown as typeof fetch
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      themeSchema,
      fetch: fetchMock,
      requestContext: { url: 'https://shop.example/' },
    })

    let result = await client.loadThemeSettings()

    expect(result._loadFailed).toBe(true)
    expect(result._error).toBe('boom')
    expect(result.theme).toEqual({
      pageWidth: 1200,
      topbarText: 'Default topbar',
    })
    expect(result.staticContent).toEqual({ greeting: 'Hello' })
    error.mockRestore()
  })

  it('should_include_serializable_schema_and_public_env_in_design_mode', async () => {
    let fetchMock = makeFetch({ theme: {} })
    let designSchema = {
      type: 'theme',
      settings: [
        {
          group: 'Layout',
          inputs: [
            {
              type: 'text',
              name: 'topbarText',
              defaultValue: 'Default',
              condition: (data: { hidden?: boolean }) => !data.hidden,
            },
          ],
        },
      ],
    }
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      themeSchema: designSchema,
      env: { PUBLIC_STORE_DOMAIN: 'shop.example' },
      fetch: fetchMock,
      requestContext: { url: 'https://shop.example/', isDesignMode: true },
    })

    let result = await client.loadThemeSettings()

    let schema = result.schema as typeof designSchema
    let condition = schema.settings[0].inputs[0].condition
    expect(typeof condition).toBe('string')
    expect(result.publicEnv).toEqual({
      PUBLIC_STORE_DOMAIN: 'shop.example',
      PUBLIC_STOREFRONT_API_TOKEN: '',
    })
  })
})

// ─── 3b. custom pages sitemap helper ─────────────────────────────────

describe('createWeaverseNextServerClient fetchCustomPages', () => {
  it('should_fetch_paginated_custom_pages_with_locale_and_limit', async () => {
    let fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          data: [
            {
              handle: 'about',
              lastModified: '2026-07-01T00:00:00.000Z',
              locale: 'en-us',
              path: '/pages/about',
            },
          ],
          nextCursor: 'cursor-2',
        })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          data: [
            {
              handle: 'faq',
              lastModified: '2026-07-02T00:00:00.000Z',
              locale: 'en-us',
              path: '/pages/faq',
            },
          ],
          nextCursor: null,
        })
      ) as unknown as typeof fetch & { mock: { calls: unknown[][] } }
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
    })

    let pages = await client.fetchCustomPages({
      locale: 'en-us',
      limit: 1,
      revalidate: 3600,
      tags: ['weaverse:custom-pages'],
    })

    expect(pages.map((page) => page.handle)).toEqual(['about', 'faq'])
    let [firstUrl, firstInit] = fetchMock.mock.calls[0] as [
      string,
      RequestInit & { next?: { revalidate?: number; tags?: string[] } },
    ]
    expect(firstUrl).toBe(
      'https://api.weaverse.io/api/public/v1/projects/proj-123/custom-pages?locale=en-us&limit=1'
    )
    expect(firstInit.next).toEqual({
      revalidate: 3600,
      tags: ['weaverse:custom-pages'],
    })
    let [secondUrl] = fetchMock.mock.calls[1] as [string, RequestInit]
    expect(secondUrl).toBe(
      'https://api.weaverse.io/api/public/v1/projects/proj-123/custom-pages?locale=en-us&limit=1&cursor=cursor-2'
    )
  })

  it('should_return_partial_results_when_later_page_fails', async () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    let fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          data: [
            {
              handle: 'about',
              lastModified: '2026-07-01T00:00:00.000Z',
              locale: null,
              path: '/pages/about',
            },
          ],
          nextCursor: 'cursor-2',
        })
      )
      .mockRejectedValueOnce(
        new Error('network down')
      ) as unknown as typeof fetch
    let client = createWeaverseNextServerClient({
      components: [heroComponent],
      projectId: 'proj-123',
      fetch: fetchMock,
    })

    let pages = await client.fetchCustomPages()

    expect(pages).toHaveLength(1)
    expect(pages[0].handle).toBe('about')
    warn.mockRestore()
  })
})

// ─── 3c. SEO metadata helper ───────────────────────────────────────────

describe('getWeaverseNextSeoMetadata', () => {
  it('should_convert_weaverse_seo_payload_to_next_metadata_shape', () => {
    let metadata = getWeaverseNextSeoMetadata({
      page: {
        id: 'page-1',
        items: [],
        seo: {
          title: 'SEO title',
          description: 'SEO description',
          keywords: 'shop,commerce',
          canonicalUrl: 'https://shop.example/pages/about',
          openGraph: {
            title: 'OG title',
            description: 'OG description',
            image: 'https://cdn.example/og.jpg',
          },
          twitter: {
            title: 'Twitter title',
            image: 'https://cdn.example/tw.jpg',
          },
          robots: { index: false, follow: true },
        },
      },
    })

    expect(metadata).toEqual({
      title: 'SEO title',
      description: 'SEO description',
      keywords: 'shop,commerce',
      alternates: { canonical: 'https://shop.example/pages/about' },
      openGraph: {
        title: 'OG title',
        description: 'OG description',
        images: ['https://cdn.example/og.jpg'],
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: 'Twitter title',
        images: ['https://cdn.example/tw.jpg'],
      },
      robots: { index: false, follow: true },
    })
  })

  it('should_return_default_index_follow_when_seo_is_missing', () => {
    expect(getWeaverseNextSeoMetadata(null)).toEqual({
      robots: { index: true, follow: true },
    })
  })

  it('should_be_assignable_to_next_metadata_without_an_adapter', () => {
    // Compile-time assertions: `tsc --noEmit` fails if the helper's return
    // type ever drifts away from Next's `Metadata`.
    let metadata: Metadata = getWeaverseNextSeoMetadata(null)
    let formatted: Metadata = formatWeaverseNextSeoMetadata({
      title: 'SEO title',
      openGraph: { type: 'article', title: 'OG title' },
      twitter: { cardType: 'summary_large_image', title: 'Twitter title' },
    })

    expect(metadata.robots).toEqual({ index: true, follow: true })
    expect(formatted.openGraph).toMatchObject({ type: 'article' })
    expect(formatted.twitter).toMatchObject({ card: 'summary_large_image' })
  })

  it('should_fall_back_to_website_when_open_graph_type_is_product', () => {
    // `product` is a Builder-only OG type; Next throws on it, so it degrades.
    let metadata: Metadata = formatWeaverseNextSeoMetadata({
      openGraph: { type: 'product', image: 'https://cdn.example/og.jpg' },
    })

    expect(metadata.openGraph).toEqual({
      title: undefined,
      description: undefined,
      images: ['https://cdn.example/og.jpg'],
      type: 'website',
    })
  })

  it.each([
    'website',
    'article',
    'profile',
    'video.other',
  ] as const)('should_preserve_open_graph_type_when_next_supports_%s', (type) => {
    let metadata: Metadata = formatWeaverseNextSeoMetadata({
      openGraph: { type },
    })

    expect(metadata.openGraph).toMatchObject({ type })
  })

  it.each([
    'app',
    'player',
  ] as const)('should_downgrade_twitter_card_to_summary_when_builder_sends_%s', (cardType) => {
    let metadata: Metadata = formatWeaverseNextSeoMetadata({
      twitter: { cardType, image: 'https://cdn.example/tw.jpg' },
    })

    expect(metadata.twitter).toEqual({
      card: 'summary',
      title: undefined,
      description: undefined,
      images: ['https://cdn.example/tw.jpg'],
    })
  })

  it('should_omit_open_graph_and_twitter_when_seo_has_no_content', () => {
    let metadata = formatWeaverseNextSeoMetadata({
      title: 'SEO title',
      openGraph: {},
      twitter: {},
      robots: { index: false },
    })

    expect(metadata).toEqual({
      title: 'SEO title',
      robots: { index: false, follow: true },
    })
  })
})

// ─── 3d. trusted weaverseHost normalization ───────────────────────────

describe('getWeaverseNextConfigs trusted host normalization', () => {
  it('should_canonicalize_a_trusted_query_host_to_its_origin', () => {
    let configs = getWeaverseNextConfigs({
      searchParams: new URLSearchParams({
        weaverseHost: 'https://studio.weaverse.io/foo?x=1',
      }),
    })

    // Path/query from the attacker-controllable param are dropped.
    expect(configs.weaverseHost).toBe('https://studio.weaverse.io')
    expect(configs.weaverseApiBase).toBe('https://studio.weaverse.io')
  })

  it('should_ignore_an_untrusted_query_host', () => {
    let configs = getWeaverseNextConfigs({
      searchParams: new URLSearchParams({
        weaverseHost: 'https://evil.example/foo',
      }),
    })

    expect(configs.weaverseHost).toBe('https://studio.weaverse.io')
    expect(configs.weaverseApiBase).toBe('https://api.weaverse.io')
  })
})

// ─── 4. Server subpath exports ────────────────────────────────────────

describe('@weaverse/next/server exports', () => {
  it('should_expose_runtime_and_helper_symbols', () => {
    expect(typeof createWeaverseNextServerClient).toBe('function')
    expect(typeof getWeaverseNextConfigs).toBe('function')
    expect(typeof normalizeNextPageUrl).toBe('function')
    expect(typeof resolveRequestUrl).toBe('function')
  })
})
