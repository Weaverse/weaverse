import { Await, useLoaderData } from '@remix-run/react'
import { WeaverseRoot } from '@weaverse/react'
import React, { memo, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { WeaverseEffect } from '~/Effect'
import { createWeaverseInstance, ThemeSettingsProvider } from './context'
import { useThemeSettingsStore } from './hooks/use-theme-settings'
import type {
  HydrogenComponent,
  WeaverseHydrogenRootProps,
  WeaverseLoaderData,
} from './types'

type WeaverseData = WeaverseLoaderData | Promise<WeaverseLoaderData>

export let WeaverseHydrogenRoot = memo(
  ({
    errorComponent: ErrorComponent = FallbackError,
    components,
  }: WeaverseHydrogenRootProps) => {
    let loaderData = useLoaderData() as {
      weaverseData: WeaverseData
    }
    let data = loaderData?.weaverseData
    
    if (data) {
      if (data instanceof Promise) {
        return (
          <ErrorBoundary fallbackRender={ErrorComponent}>
            <Suspense>
              <Await resolve={data}>
                {(resolvedData) => (
                  <RenderRoot data={resolvedData} components={components} />
                )}
              </Await>
            </Suspense>
          </ErrorBoundary>
        )
      }
      return <RenderRoot data={data} components={components} />
    }
    return (
      <ErrorComponent
        error={{ message: 'No Weaverse data return from route loader!' }}
      />
    )
  },
)

function RenderRoot(props: {
  data: WeaverseLoaderData
  components: HydrogenComponent[]
}) {
  let { data, components } = props
  let weaverse = createWeaverseInstance(data, components)
  return (
    <>
      <WeaverseRoot context={weaverse} />
      <WeaverseEffect context={weaverse} />
    </>
  )
}

export function withWeaverse(Component: React.ComponentType<any>) {
  return (props: React.JSX.IntrinsicAttributes) => {
    let { settings } = useThemeSettingsStore()
    return (
      <ThemeSettingsProvider.Provider value={settings}>
        <Component {...props} />
      </ThemeSettingsProvider.Provider>
    )
  }
}

function FallbackError({ error }: { error?: { message?: string } }) {
  return <div>{error?.message || 'An unexpected error occurred'}</div>
}
