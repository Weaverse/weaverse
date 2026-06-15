import { describe, expect, it } from 'vitest'
import {
  getStudioScriptSrc,
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
})
