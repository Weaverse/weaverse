import {
  useNavigate,
  useRevalidator,
  useRouteLoaderData,
} from '@remix-run/react'
import { isIframe, loadScript } from '@weaverse/react'
import { useEffect } from 'react'
import type {
  HydrogenThemeSchema,
  Localizations,
  PublicEnv,
  WeaverseHydrogen,
} from '~/types'

type RootRouteData = {
  weaverseTheme: {
    countries: Localizations
    schema: HydrogenThemeSchema
    publicEnv?: PublicEnv
  }
}

export function useStudio(weaverse: WeaverseHydrogen) {
  let { weaverseTheme } = useRouteLoaderData('root') as RootRouteData
  let navigate = useNavigate()
  let { revalidate } = useRevalidator()

  let { countries, schema, publicEnv } = weaverseTheme
  let { isDesignMode, weaverseHost, weaverseVersion } = weaverse
  let isStudio = isIframe && isDesignMode && weaverseHost && weaverseVersion

  useEffect(() => {
    if (isStudio) {
      weaverse.internal = {
        ...weaverse.internal,
        publicEnv,
        navigate,
        revalidate,
        themeConfigs: { schema, countries },
      }
      window.__weaverse = weaverse
      if (window.weaverseStudio) {
        window.weaverseStudio.init(weaverse)
      } else {
        loadScript(
          `${weaverseHost}/assets/studio/hydrogen/index.js?v=${weaverseVersion}`,
        )
      }
    }
  }, [weaverse])
}
