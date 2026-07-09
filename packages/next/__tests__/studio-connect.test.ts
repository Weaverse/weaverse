import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadWeaverseNextStudioScript } from '../src/studio-connect'
import type { WeaverseNextRequestContext } from '../src/types'

interface FakeScriptElement {
  async?: boolean
  src?: string
}

const SCRIPT_SELECTOR_SRC_REGEX = /^script\[src="(.*)"\]$/

function createDocumentStub() {
  let appended: FakeScriptElement[] = []
  let document = {
    createElement: (tag: string) => {
      if (tag !== 'script') {
        throw new Error(`Unexpected tag: ${tag}`)
      }
      return {} as FakeScriptElement
    },
    head: {
      appendChild: (script: FakeScriptElement) => {
        appended.push(script)
      },
    },
    querySelector: (selector: string) => {
      let src = selector.match(SCRIPT_SELECTOR_SRC_REGEX)?.[1]
      return appended.find((script) => script.src === src) ?? null
    },
  }
  return { appended, document }
}

describe('loadWeaverseNextStudioScript', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should_load_design_mode_script_with_no_page_or_runtime_data', () => {
    // Arrange — simulates mounting the connector in a root layout on a
    // not-found.tsx / error.tsx route: no page/runtime/renderer data exists.
    let { appended, document } = createDocumentStub()
    vi.stubGlobal('document', document)
    let context: WeaverseNextRequestContext = {
      searchParams: new URLSearchParams(
        'isDesignMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=error-route-test'
      ),
    }

    // Act
    loadWeaverseNextStudioScript(context, {
      storefrontHostname: 'shop.example',
    })

    // Assert
    expect(appended).toHaveLength(1)
    expect(appended[0]?.src).toBe(
      'https://studio.weaverse.io/static/studio/next/index.js?v=error-route-test'
    )
    expect(appended[0]?.async).toBe(true)
  })

  it('should_load_preview_mode_script', () => {
    // Arrange
    let { appended, document } = createDocumentStub()
    vi.stubGlobal('document', document)
    let context: WeaverseNextRequestContext = {
      searchParams: new URLSearchParams(
        'isPreviewMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=preview-route-test'
      ),
    }

    // Act
    loadWeaverseNextStudioScript(context, {
      storefrontHostname: 'shop.example',
    })

    // Assert
    expect(appended).toHaveLength(1)
    expect(appended[0]?.src).toBe(
      'https://studio.weaverse.io/static/studio/next/preview.js?v=preview-route-test'
    )
  })

  it('should_append_duplicate_src_only_once', () => {
    // Arrange
    let { appended, document } = createDocumentStub()
    vi.stubGlobal('document', document)
    let context: WeaverseNextRequestContext = {
      searchParams: new URLSearchParams(
        'isDesignMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=dedupe-test'
      ),
    }

    // Act
    loadWeaverseNextStudioScript(context, {
      storefrontHostname: 'shop.example',
    })
    loadWeaverseNextStudioScript(context, {
      storefrontHostname: 'shop.example',
    })

    // Assert
    expect(appended).toHaveLength(1)
  })

  it('should_no_op_without_document', () => {
    // Arrange — SSR path: no `document` global available.
    vi.stubGlobal('document', undefined)
    let context: WeaverseNextRequestContext = {
      searchParams: new URLSearchParams(
        'isDesignMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=ssr-test'
      ),
    }

    // Act + Assert — must not throw.
    expect(() =>
      loadWeaverseNextStudioScript(context, {
        storefrontHostname: 'shop.example',
      })
    ).not.toThrow()
  })

  it('should_not_append_script_for_untrusted_weaverse_host', () => {
    // Arrange
    let { appended, document } = createDocumentStub()
    vi.stubGlobal('document', document)
    let context: WeaverseNextRequestContext = {
      searchParams: new URLSearchParams(
        'isDesignMode=true&weaverseHost=https%3A%2F%2Fweaverse.io.evil.example'
      ),
    }

    // Act
    loadWeaverseNextStudioScript(context, {
      storefrontHostname: 'shop.example',
    })

    // Assert
    expect(appended).toHaveLength(0)
  })
})
