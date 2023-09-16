import { Await, useLoaderData, useRouteLoaderData } from '@remix-run/react'
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
export * from './client'
export * from './hooks/use-theme-settings'
export * from './types'
export * from './utils'
export * from './wrappers'

type WeaverseData = WeaverseLoaderData | Promise<WeaverseLoaderData>

export function WeaverseHydrogenRoot({
  errorComponent: ErrorComponent,
  components,
}: WeaverseHydrogenRootProps) {
  let data = useLoaderData()
  let weaverseData: WeaverseData = data?.weaverseData
  if (weaverseData) {
    if (weaverseData instanceof Promise) {
      return (
        <ErrorBoundary fallbackRender={ErrorComponent}>
          <Suspense>
            <Await resolve={weaverseData}>
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
      <RenderWeaverseRoot weaverseData={weaverseData} components={components} />
    )
  }
  return (
    <ErrorComponent
      error={{ message: 'No Weaverse data return from route loader!' }}
    />
  )
}

function RenderWeaverseRoot(props: {
  weaverseData: WeaverseLoaderData
  components: HydrogenComponent[]
}) {
  let { weaverseData, components } = props
  let weaverse = createWeaverseInstance(weaverseData, components)
  useStudio(weaverse)
  // @ts-ignore
  return <WeaverseRoot context={weaverse} />
}
