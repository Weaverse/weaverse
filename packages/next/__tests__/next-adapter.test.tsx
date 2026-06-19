import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReactNode, RefObject } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import {
  createSchema,
  createWeaverseNextClient,
  runWeaverseComponentLoaders,
  useThemeSettings,
  useWeaverseCommerce,
  useWeaversePageData,
  useWeaverseRootData,
  WeaverseNextProvider,
  WeaverseNextRenderer,
} from '../src/index'
import type {
  WeaverseNextComponentLoaderArgs,
  WeaverseNextComponentProps,
  WeaverseNextLoaderData,
} from '../src/types'

const OUTSIDE_PROVIDER_ERROR = /must be used inside a <WeaverseNextProvider>/
const SRC_FILE_REGEX = /\.(ts|tsx)$/

// ─── Fixtures ────────────────────────────────────────────────────────

const heroSchema = createSchema({
  type: 'hero',
  title: 'Hero',
  settings: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Default Heading',
        },
      ],
    },
  ],
})

const Hero = ({
  ref,
  ...props
}: WeaverseNextComponentProps & { ref?: RefObject<HTMLElement | null> }) => (
  <section ref={ref}>
    <h1>{props.heading as string}</h1>
    <p>{props.text as string}</p>
    {props.children as ReactNode}
  </section>
)
Hero.displayName = 'Hero'

const heroComponent = { default: Hero, schema: heroSchema }

function makeClient(overrides = {}) {
  return createWeaverseNextClient({
    projectId: 'proj-test',
    components: [heroComponent],
    ...overrides,
  })
}

function makePageData(): WeaverseNextLoaderData {
  return {
    page: {
      id: 'page-1',
      rootId: 'item-root',
      items: [{ id: 'item-root', type: 'hero', data: { text: 'Hello World' } }],
    },
  }
}

// ─── 1. Provider hooks return explicit data ──────────────────────────

describe('WeaverseNextProvider hooks', () => {
  it('should_expose_rootData_pageData_and_commerce_when_inside_provider', () => {
    // Arrange
    let rootData = { shop: { name: 'Test Shop' } }
    let pageData = { product: { title: 'Amazing Product' } }
    let storefront = { query: vi.fn(), i18n: { country: 'US', language: 'EN' } }
    let commerce = { storefront }

    function Probe() {
      let root = useWeaverseRootData<typeof rootData>()
      let page = useWeaversePageData<typeof pageData>()
      let c = useWeaverseCommerce<typeof commerce>()
      return (
        <div>
          {root.shop.name}|{page.product.title}|{c.storefront.i18n?.country}
        </div>
      )
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextProvider
        client={makeClient()}
        commerce={commerce}
        pageData={pageData}
        rootData={rootData}
      >
        <Probe />
      </WeaverseNextProvider>
    )

    // Assert
    expect(html).toContain('Test Shop|Amazing Product|US')
  })

  it('should_expose_themeSettings_from_client_when_inside_provider', () => {
    // Arrange
    let client = makeClient({ themeSettings: { topbarText: 'Free shipping' } })

    function Probe() {
      let theme = useThemeSettings<{ topbarText: string }>()
      return <span>{theme.topbarText}</span>
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextProvider client={client}>
        <Probe />
      </WeaverseNextProvider>
    )

    // Assert
    expect(html).toContain('Free shipping')
  })
})

// ─── 2. Hooks throw outside the provider ─────────────────────────────

describe('hooks outside provider', () => {
  it('should_throw_clear_error_when_useWeaverseRootData_used_outside_provider', () => {
    // Arrange
    function Probe() {
      useWeaverseRootData()
      return null
    }

    // Act + Assert
    expect(() => renderToStaticMarkup(<Probe />)).toThrow(
      OUTSIDE_PROVIDER_ERROR
    )
  })

  it('should_throw_clear_error_when_useWeaverseCommerce_used_outside_provider', () => {
    // Arrange
    function Probe() {
      useWeaverseCommerce()
      return null
    }

    // Act + Assert
    expect(() => renderToStaticMarkup(<Probe />)).toThrow(
      OUTSIDE_PROVIDER_ERROR
    )
  })

  it('should_throw_clear_error_when_useWeaversePageData_used_outside_provider', () => {
    // Arrange
    function Probe() {
      useWeaversePageData()
      return null
    }

    // Act + Assert
    expect(() => renderToStaticMarkup(<Probe />)).toThrow(
      OUTSIDE_PROVIDER_ERROR
    )
  })
})

// ─── 3. Client fetchers are request-safe ──────────────────────────────

describe('createWeaverseNextClient', () => {
  it('should_seed_theme_schema_defaults_under_merchant_overrides', () => {
    // Arrange — theme schema declares two settings with defaults; the merchant
    // only overrides one of them.
    let themeSchema = createSchema({
      type: 'theme',
      title: 'Theme',
      settings: [
        {
          group: 'Layout',
          inputs: [
            {
              type: 'range',
              name: 'pageWidth',
              label: 'Page width',
              defaultValue: 1200,
            },
            {
              type: 'text',
              name: 'topbarText',
              label: 'Topbar text',
              defaultValue: 'Default topbar',
            },
          ],
        },
      ],
    })
    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [heroComponent],
      themeSchema,
      themeSettings: { topbarText: 'Merchant topbar' },
    })

    // Assert — schema default fills the missing key; override wins where set.
    expect(client.themeSettings).toEqual({
      pageWidth: 1200,
      topbarText: 'Merchant topbar',
    })
  })

  it('should_return_loaded_page_without_mutating_shared_client_data', async () => {
    // Arrange
    let pageData = makePageData()
    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [heroComponent],
      fetchPage: async () => pageData,
    })

    // Act
    let result = await client.loadPage({ type: 'INDEX' })

    // Assert
    expect(result).toBe(pageData)
    expect(client.data).toBeNull()
  })

  it('should_return_loaded_theme_settings_without_mutating_shared_client_theme_settings', async () => {
    // Arrange
    let themeSettings = { topbarText: 'Request scoped' }
    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [heroComponent],
      themeSettings: { topbarText: 'Initial' },
      fetchThemeSettings: async () => themeSettings,
    })

    // Act
    let result = await client.loadThemeSettings()

    // Assert
    expect(result).toBe(themeSettings)
    expect(client.themeSettings).toEqual({ topbarText: 'Initial' })
  })
})

// ─── 4. Component loader execution ───────────────────────────────────

describe('runWeaverseComponentLoaders', () => {
  it('should_pass_commerce_storefront_and_alias_then_attach_loaderData', async () => {
    // Arrange
    let queryResult = { products: [{ id: 1 }] }
    let query = vi.fn().mockResolvedValue(queryResult)
    let storefront = { query, i18n: { country: 'US', language: 'EN' } }
    let received: WeaverseNextComponentLoaderArgs | null = null

    let loaderComponent = {
      default: Hero,
      schema: createSchema({ type: 'featured', title: 'Featured' }),
      loader: async (loaderArgs: WeaverseNextComponentLoaderArgs) => {
        received = loaderArgs
        // Both the explicit commerce path and the alias must resolve.
        await loaderArgs.commerce?.storefront?.query('query Products { id }')
        await loaderArgs.weaverse.storefront?.query('query Alias { id }')
        return queryResult
      },
    }

    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [loaderComponent],
      commerce: { storefront },
      requestContext: { pathname: '/', isDesignMode: false },
    })

    let data: WeaverseNextLoaderData = {
      page: {
        id: 'page-1',
        items: [{ id: 'f1', type: 'featured', data: { count: 4 } }],
      },
    }

    // Act
    let result = await runWeaverseComponentLoaders({ client, data })

    // Assert
    expect(received).not.toBeNull()
    let capturedArgs = received as unknown as WeaverseNextComponentLoaderArgs
    expect(capturedArgs.data).toEqual({
      count: 4,
    })
    expect(query).toHaveBeenCalledTimes(2)
    expect(result).not.toBe(data)
    expect(result?.page.items[0]).not.toBe(data.page.items[0])
    expect(result?.page.items[0].loaderData).toEqual(queryResult)
    expect(data.page.items[0].loaderData).toBeUndefined()
  })

  it('should_point_weaverse_storefront_alias_at_per_call_commerce', async () => {
    // Arrange — client built with a construction-time storefront, but the
    // loader run receives a different request-scoped commerce.
    let clientQuery = vi.fn().mockResolvedValue({ from: 'client' })
    let clientStorefront = { query: clientQuery, i18n: { country: 'US' } }
    let requestQuery = vi.fn().mockResolvedValue({ from: 'request' })
    let requestStorefront = { query: requestQuery, i18n: { country: 'JP' } }
    let aliasStorefront: unknown
    let component = {
      default: Hero,
      schema: createSchema({ type: 'aliased', title: 'Aliased' }),
      loader: async (args: WeaverseNextComponentLoaderArgs) => {
        aliasStorefront = args.weaverse.storefront
        await args.weaverse.storefront?.query('query Alias { id }')
        return { ok: true }
      },
    }
    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [component],
      commerce: { storefront: clientStorefront },
    })
    let data: WeaverseNextLoaderData = {
      page: { id: 'page-1', items: [{ id: 'a1', type: 'aliased', data: {} }] },
    }

    // Act — pass request-scoped commerce that differs from client.commerce.
    await runWeaverseComponentLoaders({
      client,
      data,
      commerce: { storefront: requestStorefront },
    })

    // Assert — the alias resolves to the per-call storefront, not the stale one.
    expect(aliasStorefront).toBe(requestStorefront)
    expect(requestQuery).toHaveBeenCalledTimes(1)
    expect(clientQuery).not.toHaveBeenCalled()
  })

  it('should_merge_schema_defaults_before_running_component_loader', async () => {
    // Arrange
    let receivedData: unknown
    let component = {
      default: Hero,
      schema: createSchema({
        type: 'featured-defaults',
        title: 'Featured Defaults',
        settings: [
          {
            group: 'Content',
            inputs: [
              {
                type: 'range',
                name: 'count',
                label: 'Count',
                defaultValue: 8,
              },
              {
                type: 'text',
                name: 'heading',
                label: 'Heading',
                defaultValue: 'Featured products',
              },
            ],
          },
        ],
      }),
      loader: (args: WeaverseNextComponentLoaderArgs) => {
        receivedData = args.data
        return Promise.resolve({ ok: true })
      },
    }
    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [component],
    })
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'page-1',
        items: [
          {
            id: 'featured-1',
            type: 'featured-defaults',
            data: { heading: 'Manual heading' },
          },
        ],
      },
    }

    // Act
    await runWeaverseComponentLoaders({ client, data })

    // Assert
    expect(receivedData).toEqual({ count: 8, heading: 'Manual heading' })
  })

  it('should_keep_rendering_other_items_when_one_component_loader_fails', async () => {
    // Arrange
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    let failingComponent = {
      default: Hero,
      schema: createSchema({ type: 'failing', title: 'Failing' }),
      loader: () => Promise.reject(new Error('storefront failed')),
    }
    let workingComponent = {
      default: Hero,
      schema: createSchema({ type: 'working', title: 'Working' }),
      loader: async () => ({ ok: true }),
    }
    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [failingComponent, workingComponent],
    })
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'page-1',
        items: [
          { id: 'bad', type: 'failing', data: {} },
          { id: 'good', type: 'working', data: {} },
        ],
      },
    }

    // Act
    let result = await runWeaverseComponentLoaders({ client, data })

    // Assert
    expect(result?.page.items[0].loaderData).toBeUndefined()
    expect(result?.page.items[1].loaderData).toEqual({ ok: true })
    expect(warn).toHaveBeenCalledWith(
      '❌ Item loader run failed.',
      'failing',
      'bad',
      expect.any(Error)
    )
    warn.mockRestore()
  })

  it('should_walk_inline_children_recursively', async () => {
    // Arrange
    let loaderCalls: string[] = []
    let component = {
      default: Hero,
      schema: createSchema({ type: 'node', title: 'Node' }),
      loader: (args: WeaverseNextComponentLoaderArgs<{ id: string }>) => {
        loaderCalls.push(args.data.id)
        return Promise.resolve(null)
      },
    }
    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [component],
    })
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'page-1',
        items: [
          {
            id: 'parent',
            type: 'node',
            data: { id: 'parent' },
            children: [
              {
                id: 'child',
                type: 'node',
                data: { id: 'child' },
                children: [],
              },
            ],
          },
        ],
      },
    }

    // Act
    await runWeaverseComponentLoaders({ client, data })

    // Assert
    expect(loaderCalls).toEqual(['parent', 'child'])
  })
})

// ─── 4. Renderer renders a fixture tree ──────────────────────────────

describe('WeaverseNextRenderer', () => {
  it('should_render_registered_component_with_schema_default_and_item_props', () => {
    // Arrange
    let client = makeClient()
    client.data = makePageData()

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextProvider client={client}>
        <WeaverseNextRenderer />
      </WeaverseNextProvider>
    )

    // Assert
    expect(html).toContain('Default Heading') // schema default
    expect(html).toContain('Hello World') // item data prop
    expect(html).toContain('data-weaverse-project-id="proj-test"')
  })

  it('should_render_from_explicit_client_and_data_props', () => {
    // Arrange
    let client = makeClient()

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRenderer client={client} data={makePageData()} />
    )

    // Assert
    expect(html).toContain('Hello World')
  })
})

// ─── 4b. Default `main` root handling ────────────────────────────────

// Flat page model: a single root `main` item whose `children` are `{ id }`
// refs into the top-level `items` array — the shape Weaverse actually serves.
function makeFlatPageData(): WeaverseNextLoaderData {
  return {
    page: {
      id: 'page-flat',
      items: [
        {
          id: 'item-main',
          type: 'main',
          children: [{ id: 'hero-1' }, { id: 'hero-2' }],
        },
        { id: 'hero-1', type: 'hero', data: { text: 'First section' } },
        { id: 'hero-2', type: 'hero', data: { text: 'Second section' } },
      ],
    },
  }
}

describe('default main root handling', () => {
  it('should_render_child_sections_when_consumer_does_not_register_main', () => {
    // Arrange — client registers only `hero`, never a `main` component.
    let client = makeClient()
    client.data = makeFlatPageData()

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextProvider client={client}>
        <WeaverseNextRenderer />
      </WeaverseNextProvider>
    )

    // Assert — both children resolved through the default `main` root.
    expect(html).toContain('First section')
    expect(html).toContain('Second section')
    expect(html).toContain('Default Heading') // hero schema default
  })

  it('should_forward_weaverse_dom_attributes_onto_the_default_main_element', () => {
    // Arrange
    let client = makeClient()
    client.data = makeFlatPageData()

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRenderer client={client} data={client.data} />
    )

    // Assert — default `main` spreads the renderer-injected DOM attributes.
    expect(html).toContain('data-wv-id="item-main"')
    expect(html).toContain('data-wv-type="main"')
  })

  it('should_prefer_user_registered_main_over_the_default_main', () => {
    // Arrange — this runs after the default `main` has already been registered.
    let CustomMain = (props: WeaverseNextComponentProps) => {
      let { children, ...rest } = props
      return (
        <main {...rest} data-custom-main="yes">
          {children as ReactNode}
        </main>
      )
    }
    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [
        {
          default: CustomMain,
          schema: createSchema({ type: 'main', title: 'Main' }),
        },
        heroComponent,
      ],
    })
    client.data = makeFlatPageData()

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRenderer client={client} data={client.data} />
    )

    // Assert
    expect(html).toContain('data-custom-main="yes"')
    expect(html).toContain('First section')
  })
})

// ─── 5. No React Router / remix-oxygen source imports ────────────────

describe('package boundaries', () => {
  it('should_not_import_react_router_or_remix_oxygen_in_src', () => {
    // Arrange
    let srcDir = join(import.meta.dirname, '..', 'src')
    let files = readdirSync(srcDir).filter((f) => SRC_FILE_REGEX.test(f))

    // Act
    let offenders: string[] = []
    for (let file of files) {
      let content = readFileSync(join(srcDir, file), 'utf8')
      if (
        content.includes('react-router') ||
        content.includes('@shopify/remix-oxygen')
      ) {
        offenders.push(file)
      }
    }

    // Assert
    expect(offenders).toEqual([])
  })
})
