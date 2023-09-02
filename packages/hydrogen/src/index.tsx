import { Await, useLoaderData } from '@remix-run/react'
import { WeaverseRoot } from '@weaverse/react'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { createWeaverseInstance } from './context'
import { useStudio } from './hooks/use-studio'
import type {
  HydrogenComponent,
  HydrogenThemeSchema,
  Localizations,
  WeaverseHydrogenRootProps,
  WeaverseLoaderData,
} from './types'
export * from '@weaverse/react'
export * from './fetch'
export * from './loader'
export * from './utils'
export * from './hydrogen-wrappers'
export * from './hooks/use-theme-settings'
export * from './types'

type WeaverseData = WeaverseLoaderData | Promise<WeaverseLoaderData>

export function WeaverseHydrogenRoot({
  errorComponent: ErrorComponent,
  ...themeConfigs
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
                    {...themeConfigs}
                  />
                )
              }}
            </Await>
          </Suspense>
        </ErrorBoundary>
      )
    }
    return <RenderWeaverseRoot weaverseData={weaverseData} {...themeConfigs} />
  }
  return (
    <ErrorComponent
      error={{ message: 'No Weaverse data return from route loader!' }}
    />
  )
}

function RenderWeaverseRoot(props: {
  components: HydrogenComponent[]
  countries: Localizations
  themeSchema: HydrogenThemeSchema
  weaverseData: WeaverseLoaderData
}) {
  let { weaverseData, components, countries, themeSchema } = props
  let weaverse = createWeaverseInstance(weaverseData, components)
  let { publicEnv } = weaverseData.configs
  useStudio(weaverse, countries, themeSchema, publicEnv)
  // @ts-ignore
  return <WeaverseRoot context={weaverse} />
}
