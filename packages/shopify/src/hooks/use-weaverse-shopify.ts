import { useWeaverse } from '@weaverse/react'

import type { WeaverseShopify } from '~/index'

export function useWeaverseShopify() {
  let weaverse = useWeaverse<WeaverseShopify>()
  return weaverse
}
