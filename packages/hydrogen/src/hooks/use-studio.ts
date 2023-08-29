import { useNavigate, useRevalidator } from '@remix-run/react'
import { isIframe, loadScript } from '@weaverse/react'
import { useEffect } from 'react'
import type {
  HydrogenThemeSchema,
  Localizations,
  WeaverseHydrogen,
} from '~/types'

export function useStudio(
  weaverse: WeaverseHydrogen,
  countries: Localizations,
  schema: HydrogenThemeSchema,
  weaverseData: any,
) {
  let navigate = useNavigate()
  let { revalidate } = useRevalidator()
  let { isDesignMode, weaverseHost, weaverseVersion } = weaverse
  let isStudio = isIframe && isDesignMode && weaverseHost && weaverseVersion

  useEffect(() => {
    if (isStudio) {
      weaverse.internal = {
        ...weaverse.internal,
        navigate,
        revalidate,
        themeConfigs: { schema, countries },
        publicStoreDomain: weaverseData?.configs?.publicStoreDomain,
        publicStorefrontApiToken:
          weaverseData?.configs?.publicStorefrontApiToken,
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
