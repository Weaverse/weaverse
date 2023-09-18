import { Await, useLoaderData } from '@remix-run/react'
import { WeaverseRoot } from '@weaverse/react'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ThemeProvider, createWeaverseInstance } from './context'
import { useStudio } from './hooks/use-studio'
import type {
  HydrogenComponent,
  WeaverseHydrogenRootProps,
  WeaverseLoaderData,
} from './types'
import { ThemeSettingsStore } from './hooks/use-theme-settings'

type WeaverseData = WeaverseLoaderData | Promise<WeaverseLoaderData>

export function WeaverseHydrogenRoot({
  errorComponent: ErrorComponent,
  components,
}: WeaverseHydrogenRootProps) {
  let loaderData = useLoaderData()

  let data: WeaverseData = loaderData?.weaverseData
  if (data) {
    if (data instanceof Promise) {
      return (
        <ErrorBoundary
          fallbackRender={ErrorComponent || (() => <>An error occurred!</>)}
        >
          <Suspense>
            <Await resolve={data}>
              {(resolvedData: WeaverseLoaderData) => {
                return (
                  <RenderRoot data={resolvedData} components={components} />
                )
              }}
            </Await>
          </Suspense>
        </ErrorBoundary>
      )
    }
    return <RenderRoot data={data} components={components} />
  }
  return ErrorComponent ? (
    <ErrorComponent
      error={{ message: 'No Weaverse data return from route loader!' }}
    />
  ) : (
    <>No Weaverse data return from route loader!</>
  )
}

function RenderRoot(props: {
  data: WeaverseLoaderData
  components: HydrogenComponent[]
}) {
  let { data, components } = props
  let weaverse = createWeaverseInstance(data, components)
  useStudio(weaverse)
  // @ts-ignore
  return <WeaverseRoot context={weaverse} />
}

export let withWeaverse = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    let { weaverseTheme } = useLoaderData<any>()
    let themeSettingsStore = new ThemeSettingsStore(weaverseTheme)
    return (
      <ThemeProvider.Provider value={themeSettingsStore}>
        <Component {...props} />
      </ThemeProvider.Provider>
    )
  }
}
