import { describe, expect, it } from 'vitest'

import type { CustomPageEntry } from '../src/types'

type ApiResponse = { data: CustomPageEntry[]; nextCursor: string | null }

function makeClient(fetchImpl: (url: string) => Promise<Response>) {
  return {
    configs: {
      weaverseApiBase: 'https://cdn.weaverse.io',
      weaverseHost: 'https://builder.weaverse.io',
      projectId: 'test-project-id',
    },
    fetchWithCache: async (url: string) => {
      const res = await fetchImpl(url)
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`)
        ;(err as any).status = res.status
        throw err
      }
      return res.json()
    },
  }
}

const { WeaverseClient } = await import('../src/weaverse-client')

function fetchPages(
  client: ReturnType<typeof makeClient>,
  opts?: { locale?: string; limit?: number }
) {
  return WeaverseClient.prototype.fetchCustomPages.call(client, opts)
}

const ENTRY: CustomPageEntry = {
  handle: 'about',
  locale: null,
  path: '/about',
  lastModified: '2026-04-01T10:00:00.000Z',
  priority: 0.7,
  changeFrequency: 'weekly',
}

describe('fetchCustomPages', () => {
  it('returns parsed entries on success', async () => {
    const client = makeClient(() =>
      Promise.resolve(Response.json({ data: [ENTRY], nextCursor: null }))
    )
    expect(await fetchPages(client)).toEqual([ENTRY])
  })

  it('returns [] for empty data', async () => {
    const client = makeClient(() =>
      Promise.resolve(Response.json({ data: [], nextCursor: null }))
    )
    expect(await fetchPages(client)).toEqual([])
  })

  it('rejects on network error', async () => {
    const client = makeClient(() =>
      Promise.reject(new Error('Network failure'))
    )
    await expect(fetchPages(client)).rejects.toThrow('Network failure')
  })

  it('rejects on 404', async () => {
    const client = makeClient(() =>
      Promise.resolve(new Response('Not found', { status: 404 }))
    )
    await expect(fetchPages(client)).rejects.toThrow('404')
  })

  it('appends locale param to URL', async () => {
    let capturedUrl = ''
    const client = makeClient((url) => {
      capturedUrl = url
      return Promise.resolve(Response.json({ data: [], nextCursor: null }))
    })
    await fetchPages(client, { locale: 'fr' })
    expect(capturedUrl).toContain('locale=fr')
  })

  it('uses public api base instead of studio host when configured', async () => {
    let capturedUrl = ''
    const client = makeClient((url) => {
      capturedUrl = url
      return Promise.resolve(Response.json({ data: [], nextCursor: null }))
    })
    await fetchPages(client)
    const parsed = new URL(capturedUrl)
    expect(parsed.origin).toBe('https://cdn.weaverse.io')
    expect(parsed.pathname.startsWith('/api/public/')).toBe(true)
  })

  it('rejects instead of returning accumulated entries when a later page fails', async () => {
    const cursor = btoa('1000:some-id')
    let callCount = 0
    const client = makeClient(() => {
      callCount++
      if (callCount === 1) {
        return Promise.resolve(
          Response.json({ data: [ENTRY], nextCursor: cursor })
        )
      }
      return Promise.reject(new Error('Network failure on page 2'))
    })
    await expect(fetchPages(client)).rejects.toThrow('after 1 entries')
  })

  it('rejects after at most 100 pages when the cursor never ends', async () => {
    let callCount = 0
    const cursor = btoa('1000:id')
    const client = makeClient(() => {
      callCount++
      return Promise.resolve(
        Response.json({ data: [ENTRY], nextCursor: cursor })
      )
    })
    await expect(fetchPages(client)).rejects.toThrow('pagination cap')
    expect(callCount).toBe(100)
  })
})
