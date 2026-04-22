import { describe, expect, it, spyOn } from 'bun:test'
import type { CustomPageEntry } from '../src/types'

type ApiResponse = { data: CustomPageEntry[]; nextCursor: string | null }

function makeClient(fetchImpl: (url: string) => Promise<Response>) {
  return {
    configs: {
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
      Promise.resolve(
        Response.json({ data: [ENTRY], nextCursor: null })
      )
    )
    expect(await fetchPages(client)).toEqual([ENTRY])
  })

  it('returns [] for empty data', async () => {
    const client = makeClient(() =>
      Promise.resolve(
        Response.json({ data: [], nextCursor: null })
      )
    )
    expect(await fetchPages(client)).toEqual([])
  })

  it('returns [] and warns on network error', async () => {
    const warnSpy = spyOn(console, 'warn').mockImplementation(() => {})
    const client = makeClient(() =>
      Promise.reject(new Error('Network failure'))
    )
    expect(await fetchPages(client)).toEqual([])
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('returns [] and warns with status on 404', async () => {
    const warnSpy = spyOn(console, 'warn').mockImplementation(() => {})
    const client = makeClient(() =>
      Promise.resolve(new Response('Not found', { status: 404 }))
    )
    expect(await fetchPages(client)).toEqual([])
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('404'))
    warnSpy.mockRestore()
  })

  it('appends locale param to URL', async () => {
    let capturedUrl = ''
    const client = makeClient((url) => {
      capturedUrl = url
      return Promise.resolve(
        Response.json({ data: [], nextCursor: null })
      )
    })
    await fetchPages(client, { locale: 'fr' })
    expect(capturedUrl).toContain('locale=fr')
  })

  it('returns accumulated entries when later page fails', async () => {
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
    const warnSpy = spyOn(console, 'warn').mockImplementation(() => {})
    const result = await fetchPages(client)
    expect(result).toEqual([ENTRY])
    warnSpy.mockRestore()
  })

  it('stops at pagination cap (100 iterations)', async () => {
    let callCount = 0
    const cursor = btoa('1000:id')
    const client = makeClient(() => {
      callCount++
      return Promise.resolve(
        Response.json({ data: [ENTRY], nextCursor: cursor })
      )
    })
    await fetchPages(client)
    expect(callCount).toBeLessThanOrEqual(100)
  })

  it('warns when pagination cap reached', async () => {
    const cursor = btoa('1000:id')
    const warnSpy = spyOn(console, 'warn').mockImplementation(() => {})
    let callCount = 0
    const client = makeClient(() => {
      callCount++
      return Promise.resolve(
        Response.json({ data: [ENTRY], nextCursor: cursor })
      )
    })
    const result = await fetchPages(client)
    expect(result.length).toBeGreaterThan(0)
    if (callCount >= 100) {
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('pagination cap')
      )
    }
    warnSpy.mockRestore()
  })
})
