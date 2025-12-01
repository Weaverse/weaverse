import {
  isBrowser,
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
  useMemo,
} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Await, useMatches } from 'react-router'
import { defaultComponents } from '~/components'
import { createWeaverseDataContext } from './hooks/use-weaverse-data-context'
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
    const { data, ...rest } = initialData
    if (!this.Element?.schema) {
      console.error('Element is missing schema or not found!')
      return
    }
    const schemaData = generateDataFromSchema(this.Element.schema)
    Object.assign(this._store, schemaData, data, rest)
  }

  get Element(): HydrogenElement {
    return super.Element
  }
}

Weaverse.ItemConstructor = WeaverseHydrogenItem

export class WeaverseHydrogen extends Weaverse {
  pageId: string
  internal: Partial<WeaverseInternal>
  requestInfo: WeaverseLoaderRequestInfo
  projectId: string
  weaverseHost: string
  weaverseApiBase: string
  weaverseApiKey: string
  weaverseVersion: string
  isDesignMode: boolean
  isPreviewMode: boolean
  sectionType: string
  declare ItemConstructor: typeof WeaverseHydrogenItem
  declare data: HydrogenPageData
  static itemInstances: Map<string, WeaverseHydrogenItem>
  static elementRegistry: Map<string, HydrogenElement>

  constructor(params: WeaverseHydrogenParams) {
    const { internal, pageId, requestInfo, ...coreParams } = params
    super({ ...coreParams })
    this.internal = internal
    this.pageId = pageId
    this.requestInfo = requestInfo
    // Assign configuration properties
    this.projectId = params.projectId
    this.weaverseHost = params.weaverseHost
    this.weaverseApiBase = params.weaverseApiBase
    this.weaverseApiKey = params.weaverseApiKey
    this.weaverseVersion = params.weaverseVersion || ''
    this.isDesignMode = params.isDesignMode ?? false
    this.isPreviewMode = params.isPreviewMode ?? false
    this.sectionType = params.sectionType || ''
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

const StudioBridge = memo(({ context }: { context: WeaverseHydrogen }) => {
  useStudio(context)
  return null
})

function RenderRoot(props: {
  data: WeaverseLoaderData
  components: HydrogenComponent[]
  dataContext?: Record<string, any>
}) {
  const { data, components, dataContext } = props
  for (const comp of [...components, ...defaultComponents]) {
    comp?.schema?.type &&
      registerComponent({
        type: comp?.schema.type,
        Component: comp.default,
        schema: comp.schema,
        loader: comp.loader,
      })
  }
  const { page, configs, project, pageAssignment } = data || {}

  // Keep original page data - processing will happen at component level in renderer

  const weaverse = createWeaverseInstance({
    ...configs,
    dataContext,
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

export const WeaverseHydrogenRoot = memo(
  ({
    components,
    errorComponent: ErrorComponent = ({ error }) => (
      <div>{error?.message || 'An unexpected error occurred'}</div>
    ),
  }: {
    components: HydrogenComponent[]
    errorComponent?: React.FC<{ error: any }>
  }) => {
    const matches = useMatches()

    // Create flat route-keyed data context from matches only
    // No more useLoaderData dependency - everything comes from matches
    const enhancedDataContext = createWeaverseDataContext(matches)

    // Find weaverseData from matches - optimized with useMemo and reverse iteration
    // Most recent route match (deepest in hierarchy) is most likely to have weaverseData
    const weaverseData = useMemo(() => {
      // Iterate backwards for better performance (most recent match first)
      for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i]
        const loaderData = match.loaderData as
          | Record<string, unknown>
          | undefined
        if (loaderData && 'weaverseData' in loaderData) {
          return loaderData.weaverseData as
            | WeaverseLoaderData
            | Promise<WeaverseLoaderData>
        }
      }
      return null
    }, [matches])

    if (weaverseData) {
      if (weaverseData instanceof Promise) {
        return (
          <ErrorBoundary fallbackRender={ErrorComponent as any}>
            <Suspense>
              <Await resolve={weaverseData}>
                {(resolvedData) => (
                  <RenderRoot
                    components={components}
                    data={resolvedData}
                    dataContext={enhancedDataContext}
                  />
                )}
              </Await>
            </Suspense>
          </ErrorBoundary>
        )
      }
      return (
        <RenderRoot
          components={components}
          data={weaverseData}
          dataContext={enhancedDataContext}
        />
      )
    }
    return (
      <ErrorComponent
        error={{ message: 'No Weaverse data found in route matches!' }}
      />
    )
  }
)

const ThemeSettingsProvider = createContext<HydrogenThemeSettings | null>(null)
ThemeSettingsProvider.displayName = 'WeaverseThemeSettingsProvider'

export function withWeaverse(Component: ComponentType<any>) {
  return (props: JSX.IntrinsicAttributes) => {
    const { settings } = useThemeSettingsStore()
    return (
      <ThemeSettingsProvider.Provider value={settings}>
        <Component {...props} />
      </ThemeSettingsProvider.Provider>
    )
  }
}

export function useThemeSettings<T = HydrogenThemeSettings>() {
  const themeSettingsStore = useThemeSettingsStore()
  const settings = useSafeExternalStore(
    themeSettingsStore.subscribe,
    themeSettingsStore.getSnapshot,
    themeSettingsStore.getServerSnapshot
  )
  return settings as T
}
