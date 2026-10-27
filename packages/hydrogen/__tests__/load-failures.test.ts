import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { InMemoryCache } from '@shopify/hydrogen'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type HydrogenThemeSchema,
  WeaverseError,
  type WeaverseLoadError,
} from '../src/types'
import { WeaverseClient } from '../src/weaverse-client'

/**
 * Page and theme loads against a real local origin, through both request
 * paths the client chooses between: the direct fetch used for the public API
 * proxy, and Hydrogen's cached fetch used when the API base is the Weaverse
 * host. Each test scripts the origin's answers in order.
 */

type Reply = { status: number; body: string }

const VALID_PAGE = JSON.stringify({
  page: { id: 'page-1', rootId: 'root-1', name: 'Home', items: [] },
  project: { id: 'proj-1', name: 'Project', weaverseShopId: 'shop-1' },
  pageAssignment: {},
})
const UNASSIGNED_PAGE = JSON.stringify({
  page: null,
  project: { id: 'proj-1', name: 'Project', weaverseShopId: 'shop-1' },
  pageAssignment: {},
})
const PROJECT_NOT_FOUND = JSON.stringify({ error: 'Project not found' })

const THEME_SCHEMA: HydrogenThemeSchema = {
  info: {
    name: 'T',
    author: 'A',
    version: '1.0.0',
    authorProfilePhoto: '',
    documentationUrl: '',
    supportUrl: '',
  },
  settings: [
    {
      group: 'Header',
      inputs: [
        {
          type: 'text',
          name: 'logoText',
          label: 'Logo',
          defaultValue: 'DEMO',
        },
      ],
    },
  ],
}

let server: Server
let origin: string
let replies: Reply[]
let requests: number

beforeEach(async () => {
  replies = []
  requests = 0
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  server = createServer((_req, res) => {
    requests++
    let reply = replies.shift() ?? { status: 500, body: '{}' }
    res.writeHead(reply.status, { 'Content-Type': 'application/json' })
    res.end(reply.body)
  })
  let listening = Promise.withResolvers<void>()
  server.listen(0, '127.0.0.1', listening.resolve)
  await listening.promise
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})

afterEach(async () => {
  vi.restoreAllMocks()
  server.closeAllConnections()
  let closed = Promise.withResolvers<void>()
  server.close(() => closed.resolve())
  await closed.promise
})

function reply(...answers: Reply[]) {
  replies.push(...answers)
}

/**
 * `direct`: the public API proxy is a different origin from the Weaverse
 * host. `cached`: they are the same origin (self-hosted), so requests go
 * through Hydrogen's cached fetch.
 */
function makeClient(
  path: 'direct' | 'cached',
  opts: {
    throwPageLoadFailures?: boolean
    url?: string
    cache?: Cache
  } = {}
) {
  return new WeaverseClient({
    customerAccount: null,
    env: {
      WEAVERSE_PROJECT_ID: 'proj-1',
      WEAVERSE_HOST: path === 'direct' ? 'https://studio.weaverse.io' : origin,
      WEAVERSE_PUBLIC_API_BASE: origin,
    },
    storefront: { i18n: { language: 'EN', country: 'US' } },
    cache: opts.cache ?? new InMemoryCache(),
    waitUntil: () => {},
    request: new Request(opts.url ?? 'https://shop.test/'),
    components: [],
    themeSchema: THEME_SCHEMA,
    throwPageLoadFailures: opts.throwPageLoadFailures,
  } as any)
}

async function loadFailure(client: WeaverseClient): Promise<unknown> {
  try {
    await client.loadPage({ type: 'INDEX' })
  } catch (error) {
    return error
  }
  return
}

describe('loadPage failure classification (opt-in)', () => {
  for (let path of ['direct', 'cached'] as const) {
    describe(`${path} fetch`, () => {
      it('should_reject_as_unavailable_when_the_api_keeps_answering_5xx', async () => {
        reply({ status: 503, body: '{}' }, { status: 503, body: '{}' })
        let client = makeClient(path, { throwPageLoadFailures: true })

        let error = await loadFailure(client)

        expect((error as WeaverseLoadError)?.kind).toBe('unavailable')
      })

      it('should_reject_as_configuration_when_the_api_refuses_the_request', async () => {
        reply({ status: 403, body: '{"error":"Forbidden"}' })
        let client = makeClient(path, { throwPageLoadFailures: true })

        let error = await loadFailure(client)

        expect((error as WeaverseLoadError)?.kind).toBe('configuration')
      })

      it('should_reject_as_invalid_response_when_a_successful_body_has_no_page_field', async () => {
        reply({ status: 200, body: '{}' }, { status: 200, body: '{}' })
        let client = makeClient(path, { throwPageLoadFailures: true })

        let error = await loadFailure(client)

        expect((error as WeaverseLoadError)?.kind).toBe('invalid-response')
      })

      it('should_resolve_null_when_the_project_does_not_exist', async () => {
        reply({ status: 404, body: PROJECT_NOT_FOUND })
        let client = makeClient(path, { throwPageLoadFailures: true })

        let result = await client.loadPage({ type: 'INDEX' })

        expect(result).toBeNull()
      })

      it('should_resolve_a_fallback_page_when_nothing_is_assigned_at_the_url', async () => {
        reply({ status: 200, body: UNASSIGNED_PAGE })
        let client = makeClient(path, { throwPageLoadFailures: true })

        let result = await client.loadPage({ type: 'INDEX' })

        expect(result?.page.id).toMatch(/^fallback_page_/)
      })

      it('should_resolve_the_page_when_the_retry_succeeds', async () => {
        reply({ status: 503, body: '{}' }, { status: 200, body: VALID_PAGE })
        let client = makeClient('direct', { throwPageLoadFailures: true })

        let result = await client.loadPage({ type: 'INDEX' })

        expect(result?.page.id).toBe('page-1')
      })
    })
  }

  it('should_keep_one_retry_when_the_api_is_unavailable', async () => {
    reply({ status: 503, body: '{}' }, { status: 503, body: '{}' })
    let client = makeClient('direct', { throwPageLoadFailures: true })

    await loadFailure(client)

    expect(requests).toBe(2)
  })

  it('should_reject_as_unavailable_when_the_api_cannot_be_reached', async () => {
    let client = makeClient('direct', { throwPageLoadFailures: true })
    server.closeAllConnections()
    server.close()

    let error = await loadFailure(client)

    expect((error as WeaverseLoadError)?.kind).toBe('unavailable')
  })

  it('should_reject_as_invalid_response_when_a_successful_body_is_not_json', async () => {
    reply(
      { status: 200, body: '<html>edge</html>' },
      { status: 200, body: '<html>edge</html>' }
    )
    let client = makeClient('direct', { throwPageLoadFailures: true })

    let error = await loadFailure(client)

    expect((error as WeaverseLoadError)?.kind).toBe('invalid-response')
  })

  it('should_reject_as_configuration_when_a_route_project_id_is_invalid', async () => {
    let client = makeClient('direct', { throwPageLoadFailures: true })

    let error = await client
      .loadPage({ projectId: 'bad id!' })
      .catch((e: unknown) => e)

    expect((error as WeaverseLoadError)?.kind).toBe('configuration')
  })

  it('should_expose_a_weaverse_error_when_a_load_fails', async () => {
    reply({ status: 503, body: '{}' }, { status: 503, body: '{}' })
    let client = makeClient('direct', { throwPageLoadFailures: true })

    let error = await loadFailure(client)

    expect(error).toBeInstanceOf(WeaverseError)
  })

  it('should_keep_the_fallback_page_in_design_mode_when_nothing_is_assigned', async () => {
    reply({ status: 200, body: UNASSIGNED_PAGE })
    let client = makeClient('direct', {
      throwPageLoadFailures: true,
      url: 'https://shop.test/?isDesignMode=true&weaverseProjectId=proj-1',
    })

    let result = await client.loadPage({ type: 'INDEX' })

    expect(result?.page.id).toMatch(/^fallback_page_/)
  })

  it('should_not_cache_an_invalid_body_when_requests_go_through_hydrogen', async () => {
    let cache = new InMemoryCache()
    reply({ status: 200, body: '{}' }, { status: 200, body: VALID_PAGE })
    await loadFailure(
      makeClient('cached', { throwPageLoadFailures: true, cache })
    )

    let result = await makeClient('cached', {
      throwPageLoadFailures: true,
      cache,
    }).loadPage({ type: 'INDEX' })

    expect(result?.page.id).toBe('page-1')
  })
})

describe('loadPage without the opt-in', () => {
  it('should_resolve_null_when_the_api_keeps_answering_5xx', async () => {
    reply({ status: 503, body: '{}' }, { status: 503, body: '{}' })
    let client = makeClient('direct')

    let result = await client.loadPage({ type: 'INDEX' })

    expect(result).toBeNull()
  })

  it('should_keep_the_historical_fallback_page_when_a_successful_body_is_malformed', async () => {
    reply({ status: 200, body: '{}' })
    let client = makeClient('direct')

    let result = await client.loadPage({ type: 'INDEX' })

    expect(result?.page.id).toMatch(/^fallback_page_/)
  })

  it('should_resolve_null_instead_of_a_placeholder_page_when_the_cached_path_gets_5xx', async () => {
    reply({ status: 500, body: '{}' })
    let client = makeClient('cached')

    let result = await client.loadPage({ type: 'INDEX' })

    expect(result).toBeNull()
  })
})

describe('loadThemeSettings envelope validation', () => {
  for (let path of ['direct', 'cached'] as const) {
    it(`should_mark_the_load_failed_when_a_successful_body_has_no_theme_field (${path})`, async () => {
      reply({ status: 200, body: '{}' })
      let client = makeClient(path)

      let result = await client.loadThemeSettings()

      expect(result._loadFailed).toBe(true)
    })

    it(`should_mark_the_load_failed_when_the_api_answers_5xx (${path})`, async () => {
      reply({ status: 500, body: '{}' }, { status: 500, body: '{}' })
      let client = makeClient(path)

      let result = await client.loadThemeSettings()

      expect(result._loadFailed).toBe(true)
    })
  }

  it('should_use_schema_defaults_without_a_failure_mark_when_the_merchant_never_saved_settings', async () => {
    reply({ status: 200, body: '{"projectId":"proj-1","theme":null}' })
    let client = makeClient('direct')

    let result = await client.loadThemeSettings()

    expect(result).toMatchObject({ theme: { logoText: 'DEMO' } })
    expect(result._loadFailed).toBeUndefined()
  })

  it('should_merge_saved_settings_without_a_failure_mark_when_the_body_is_valid', async () => {
    reply({ status: 200, body: '{"theme":{"logoText":"Merchant"}}' })
    let client = makeClient('cached')

    let result = await client.loadThemeSettings()

    expect(result).toMatchObject({ theme: { logoText: 'Merchant' } })
    expect(result._loadFailed).toBeUndefined()
  })

  it('should_not_cache_an_invalid_theme_body_when_requests_go_through_hydrogen', async () => {
    let cache = new InMemoryCache()
    reply(
      { status: 200, body: '{}' },
      { status: 200, body: '{"theme":{"logoText":"Merchant"}}' }
    )
    await makeClient('cached', { cache }).loadThemeSettings()

    let result = await makeClient('cached', { cache }).loadThemeSettings()

    expect(result.theme).toEqual({ logoText: 'Merchant' })
  })
})
