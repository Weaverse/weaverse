import { WeaverseRoot } from '@weaverse/react'
import React, { Suspense } from 'react'
import { createWeaverseInstance } from './context'
import { useStudio } from './hooks/use-studio'
import type { WeaverseHydrogenRootProps, WeaverseLoaderData } from './types'
export * from './hooks/use-theme-setting'
export * from './fetch'
export * from './loader'
export * from './types'
export * from '@weaverse/react'
import { Await, useLoaderData } from '@remix-run/react'

export function WeaverseHydrogenRoot(props: WeaverseHydrogenRootProps) {
  let loaderData = useLoaderData()
  console.log('loaderData111', loaderData)
  let weaverseDataFromLoader: WeaverseLoaderData | Promise<WeaverseLoaderData> =
    loaderData?.weaverseData

  let { components, themeSchema } = props

  if (weaverseDataFromLoader) {
    if (weaverseDataFromLoader instanceof Promise) {
      return (
        <Suspense>
          <Await resolve={weaverseDataFromLoader}>
            {(resolvedData: WeaverseLoaderData) => {
              console.log('resolvedData', resolvedData)

              return (
                <RenderWeaverseRoot
                  components={components}
                  themeSchema={themeSchema}
                  weaverseData={resolvedData}
                />
              )
            }}
          </Await>
        </Suspense>
      )
    }
    return (
      <RenderWeaverseRoot
        components={components}
        themeSchema={themeSchema}
        weaverseData={weaverseDataFromLoader}
      />
    )
  }
  return (
    <div style={{ display: 'none' }}>
      No weaverseData return from Remix loader!
    </div>
  )
}

let RenderWeaverseRoot = (
  props: WeaverseHydrogenRootProps & { weaverseData: WeaverseLoaderData },
) => {
  let { components, themeSchema, weaverseData } = props
  let weaverse = createWeaverseInstance(weaverseData, components)
  useStudio(weaverse, themeSchema)
  // @ts-ignore
  return <WeaverseRoot context={weaverse} />
}
