import { Await, useLoaderData, useLocation } from '@remix-run/react'
import React, { Suspense } from 'react'
import type { WeaverseThemeConfigs } from './types'

export function WeaverseStudio() {
  let { search } = useLocation()
  let { weaverseThemeConfigs } = useLoaderData<{
    weaverseThemeConfigs: Promise<WeaverseThemeConfigs>
  }>()
  if (weaverseThemeConfigs instanceof Promise) {
    let params = new URLSearchParams(search)
    let weaverseHost = params.get('weaverseHost')
    let weaverseVersion = params.get('weaverseVersion')
    return (
      <Suspense>
        <Await resolve={weaverseThemeConfigs}>
          {(configs: WeaverseThemeConfigs) => {
            if (!configs) return null
            return (
              <>
                <script
                  src={`${weaverseHost}/assets/studio/hydrogen/index.js?v=${weaverseVersion}`}
                  async
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `window.__weaverseThemeConfigs = ${JSON.stringify(
                      configs,
                    )}`,
                  }}
                />
              </>
            )
          }}
        </Await>
      </Suspense>
    )
  }
  return null
}
