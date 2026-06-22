import { describe, expect, it, vi } from 'vitest'
import { createSchema } from '../src/index'
import {
  createWeaverseNextServerClient,
  getWeaverseNextConfigs,
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
    pageAssignment: { type: 'INDEX' },
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

// ─── 3b. trusted weaverseHost normalization ───────────────────────────

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
