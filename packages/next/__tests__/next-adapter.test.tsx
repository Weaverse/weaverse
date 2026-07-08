import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReactNode, RefObject } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import {
  bindWeaverseNextStudioRuntime,
  buildWeaverseNextRequestInfo,
  createSchema,
  createWeaverseNextClient,
  createWeaverseNextRuntime,
  createWeaverseNextThemeSettingsStore,
  resolveWeaverseNextStudioScriptSrc,
  runWeaverseComponentLoaders,
  useThemeSettings,
  useWeaverseCommerce,
  useWeaversePageData,
  useWeaverseRootData,
  WeaverseNextProvider,
  WeaverseNextRenderer,
  WeaverseNextStudioConnect,
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
      'https://studio.weaverse.io/static/studio/hydrogen/index.js?v=new'
    )
  })

  it('should_resolve_next_framework_studio_script_when_explicitly_requested', () => {
    // Arrange
    let searchParams = new URLSearchParams(
      'isDesignMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=2026.7.18'
    )

    // Act
    let src = resolveWeaverseNextStudioScriptSrc(
      { searchParams },
      { framework: 'next', storefrontHostname: 'shop.example' }
    )

    // Assert
    expect(src).toBe(
      'https://studio.weaverse.io/static/studio/next/index.js?v=2026.7.18'
    )
  })

  it('should_resolve_next_framework_preview_script_when_explicitly_requested', () => {
    // Arrange
    let searchParams = new URLSearchParams(
      'isPreviewMode=true&weaverseHost=https%3A%2F%2Fstudio.weaverse.io&weaverseVersion=2026.7.18'
    )

    // Act
    let src = resolveWeaverseNextStudioScriptSrc(
      { searchParams },
      { framework: 'next', storefrontHostname: 'shop.example' }
    )

    // Assert
    expect(src).toBe(
      'https://studio.weaverse.io/static/studio/next/preview.js?v=2026.7.18'
    )
  })

  it('should_accept_framework_prop_on_studio_connect', () => {
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
        framework="next"
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
    expect(src).toBe(
      'https://preview.weaverse.dev/static/studio/hydrogen/index.js'
    )
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
      'http://localhost:3000/static/studio/hydrogen/index.js'
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
      pageAssignment: { type: 'INDEX' },
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
    expect(runtime.internal.pageAssignment).toEqual({ type: 'INDEX' })
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
    let runtime = createWeaverseNextRuntime({ client, data: makePageData() })
    bindWeaverseNextStudioRuntime(runtime)
    let nextData = {
      ...makePageData(),
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

  it('should_apply_fresh_page_data_when_reusing_runtime_outside_design_mode', () => {
    // Arrange — published/non-design reuse has no draft state, so the latest
    // loader data must win.
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

    // Act
    let reusedRuntime = createWeaverseNextRuntime({ client, data: nextData })

    // Assert — same runtime, but the fresh page tree is applied.
    expect(reusedRuntime).toBe(runtime)
    expect(setProjectData).toHaveBeenCalledTimes(1)
    expect(reusedRuntime.data.items).toHaveLength(2)
    vi.stubGlobal('window', previousWindow)
  })
})
