import { describe, expect, it, vi } from 'vitest'
import { createSchema } from '../src/index'
import {
  buildWeaverseNextRevalidateRouteContext,
  DEFAULT_REVALIDATE_ENDPOINT,
  revalidateWeaverseNextItem,
} from '../src/revalidate-item'
import { getWeaverseNextConfigs } from '../src/server/configs'
import { createWeaverseNextRevalidateHandler } from '../src/server/revalidate-handler'
import type {
  WeaverseNextComponent,
  WeaverseNextRequestContext,
  WeaverseNextServerClient,
} from '../src/types'

const STATUS_OK = 200
const STATUS_BAD_REQUEST = 400
const STATUS_NOT_FOUND = 404
const STATUS_UNPROCESSABLE = 422
const STATUS_SERVER_ERROR = 500
const MAX_ROUTE_CONTEXT_HANDLE_LENGTH = 512
const MAX_ROUTE_CONTEXT_PATHNAME_LENGTH = 2048
const RESPONDED_404_ERROR = /responded 404/
const NO_LIVE_INSTANCE_ERROR = /No live item instance/

const smokeSchema = createSchema({
  type: 'resource-smoke',
  title: 'Resource smoke',
  settings: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Default heading',
        },
      ],
    },
  ],
})

function makeServerClient(
  components: WeaverseNextComponent[]
): WeaverseNextServerClient {
  return {
    components,
    commerce: { storefront: { query: vi.fn() } },
    requestContext: { pathname: '/' },
  } as unknown as WeaverseNextServerClient
}

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/weaverse/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

describe('createWeaverseNextRevalidateHandler', () => {
  it('should_run_component_loader_with_schema_defaults_and_draft_data', async () => {
    // Arrange
    let loader = vi.fn().mockResolvedValue({ product: { title: 'Fresh' } })
    let client = makeServerClient([
      { default: () => null, loader, schema: smokeSchema },
    ])
    let { POST } = createWeaverseNextRevalidateHandler({
      getClient: () => client,
    })

    // Act
    let response = await POST(
      makeRequest({
        draftItem: {
          id: 'item-1',
          type: 'resource-smoke',
          data: { product: { handle: 'new-product' } },
        },
      })
    )
    let body = await response.json()

    // Assert — loader gets the merged draft data and the page-load args shape.
    expect(response.status).toBe(STATUS_OK)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(body).toEqual({ loaderData: { product: { title: 'Fresh' } } })
    expect(loader).toHaveBeenCalledWith({
      data: {
        heading: 'Default heading',
        product: { handle: 'new-product' },
      },
      weaverse: client,
      context: client.requestContext,
      commerce: client.commerce,
    })
  })

  it('should_reject_invalid_payloads_and_unknown_types', async () => {
    // Arrange
    let client = makeServerClient([
      {
        default: () => null,
        loader: vi.fn(),
        schema: smokeSchema,
      },
    ])
    let { POST } = createWeaverseNextRevalidateHandler({
      getClient: () => client,
    })

    // Act
    let invalidJson = await POST(makeRequest('not-json{'))
    let missingItem = await POST(makeRequest({ nope: true }))
    let missingId = await POST(
      makeRequest({ draftItem: { type: 'resource-smoke' } })
    )
    let unknownType = await POST(
      makeRequest({ draftItem: { id: 'item-1', type: 'nope' } })
    )

    // Assert
    expect(invalidJson.status).toBe(STATUS_BAD_REQUEST)
    expect(missingItem.status).toBe(STATUS_BAD_REQUEST)
    expect(missingId.status).toBe(STATUS_BAD_REQUEST)
    expect(unknownType.status).toBe(STATUS_NOT_FOUND)
    expect(await unknownType.json()).toEqual({
      error: 'unknown-component-type',
    })
  })

  it('should_report_missing_loader_and_loader_failures', async () => {
    // Arrange
    let noLoaderClient = makeServerClient([
      { default: () => null, schema: smokeSchema },
    ])
    let throwingClient = makeServerClient([
      {
        default: () => null,
        loader: vi.fn().mockRejectedValue(new Error('boom')),
        schema: smokeSchema,
      },
    ])
    let draftItem = { id: 'item-1', type: 'resource-smoke', data: {} }

    // Act
    let missingLoader = await createWeaverseNextRevalidateHandler({
      getClient: () => noLoaderClient,
    }).POST(makeRequest({ draftItem }))
    let loaderFailed = await createWeaverseNextRevalidateHandler({
      getClient: () => throwingClient,
    }).POST(makeRequest({ draftItem }))

    // Assert
    expect(missingLoader.status).toBe(STATUS_UNPROCESSABLE)
    expect(await missingLoader.json()).toEqual({ error: 'missing-loader' })
    expect(loaderFailed.status).toBe(STATUS_SERVER_ERROR)
    expect(await loaderFailed.json()).toEqual({ error: 'loader-failed' })
  })
})

describe('revalidateWeaverseNextItem', () => {
  it('should_post_draft_item_and_apply_loader_data_in_place', async () => {
    // Arrange
    let setData = vi.fn()
    let runtime = {
      itemInstances: new Map([['item-1', { setData }]]),
    }
    let fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ loaderData: { title: 'Fresh' } }), {
        status: 200,
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    let draftItem = {
      id: 'item-1',
      type: 'resource-smoke',
      data: { product: { handle: 'new-product' } },
    }

    // Act
    await revalidateWeaverseNextItem(runtime, draftItem)

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(DEFAULT_REVALIDATE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftItem }),
    })
    expect(setData).toHaveBeenCalledWith({ loaderData: { title: 'Fresh' } })
    vi.unstubAllGlobals()
  })

  it('should_throw_when_endpoint_or_instance_is_missing_so_builder_can_fall_back', async () => {
    // Arrange
    let runtime = {
      itemInstances: new Map([['item-1', { setData: vi.fn() }]]),
    }
    let fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('nope', { status: 404 }))
    vi.stubGlobal('fetch', fetchMock)
    let draftItem = { id: 'item-1', type: 'resource-smoke', data: {} }

    // Act + Assert — 404 route (app did not mount the handler) must reject.
    await expect(
      revalidateWeaverseNextItem(runtime, draftItem, '/missing')
    ).rejects.toThrow(RESPONDED_404_ERROR)
    // Unknown live instance must reject without fetching.
    await expect(
      revalidateWeaverseNextItem(runtime, {
        ...draftItem,
        id: 'ghost',
      })
    ).rejects.toThrow(NO_LIVE_INSTANCE_ERROR)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    vi.unstubAllGlobals()
  })

  it('should_post_sanitized_route_context_from_runtime_request_info', async () => {
    // Arrange
    let setData = vi.fn()
    let runtime = {
      itemInstances: new Map([['item-1', { setData }]]),
      requestInfo: {
        handle: 'classic-kicks',
        i18n: { country: 'FR', language: 'FR', locale: 'fr-FR' },
        pageType: 'PRODUCT' as const,
        pathname: '/fr-fr/products/classic-kicks',
        queries: {},
        search:
          '?foo=a&foo=b&name=%C3%A9&isDesignMode=true&sectionType=main&weaverseProjectId=secret&weaverseApiKey=key&_rsc=1',
      },
    }
    let fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ loaderData: { title: 'Fresh' } }), {
        status: 200,
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    let draftItem = { id: 'item-1', type: 'resource-smoke', data: {} }

    // Act
    await revalidateWeaverseNextItem(runtime, draftItem)

    // Assert
    let body = JSON.parse(fetchMock.mock.calls[0][1].body)
    let sentSearch = new URLSearchParams(body.routeContext.search)
    expect(body.routeContext.pathname).toBe('/fr-fr/products/classic-kicks')
    expect(body.routeContext.pageType).toBe('PRODUCT')
    expect(body.routeContext.handle).toBe('classic-kicks')
    expect(body.routeContext.i18n).toEqual({
      country: 'FR',
      language: 'FR',
      locale: 'fr-FR',
    })
    expect(sentSearch.getAll('foo')).toEqual(['a', 'b'])
    expect(sentSearch.get('name')).toBe('é')
    expect(sentSearch.get('isDesignMode')).toBe('true')
    expect(sentSearch.get('sectionType')).toBe('main')
    expect(sentSearch.has('weaverseProjectId')).toBe(false)
    expect(sentSearch.has('weaverseApiKey')).toBe(false)
    expect(sentSearch.has('_rsc')).toBe(false)
    vi.unstubAllGlobals()
  })

  it('should_omit_route_context_when_runtime_has_no_request_info', async () => {
    // Arrange
    let runtime = {
      itemInstances: new Map([['item-1', { setData: vi.fn() }]]),
    }
    let fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ loaderData: null }))
    vi.stubGlobal('fetch', fetchMock)
    let draftItem = { id: 'item-1', type: 'resource-smoke', data: {} }

    // Act
    await revalidateWeaverseNextItem(runtime, draftItem)

    // Assert — legacy body carries only draftItem, no routeContext.
    let body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body).toEqual({ draftItem })
    vi.unstubAllGlobals()
  })
})

describe('buildWeaverseNextRevalidateRouteContext', () => {
  it('should_return_undefined_when_request_info_is_missing', () => {
    // Arrange + Act
    let result = buildWeaverseNextRevalidateRouteContext(undefined)

    // Assert
    expect(result).toBeUndefined()
  })

  it('should_drop_page_type_not_accepted_by_page_type_schema', () => {
    // Arrange
    let requestInfo = {
      pageType: 'ARBITRARY' as unknown as 'PRODUCT',
      pathname: '/x',
      queries: {},
      search: '',
    }

    // Act
    let result = buildWeaverseNextRevalidateRouteContext(requestInfo)

    // Assert
    expect(result).toBeDefined()
    expect(result).not.toHaveProperty('pageType')
  })

  it('should_drop_oversized_handle_before_serializing_route_context', () => {
    // Arrange
    let requestInfo = {
      handle: 'x'.repeat(MAX_ROUTE_CONTEXT_HANDLE_LENGTH + 1),
      pathname: '/products/hat',
      queries: {},
      search: '',
    }

    // Act
    let result = buildWeaverseNextRevalidateRouteContext(requestInfo)

    // Assert
    expect(result).toBeDefined()
    expect(result).not.toHaveProperty('handle')
  })
})

// ─── Handler route-context reconstruction ─────────────────────────────

const INVALID_ROUTE_CONTEXT = { error: 'invalid-route-context' }

function makeCapturingHandler(
  loader = vi.fn().mockResolvedValue({ ok: true }),
  getClient?: (
    request: Request,
    requestContext?: WeaverseNextRequestContext
  ) => WeaverseNextServerClient
) {
  let received: {
    request: Request
    requestContext?: WeaverseNextRequestContext
  }[] = []
  let defaultGetClient = (
    request: Request,
    requestContext?: WeaverseNextRequestContext
  ): WeaverseNextServerClient => {
    received.push({ request, requestContext })
    return {
      components: [{ default: () => null, loader, schema: smokeSchema }],
      commerce: { storefront: { query: vi.fn() } },
      requestContext,
    } as unknown as WeaverseNextServerClient
  }
  let { POST } = createWeaverseNextRevalidateHandler({
    getClient: getClient ?? defaultGetClient,
  })
  return { POST, received, loader }
}

function routeBody(routeContext: unknown) {
  return {
    draftItem: { id: 'item-1', type: 'resource-smoke', data: {} },
    routeContext,
  }
}

describe('createWeaverseNextRevalidateHandler route context', () => {
  it('should_reconstruct_same_origin_request_context_for_localized_pdp', async () => {
    // Arrange
    let { POST, loader } = makeCapturingHandler()

    // Act
    let response = await POST(
      makeRequest(
        routeBody({
          handle: 'classic-kicks',
          i18n: { country: 'FR', language: 'FR', locale: 'fr-FR' },
          pageType: 'PRODUCT',
          pathname: '/fr-fr/products/classic-kicks',
          search: '?variant=123',
        })
      )
    )

    // Assert
    expect(response.status).toBe(STATUS_OK)
    let context = loader.mock.calls[0][0].context as WeaverseNextRequestContext
    expect(context.pathname).toBe('/fr-fr/products/classic-kicks')
    expect((context.url as URL).pathname).toBe(context.pathname)
    expect((context.url as URL).origin).toBe('http://localhost')
    expect(context.pageType).toBe('PRODUCT')
    expect(context.handle).toBe('classic-kicks')
    expect(context.i18n).toEqual({
      country: 'FR',
      language: 'FR',
      locale: 'fr-FR',
    })
    expect(context.searchParams?.get('variant')).toBe('123')
  })

  it('should_canonicalize_literal_and_encoded_dot_segments_into_one_pathname', async () => {
    // Arrange
    let { POST, loader } = makeCapturingHandler()

    // Act
    let literal = await POST(
      makeRequest(
        routeBody({
          pathname: '/fr-fr/products/../classic-kicks',
          search: '',
        })
      )
    )
    let encoded = await POST(
      makeRequest(
        routeBody({
          pathname: '/fr-fr/products/%2e%2e/classic-kicks',
          search: '',
        })
      )
    )

    // Assert
    expect(literal.status).toBe(STATUS_OK)
    expect(encoded.status).toBe(STATUS_OK)
    let literalContext = loader.mock.calls[0][0]
      .context as WeaverseNextRequestContext
    let encodedContext = loader.mock.calls[1][0]
      .context as WeaverseNextRequestContext
    expect(literalContext.pathname).toBe('/fr-fr/classic-kicks')
    expect(literalContext.pathname).toBe((literalContext.url as URL).pathname)
    expect(encodedContext.pathname).toBe('/fr-fr/classic-kicks')
    expect(encodedContext.pathname).toBe((encodedContext.url as URL).pathname)
  })

  it('should_use_last_value_for_duplicate_studio_controls_matching_configs', async () => {
    // Arrange
    let { POST, loader } = makeCapturingHandler()
    let search =
      '?isDesignMode=false&isDesignMode=true&isPreviewMode=true&isPreviewMode=false&sectionType=old&sectionType=main'

    // Act
    let response = await POST(makeRequest(routeBody({ pathname: '/', search })))

    // Assert — last value wins and matches getWeaverseNextConfigs resolution.
    expect(response.status).toBe(STATUS_OK)
    let context = loader.mock.calls[0][0].context as WeaverseNextRequestContext
    let configs = getWeaverseNextConfigs(context)
    expect(context.isDesignMode).toBe(true)
    expect(context.isPreviewMode).toBe(false)
    expect(context.sectionType).toBe('main')
    expect(configs.isDesignMode).toBe(true)
    expect(configs.isPreviewMode).toBe(false)
    expect(configs.sectionType).toBe('main')
  })

  it('should_strip_denied_controls_even_when_client_sanitization_is_bypassed', async () => {
    // Arrange
    let { POST, loader } = makeCapturingHandler()
    let search =
      '?variant=1&weaverseProjectId=hijack&weaverseHost=https://evil.example&weaverseApiKey=k&weaverseApiBase=x&weaversePublicApiBase=y&weaverseVersion=9&projectId=z&weaverseDraftItem=d&_rsc=1'

    // Act
    let response = await POST(makeRequest(routeBody({ pathname: '/', search })))

    // Assert
    expect(response.status).toBe(STATUS_OK)
    let context = loader.mock.calls[0][0].context as WeaverseNextRequestContext
    let params = context.searchParams as URLSearchParams
    expect(params.get('variant')).toBe('1')
    for (let denied of [
      'weaverseProjectId',
      'weaverseHost',
      'weaverseApiKey',
      'weaverseApiBase',
      'weaversePublicApiBase',
      'weaverseVersion',
      'projectId',
      'weaverseDraftItem',
      '_rsc',
    ]) {
      expect(params.has(denied)).toBe(false)
    }
  })

  it('should_not_construct_headers_or_cookies_from_route_context_json', async () => {
    // Arrange
    let { POST, loader } = makeCapturingHandler()

    // Act
    let response = await POST(
      makeRequest(
        routeBody({
          authorization: 'Bearer attacker',
          cookies: 'session=attacker',
          headers: {
            authorization: 'Bearer attacker',
            cookie: 'session=attacker',
          },
          pathname: '/',
          search: '',
        })
      )
    )

    // Assert
    expect(response.status).toBe(STATUS_OK)
    let context = loader.mock.calls[0][0].context as WeaverseNextRequestContext
    expect(context.headers?.get('authorization')).toBeNull()
    expect(context.headers?.get('cookie')).toBeNull()
    expect(context).not.toHaveProperty('authorization')
    expect(context).not.toHaveProperty('cookies')
  })

  it('should_reject_hostile_route_context_before_client_creation', async () => {
    // Arrange
    let { POST, received } = makeCapturingHandler()
    let hostile = [
      { pathname: 'http://evil.example', search: '' },
      { pathname: '//evil.example/x', search: '' },
      { pathname: '/a\\b', search: '' },
      { pathname: '/a\u0007b', search: '' },
      { pathname: '/a?b=1', search: '' },
      { pathname: '/a#frag', search: '' },
      {
        pathname: `/${'x'.repeat(MAX_ROUTE_CONTEXT_PATHNAME_LENGTH)}`,
        search: '',
      },
      { pathname: '/x', search: 'variant=1' },
      { pathname: '/x' },
      { pathname: '/x', search: '', pageType: 'ARBITRARY' },
      null,
      { pathname: '/x', search: '', i18n: ['not', 'object'] },
      { pathname: '/x', search: '', i18n: { country: { nested: true } } },
      {
        pathname: '/x',
        search: '',
        handle: 'y'.repeat(MAX_ROUTE_CONTEXT_HANDLE_LENGTH + 1),
      },
    ]

    // Act + Assert
    for (let routeContext of hostile) {
      let response = await POST(makeRequest(routeBody(routeContext)))
      expect(response.status).toBe(STATUS_BAD_REQUEST)
      expect(await response.json()).toEqual(INVALID_ROUTE_CONTEXT)
      expect(response.headers.get('Cache-Control')).toBe('no-store')
    }
    expect(received).toHaveLength(0)
  })

  it('should_treat_spoofed_route_context_as_routing_input_only', async () => {
    // Arrange — a valid-looking context cannot make an unknown type executable.
    let { POST } = makeCapturingHandler()

    // Act
    let response = await POST(
      makeRequest({
        draftItem: { id: 'item-1', type: 'not-registered' },
        routeContext: { pathname: '/admin/secret', search: '' },
      })
    )

    // Assert
    expect(response.status).toBe(STATUS_NOT_FOUND)
    expect(await response.json()).toEqual({ error: 'unknown-component-type' })
  })

  it('should_pass_undefined_request_context_for_legacy_missing_route_context', async () => {
    // Arrange
    let { POST, received, loader } = makeCapturingHandler()

    // Act
    let response = await POST(
      makeRequest({ draftItem: { id: 'item-1', type: 'resource-smoke' } })
    )

    // Assert
    expect(response.status).toBe(STATUS_OK)
    expect(received).toHaveLength(1)
    expect(received[0].requestContext).toBeUndefined()
    expect(loader.mock.calls[0][0].context).toBeUndefined()
  })

  it('should_support_legacy_one_argument_get_client_callback', async () => {
    // Arrange — callback ignoring the optional second argument stays valid.
    let loader = vi.fn().mockResolvedValue({ ok: true })
    let oneArgClient = (_request: Request) =>
      ({
        components: [{ default: () => null, loader, schema: smokeSchema }],
        commerce: { storefront: { query: vi.fn() } },
        requestContext: { pathname: '/' },
      }) as unknown as WeaverseNextServerClient
    let { POST } = createWeaverseNextRevalidateHandler({
      getClient: oneArgClient,
    })

    // Act
    let response = await POST(
      makeRequest(routeBody({ pathname: '/products/hat', search: '?a=1' }))
    )

    // Assert
    expect(response.status).toBe(STATUS_OK)
    expect(loader).toHaveBeenCalledTimes(1)
  })
})
