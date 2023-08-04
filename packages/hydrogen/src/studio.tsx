import { useLocation } from '@remix-run/react'
import React from 'react'
import type { HydrogenThemeSchema } from './types'

type StudioProps = {
  themeSchema: HydrogenThemeSchema
}

export function HydrogenStudio({ themeSchema }: StudioProps) {
  let { search } = useLocation()
  let params = new URLSearchParams(search)
  if (params) {
    let isDesignMode = params.get('isDesignMode') === 'true'
    let weaverseHost = params.get('weaverseHost')
    let weaverseVersion = params.get('weaverseVersion')
    if (isDesignMode && weaverseHost && weaverseVersion) {
      return (
        <>
          <script
            src={`${weaverseHost}/assets/studio/hydrogen/index.js?v=${weaverseVersion}`}
            async
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__weaverseHydrogenThemeSchema = ${JSON.stringify(
                themeSchema,
              )}`,
            }}
          />
        </>
      )
    }
  }
  return null
}
