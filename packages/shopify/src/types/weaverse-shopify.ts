import type { WeaverseCoreParams, ElementSchema } from '@weaverse/react'
import type { ThirdPartyIntegration } from './shopify'

export interface WeaverseShopifyParams extends WeaverseCoreParams {
  thirdPartyIntegration?: ThirdPartyIntegration[]
  elementSchemas?: ElementSchema[]
  ssrMode?: boolean
}
