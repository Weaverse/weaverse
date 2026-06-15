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

  it('ignores a crafted weaverseHost and falls back to the default host', () => {
    // The bridge executes in the storefront document; a URL-supplied host must
    // never be able to point it at an attacker origin.
    let search =
      '?isDesignMode=true&weaverseHost=https%3A%2F%2Fattacker.example&weaverseVersion=9'
    expect(resolveStudioScriptSrc(search)).toBe(
      `${HOST}/static/studio/hydrogen/index.js?v=9`
    )
  })

  it('rejects a look-alike host that only suffixes a trusted domain', () => {
    let search =
      '?isDesignMode=true&weaverseHost=https%3A%2F%2Fweaverse.io.attacker.com&weaverseVersion=9'
    expect(resolveStudioScriptSrc(search)).toBe(
      `${HOST}/static/studio/hydrogen/index.js?v=9`
    )
  })
})

describe('isTrustedStudioHost', () => {
  it('trusts weaverse.io / weaverse.dev and their subdomains', () => {
    expect(isTrustedStudioHost('https://studio.weaverse.io')).toBe(true)
    expect(isTrustedStudioHost('https://preview.weaverse.io')).toBe(true)
    expect(isTrustedStudioHost('https://weaverse.io')).toBe(true)
    expect(isTrustedStudioHost('https://foo.weaverse.dev')).toBe(true)
  })

  it('trusts localhost for previewing against a local builder', () => {
    expect(isTrustedStudioHost('http://localhost:3456')).toBe(true)
    expect(isTrustedStudioHost('http://127.0.0.1:3456')).toBe(true)
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
