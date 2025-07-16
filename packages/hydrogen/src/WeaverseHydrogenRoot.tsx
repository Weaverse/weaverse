import {
  isBrowser,
  type PlatformTypeEnum,
  useSafeExternalStore,
  Weaverse,
  WeaverseItemStore,
  WeaverseRoot,
} from '@weaverse/react'
import {
  type ComponentType,
  createContext,
  type JSX,
  memo,
  Suspense,
} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Await, useLoaderData } from 'react-router'
import { defaultComponents } from '~/components'
import type {
  HydrogenComponentData,
  HydrogenElement,
  HydrogenPageData,
  HydrogenThemeSettings,
  WeaverseInternal,
  WeaverseLoaderRequestInfo,
} from './index'
import type {
  HydrogenComponent,
  WeaverseHydrogenParams,
  WeaverseLoaderData,
} from './types'
import { generateDataFromSchema } from './utils'
import { useStudio } from './utils/use-studio'
import { useThemeSettingsStore } from './utils/use-theme-settings-store'

export class WeaverseHydrogenItem extends WeaverseItemStore {
  declare weaverse: WeaverseHydrogen

  constructor(initialData: HydrogenComponentData, weaverse: WeaverseHydrogen) {
    super(initialData, weaverse)
    let { data, ...rest } = initialData
    if (!this.Element?.schema) {
      console.error('Element is missing schema or not found!')
      return
    }
    let schemaData = generateDataFromSchema(this.Element.schema)
    Object.assign(this._store, schemaData, data, rest)
  }

  get Element(): HydrogenElement {
    return super.Element
  }
}

Weaverse.ItemConstructor = WeaverseHydrogenItem

export class WeaverseHydrogen extends Weaverse {
  platformType: PlatformTypeEnum = 'shopify-hydrogen'
  pageId: string
  internal: Partial<WeaverseInternal>
  requestInfo: WeaverseLoaderRequestInfo
  declare ItemConstructor: typeof WeaverseHydrogenItem
  declare data: HydrogenPageData
  static itemInstances: Map<string, WeaverseHydrogenItem>
  static elementRegistry: Map<string, HydrogenElement>

  constructor(params: WeaverseHydrogenParams) {
    let { internal, pageId, requestInfo, ...coreParams } = params
    super({ ...coreParams })
    this.internal = internal
    this.pageId = pageId
    this.requestInfo = requestInfo
  }
}

function createWeaverseInstance(
  params: WeaverseHydrogenParams
): WeaverseHydrogen {
  if (isBrowser) {
    // Check if the weaverse instance already exists in the window object
    window.__weaverses = window.__weaverses || {}
    let weaverse = window.__weaverses[params.pageId]
    // If the weaverse instance does not exist, or the pathname or search has changed, create a new instance
    if (
      !weaverse ||
      weaverse?.requestInfo?.pathname !== params.requestInfo.pathname ||
      weaverse?.requestInfo?.search !== params.requestInfo.search
    ) {
      weaverse = new WeaverseHydrogen(params)
      window.__weaverses[params.pageId] = weaverse
    }
    if (weaverse?.isDesignMode) {
      weaverse.requestInfo = params.requestInfo
      window.weaverseStudio?.refreshStudio(params)
    }
    return weaverse
  }
  return new WeaverseHydrogen(params)
}

let StudioBridge = memo(({ context }: { context: WeaverseHydrogen }) => {
  useStudio(context)
  return null
})

function RenderRoot(props: {
  data: WeaverseLoaderData
  components: HydrogenComponent[]
}) {
  let { data, components } = props
  for (let comp of [...components, ...defaultComponents]) {
    comp?.schema?.type &&
      registerComponent({
        type: comp?.schema.type,
        Component: comp.default,
        schema: comp.schema,
        loader: comp.loader,
      })
  }
  let { page, configs, project, pageAssignment } = data || {}
  let weaverse = createWeaverseInstance({
    ...configs,
    data: page,
    pageId: page?.id,
    internal: { project, pageAssignment },
  })
  return (
    <>
      <WeaverseRoot context={weaverse} />
      <StudioBridge context={weaverse} />
    </>
  )
}

export function registerComponent(element: HydrogenElement) {
  WeaverseHydrogen.registerElement(element)
}

export let WeaverseHydrogenRoot = memo(
  ({
    components,
    errorComponent: ErrorComponent = ({ error }) => (
      <div>{error?.message || 'An unexpected error occurred'}</div>
    ),
  }: {
    components: HydrogenComponent[]
    errorComponent?: React.FC<{ error: any }>
  }) => {
    let loaderData = useLoaderData()
    let data = loaderData?.weaverseData as
      | WeaverseLoaderData
      | Promise<WeaverseLoaderData>

    if (data) {
      if (data instanceof Promise) {
        return (
          <ErrorBoundary fallbackRender={ErrorComponent as any}>
            <Suspense>
              <Await resolve={data}>
                {(resolvedData) => (
                  <RenderRoot components={components} data={resolvedData} />
                )}
              </Await>
            </Suspense>
          </ErrorBoundary>
        )
      }
      return <RenderRoot components={components} data={data} />
    }
    return (
      <ErrorComponent
        error={{ message: 'No Weaverse data return from route loader!' }}
      />
    )
  }
)

let ThemeSettingsProvider = createContext<HydrogenThemeSettings | null>(null)
ThemeSettingsProvider.displayName = 'WeaverseThemeSettingsProvider'

export function withWeaverse(Component: ComponentType<any>) {
  return (props: JSX.IntrinsicAttributes) => {
    let { settings } = useThemeSettingsStore()
    return (
      <ThemeSettingsProvider.Provider value={settings}>
        <Component {...props} />
      </ThemeSettingsProvider.Provider>
    )
  }
}

export function useThemeSettings<T = HydrogenThemeSettings>() {
  let themeSettingsStore = useThemeSettingsStore()
  let settings = useSafeExternalStore(
    themeSettingsStore.subscribe,
    themeSettingsStore.getSnapshot,
    themeSettingsStore.getServerSnapshot
  )
  return settings as T
}
