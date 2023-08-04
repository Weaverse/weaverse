import { useNavigate, useRevalidator } from '@remix-run/react'
import { isIframe } from '@weaverse/react'
import { useEffect } from 'react'
import type { WeaverseHydrogen } from '~/types'

export function useStudio(weaverse: WeaverseHydrogen) {
  let navigate = useNavigate()
  let revalidator = useRevalidator()

  useEffect(() => {
    if (isIframe && weaverse.isDesignMode) {
      weaverse.internal = {
        ...weaverse.internal,
        navigate,
        revalidator,
      }
      window.__weaverse = weaverse
      if (window.weaverseStudio) {
        window.weaverseStudio.init(weaverse)
      }
    }
  }, [weaverse])
}
