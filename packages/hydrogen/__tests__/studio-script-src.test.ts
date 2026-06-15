import { describe, expect, it } from 'vitest'
import {
  getStudioScriptSrc,
  isTrustedStudioHost,
  resolveStudioScriptSrc,
} from '../src/utils/studio-script-src'

const HOST = 'https://studio.weaverse.io'
const V = '2026.6.15'

describe('getStudioScriptSrc', () => {
  it('returns null on a production storefront (no design/preview markers)', () => {
    // The gate that keeps the Studio bridge off live stores: a normal visitor
    // carries none of these flags, so nothing is ever loaded.
    expect(
      getStudioScriptSrc({ weaverseHost: HOST, weaverseVersion: V })
    ).toBeNull()
    expect(
      getStudioScriptSrc({
        isDesignMode: false,
        isPreviewMode: false,
        isRevisionPreview: false,
        weaverseHost: HOST,
        weaverseVersion: V,
      })
    ).toBeNull()
  })

  it('loads the design bridge (index.js) in design mode', () => {
    expect(
      getStudioScriptSrc({
        isDesignMode: true,
        weaverseHost: HOST,
        weaverseVersion: V,
      })
    ).toBe(`${HOST}/static/studio/hydrogen/index.js?v=${V}`)
  })

  it('loads the preview bridge (preview.js) in preview mode', () => {
    expect(
      getStudioScriptSrc({
        isPreviewMode: true,
        weaverseHost: HOST,
        weaverseVersion: V,
      })
    ).toBe(`${HOST}/static/studio/hydrogen/preview.js?v=${V}`)
  })

  it('loads the preview bridge for a revision preview', () => {
    expect(
      getStudioScriptSrc({
        isRevisionPreview: true,
        weaverseHost: HOST,
        weaverseVersion: V,
      })
    ).toBe(`${HOST}/static/studio/hydrogen/preview.js?v=${V}`)
  })

  it('prefers preview/revision over design when both are set', () => {
    expect(
      getStudioScriptSrc({
        isDesignMode: true,
        isRevisionPreview: true,
        weaverseHost: HOST,
        weaverseVersion: V,
      })
    ).toBe(`${HOST}/static/studio/hydrogen/preview.js?v=${V}`)
  })

  it('honors a custom (staging/self-hosted) host', () => {
    expect(
      getStudioScriptSrc({
        isDesignMode: true,
        weaverseHost: 'https://staging.example.com',
        weaverseVersion: V,
      })
    ).toBe(`https://staging.example.com/static/studio/hydrogen/index.js?v=${V}`)
  })
})

describe('resolveStudioScriptSrc (URL gate)', () => {
  it('returns null for a clean production URL', () => {
    expect(resolveStudioScriptSrc('')).toBeNull()
    expect(resolveStudioScriptSrc('?utm_source=ig&page=2')).toBeNull()
  })

  it('returns the design bridge when Studio drives the iframe', () => {
    let search =
      '?isDesignMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=2026.6.15'
    expect(resolveStudioScriptSrc(search)).toBe(
      `${HOST}/static/studio/hydrogen/index.js?v=${V}`
    )
  })

  it('treats isDesignMode as a strict "true" flag, not mere presence', () => {
    expect(resolveStudioScriptSrc('?isDesignMode=false')).toBeNull()
    expect(resolveStudioScriptSrc('?isDesignMode=1')).toBeNull()
  })

  it('returns the preview bridge for a revision preview (__revisionId)', () => {
    expect(resolveStudioScriptSrc('?__revisionId=abc&weaverseVersion=9')).toBe(
      `${HOST}/static/studio/hydrogen/preview.js?v=9`
    )
  })

  it('falls back to the default Studio host when none is supplied', () => {
    expect(resolveStudioScriptSrc('?isDesignMode=true&weaverseVersion=9')).toBe(
      `${HOST}/static/studio/hydrogen/index.js?v=9`
    )
  })

  it('returns null for an untrusted host instead of substituting prod', () => {
    // An attacker host must never load; nor should it be silently replaced with
    // production Studio (that would inject the wrong bridge for self-hosted).
    let attacker =
      '?isDesignMode=true&weaverseHost=https%3A%2F%2Fattacker.example&weaverseVersion=9'
    expect(resolveStudioScriptSrc(attacker)).toBeNull()
    let lookalike =
      '?isDesignMode=true&weaverseHost=https%3A%2F%2Fweaverse.io.attacker.com&weaverseVersion=9'
    expect(resolveStudioScriptSrc(lookalike)).toBeNull()
  })

  it('honors a loopback host only when the storefront is also loopback', () => {
    let search =
      '?isDesignMode=true&weaverseHost=http%3A%2F%2Flocalhost%3A3456&weaverseVersion=9'
    // Production storefront: a query-supplied loopback host is ignored.
    expect(resolveStudioScriptSrc(search, 'shop.example.com')).toBeNull()
    // Local-builder dev: storefront is loopback too, so it's honored.
    expect(resolveStudioScriptSrc(search, 'localhost')).toBe(
      'http://localhost:3456/static/studio/hydrogen/index.js?v=9'
    )
  })

  it('uses the last weaverseHost when duplicated, matching the loader', () => {
    // The server's getRequestQueries keeps the last value; an earlier stale or
    // untrusted host must not make the root bridge disagree with the loader.
    let trustedLast =
      '?isDesignMode=true&weaverseHost=https%3A%2F%2Fstale.example&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=9'
    expect(resolveStudioScriptSrc(trustedLast)).toBe(
      `${HOST}/static/studio/hydrogen/index.js?v=9`
    )
    // Last value untrusted → null (consistent with the server rejecting it).
    let untrustedLast =
      '?isDesignMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseHost=https%3A%2F%2Fattacker.example&weaverseVersion=9'
    expect(resolveStudioScriptSrc(untrustedLast)).toBeNull()
  })
})

describe('isTrustedStudioHost', () => {
  it('trusts weaverse.io / weaverse.dev and their subdomains', () => {
    expect(isTrustedStudioHost('https://studio.weaverse.io')).toBe(true)
    expect(isTrustedStudioHost('https://preview.weaverse.io')).toBe(true)
    expect(isTrustedStudioHost('https://weaverse.io')).toBe(true)
    expect(isTrustedStudioHost('https://foo.weaverse.dev')).toBe(true)
  })

  it('requires https for trusted Weaverse domains (no cleartext downgrade)', () => {
    expect(isTrustedStudioHost('http://studio.weaverse.io')).toBe(false)
    expect(isTrustedStudioHost('http://preview.weaverse.io')).toBe(false)
    expect(
      isTrustedStudioHost('http://preview.weaverse.io', { allowLoopback: true })
    ).toBe(false)
  })

  it('trusts loopback hosts only when loopback is opted in', () => {
    // Server-safe default rejects loopback so a public ?weaverseHost= can't
    // turn into an SSRF target; the browser script resolver opts in.
    expect(isTrustedStudioHost('http://localhost:3456')).toBe(false)
    expect(isTrustedStudioHost('http://127.0.0.1:3456')).toBe(false)
    expect(isTrustedStudioHost('http://studio.localhost')).toBe(false)
    let opts = { allowLoopback: true }
    expect(isTrustedStudioHost('http://localhost:3456', opts)).toBe(true)
    expect(isTrustedStudioHost('http://127.0.0.1:3456', opts)).toBe(true)
    expect(isTrustedStudioHost('http://studio.localhost', opts)).toBe(true)
    // Opting in to loopback never widens trust to other untrusted hosts.
    expect(isTrustedStudioHost('https://attacker.example', opts)).toBe(false)
  })

  it('rejects untrusted, look-alike, and embedded-trusted hosts', () => {
    expect(isTrustedStudioHost('https://attacker.example')).toBe(false)
    // suffix collision without a dot boundary
    expect(isTrustedStudioHost('https://notweaverse.io')).toBe(false)
    // trusted token only as a left-hand label
    expect(isTrustedStudioHost('https://weaverse.io.attacker.com')).toBe(false)
    // trusted token in path/userinfo, not the host
    expect(isTrustedStudioHost('https://attacker.com/weaverse.io')).toBe(false)
    expect(isTrustedStudioHost('https://weaverse.io@attacker.com')).toBe(false)
  })

  it('rejects non-http(s) schemes and unparseable input', () => {
    expect(isTrustedStudioHost('javascript:alert(1)//weaverse.io')).toBe(false)
    expect(isTrustedStudioHost('//studio.weaverse.io')).toBe(false)
    expect(isTrustedStudioHost('not a url')).toBe(false)
    expect(isTrustedStudioHost('')).toBe(false)
  })
})
