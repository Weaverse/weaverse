import {
  StudioSelectionStore,
  StudioSelectionStoreContext,
  useWeaverse,
} from '@weaverse/react'
import { useContext } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { WeaverseNextRuntime } from '../src/index'
import {
  createSchema,
  createWeaverseNextClient,
  createWeaverseNextRuntime,
  WeaverseNextProvider,
  WeaverseNextRenderer,
  WeaverseNextRootProvider,
} from '../src/index'

type Seen = {
  root?: StudioSelectionStore | null
  page?: StudioSelectionStore | null
  runtime?: StudioSelectionStore
}

// Runtimes, item instances and component types are registered globally, so
// each test renders its own page with its own probe component.
let pageCount = 0

function setup() {
  let seen: Seen = {}
  let suffix = ++pageCount
  function RootProbe() {
    seen.root = useContext(StudioSelectionStoreContext)
    return null
  }
  function PageProbe() {
    seen.page = useContext(StudioSelectionStoreContext)
    seen.runtime =
      useWeaverse<WeaverseNextRuntime>().internal.studioSelectionStore
    return null
  }
  let client = createWeaverseNextClient({
    projectId: 'proj-test',
    components: [
      {
        default: PageProbe,
        schema: createSchema({ type: `probe-${suffix}`, title: 'Probe' }),
      },
    ],
  })
  client.data = {
    page: {
      id: `page-probe-${suffix}`,
      rootId: `probe-root-${suffix}`,
      items: [{ id: `probe-root-${suffix}`, type: `probe-${suffix}` }],
    },
  }
  return { seen, client, RootProbe }
}

describe('Studio selection store in @weaverse/next', () => {
  it('should_share_one_store_between_root_ui_the_page_and_the_runtime', () => {
    // Arrange
    let { seen, client, RootProbe } = setup()

    // Act
    renderToStaticMarkup(
      <WeaverseNextRootProvider>
        <RootProbe />
        <WeaverseNextProvider client={client}>
          <WeaverseNextRenderer />
        </WeaverseNextProvider>
      </WeaverseNextRootProvider>
    )

    // Assert
    expect(seen.root).toBeInstanceOf(StudioSelectionStore)
    expect(seen.page).toBe(seen.root)
    expect(seen.runtime).toBe(seen.root)
  })

  it('should_give_the_runtime_the_route_store_when_no_root_provider_is_mounted', () => {
    // Arrange
    let { seen, client } = setup()

    // Act
    renderToStaticMarkup(
      <WeaverseNextProvider client={client}>
        <WeaverseNextRenderer />
      </WeaverseNextProvider>
    )

    // Assert
    expect(seen.page).toBeInstanceOf(StudioSelectionStore)
    expect(seen.runtime).toBe(seen.page)
  })

  it('should_attach_the_new_store_when_an_existing_runtime_is_reused', () => {
    // Arrange
    let previousWindow = globalThis.window
    vi.stubGlobal('window', {} as Window & typeof globalThis)
    let { client } = setup()
    let data = client.data as NonNullable<typeof client.data>
    let first = new StudioSelectionStore()
    let second = new StudioSelectionStore()
    let runtime = createWeaverseNextRuntime({
      client,
      data,
      studioSelectionStore: first,
    })

    // Act
    let reused = createWeaverseNextRuntime({
      client,
      data,
      studioSelectionStore: second,
    })

    // Assert
    expect(reused).toBe(runtime)
    expect(reused.internal.studioSelectionStore).toBe(second)
    vi.stubGlobal('window', previousWindow)
  })
})
