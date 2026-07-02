import { describe, expect, it, vi } from 'vitest'
import { createSchema } from '../src/index'
import {
  DEFAULT_REVALIDATE_ENDPOINT,
  revalidateWeaverseNextItem,
} from '../src/revalidate-item'
import { createWeaverseNextRevalidateHandler } from '../src/server/revalidate-handler'
import type {
  WeaverseNextComponent,
  WeaverseNextServerClient,
} from '../src/types'

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
    expect(response.status).toBe(200)
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
    expect(invalidJson.status).toBe(400)
    expect(missingItem.status).toBe(400)
    expect(missingId.status).toBe(400)
    expect(unknownType.status).toBe(404)
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
    expect(missingLoader.status).toBe(422)
    expect(await missingLoader.json()).toEqual({ error: 'missing-loader' })
    expect(loaderFailed.status).toBe(500)
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
    ).rejects.toThrow(/responded 404/)
    // Unknown live instance must reject without fetching.
    await expect(
      revalidateWeaverseNextItem(runtime, {
        ...draftItem,
        id: 'ghost',
      })
    ).rejects.toThrow(/No live item instance/)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    vi.unstubAllGlobals()
  })
})
