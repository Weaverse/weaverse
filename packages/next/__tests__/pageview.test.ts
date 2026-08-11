import { afterEach, describe, expect, it, vi } from 'vitest'
import { createWeaverseNextClient } from '../src/client'
import { createPageviewCoordinator } from '../src/pageview'
import { createWeaverseNextRuntime } from '../src/runtime'
import {
  getPageviewNavigationIdentity,
  getPageviewPayload,
  sendPageview,
} from '../src/use-pageview'

class ImageStub {
  onerror: (() => void) | null = null
  onload: (() => void) | null = null
  remove = vi.fn()
  src = ''
}

function stubImageConstructor() {
  let images: ImageStub[] = []
  vi.stubGlobal(
    'Image',
    class extends ImageStub {
      constructor() {
        super()
        images.push(this)
      }
    }
  )
  return images
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('pageview coordinator', () => {
  it('should_fire_for_an_initial_published_navigation', () => {
    // Arrange
    let coordinator = createPageviewCoordinator()

    // Act
    let fired = coordinator.shouldFire('/products/one', 'page-one')

    // Assert
    expect(fired).toBe(true)
  })

  it('should_deduplicate_same_page_co_located_runtimes', () => {
    // Arrange
    let coordinator = createPageviewCoordinator()

    // Act
    let results = [
      coordinator.shouldFire('/products/one', 'page-one'),
      coordinator.shouldFire('/products/one', 'page-one'),
    ]

    // Assert
    expect(results).toEqual([true, false])
  })

  it('should_count_distinct_co_located_page_ids_separately', () => {
    // Arrange
    let coordinator = createPageviewCoordinator()

    // Act
    let results = [
      coordinator.shouldFire('/help', 'page-layout'),
      coordinator.shouldFire('/help', 'page-child'),
      coordinator.shouldFire('/help', 'page-child'),
    ]

    // Assert
    expect(results).toEqual([true, true, false])
  })

  it('should_fire_again_when_a_persistent_runtime_observes_client_navigation', () => {
    // Arrange
    let coordinator = createPageviewCoordinator()
    coordinator.shouldFire('/products/one', 'page-layout')

    // Act
    let fired = coordinator.shouldFire('/products/two', 'page-layout')

    // Assert
    expect(fired).toBe(true)
  })

  it('should_not_double_fire_when_same_navigation_remounts_after_an_async_gap', async () => {
    // Arrange
    let coordinator = createPageviewCoordinator()
    coordinator.shouldFire('/products/one', 'page-one')
    await Promise.resolve()

    // Act
    let fired = coordinator.shouldFire('/products/one', 'page-one')

    // Assert
    expect(fired).toBe(false)
  })

  it('should_fire_once_when_persisted_pageshow_starts_a_new_visit', () => {
    // Arrange
    let coordinator = createPageviewCoordinator()
    coordinator.shouldFire('/products/one', 'page-one')
    let initialPageShow = { persisted: false }
    let restoredPageShow = { persisted: true }

    // Act
    coordinator.observePageShow(initialPageShow)
    let afterInitialPageShow = coordinator.shouldFire(
      '/products/one',
      'page-one'
    )
    coordinator.observePageShow(restoredPageShow)
    let afterRestore = coordinator.shouldFire('/products/one', 'page-one')
    coordinator.observePageShow(restoredPageShow)
    let afterDuplicateDelivery = coordinator.shouldFire(
      '/products/one',
      'page-one'
    )

    // Assert
    expect([
      afterInitialPageShow,
      afterRestore,
      afterDuplicateDelivery,
    ]).toEqual([false, true, false])
  })

  it('should_allow_revisit_after_observing_a_non_weaverse_route_detour', () => {
    // Arrange
    let coordinator = createPageviewCoordinator()
    coordinator.shouldFire('/products/one', 'page-one')
    coordinator.observeNavigation('/cart')
    coordinator.observeNavigation('/products/one')

    // Act
    let fired = coordinator.shouldFire('/products/one', 'page-one')

    // Assert
    expect(fired).toBe(true)
  })

  it('should_use_current_navigation_and_page_when_runtime_is_reused', () => {
    // Arrange
    let coordinator = createPageviewCoordinator()
    coordinator.shouldFire('/products/one', 'page-one')

    // Act
    let results = [
      coordinator.shouldFire('/products/two', 'page-two'),
      coordinator.shouldFire('/products/two', 'page-two'),
    ]

    // Assert
    expect(results).toEqual([true, false])
  })
})

describe('pageview hook inputs', () => {
  it('should_normalize_search_parameter_order_for_navigation_identity', () => {
    // Arrange
    let first = new URLSearchParams('sort=price&color=red')
    let second = new URLSearchParams('color=red&sort=price')

    // Act
    let identities = [
      getPageviewNavigationIdentity('/products', first),
      getPageviewNavigationIdentity('/products', second),
    ]

    // Assert
    expect(new Set(identities).size).toBe(1)
  })

  it('should_skip_non_published_modes_and_missing_required_values', () => {
    // Arrange
    let published = {
      isDesignMode: false,
      isPreviewMode: false,
      isRevisionPreview: false,
      pageId: 'page-one',
      projectId: 'project-one',
      sectionType: undefined,
      weaverseHost: 'https://studio.weaverse.io',
    }
    let candidates = [
      null,
      { ...published, isDesignMode: true },
      { ...published, isPreviewMode: true },
      { ...published, isRevisionPreview: true },
      { ...published, sectionType: 'hero' },
      { ...published, weaverseHost: '' },
      { ...published, projectId: '' },
      { ...published, pageId: '' },
    ]

    // Act
    let results = candidates.map((candidate) => getPageviewPayload(candidate))

    // Assert
    expect(results).toEqual(candidates.map(() => null))
  })

  it('should_return_transport_values_for_published_runtime', () => {
    // Arrange
    let runtime = {
      isDesignMode: false,
      isPreviewMode: false,
      isRevisionPreview: false,
      pageId: 'page-one',
      projectId: 'project-one',
      sectionType: undefined,
      weaverseHost: 'https://studio.weaverse.io',
    }

    // Act
    let payload = getPageviewPayload(runtime)

    // Assert
    expect(payload).toEqual({
      host: 'https://studio.weaverse.io',
      pageId: 'page-one',
      projectId: 'project-one',
    })
  })
})

describe('hydrated pageview eligibility', () => {
  it.each([
    ['serialized design', { isDesignMode: true }, {}, { isDesignMode: true }],
    [
      'explicit design',
      { isDesignMode: false },
      { isDesignMode: true },
      { isDesignMode: true },
    ],
    [
      'serialized preview',
      { isPreviewMode: true },
      {},
      { isPreviewMode: true },
    ],
    [
      'explicit preview',
      { isPreviewMode: false },
      { isPreviewMode: true },
      { isPreviewMode: true },
    ],
    [
      'serialized revision preview',
      { isRevisionPreview: true },
      {},
      { isRevisionPreview: true },
    ],
    [
      'explicit revision preview',
      { isRevisionPreview: false },
      { isRevisionPreview: true },
      { isRevisionPreview: true },
    ],
    [
      'serialized section preview',
      { sectionType: 'main' },
      {},
      { sectionType: 'main' },
    ],
    [
      'explicit section preview',
      { sectionType: '' },
      { sectionType: 'main' },
      { sectionType: 'main' },
    ],
    // A client-supplied request context must never downgrade a mode the server
    // already resolved for this request — that would bill preview traffic as a
    // published pageview.
    [
      'serialized design over explicit published',
      { isDesignMode: true },
      { isDesignMode: false },
      { isDesignMode: true },
    ],
    [
      'serialized preview over explicit published',
      { isPreviewMode: true },
      { isPreviewMode: false },
      { isPreviewMode: true },
    ],
    [
      'serialized revision preview over explicit published',
      { isRevisionPreview: true },
      { isRevisionPreview: false },
      { isRevisionPreview: true },
    ],
    [
      'serialized section preview over explicit published',
      { sectionType: 'main' },
      { sectionType: '' },
      { sectionType: 'main' },
    ],
  ])('should_honor_%s_state_during_hydration_and_reuse', (mode, modeConfig, requestContext, expectedMode) => {
    // Arrange
    vi.stubGlobal('window', {})
    let client = createWeaverseNextClient({
      components: [],
      projectId: `project-${mode}`,
      requestContext: {
        pathname: '/products/one',
        ...requestContext,
      },
    })
    let data = {
      configs: {
        ...modeConfig,
        weaverseHost: 'https://studio.weaverse.io',
      },
      page: {
        id: `page-${mode}`,
        items: [],
      },
    }

    // Act
    let runtime = createWeaverseNextRuntime({ client, data })
    let reusedRuntime = createWeaverseNextRuntime({ client, data })
    let payload = getPageviewPayload(reusedRuntime)

    // Assert
    expect(reusedRuntime).toBe(runtime)
    expect(reusedRuntime).toMatchObject(expectedMode)
    expect(payload).toBeNull()
  })
})

describe('sendPageview', () => {
  it('should_encode_transport_query_parameters', () => {
    // Arrange
    let images = stubImageConstructor()

    // Act
    sendPageview({
      host: 'https://studio.weaverse.io/base',
      pageId: 'page / one',
      projectId: 'project + one',
    })

    // Assert
    let url = new URL(images[0]?.src ?? '')
    expect(url.searchParams.has('cacheBust')).toBe(true)
    url.searchParams.delete('cacheBust')
    expect(url.toString()).toBe(
      'https://studio.weaverse.io/api/public/px?projectId=project+%2B+one&pageId=page+%2F+one'
    )
  })

  it('should_use_distinct_urls_for_repeated_pageviews', () => {
    // Arrange
    let images = stubImageConstructor()
    let payload = {
      host: 'https://studio.weaverse.io',
      pageId: 'page-one',
      projectId: 'project-one',
    }

    // Act
    sendPageview(payload)
    sendPageview(payload)

    // Assert
    expect(images[0]?.src).not.toBe(images[1]?.src)
  })

  it('should_remove_transport_image_when_network_errors', () => {
    // Arrange
    let images = stubImageConstructor()
    sendPageview({
      host: 'https://studio.weaverse.io',
      pageId: 'page-one',
      projectId: 'project-one',
    })

    // Act
    images[0]?.onerror?.()

    // Assert
    expect(images[0]?.remove).toHaveBeenCalledOnce()
  })

  it('should_never_throw_when_transport_setup_fails', () => {
    // Arrange
    vi.stubGlobal(
      'Image',
      class {
        constructor() {
          throw new Error('Image unavailable')
        }
      }
    )

    // Act + Assert
    expect(() =>
      sendPageview({
        host: 'https://studio.weaverse.io',
        pageId: 'page-one',
        projectId: 'project-one',
      })
    ).not.toThrow()
  })
})
