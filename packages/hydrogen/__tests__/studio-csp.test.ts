import { describe, expect, it } from 'vitest'
import { getWeaverseStudioCspDirectives } from '../src/utils/studio-csp'

describe('getWeaverseStudioCspDirectives', () => {
  it('should_return_no_directives_when_not_in_studio', () => {
    // Arrange
    let request = new Request('https://shop.example/products/hat')

    // Act
    let directives = getWeaverseStudioCspDirectives(request)

    // Assert
    expect(directives).toEqual({})
  })

  it('should_allow_the_trusted_studio_origin_when_in_design_mode', () => {
    // Arrange
    let request = new Request(
      'https://shop.example/?isDesignMode=true&weaverseHost=https://studio.weaverse.io'
    )

    // Act
    let directives = getWeaverseStudioCspDirectives(request)

    // Assert
    expect(directives).toEqual({
      connectSrc: ['https://studio.weaverse.io'],
      fontSrc: ['https://studio.weaverse.io'],
      frameAncestors: ['https://studio.weaverse.io'],
      imgSrc: ['https://studio.weaverse.io'],
      scriptSrc: ['https://studio.weaverse.io', "'unsafe-eval'"],
      styleSrc: ['https://studio.weaverse.io'],
    })
  })

  it('should_return_no_directives_when_weaverse_host_is_untrusted', () => {
    // Arrange
    let request = new Request(
      'https://shop.example/?isDesignMode=true&weaverseHost=https://evil.example'
    )

    // Act
    let directives = getWeaverseStudioCspDirectives(request)

    // Assert
    expect(directives).toEqual({})
  })

  it('should_skip_unsafe_eval_when_previewing', () => {
    // Arrange
    let request = new Request(
      'https://shop.example/?isPreviewMode=true&weaverseHost=https://studio.weaverse.io'
    )

    // Act
    let directives = getWeaverseStudioCspDirectives(request)

    // Assert
    expect(directives.scriptSrc).toEqual(['https://studio.weaverse.io'])
  })

  it('should_reject_a_loopback_host_when_the_storefront_is_public', () => {
    // Arrange
    let request = new Request(
      'https://shop.example/?isDesignMode=true&weaverseHost=http://localhost:3000'
    )

    // Act
    let directives = getWeaverseStudioCspDirectives(request)

    // Assert
    expect(directives).toEqual({})
  })

  it('should_return_no_directives_when_the_url_is_relative', () => {
    // Act
    let directives = getWeaverseStudioCspDirectives('/?isDesignMode=true')

    // Assert
    expect(directives).toEqual({})
  })

  it('should_use_the_last_weaverse_host_when_the_param_is_duplicated', () => {
    // Arrange
    let request = new Request(
      'https://shop.example/?weaverseHost=https://evil.example&isDesignMode=true&weaverseHost=https://studio.weaverse.io'
    )

    // Act
    let directives = getWeaverseStudioCspDirectives(request)

    // Assert
    expect(directives.frameAncestors).toEqual(['https://studio.weaverse.io'])
  })

  it('should_allow_the_studio_origin_when_previewing_a_revision', () => {
    // Arrange
    let request = new Request(
      'https://shop.example/?__revisionId=r1&weaverseHost=https://studio.weaverse.io'
    )

    // Act
    let directives = getWeaverseStudioCspDirectives(request)

    // Assert
    expect(directives.frameAncestors).toEqual(['https://studio.weaverse.io'])
  })
})
