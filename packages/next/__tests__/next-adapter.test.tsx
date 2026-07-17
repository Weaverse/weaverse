import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Weaverse } from '@weaverse/react'
import type { ReactNode, RefObject } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type {
  WeaverseNextComponentLoaderArgs,
  WeaverseNextComponentProps,
  WeaverseNextLoaderData,
  WeaverseNextThemeSchema,
} from '../src/index'
import {
  bindWeaverseNextStudioRuntime,
  buildWeaverseNextRequestInfo,
  createSchema,
  createTranslate,
  createWeaverseNextClient,
  createWeaverseNextRuntime,
  createWeaverseNextThemeSettingsStore,
  generateDataFromSchema,
  getNestedKey,
  interpolate,
  resolveWeaverseNextStudioScriptSrc,
  runWeaverseComponentLoaders,
  TranslationProvider,
  TranslationStore,
  useThemeSettings,
  useTranslation,
  useWeaverseCommerce,
  useWeaversePageData,
  useWeaverseRootData,
  WeaverseNextProvider,
  WeaverseNextRenderer,
  WeaverseNextRootProvider,
  WeaverseNextStudioConnect,
} from '../src/index'

const OUTSIDE_PROVIDER_ERROR = /must be used inside a <WeaverseNextProvider>/
const OUTSIDE_TRANSLATION_PROVIDER_ERROR =
  /useTranslation must be used within <TranslationProvider>/
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

// ─── 1b. Root-owned theme provider ────────────────────────────────────

describe('WeaverseNextRootProvider', () => {
  it('should_expose_themeSettings_at_root_without_a_route_provider', () => {
    // Arrange
    function Probe() {
      let theme = useThemeSettings<{ topbarText: string }>()
      return <span>{theme.topbarText}</span>
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRootProvider
        initialThemeSettings={{ topbarText: 'Root free shipping' }}
      >
        <Probe />
      </WeaverseNextRootProvider>
    )

    // Assert
    expect(html).toContain('Root free shipping')
  })

  it('should_render_root_ssr_value_even_when_route_provider_carries_pending_theme_data', () => {
    // Arrange — route provider supplies its own theme data on top of root's,
    // but the merge into the root store runs in a client-only effect (not
    // during render), so it never runs under `renderToStaticMarkup`.
    let client = makeClient({ themeSettings: { topbarText: 'Route' } })

    function Probe() {
      let theme = useThemeSettings<{ topbarText: string }>()
      return <span>{theme.topbarText}</span>
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRootProvider initialThemeSettings={{ topbarText: 'Root' }}>
        <WeaverseNextProvider client={client}>
          <Probe />
        </WeaverseNextProvider>
      </WeaverseNextRootProvider>
    )

    // Assert — root's initial theme is authoritative on SSR; the route
    // override applies after client mount, not as a render-phase mutation.
    expect(html).toContain('Root')
    expect(html).not.toContain('Route')
  })

  it('should_keep_root_only_settings_when_route_provider_has_no_explicit_theme_data', () => {
    // Arrange — route provider carries page data but no theme override.
    let client = makeClient()

    function Probe() {
      let theme = useThemeSettings<{ topbarText: string }>()
      return <span>{theme.topbarText}</span>
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRootProvider
        initialThemeSettings={{ topbarText: 'Root only' }}
      >
        <WeaverseNextProvider client={client}>
          <Probe />
        </WeaverseNextProvider>
      </WeaverseNextRootProvider>
    )

    // Assert
    expect(html).toContain('Root only')
  })

  it('should_share_the_same_theme_store_between_root_and_the_page_renderer', () => {
    // Arrange — a page-tree component reads useThemeSettings() through the
    // renderer/runtime path; it must observe the root store's value, proving
    // that path threads the same store instance instead of falling back to
    // an empty per-route store. No route-level `themeSettings` here, so this
    // is unaffected by the client-only route-merge effect.
    let ThemeAware = () => {
      let theme = useThemeSettings<{ topbarText: string }>()
      return <div>{theme.topbarText}</div>
    }
    let themeAwareComponent = {
      default: ThemeAware,
      schema: createSchema({ type: 'theme-aware', title: 'Theme aware' }),
    }
    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [themeAwareComponent],
    })
    client.data = {
      page: {
        id: 'page-theme-aware',
        rootId: 'theme-aware-root',
        items: [{ id: 'theme-aware-root', type: 'theme-aware' }],
      },
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRootProvider
        initialThemeSettings={{ topbarText: 'Root shared' }}
      >
        <WeaverseNextProvider client={client}>
          <WeaverseNextRenderer />
        </WeaverseNextProvider>
      </WeaverseNextRootProvider>
    )

    // Assert — the page renderer observes the same root store instance.
    expect(html).toContain('Root shared')
  })

  it('should_keep_backward_compatible_behavior_when_no_root_provider_is_mounted', () => {
    // Arrange — no WeaverseNextRootProvider anywhere in the tree.
    let client = makeClient({ themeSettings: { topbarText: 'Standalone' } })

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
    expect(html).toContain('Standalone')
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

// ─── 3. Root API exports ──────────────────────────────────────────────

describe('@weaverse/next root API exports', () => {
  it('should_export_theme_schema_type_and_schema_default_utility_from_root_entry', () => {
    // Arrange
    let themeSchema: WeaverseNextThemeSchema = {
      info: { name: 'Next theme', version: '0.1.0' },
      settings: [
        {
          group: 'Layout',
          inputs: [
            {
              type: 'text',
              name: 'announcement',
              label: 'Announcement',
              defaultValue: 'Free shipping',
            },
          ],
        },
      ],
      i18n: {
        urlStructure: 'url-path',
        defaultLocale: { language: 'EN', country: 'US' },
        shopLocales: [{ language: 'FR', country: 'FR', pathPrefix: 'fr-fr' }],
        translation: true,
      },
    }

    // Act
    let defaults = generateDataFromSchema(themeSchema)

    // Assert
    expect(defaults).toEqual({ announcement: 'Free shipping' })
  })
})

// ─── 4. Client fetchers are request-safe ──────────────────────────────

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

// ─── 6. Studio runtime contract ───────────────────────────────────────

describe('Studio runtime contract', () => {
  it('should_build_request_info_from_url_and_search_params', () => {
    // Arrange
    let searchParams = new URLSearchParams(
      'isDesignMode=true&isPreviewMode=false&foo=old&foo=new'
    )

    // Act
    let requestInfo = buildWeaverseNextRequestInfo({
      i18n: { country: 'US', language: 'EN' },
      pathname: '/products/hat',
      searchParams,
      url: 'https://shop.example/products/hat?ignored=yes',
    })

    // Assert
    expect(requestInfo).toEqual({
      pathname: '/products/hat',
      search: '?isDesignMode=true&isPreviewMode=false&foo=old&foo=new',
      queries: { isDesignMode: true, isPreviewMode: false, foo: 'new' },
      i18n: { country: 'US', language: 'EN' },
    })
  })

  it('should_hide_transient_draft_item_param_from_studio_request_info', () => {
    // Arrange
    let draftItem = JSON.stringify({
      id: 'section',
      data: { product: 'draft' },
    })
    let searchParams = new URLSearchParams(
      `isDesignMode=true&weaverseDraftItem=${encodeURIComponent(
        draftItem
      )}&weaverseProjectId=project-123`
    )

    // Act
    let requestInfo = buildWeaverseNextRequestInfo({
      pathname: '/',
      searchParams,
    })

    // Assert
    expect(requestInfo).toEqual({
      pathname: '/',
      search: '?isDesignMode=true&weaverseProjectId=project-123',
      queries: { isDesignMode: true, weaverseProjectId: 'project-123' },
    })
  })

  it('should_expose_theme_settings_store_with_live_update_method', () => {
    // Arrange
    let listener = vi.fn()
    let store = createWeaverseNextThemeSettingsStore({
      publicEnv: { PUBLIC_KEY: 'safe' },
      schema: { type: 'theme' },
      settings: { heading: 'Before' },
    })

    // Act
    let unsubscribe = store.subscribe(listener)
    store.updateThemeSettings({ heading: 'After' })
    unsubscribe()
    store.updateThemeSettings({ heading: 'Ignored listener' })

    // Assert
    expect(store.schema).toEqual({ type: 'theme' })
    expect(store.publicEnv).toEqual({ PUBLIC_KEY: 'safe' })
    expect(store.getSnapshot()).toEqual({ heading: 'Ignored listener' })
    expect(store.getServerSnapshot()).toEqual({ heading: 'Ignored listener' })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should_use_last_duplicate_studio_control_params_for_script_src', () => {
    // Arrange
    let searchParams = new URLSearchParams(
      'isDesignMode=false&isDesignMode=true&weaverseHost=https%3A%2F%2Fevil.example&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=old&weaverseVersion=new'
    )

    // Act
    let src = resolveWeaverseNextStudioScriptSrc(
      { searchParams },
      { storefrontHostname: 'shop.example' }
    )

    // Assert
    expect(src).toBe(
      'https://studio.weaverse.io/static/studio/next/index.js?v=new'
    )
  })

  it('should_resolve_next_studio_script_by_default', () => {
    // Arrange
    let searchParams = new URLSearchParams(
      'isDesignMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=2026.7.18'
    )

    // Act
    let src = resolveWeaverseNextStudioScriptSrc(
      { searchParams },
      { storefrontHostname: 'shop.example' }
    )

    // Assert
    expect(src).toBe(
      'https://studio.weaverse.io/static/studio/next/index.js?v=2026.7.18'
    )
  })

  it('should_resolve_next_preview_script_by_default', () => {
    // Arrange
    let searchParams = new URLSearchParams(
      'isPreviewMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=2026.7.18'
    )

    // Act
    let src = resolveWeaverseNextStudioScriptSrc(
      { searchParams },
      { storefrontHostname: 'shop.example' }
    )

    // Assert
    expect(src).toBe(
      'https://studio.weaverse.io/static/studio/next/preview.js?v=2026.7.18'
    )
  })

  it('should_accept_studio_connect_without_framework_prop', () => {
    // Arrange
    let context = {
      searchParams: new URLSearchParams(
        'isDesignMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io'
      ),
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextStudioConnect
        context={context}
        storefrontHostname="shop.example"
      />
    )

    // Assert
    expect(html).toBe('')
  })

  it('should_trust_non_studio_weaverse_subdomains_for_script_src', () => {
    // Arrange — a non-`studio` subdomain of a trusted apex domain, matching
    // Hydrogen's subdomain trust.
    let searchParams = new URLSearchParams(
      'isDesignMode=true&weaverseHost=https%3A%2F%2Fpreview.weaverse.dev'
    )

    // Act
    let src = resolveWeaverseNextStudioScriptSrc(
      { searchParams },
      { storefrontHostname: 'shop.example' }
    )

    // Assert
    expect(src).toBe('https://preview.weaverse.dev/static/studio/next/index.js')
  })

  it('should_reject_untrusted_weaverse_host_for_script_src', () => {
    // Arrange
    let searchParams = new URLSearchParams(
      'isDesignMode=true&weaverseHost=https%3A%2F%2Fweaverse.io.evil.example'
    )

    // Act
    let src = resolveWeaverseNextStudioScriptSrc(
      { searchParams },
      { storefrontHostname: 'shop.example' }
    )

    // Assert
    expect(src).toBeNull()
  })

  it('should_trust_loopback_studio_host_only_when_storefront_is_loopback', () => {
    // Arrange
    let searchParams = new URLSearchParams(
      'isDesignMode=true&weaverseHost=http%3A%2F%2Flocalhost%3A3000'
    )

    // Act — loopback storefront opts into the loopback host (local builder).
    let loopbackSrc = resolveWeaverseNextStudioScriptSrc(
      { searchParams },
      { storefrontHostname: 'localhost' }
    )
    // Same crafted host on a public storefront must be rejected.
    let publicSrc = resolveWeaverseNextStudioScriptSrc(
      { searchParams },
      { storefrontHostname: 'shop.example' }
    )
    // Omitting storefrontHostname must also be safe-by-default, not loopback.
    let omittedStorefrontSrc = resolveWeaverseNextStudioScriptSrc({
      searchParams,
    })

    // Assert
    expect(loopbackSrc).toBe(
      'http://localhost:3000/static/studio/next/index.js'
    )
    expect(publicSrc).toBeNull()
    expect(omittedStorefrontSrc).toBeNull()
  })

  it('should_create_studio_runtime_with_request_info_and_internal_contract', () => {
    // Arrange
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: {
        isDesignMode: true,
        pathname: '/',
        searchParams: new URLSearchParams('isDesignMode=true'),
      },
      themeSchema: { type: 'theme' },
      themeSettings: { color: 'blue' },
    })
    let data = {
      ...makePageData(),
      pageAssignment: {
        projectId: 'proj-test',
        type: 'INDEX',
        locale: '',
        handle: '',
        meta: { inherited: false, sourceProjectId: 'proj-test', depth: 0 },
      },
      project: { id: 'project-record' },
    }

    // Act
    let runtime = createWeaverseNextRuntime({ client, data })

    // Assert
    expect(runtime.pageId).toBe('page-1')
    expect(runtime.projectId).toBe('proj-test')
    expect(runtime.isDesignMode).toBe(true)
    expect(runtime.requestInfo).toEqual({
      pathname: '/',
      search: '?isDesignMode=true',
      queries: { isDesignMode: true },
    })
    expect(runtime.internal.project).toEqual({ id: 'project-record' })
    expect(runtime.internal.pageAssignment).toEqual({
      projectId: 'proj-test',
      type: 'INDEX',
      locale: '',
      handle: '',
      meta: { inherited: false, sourceProjectId: 'proj-test', depth: 0 },
    })
    expect(runtime.internal.themeSettingsStore?.settings).toEqual({
      color: 'blue',
    })
    expect((fakeWindow.__weaverses as Record<string, unknown>)['page-1']).toBe(
      runtime
    )
    vi.stubGlobal('window', previousWindow)
  })

  it('should_refresh_studio_after_reusing_runtime_with_new_page_data', () => {
    // Arrange
    let previousWindow = globalThis.window
    let init = vi.fn()
    let refreshStudio = vi.fn()
    let fakeWindow = {
      weaverseStudio: { init, refreshStudio },
    } as unknown as Window & typeof globalThis
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: { isDesignMode: true, pathname: '/' },
    })
    let initialData = {
      ...makePageData(),
      pageAssignment: {
        projectId: 'proj-test',
        type: 'INDEX',
        locale: '',
        handle: '',
      },
    }
    let runtime = createWeaverseNextRuntime({ client, data: initialData })
    bindWeaverseNextStudioRuntime(runtime)
    let nextPageAssignment = {
      projectId: 'proj-test',
      type: 'COLLECTION',
      locale: 'en-us',
      handle: 'sale',
      meta: { inherited: true, sourceProjectId: 'proj-parent', depth: 1 },
    }
    let nextData = {
      ...makePageData(),
      pageAssignment: nextPageAssignment,
      page: {
        ...makePageData().page,
        items: [
          ...makePageData().page.items,
          { id: 'section-2', type: 'hero', data: { heading: 'Updated' } },
        ],
      },
    }

    // Act
    let reusedRuntime = createWeaverseNextRuntime({ client, data: nextData })
    bindWeaverseNextStudioRuntime(reusedRuntime)

    // Assert — refreshStudio must receive the FRESH server payload, not the
    // (deliberately untouched) design-mode live tree on `runtime.data`.
    expect(reusedRuntime).toBe(runtime)
    expect(reusedRuntime.internal.pageAssignment).toEqual(nextPageAssignment)
    expect(init).toHaveBeenCalledTimes(1)
    expect(refreshStudio).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          items: nextData.page.items,
        }),
        pageId: 'page-1',
        requestInfo: reusedRuntime.requestInfo,
      })
    )
    vi.stubGlobal('window', previousWindow)
  })

  it('should_report_fresh_loader_data_to_refresh_studio_when_design_mode_tree_is_stale', () => {
    // Arrange — mirrors a resource-picker revalidation: the RSC refresh returns
    // fresh per-item `loaderData`, while the reused design-mode runtime keeps
    // the old live tree. Builder's refreshStudio merges draft structural edits
    // with THIS payload's loaderData, so passing the stale tree would keep the
    // previously selected resource rendered.
    let previousWindow = globalThis.window
    let init = vi.fn()
    let refreshStudio = vi.fn()
    let fakeWindow = {
      weaverseStudio: { init, refreshStudio },
    } as unknown as Window & typeof globalThis
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: { isDesignMode: true, pathname: '/' },
    })
    let staleData = {
      page: {
        id: 'page-1',
        rootId: 'item-root',
        items: [
          {
            id: 'item-root',
            type: 'hero',
            data: { product: { handle: 'old-product' } },
            loaderData: { product: { title: 'Old Product' } },
          },
        ],
      },
    } as WeaverseNextLoaderData
    let runtime = createWeaverseNextRuntime({ client, data: staleData })
    bindWeaverseNextStudioRuntime(runtime)
    let freshData = {
      page: {
        id: 'page-1',
        rootId: 'item-root',
        items: [
          {
            id: 'item-root',
            type: 'hero',
            data: { product: { handle: 'new-product' } },
            loaderData: { product: { title: 'New Product' } },
          },
        ],
      },
    } as WeaverseNextLoaderData

    // Act
    let reusedRuntime = createWeaverseNextRuntime({ client, data: freshData })
    bindWeaverseNextStudioRuntime(reusedRuntime)

    // Assert — the live tree stays untouched (drafts preserved), but the
    // refreshStudio payload carries the fresh loaderData.
    expect(reusedRuntime).toBe(runtime)
    let refreshedWith = refreshStudio.mock.calls.at(-1)?.[0] as {
      data: { items: { loaderData?: { product?: { title?: string } } }[] }
    }
    expect(refreshedWith.data.items[0].loaderData?.product?.title).toBe(
      'New Product'
    )
    vi.stubGlobal('window', previousWindow)
  })

  it('should_not_clobber_studio_drafts_when_reusing_runtime_in_design_mode', () => {
    // Arrange — a live design-mode runtime owns the page tree (incl. unsaved
    // drafts); reusing it with fresh loader data must not replace that tree.
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: { isDesignMode: true, pathname: '/' },
    })
    let runtime = createWeaverseNextRuntime({ client, data: makePageData() })
    let setProjectData = vi.spyOn(runtime, 'setProjectData')
    let nextData = {
      ...makePageData(),
      page: {
        ...makePageData().page,
        items: [
          ...makePageData().page.items,
          { id: 'section-2', type: 'hero', data: { heading: 'Server data' } },
        ],
      },
    }

    // Act
    let reusedRuntime = createWeaverseNextRuntime({ client, data: nextData })

    // Assert — same runtime, draft tree untouched, no project-data reset.
    expect(reusedRuntime).toBe(runtime)
    expect(setProjectData).not.toHaveBeenCalled()
    expect(reusedRuntime.data.items).toHaveLength(1)
    vi.stubGlobal('window', previousWindow)
  })

  it('should_defer_fresh_page_data_until_after_render_when_reusing_runtime_outside_design_mode', () => {
    // Arrange — published/non-design reuse has no draft state, so the latest
    // loader data must win, but not by emitting external-store updates during
    // the renderer's render phase.
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: { isDesignMode: false, pathname: '/' },
    })
    let runtime = createWeaverseNextRuntime({ client, data: makePageData() })
    let setProjectData = vi.spyOn(runtime, 'setProjectData')
    let nextData = {
      ...makePageData(),
      page: {
        ...makePageData().page,
        items: [
          ...makePageData().page.items,
          { id: 'section-2', type: 'hero', data: { heading: 'Server data' } },
        ],
      },
    }

    // Act — runtime factory runs during React render.
    let reusedRuntime = createWeaverseNextRuntime({ client, data: nextData })

    // Assert — same runtime, but fresh page data is only queued until the
    // renderer's post-commit effect flushes it.
    expect(reusedRuntime).toBe(runtime)
    expect(setProjectData).not.toHaveBeenCalled()
    expect(reusedRuntime.data.items).toHaveLength(1)
    expect(reusedRuntime.pendingProjectData?.items).toHaveLength(2)

    reusedRuntime.flushRenderPhaseUpdates()

    expect(setProjectData).toHaveBeenCalledTimes(1)
    expect(reusedRuntime.pendingProjectData).toBeUndefined()
    expect(reusedRuntime.data.items).toHaveLength(2)
    vi.stubGlobal('window', previousWindow)
  })

  it('should_flatten_fresh_item_data_when_locale_navigation_recreates_runtime_for_same_page', () => {
    // Arrange — locale/client navigation serves the same page id under a new
    // request key ('/fr-fr'), so a new runtime is built, but core
    // `initProject()` finds the existing item instance in the process-wide
    // `Weaverse.itemInstances` map and only calls `setData(item)` — nested
    // `item.data` is flattened onto the store solely in the `WeaverseNextItem`
    // constructor, so top-level props go stale.
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let enData: WeaverseNextLoaderData = {
      page: {
        id: 'page-1',
        rootId: 'item-root',
        items: [{ id: 'item-root', type: 'hero', data: { text: 'Hello EN' } }],
      },
    }
    let frData: WeaverseNextLoaderData = {
      page: {
        id: 'page-1',
        rootId: 'item-root',
        items: [
          { id: 'item-root', type: 'hero', data: { text: 'Bonjour FR' } },
        ],
      },
    }
    createWeaverseNextRuntime({
      client: makeClient({
        requestContext: { isDesignMode: false, pathname: '/' },
      }),
      data: enData,
    })
    let existingItem = Weaverse.itemInstances.get('item-root')
    expect(existingItem).toBeDefined()
    let notify = vi.fn()
    let unsubscribe = existingItem?.subscribe(notify)

    // Act — same page id, different pathname → new runtime, reused item store.
    let runtime = createWeaverseNextRuntime({
      client: makeClient({
        requestContext: { isDesignMode: false, pathname: '/fr-fr' },
      }),
      data: frData,
    })

    // Assert — the runtime data carries the fresh nested payload, and the item
    // snapshot must expose it as a flattened top-level prop. The subscriber
    // notification is deferred for the renderer's post-commit flush so runtime
    // construction remains render-phase safe.
    expect(runtime.data.items[0]?.data).toMatchObject({ text: 'Bonjour FR' })
    let item = runtime.itemInstances.get('item-root')
    expect(item).toBeDefined()
    expect(item?.getSnapShot().text).toBe('Bonjour FR')
    expect(notify).not.toHaveBeenCalled()

    runtime.flushRenderPhaseUpdates()

    expect(notify).toHaveBeenCalledTimes(1)
    unsubscribe?.()
    vi.stubGlobal('window', previousWindow)
  })
})

// ─── 7. Multi-runtime / nested instance selection ─────────────────────

// A single loader payload for one Weaverse instance, with distinct page/item
// IDs and its own pageAssignment/project record so co-located runtimes can be
// told apart. Item IDs are globally unique per test to avoid the process-wide
// `Weaverse.itemInstances` static map (see the 2026-07-09 work log) leaking
// item stores across unrelated tests.
function makeMultiRuntimeData(opts: {
  pageId: string
  itemId: string
  projectId: string
  projectRecordId: string
}): WeaverseNextLoaderData {
  return {
    page: {
      id: opts.pageId,
      rootId: opts.itemId,
      items: [{ id: opts.itemId, type: 'hero', data: { text: opts.pageId } }],
    },
    pageAssignment: {
      projectId: opts.projectId,
      type: 'INDEX',
      locale: '',
      handle: '',
    },
    project: { id: opts.projectRecordId },
  }
}

// Hydrogen reference: `WeaverseHydrogenRoot.createWeaverseInstance()` stores
// every runtime under `window.__weaverses[pageId]` and reuses one only while
// `pageId + pathname + search` all match. Builder Studio's own active-instance
// picker (`resolveEditingInstance()`) lives in the Builder repo; the SDK's job
// is to keep the registry/reuse contract and hand Builder every candidate.
describe('multi-runtime / nested instance selection', () => {
  it('should_register_co_located_runtimes_under_distinct_page_ids_without_reuse', () => {
    // Arrange — same pathname + search (nested/co-located instances share a
    // URL), different page IDs and root item IDs.
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: {
        isDesignMode: true,
        pathname: '/',
        searchParams: new URLSearchParams('isDesignMode=true'),
      },
    })
    let dataA = makeMultiRuntimeData({
      pageId: 'mr-reg-page-a',
      itemId: 'mr-reg-item-a',
      projectId: 'proj-a',
      projectRecordId: 'project-record-a',
    })
    let dataB = makeMultiRuntimeData({
      pageId: 'mr-reg-page-b',
      itemId: 'mr-reg-item-b',
      projectId: 'proj-b',
      projectRecordId: 'project-record-b',
    })

    // Act
    let runtimeA = createWeaverseNextRuntime({ client, data: dataA })
    let runtimeB = createWeaverseNextRuntime({ client, data: dataB })

    // Assert — both runtimes co-exist in the registry, keyed by page ID, and
    // are never reused across page IDs.
    let registry = fakeWindow.__weaverses as Record<string, unknown>
    expect(Object.keys(registry).sort()).toEqual([
      'mr-reg-page-a',
      'mr-reg-page-b',
    ])
    expect(registry['mr-reg-page-a']).toBe(runtimeA)
    expect(registry['mr-reg-page-b']).toBe(runtimeB)
    expect(runtimeA).not.toBe(runtimeB)
    // `window.__weaverse` tracks the last-created candidate, mirroring
    // Hydrogen's single-pointer + full registry split. Builder owns deciding
    // which co-located instance is the editable leaf.
    expect(fakeWindow.__weaverse).toBe(runtimeB)

    // Each runtime keeps its own identity (pageId, requestInfo, root, and the
    // save-critical pageAssignment / project record).
    expect(runtimeA.pageId).toBe('mr-reg-page-a')
    expect(runtimeB.pageId).toBe('mr-reg-page-b')
    expect(runtimeA.data.rootId).toBe('mr-reg-item-a')
    expect(runtimeB.data.rootId).toBe('mr-reg-item-b')
    expect(runtimeA.requestInfo).toEqual({
      pathname: '/',
      search: '?isDesignMode=true',
      queries: { isDesignMode: true },
    })
    expect(runtimeB.requestInfo).toEqual(runtimeA.requestInfo)
    expect(runtimeA.internal.pageAssignment?.projectId).toBe('proj-a')
    expect(runtimeB.internal.pageAssignment?.projectId).toBe('proj-b')
    expect(runtimeA.internal.project).toEqual({ id: 'project-record-a' })
    expect(runtimeB.internal.project).toEqual({ id: 'project-record-b' })
    vi.stubGlobal('window', previousWindow)
  })

  it('should_reuse_the_same_runtime_for_the_same_page_and_url_and_refresh_internal_payload', () => {
    // Arrange — same page ID and same URL across two loader passes (e.g. an RSC
    // revalidation), with a changed pageAssignment/project on the second pass.
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: {
        isDesignMode: true,
        pathname: '/',
        searchParams: new URLSearchParams('isDesignMode=true'),
      },
    })
    let firstData = makeMultiRuntimeData({
      pageId: 'mr-reuse-page',
      itemId: 'mr-reuse-item',
      projectId: 'proj-first',
      projectRecordId: 'record-first',
    })
    let secondData = makeMultiRuntimeData({
      pageId: 'mr-reuse-page',
      itemId: 'mr-reuse-item',
      projectId: 'proj-second',
      projectRecordId: 'record-second',
    })
    secondData.pageAssignment = {
      projectId: 'proj-second',
      type: 'COLLECTION',
      locale: 'en-us',
      handle: 'sale',
    }

    // Act
    let first = createWeaverseNextRuntime({ client, data: firstData })
    let second = createWeaverseNextRuntime({ client, data: secondData })

    // Assert — the same runtime object is reused, the registry key still points
    // at it, and internal payload fields are refreshed from the latest loader
    // data.
    expect(second).toBe(first)
    let registry = fakeWindow.__weaverses as Record<string, unknown>
    expect(registry['mr-reuse-page']).toBe(first)
    expect(second.internal.pageAssignment).toEqual({
      projectId: 'proj-second',
      type: 'COLLECTION',
      locale: 'en-us',
      handle: 'sale',
    })
    expect(second.internal.project).toEqual({ id: 'record-second' })
    vi.stubGlobal('window', previousWindow)
  })

  it('should_not_reuse_a_stale_runtime_for_the_same_page_on_a_different_url', () => {
    // Arrange — the same page ID served at two different URLs. Mirrors
    // Hydrogen's "reuse only while the browser stays on the same URL" comment.
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let clientA = makeClient({
      requestContext: { isDesignMode: true, pathname: '/collections/a' },
    })
    let clientB = makeClient({
      requestContext: { isDesignMode: true, pathname: '/collections/b' },
    })
    let makeData = () =>
      makeMultiRuntimeData({
        pageId: 'mr-url-page',
        itemId: 'mr-url-item',
        projectId: 'proj-url',
        projectRecordId: 'record-url',
      })

    // Act
    let runtimeA = createWeaverseNextRuntime({
      client: clientA,
      data: makeData(),
    })
    let runtimeB = createWeaverseNextRuntime({
      client: clientB,
      data: makeData(),
    })

    // Assert — a fresh runtime is created and the registry key is overwritten
    // to point at the new URL's runtime; the old one is not handed back.
    expect(runtimeB).not.toBe(runtimeA)
    expect(runtimeA.requestInfo.pathname).toBe('/collections/a')
    expect(runtimeB.requestInfo.pathname).toBe('/collections/b')
    let registry = fakeWindow.__weaverses as Record<string, unknown>
    expect(registry['mr-url-page']).toBe(runtimeB)
    vi.stubGlobal('window', previousWindow)
  })

  it('should_reinit_reused_runtime_when_it_is_not_the_active_studio_page', () => {
    // Arrange — this mirrors Studio navigation Home -> PDP -> Home. The Home
    // runtime is already bound when returning to it, but Builder's active bridge
    // still points at PDP. Calling refreshStudio(Home) would be ignored by
    // Builder as a cross-page refresh, leaving `beforeNavigate()` stuck in the
    // disconnected/disabled state. The SDK must reactivate Home via init().
    let previousWindow = globalThis.window
    let fakeWindow = {
      weaverseStudio: {
        weaverse: undefined,
        init: vi.fn((runtime) => {
          fakeWindow.weaverseStudio.weaverse = runtime
        }),
        refreshStudio: vi.fn(),
      },
    } as unknown as Window &
      typeof globalThis & {
        weaverseStudio: {
          weaverse?: unknown
          init: ReturnType<typeof vi.fn>
          refreshStudio: ReturnType<typeof vi.fn>
        }
      }
    vi.stubGlobal('window', fakeWindow)
    let homeClient = makeClient({
      requestContext: {
        isDesignMode: true,
        pathname: '/',
        searchParams: new URLSearchParams('isDesignMode=true'),
      },
    })
    let pdpClient = makeClient({
      requestContext: {
        isDesignMode: true,
        pathname: '/products/oxygen-snowboard',
        searchParams: new URLSearchParams('isDesignMode=true'),
      },
    })
    let homeData = makeMultiRuntimeData({
      pageId: 'mr-nav-home-page',
      itemId: 'mr-nav-home-item',
      projectId: 'proj-home',
      projectRecordId: 'record-home',
    })
    let pdpData = makeMultiRuntimeData({
      pageId: 'mr-nav-pdp-page',
      itemId: 'mr-nav-pdp-item',
      projectId: 'proj-pdp',
      projectRecordId: 'record-pdp',
    })
    let homeRuntime = createWeaverseNextRuntime({
      client: homeClient,
      data: homeData,
    })
    bindWeaverseNextStudioRuntime(homeRuntime)
    let pdpRuntime = createWeaverseNextRuntime({
      client: pdpClient,
      data: pdpData,
    })
    bindWeaverseNextStudioRuntime(pdpRuntime)

    // Act — Next reuses the already-bound Home runtime when navigating back.
    let reusedHomeRuntime = createWeaverseNextRuntime({
      client: homeClient,
      data: homeData,
    })
    bindWeaverseNextStudioRuntime(reusedHomeRuntime)

    // Assert
    expect(reusedHomeRuntime).toBe(homeRuntime)
    expect(fakeWindow.weaverseStudio.init.mock.calls).toEqual([
      [homeRuntime],
      [pdpRuntime],
      [homeRuntime],
    ])
    expect(fakeWindow.weaverseStudio.init).toHaveBeenLastCalledWith(homeRuntime)
    expect(fakeWindow.weaverseStudio.refreshStudio).not.toHaveBeenCalled()
    expect(fakeWindow.weaverseStudio.weaverse).toBe(homeRuntime)
    vi.stubGlobal('window', previousWindow)
  })

  it('should_not_reinit_an_inactive_co_located_runtime_on_the_same_url', () => {
    // Arrange — nested/co-located runtimes share one URL. Builder decides which
    // page is the editable leaf. A background rebind from the sibling must not
    // steal active Studio ownership by calling init() again.
    let previousWindow = globalThis.window
    let fakeWindow = {
      weaverseStudio: {
        weaverse: undefined,
        init: vi.fn((runtime) => {
          fakeWindow.weaverseStudio.weaverse = runtime
        }),
        refreshStudio: vi.fn(),
      },
    } as unknown as Window &
      typeof globalThis & {
        weaverseStudio: {
          weaverse?: unknown
          init: ReturnType<typeof vi.fn>
          refreshStudio: ReturnType<typeof vi.fn>
        }
      }
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: {
        isDesignMode: true,
        pathname: '/',
        searchParams: new URLSearchParams('isDesignMode=true'),
      },
    })
    let runtimeA = createWeaverseNextRuntime({
      client,
      data: makeMultiRuntimeData({
        pageId: 'mr-same-url-page-a',
        itemId: 'mr-same-url-item-a',
        projectId: 'proj-a',
        projectRecordId: 'record-a',
      }),
    })
    let runtimeB = createWeaverseNextRuntime({
      client,
      data: makeMultiRuntimeData({
        pageId: 'mr-same-url-page-b',
        itemId: 'mr-same-url-item-b',
        projectId: 'proj-b',
        projectRecordId: 'record-b',
      }),
    })
    bindWeaverseNextStudioRuntime(runtimeA)
    bindWeaverseNextStudioRuntime(runtimeB)

    // Act — runtime A is already bound but inactive while B is active on the
    // same URL.
    bindWeaverseNextStudioRuntime(runtimeA)

    // Assert
    expect(fakeWindow.weaverseStudio.init.mock.calls).toEqual([
      [runtimeA],
      [runtimeB],
    ])
    expect(fakeWindow.weaverseStudio.refreshStudio).toHaveBeenCalledWith(
      expect.objectContaining({ pageId: runtimeA.pageId })
    )
    expect(fakeWindow.weaverseStudio.weaverse).toBe(runtimeB)
    vi.stubGlobal('window', previousWindow)
  })

  it('should_bind_each_co_located_runtime_through_studio_init_without_collapsing_registry', () => {
    // Arrange — Builder decides which runtime to edit; the SDK must simply pass
    // every design-mode candidate to `weaverseStudio.init` and keep the
    // registry intact. We do NOT reimplement `resolveEditingInstance()` here.
    let previousWindow = globalThis.window
    let init = vi.fn()
    let refreshStudio = vi.fn()
    let fakeWindow = {
      weaverseStudio: { init, refreshStudio },
    } as unknown as Window & typeof globalThis
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: {
        isDesignMode: true,
        pathname: '/',
        searchParams: new URLSearchParams('isDesignMode=true'),
      },
    })
    let runtimeA = createWeaverseNextRuntime({
      client,
      data: makeMultiRuntimeData({
        pageId: 'mr-bind-page-a',
        itemId: 'mr-bind-item-a',
        projectId: 'proj-a',
        projectRecordId: 'record-a',
      }),
    })
    let runtimeB = createWeaverseNextRuntime({
      client,
      data: makeMultiRuntimeData({
        pageId: 'mr-bind-page-b',
        itemId: 'mr-bind-item-b',
        projectId: 'proj-b',
        projectRecordId: 'record-b',
      }),
    })

    // Act
    let boundA = bindWeaverseNextStudioRuntime(runtimeA)
    let boundB = bindWeaverseNextStudioRuntime(runtimeB)

    // Assert — both runtimes are initialized as candidates, and the registry
    // still holds both (binding does not collapse it to a single instance).
    expect(boundA).toBe(true)
    expect(boundB).toBe(true)
    expect(init).toHaveBeenCalledTimes(2)
    expect(init).toHaveBeenCalledWith(runtimeA)
    expect(init).toHaveBeenCalledWith(runtimeB)
    let registry = fakeWindow.__weaverses as Record<string, unknown>
    expect(registry['mr-bind-page-a']).toBe(runtimeA)
    expect(registry['mr-bind-page-b']).toBe(runtimeB)
    vi.stubGlobal('window', previousWindow)
  })

  it('should_keep_distinct_root_item_stores_and_element_refs_per_runtime', () => {
    // Builder's DOM leaf selection (`resolveEditingInstance()` walking the DOM
    // to pick the innermost matching instance) is Builder-owned and covered in
    // the Builder repo. The SDK-side guarantee it relies on is exercised here:
    // co-located runtimes with distinct item IDs own distinct root item stores,
    // each carrying its own element ref. The test env is Node with no jsdom, so
    // element refs are set directly rather than mounted.
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: {
        isDesignMode: true,
        pathname: '/',
        searchParams: new URLSearchParams('isDesignMode=true'),
      },
    })
    let runtimeA = createWeaverseNextRuntime({
      client,
      data: makeMultiRuntimeData({
        pageId: 'mr-el-page-a',
        itemId: 'mr-el-item-a',
        projectId: 'proj-a',
        projectRecordId: 'record-a',
      }),
    })
    let runtimeB = createWeaverseNextRuntime({
      client,
      data: makeMultiRuntimeData({
        pageId: 'mr-el-page-b',
        itemId: 'mr-el-item-b',
        projectId: 'proj-b',
        projectRecordId: 'record-b',
      }),
    })

    // Act — resolve each runtime's root item store and attach a mock element.
    let rootStoreA = runtimeA.itemInstances.get(runtimeA.data.rootId)
    let rootStoreB = runtimeB.itemInstances.get(runtimeB.data.rootId)
    let elementA = { id: 'element-a' }
    let elementB = { id: 'element-b' }
    rootStoreA.ref.current = elementA
    rootStoreB.ref.current = elementB

    // Assert — distinct stores, distinct element refs.
    expect(rootStoreA).toBeDefined()
    expect(rootStoreB).toBeDefined()
    expect(rootStoreA).not.toBe(rootStoreB)
    expect(rootStoreA._element).toBe(elementA)
    expect(rootStoreB._element).toBe(elementB)
    vi.stubGlobal('window', previousWindow)
  })
})

// ─── 8. Translation / static-text foundation ──────────────────────────

describe('TranslationStore', () => {
  it('should_replace_all_overrides_on_setOverrides_and_notify_subscribers', () => {
    // Arrange
    let store = new TranslationStore()
    let listener = vi.fn()
    store.updateOverrides({ 'cart.title': 'Bag' })

    // Act
    let unsubscribe = store.subscribe(listener)
    store.setOverrides({ 'cart.subtitle': 'Items' })

    // Assert — setOverrides replaces (not merges) and notifies once.
    expect(store.getSnapshot()).toEqual({ 'cart.subtitle': 'Items' })
    expect(store.getServerSnapshot()).toEqual({ 'cart.subtitle': 'Items' })
    expect(listener).toHaveBeenCalledTimes(1)

    // Act — after unsubscribe, no further notifications.
    unsubscribe()
    store.setOverrides({ 'cart.title': 'Cart' })

    // Assert
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should_merge_overrides_on_updateOverrides_keeping_untouched_siblings', () => {
    // Arrange
    let store = new TranslationStore()
    store.setOverrides({ 'cart.title': 'Cart', 'cart.subtitle': 'Items' })

    // Act — update one key; the sibling must survive.
    store.updateOverrides({ 'cart.title': 'Shopping Cart' })

    // Assert
    expect(store.getSnapshot()).toEqual({
      'cart.title': 'Shopping Cart',
      'cart.subtitle': 'Items',
    })
  })
})

describe('translation helpers', () => {
  it('should_read_nested_dot_paths_and_fall_back_when_missing_or_non_string', () => {
    expect(getNestedKey({ cart: { title: 'Cart' } }, 'cart.title')).toBe('Cart')
    expect(getNestedKey({}, 'cart.title', 'fallback')).toBe('fallback')
    // A non-string leaf resolves to the fallback, never the object itself.
    expect(getNestedKey({ cart: { title: {} } }, 'cart.title')).toBeUndefined()
  })

  it('should_interpolate_double_brace_variables_and_leave_unknowns_intact', () => {
    expect(interpolate('Hello {{name}}!', { name: 'World' })).toBe(
      'Hello World!'
    )
    expect(interpolate('-{{percentage}}% Off', { percentage: 15 })).toBe(
      '-15% Off'
    )
    expect(interpolate('Hi {{missing}}', { name: 'x' })).toBe('Hi {{missing}}')
  })
})

describe('createTranslate priority chain', () => {
  it('should_resolve_external_then_design_then_merchant_then_static_then_key', () => {
    // Arrange — externalT only knows one key and echoes the rest, so the
    // internal chain (design > merchant > static > key) continues for those.
    let externalT = vi.fn((key: string) =>
      key === 'nav.home' ? 'Accueil' : key
    )
    let t = createTranslate({
      staticContent: {
        cart: { title: 'Cart', subtitle: 'Your items', footer: 'Checkout' },
        badge: { sale: '-{{percentage}}% Off' },
      },
      merchantOverrides: {
        cart: { title: 'Shopping Cart', subtitle: 'Locale items' },
      },
      designOverrides: { 'cart.title': 'Bag' },
      externalT,
    })

    // Assert
    expect(t('nav.home')).toBe('Accueil') // external t wins
    expect(t('cart.title')).toBe('Bag') // design > merchant > static
    expect(t('cart.subtitle')).toBe('Locale items') // merchant > static
    expect(t('cart.footer')).toBe('Checkout') // static content
    expect(t('badge.sale', { percentage: 15 })).toBe('-15% Off') // interpolate
    expect(t('missing.key')).toBe('missing.key') // key fallback
  })

  it('should_only_apply_own_design_override_keys_so_prototype_is_not_leaked', () => {
    // Arrange — an inherited Object.prototype member must not resolve through
    // the design-override lookup (own-property check) or the static lookup.
    let t = createTranslate({
      staticContent: { greeting: 'Hi' },
      designOverrides: {},
    })

    // Assert — `toString` is inherited, not an own key; falls back to the key.
    expect(t('toString')).toBe('toString')
  })
})

describe('TranslationProvider / useTranslation', () => {
  it('should_resolve_translations_inside_the_provider_on_the_server', () => {
    // Arrange
    function Probe() {
      let { t } = useTranslation()
      return <span>{t('cart.title')}</span>
    }

    // Act
    let html = renderToStaticMarkup(
      <TranslationProvider staticContent={{ cart: { title: 'Cart' } }}>
        <Probe />
      </TranslationProvider>
    )

    // Assert
    expect(html).toContain('Cart')
  })

  it('should_layer_live_store_design_overrides_over_static_content', () => {
    // Arrange — an override already present in the store is picked up via
    // getServerSnapshot during SSR (no window in the node test env).
    let store = new TranslationStore()
    store.setOverrides({ 'cart.title': 'Bag' })
    function Probe() {
      let { t } = useTranslation()
      return <span>{t('cart.title')}</span>
    }

    // Act
    let html = renderToStaticMarkup(
      <TranslationProvider
        staticContent={{ cart: { title: 'Cart' } }}
        translationStore={store}
      >
        <Probe />
      </TranslationProvider>
    )

    // Assert — design override beats static content.
    expect(html).toContain('Bag')
    expect(html).not.toContain('Cart')
  })

  it('should_expose_the_store_under_both_translationStore_and_deprecated_themeTextStore', () => {
    // Arrange
    let store = new TranslationStore()
    let seen: unknown[] = []
    function Probe() {
      let value = useTranslation()
      seen.push(value.translationStore, value.themeTextStore)
      return null
    }

    // Act
    renderToStaticMarkup(
      <TranslationProvider staticContent={{}} translationStore={store}>
        <Probe />
      </TranslationProvider>
    )

    // Assert — one instance, exposed under both names.
    expect(seen[0]).toBe(store)
    expect(seen[1]).toBe(store)
  })

  it('should_throw_a_clear_error_when_useTranslation_is_used_outside_a_provider', () => {
    // Arrange
    function Probe() {
      useTranslation()
      return null
    }

    // Act + Assert
    expect(() => renderToStaticMarkup(<Probe />)).toThrow(
      OUTSIDE_TRANSLATION_PROVIDER_ERROR
    )
  })
})

describe('WeaverseNextRootProvider translation wiring', () => {
  it('should_expose_useTranslation_to_root_children_using_staticContent', () => {
    // Arrange — a global child (Header/Footer) under the root provider, with no
    // route-level WeaverseNextProvider.
    function Probe() {
      let { t } = useTranslation()
      return <span>{t('cart.title')}</span>
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRootProvider staticContent={{ cart: { title: 'Cart' } }}>
        <Probe />
      </WeaverseNextRootProvider>
    )

    // Assert
    expect(html).toContain('Cart')
  })

  it('should_derive_root_staticContent_from_themeSchema_i18n_when_no_prop', () => {
    // Arrange
    function Probe() {
      let { t } = useTranslation()
      return <span>{t('greeting')}</span>
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRootProvider
        themeSchema={{ i18n: { staticContent: { greeting: 'Hello' } } }}
      >
        <Probe />
      </WeaverseNextRootProvider>
    )

    // Assert
    expect(html).toContain('Hello')
  })

  it('should_share_one_translation_store_between_root_and_a_nested_route_provider', () => {
    // Arrange — capture the adopted store both directly under root and under a
    // nested route provider; adoption means the two are the same instance.
    let client = makeClient()
    let stores: unknown[] = []
    function Capture() {
      stores.push(useTranslation().translationStore)
      return null
    }

    // Act
    renderToStaticMarkup(
      <WeaverseNextRootProvider staticContent={{ cart: { title: 'Cart' } }}>
        <Capture />
        <WeaverseNextProvider client={client}>
          <Capture />
        </WeaverseNextProvider>
      </WeaverseNextRootProvider>
    )

    // Assert
    expect(stores).toHaveLength(2)
    expect(stores[0]).toBeInstanceOf(TranslationStore)
    expect(stores[0]).toBe(stores[1])
  })

  it('should_let_a_route_child_read_root_staticContent_when_route_supplies_none', () => {
    // Arrange — route provider passes no staticContent and its client has no
    // themeSchema; a route child must still resolve via the adopted root value.
    let client = makeClient()
    function Probe() {
      let { t } = useTranslation()
      return <span>{t('cart.title')}</span>
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRootProvider staticContent={{ cart: { title: 'Cart' } }}>
        <WeaverseNextProvider client={client}>
          <Probe />
        </WeaverseNextProvider>
      </WeaverseNextRootProvider>
    )

    // Assert
    expect(html).toContain('Cart')
  })

  it('should_resolve_translations_for_page_tree_components_through_the_renderer', () => {
    // Arrange — a registered section reads useTranslation() and must resolve
    // against the root staticContent adopted by the route provider + renderer.
    let ThemeText = () => {
      let { t } = useTranslation()
      return <div>{t('cart.title')}</div>
    }
    let client = createWeaverseNextClient({
      projectId: 'proj-test',
      components: [
        {
          default: ThemeText,
          schema: createSchema({ type: 'theme-text', title: 'Theme text' }),
        },
      ],
    })
    client.data = {
      page: {
        id: 'page-tr-render',
        rootId: 'tr-render-root',
        items: [{ id: 'tr-render-root', type: 'theme-text' }],
      },
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextRootProvider staticContent={{ cart: { title: 'Cart' } }}>
        <WeaverseNextProvider client={client}>
          <WeaverseNextRenderer />
        </WeaverseNextProvider>
      </WeaverseNextRootProvider>
    )

    // Assert
    expect(html).toContain('Cart')
  })
})

describe('runtime translation bridge', () => {
  it('should_default_internal_translation_store_and_alias_when_none_provided', () => {
    // Arrange
    let client = makeClient()
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-default-page',
        rootId: 'tr-default-item',
        items: [{ id: 'tr-default-item', type: 'hero', data: {} }],
      },
    }

    // Act
    let runtime = createWeaverseNextRuntime({ client, data })

    // Assert — a store exists and both names point at the same instance, so
    // Builder's updateStaticText() RPC (which reads themeTextStore) works.
    expect(runtime.internal.translationStore).toBeInstanceOf(TranslationStore)
    expect(runtime.internal.themeTextStore).toBe(
      runtime.internal.translationStore
    )
  })

  it('should_attach_provided_translation_store_and_merchant_overrides_to_internal', () => {
    // Arrange
    let client = makeClient()
    let translationStore = new TranslationStore()
    let merchantOverrides = { cart: { title: 'Cart' } }
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-attach-page',
        rootId: 'tr-attach-item',
        items: [{ id: 'tr-attach-item', type: 'hero', data: {} }],
      },
    }

    // Act
    let runtime = createWeaverseNextRuntime({
      client,
      data,
      merchantOverrides,
      translationStore,
    })

    // Assert
    expect(runtime.internal.translationStore).toBe(translationStore)
    expect(runtime.internal.themeTextStore).toBe(translationStore)
    expect(runtime.internal.merchantOverrides).toBe(merchantOverrides)
  })

  it('should_refresh_internal_translation_wiring_when_reusing_a_runtime', () => {
    // Arrange — same page ID + URL, so the runtime is reused across loader
    // passes; the adopted store/overrides must be refreshed onto internal.
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: { isDesignMode: false, pathname: '/' },
    })
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-reuse-page',
        rootId: 'tr-reuse-item',
        items: [{ id: 'tr-reuse-item', type: 'hero', data: {} }],
      },
    }
    let first = createWeaverseNextRuntime({ client, data })
    let nextStore = new TranslationStore()
    let nextOverrides = { cart: { title: 'Updated' } }

    // Act
    let reused = createWeaverseNextRuntime({
      client,
      data,
      merchantOverrides: nextOverrides,
      translationStore: nextStore,
    })

    // Assert — same runtime, translation wiring refreshed from the latest config.
    expect(reused).toBe(first)
    expect(reused.internal.translationStore).toBe(nextStore)
    expect(reused.internal.themeTextStore).toBe(nextStore)
    expect(reused.internal.merchantOverrides).toBe(nextOverrides)

    // Act — a later loader pass with no overrides must clear the previous
    // locale's overrides instead of leaking them into the next render.
    let cleared = createWeaverseNextRuntime({
      client,
      data,
      translationStore: nextStore,
    })

    // Assert
    expect(cleared).toBe(first)
    expect(cleared.internal.merchantOverrides).toBeUndefined()
    vi.stubGlobal('window', previousWindow)
  })
})

// ─── 9. Item-level translation sidecar ────────────────────────────────

// Parity with Hydrogen's `WeaverseHydrogenItem.getSnapShot()` overlay +
// `WeaverseHydrogen` sidecar methods. Item IDs are globally unique per test to
// avoid the process-wide `Weaverse.itemInstances` static map leaking stores
// across unrelated tests (see the 2026-07-09 work-log pitfall).
describe('item-level translation sidecar', () => {
  it('should_overlay_translated_values_from_page_data_over_the_base_store', () => {
    // Arrange — the loader attached an item-level translation sidecar.
    let client = makeClient()
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-overlay-page',
        rootId: 'tr-overlay-item',
        items: [
          {
            id: 'tr-overlay-item',
            type: 'hero',
            data: { heading: 'Original' },
          },
        ],
        translationMap: {
          'tr-overlay-item': {
            heading: { originalValue: 'Original', translatedValue: 'Traduit' },
          },
        },
        translationLocale: 'fr',
        translationLanguageId: 'lang-fr',
      },
    }

    // Act
    let runtime = createWeaverseNextRuntime({ client, data })
    let item = runtime.itemInstances.get('tr-overlay-item')
    let snapshot = item.getSnapShot()

    // Assert — snapshot carries the translated value; base store is untouched.
    expect(runtime.translationLocale).toBe('fr')
    expect(runtime.translationLanguageId).toBe('lang-fr')
    expect(snapshot.heading).toBe('Traduit')
    expect(item._store.heading).toBe('Original')
  })

  it('should_return_the_base_store_snapshot_when_the_item_has_no_translations', () => {
    // Arrange — no sidecar on the page data.
    let client = makeClient()
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-none-page',
        rootId: 'tr-none-item',
        items: [
          { id: 'tr-none-item', type: 'hero', data: { heading: 'Base' } },
        ],
      },
    }

    // Act
    let runtime = createWeaverseNextRuntime({ client, data })
    let item = runtime.itemInstances.get('tr-none-item')

    // Assert — the fast path returns the base store object itself.
    expect(runtime.translationMap).toEqual({})
    expect(item.getSnapShot()).toBe(item._store)
    expect(item.getSnapShot().heading).toBe('Base')
  })

  it('should_memoize_the_merged_snapshot_until_the_translation_entry_changes', () => {
    // Arrange
    let client = makeClient()
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-memo-page',
        rootId: 'tr-memo-item',
        items: [
          { id: 'tr-memo-item', type: 'hero', data: { heading: 'Original' } },
        ],
        translationMap: {
          'tr-memo-item': {
            heading: { originalValue: 'Original', translatedValue: 'V1' },
          },
        },
        translationLocale: 'fr',
        translationLanguageId: 'lang-fr',
      },
    }
    let runtime = createWeaverseNextRuntime({ client, data })
    let item = runtime.itemInstances.get('tr-memo-item')

    // Act — two reads with nothing changed.
    let first = item.getSnapShot()
    let second = item.getSnapShot()

    // Assert — same store + same translation entry → identical object ref.
    expect(second).toBe(first)
    expect(first.heading).toBe('V1')

    // Act — editing the field assigns a fresh per-item entry (cache invalidates).
    runtime.updateTranslation('tr-memo-item', 'heading', 'Original', 'V2')
    let third = item.getSnapShot()

    // Assert — new object, new value.
    expect(third).not.toBe(first)
    expect(third.heading).toBe('V2')
  })

  it('should_set_locale_and_refresh_items_when_setTranslationSidecar_is_called', () => {
    // Arrange — start with no sidecar, subscribe to the item.
    let client = makeClient()
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-set-page',
        rootId: 'tr-set-item',
        items: [
          { id: 'tr-set-item', type: 'hero', data: { heading: 'Original' } },
        ],
      },
    }
    let runtime = createWeaverseNextRuntime({ client, data })
    let item = runtime.itemInstances.get('tr-set-item')
    let listener = vi.fn()
    let unsubscribe = item.subscribe(listener)

    // Act
    runtime.setTranslationSidecar(
      {
        'tr-set-item': {
          heading: { originalValue: 'Original', translatedValue: 'Neu' },
        },
      },
      'de',
      'lang-de'
    )
    unsubscribe()

    // Assert — locale/languageId/map applied, item refreshed, snapshot updated.
    expect(runtime.translationLocale).toBe('de')
    expect(runtime.translationLanguageId).toBe('lang-de')
    expect(listener).toHaveBeenCalled()
    expect(item.getSnapShot().heading).toBe('Neu')
  })

  it('should_update_only_the_translation_map_and_fire_the_item_subscriber', () => {
    // Arrange
    let client = makeClient()
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-update-page',
        rootId: 'tr-update-item',
        items: [
          { id: 'tr-update-item', type: 'hero', data: { heading: 'Original' } },
        ],
        translationMap: {},
        translationLocale: 'fr',
        translationLanguageId: 'lang-fr',
      },
    }
    let runtime = createWeaverseNextRuntime({ client, data })
    let item = runtime.itemInstances.get('tr-update-item')
    let listener = vi.fn()
    let unsubscribe = item.subscribe(listener)

    // Act
    runtime.updateTranslation(
      'tr-update-item',
      'heading',
      'Original',
      'Traduit'
    )
    unsubscribe()

    // Assert — base store untouched, map holds the entry, subscriber fired once,
    // and the merged snapshot renders the translated value.
    expect(item._store.heading).toBe('Original')
    expect(runtime.translationMap['tr-update-item'].heading).toEqual({
      originalValue: 'Original',
      translatedValue: 'Traduit',
    })
    expect(listener).toHaveBeenCalledTimes(1)
    expect(item.getSnapShot().heading).toBe('Traduit')
  })

  it('should_render_translated_values_through_the_page_renderer', () => {
    // Arrange — a hero whose heading is translated via the page sidecar.
    let client = makeClient()
    client.data = {
      page: {
        id: 'tr-render-overlay-page',
        rootId: 'tr-render-overlay-item',
        items: [
          {
            id: 'tr-render-overlay-item',
            type: 'hero',
            data: { heading: 'Original heading' },
          },
        ],
        translationMap: {
          'tr-render-overlay-item': {
            heading: {
              originalValue: 'Original heading',
              translatedValue: 'Titre traduit',
            },
          },
        },
        translationLocale: 'fr',
        translationLanguageId: 'lang-fr',
      },
    }

    // Act
    let html = renderToStaticMarkup(
      <WeaverseNextProvider client={client}>
        <WeaverseNextRenderer />
      </WeaverseNextProvider>
    )

    // Assert — the overlay reaches the rendered output; the base copy is gone.
    expect(html).toContain('Titre traduit')
    expect(html).not.toContain('Original heading')
  })

  it('should_collect_translation_changes_with_data_prefixed_keys', () => {
    // Arrange
    let client = makeClient()
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-changes-page',
        rootId: 'tr-changes-item',
        items: [{ id: 'tr-changes-item', type: 'hero', data: {} }],
      },
    }
    let runtime = createWeaverseNextRuntime({ client, data })
    runtime.setTranslationSidecar(
      {
        'tr-changes-item': {
          heading: { originalValue: 'Original', translatedValue: 'Traduit' },
        },
      },
      'fr',
      'lang-fr'
    )

    // Act
    let changes = runtime.getTranslationChanges()

    // Assert — entries carry the `data.<field>` key namespace Builder expects.
    expect(changes).toEqual({
      languageId: 'lang-fr',
      entries: [
        {
          itemId: 'tr-changes-item',
          key: 'data.heading',
          originalValue: 'Original',
          translatedValue: 'Traduit',
        },
      ],
    })
  })

  it('should_return_undefined_translation_changes_when_locale_language_or_entries_missing', () => {
    // Arrange
    let client = makeClient()
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-empty-changes-page',
        rootId: 'tr-empty-changes-item',
        items: [{ id: 'tr-empty-changes-item', type: 'hero', data: {} }],
      },
    }
    let runtime = createWeaverseNextRuntime({ client, data })

    // Assert — no locale/languageId and no entries → undefined.
    expect(runtime.getTranslationChanges()).toBeUndefined()

    // Act — locale + languageId set, but the map is still empty.
    runtime.setTranslationSidecar({}, 'fr', 'lang-fr')

    // Assert — empty entries → undefined.
    expect(runtime.getTranslationChanges()).toBeUndefined()

    // Act — a map entry exists, but the languageId is missing.
    runtime.setTranslationSidecar(
      {
        'tr-empty-changes-item': {
          heading: { originalValue: 'a', translatedValue: 'b' },
        },
      },
      'fr',
      ''
    )

    // Assert — missing languageId → undefined even with entries.
    expect(runtime.getTranslationChanges()).toBeUndefined()
  })

  it('should_clear_a_stale_sidecar_when_setProjectData_gets_page_data_without_one', () => {
    // Arrange — a runtime that started with a translation sidecar.
    let client = makeClient()
    let data: WeaverseNextLoaderData = {
      page: {
        id: 'tr-clear-page',
        rootId: 'tr-clear-item',
        items: [{ id: 'tr-clear-item', type: 'hero', data: {} }],
        translationMap: {
          'tr-clear-item': {
            heading: { originalValue: 'a', translatedValue: 'b' },
          },
        },
        translationLocale: 'fr',
        translationLanguageId: 'lang-fr',
      },
    }
    let runtime = createWeaverseNextRuntime({ client, data })
    expect(runtime.translationLocale).toBe('fr')

    // Act — replace with fresh page data that carries no sidecar.
    runtime.setProjectData({
      id: 'tr-clear-page',
      rootId: 'tr-clear-item',
      items: [{ id: 'tr-clear-item', type: 'hero', data: {} }],
    })

    // Assert — the stale sidecar is cleared to defaults.
    expect(runtime.translationMap).toEqual({})
    expect(runtime.translationLocale).toBe('')
    expect(runtime.translationLanguageId).toBe('')
  })

  it('should_apply_a_fresh_sidecar_through_setProjectData_on_non_design_reuse', () => {
    // Arrange — published/non-design reuse: same page ID + URL across two passes.
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: { isDesignMode: false, pathname: '/' },
    })
    let firstData: WeaverseNextLoaderData = {
      page: {
        id: 'tr-reuse-side-page',
        rootId: 'tr-reuse-side-item',
        items: [
          {
            id: 'tr-reuse-side-item',
            type: 'hero',
            data: { heading: 'Original' },
          },
        ],
      },
    }
    let runtime = createWeaverseNextRuntime({ client, data: firstData })
    expect(runtime.translationMap).toEqual({})
    let secondData: WeaverseNextLoaderData = {
      page: {
        id: 'tr-reuse-side-page',
        rootId: 'tr-reuse-side-item',
        items: [
          {
            id: 'tr-reuse-side-item',
            type: 'hero',
            data: { heading: 'Original' },
          },
        ],
        translationMap: {
          'tr-reuse-side-item': {
            heading: { originalValue: 'Original', translatedValue: 'Traduit' },
          },
        },
        translationLocale: 'fr',
        translationLanguageId: 'lang-fr',
      },
    }

    // Act — runtime reuse happens during render, so fresh project data (and its
    // sidecar) is queued until the renderer's post-commit flush.
    let reused = createWeaverseNextRuntime({ client, data: secondData })

    // Assert — same runtime, with the fresh sidecar pending until flush.
    expect(reused).toBe(runtime)
    expect(reused.translationLocale).toBe('')

    reused.flushRenderPhaseUpdates()

    expect(reused.translationLocale).toBe('fr')
    expect(
      reused.translationMap['tr-reuse-side-item'].heading.translatedValue
    ).toBe('Traduit')
    let item = reused.itemInstances.get('tr-reuse-side-item')
    expect(item.getSnapShot().heading).toBe('Traduit')
    vi.stubGlobal('window', previousWindow)
  })

  it('should_not_clobber_a_live_sidecar_when_reusing_a_design_mode_runtime', () => {
    // Arrange — a live design-mode runtime owns its translation sidecar; Builder
    // pushes edits via setTranslationSidecar/updateTranslation, so a reuse pass
    // with fresh loader data must not overwrite the live map.
    let previousWindow = globalThis.window
    let fakeWindow = {} as Window &
      typeof globalThis & { __weaverses?: unknown }
    vi.stubGlobal('window', fakeWindow)
    let client = makeClient({
      requestContext: { isDesignMode: true, pathname: '/' },
    })
    let runtime = createWeaverseNextRuntime({
      client,
      data: {
        page: {
          id: 'tr-design-reuse-page',
          rootId: 'tr-design-reuse-item',
          items: [{ id: 'tr-design-reuse-item', type: 'hero', data: {} }],
        },
      },
    })
    // Builder pushes a live translation edit into the running runtime.
    runtime.updateTranslation(
      'tr-design-reuse-item',
      'heading',
      'Original',
      'Live edit'
    )
    let setProjectData = vi.spyOn(runtime, 'setProjectData')

    // Act — a reuse pass arrives with fresh loader data carrying its own sidecar.
    let reused = createWeaverseNextRuntime({
      client,
      data: {
        page: {
          id: 'tr-design-reuse-page',
          rootId: 'tr-design-reuse-item',
          items: [{ id: 'tr-design-reuse-item', type: 'hero', data: {} }],
          translationMap: {
            'tr-design-reuse-item': {
              heading: {
                originalValue: 'Original',
                translatedValue: 'Server value',
              },
            },
          },
          translationLocale: 'fr',
          translationLanguageId: 'lang-fr',
        },
      },
    })

    // Assert — same runtime, project data not reset, live edit preserved.
    expect(reused).toBe(runtime)
    expect(setProjectData).not.toHaveBeenCalled()
    expect(
      reused.translationMap['tr-design-reuse-item'].heading.translatedValue
    ).toBe('Live edit')
    vi.stubGlobal('window', previousWindow)
  })
})
