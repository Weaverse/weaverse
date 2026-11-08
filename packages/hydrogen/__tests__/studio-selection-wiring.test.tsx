// @vitest-environment happy-dom
import type * as WeaverseReact from '@weaverse/react'
import { useStudioSelection } from '@weaverse/react'
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type * as ReactRouter from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { WeaverseHydrogen } from '../src/internal'
import type { WeaverseLoaderData } from '../src/types'
import { WeaverseHydrogenRoot, withWeaverse } from '../src/WeaverseHydrogenRoot'

vi.mock('@weaverse/react', async (importOriginal) => ({
  ...(await importOriginal<typeof WeaverseReact>()),
  // The Studio bridge script never loads in tests.
  loadScript: vi.fn(() => new Promise(() => {})),
}))

// Only the store wiring is under test; an idle route on `/` is enough.
vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactRouter>()),
  useLoaderData: () => undefined,
  useLocation: () => ({ pathname: '/', search: '' }),
  useMatches: () => [],
  useNavigate: () => vi.fn(),
  useNavigation: () => ({ state: 'idle' }),
  useRevalidator: () => ({ revalidate: vi.fn() }),
  useRouteLoaderData: () => undefined,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const PAGE_ID = 'page-1'

const DESIGN_MODE_PAGE = {
  configs: {
    isDesignMode: true,
    weaverseHost: 'https://studio.weaverse.test',
    weaverseVersion: '6.0.0',
    requestInfo: { pathname: '/', search: '' },
  },
  page: {
    id: PAGE_ID,
    rootId: 'root',
    items: [{ id: 'root', type: 'main', data: {}, children: [] }],
  },
  project: { id: 'project-1' },
} as unknown as WeaverseLoaderData

function Popup() {
  let { selectedThemeGroup } = useStudioSelection()
  return <output>{selectedThemeGroup ?? 'none'}</output>
}

let Layout = withWeaverse(({ children }: { children: ReactNode }) => (
  <>
    <Popup />
    {children}
  </>
))

let root: Root | undefined

async function render(element: ReactNode) {
  let container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  await act(async () => {
    root?.render(element)
  })
  return container
}

type RuntimeWindow = Window & {
  __weaverses?: Record<string, WeaverseHydrogen>
}

// createWeaverseInstance registers each page's instance on the window.
function bridgeStore() {
  let runtimeWindow: RuntimeWindow = window
  return runtimeWindow.__weaverses?.[PAGE_ID]?.internal.studioSelectionStore
}

afterEach(() => {
  act(() => root?.unmount())
  root = undefined
  document.body.innerHTML = ''
  Reflect.deleteProperty(window, '__weaverses')
})

describe('Studio selection wiring', () => {
  it('reaches a layout reader from the store the Studio bridge writes', async () => {
    let container = await render(
      <Layout>
        <WeaverseHydrogenRoot components={[]} data={DESIGN_MODE_PAGE} />
      </Layout>
    )
    let store = bridgeStore()

    expect(store).toBeTruthy()
    await act(async () => {
      store?.setSelection({
        selectedItemId: null,
        selectedThemeGroup: 'Newsletter Popup',
      })
    })
    expect(container.querySelector('output')?.textContent).toBe(
      'Newsletter Popup'
    )
  })
})
