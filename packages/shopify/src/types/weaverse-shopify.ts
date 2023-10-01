import type {
  WeaverseCoreParams,
  ElementSchema,
  WeaverseProjectDataType,
} from '@weaverse/react'
import type { ThirdPartyIntegration } from './shopify'

export interface WeaverseShopifySectionData extends WeaverseProjectDataType {
  script?: {
    css: string
    js: string
  }
}

export interface WeaverseShopifyParams extends WeaverseCoreParams {
  thirdPartyIntegration?: ThirdPartyIntegration[]
  elementSchemas?: ElementSchema[]
  ssrMode?: boolean
  data: WeaverseShopifySectionData
}
