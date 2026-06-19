import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { forwardRef, type ReactNode } from 'react'
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

const Hero = forwardRef<HTMLElement, WeaverseNextComponentProps>(
  (props, ref) => (
    <section ref={ref}>
      <h1>{props.heading as string}</h1>
      <p>{props.text as string}</p>
      {props.children as ReactNode}
    </section>
  )
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

// ─── 3. Component loader execution ───────────────────────────────────

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
      loader: async (args: WeaverseNextComponentLoaderArgs) => {
        received = args
        // Both the explicit commerce path and the alias must resolve.
        await args.commerce?.storefront?.query('query Products { id }')
        await args.weaverse.storefront?.query('query Alias { id }')
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
    let args = received as unknown as WeaverseNextComponentLoaderArgs
    expect(args.data).toEqual({
      count: 4,
    })
    expect(query).toHaveBeenCalledTimes(2)
    expect(result?.page.items[0].loaderData).toEqual(queryResult)
  })

  it('should_walk_inline_children_recursively', async () => {
    // Arrange
    let loaderCalls: string[] = []
    let component = {
      default: Hero,
      schema: createSchema({ type: 'node', title: 'Node' }),
      loader: async (args: WeaverseNextComponentLoaderArgs<{ id: string }>) => {
        loaderCalls.push(args.data.id)
        return null
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

// ─── 5. No React Router / remix-oxygen source imports ────────────────

describe('package boundaries', () => {
  it('should_not_import_react_router_or_remix_oxygen_in_src', () => {
    // Arrange
    let srcDir = join(import.meta.dirname, '..', 'src')
    let files = readdirSync(srcDir).filter((f) => /\.(ts|tsx)$/.test(f))

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
