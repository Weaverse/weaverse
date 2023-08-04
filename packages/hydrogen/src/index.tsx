import { Await, useLoaderData } from '@remix-run/react'
import { WeaverseRoot } from '@weaverse/react'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { createWeaverseInstance } from './context'
import { useStudio } from './hooks/use-studio'
import type {
  HydrogenComponent,
  WeaverseHydrogenRootProps,
  WeaverseLoaderData,
} from './types'
export * from '@weaverse/react'
export * from './fetch'
export * from './hooks/use-theme-settings'
export * from './loader'
export * from './studio'
export * from './types'

export function WeaverseHydrogenRoot({
  components,
  ErrorComponent,
}: WeaverseHydrogenRootProps) {
  let data = useLoaderData()
  let weaverseDataFromLoader: WeaverseLoaderData | Promise<WeaverseLoaderData> =
    data?.weaverseData

  if (weaverseDataFromLoader) {
    if (weaverseDataFromLoader instanceof Promise) {
      return (
        <ErrorBoundary fallbackRender={ErrorComponent}>
          <Suspense>
            <Await resolve={weaverseDataFromLoader}>
              {(resolvedData: WeaverseLoaderData) => {
                return (
                  <RenderWeaverseRoot
                    weaverseData={resolvedData}
                    components={components}
                  />
                )
              }}
            </Await>
          </Suspense>
        </ErrorBoundary>
      )
    }
    return (
      <RenderWeaverseRoot
        weaverseData={weaverseDataFromLoader}
        components={components}
      />
    )
  }
  return (
    <ErrorComponent
      error={{ message: 'No Weaverse data return from route loader!' }}
    />
  )
}

function RenderWeaverseRoot(props: {
  components: HydrogenComponent[]
  weaverseData: WeaverseLoaderData
}) {
  let { components, weaverseData } = props
  let weaverse = createWeaverseInstance(weaverseData, components)
  useStudio(weaverse)
  // @ts-ignore
  return <WeaverseRoot context={weaverse} />
}
