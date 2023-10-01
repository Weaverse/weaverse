import type { PlatformTypeEnum, WeaverseItemStore } from '@weaverse/react'
import { Weaverse } from '@weaverse/react'
import * as ThirdPartyElement from '~/elements/third-party'
import type { ThirdPartyIntegration } from '~/types/shopify'
import { DEFAULT_INTEGRATIONS } from './constant'
import { SHOPIFY_ELEMENTS } from './elements'
import type {
  ElementSchema,
  WeaverseElement,
  WeaverseShopifyParams,
  WeaverseShopifySectionData,
} from './types/weaverse-shopify'

export * from './WeaverseShopifyRoot'
export * from './types'
export * from './utils/fetch-project-data'

export class WeaverseShopify extends Weaverse {
  platformType: PlatformTypeEnum = 'shopify-section'
  integrations: ThirdPartyIntegration[]
  elementSchemas: ElementSchema[]
  ssrMode: boolean
  declare data: WeaverseShopifySectionData
  declare itemInstances: Map<string | number, WeaverseItemStore>
  declare elementRegistry: Map<string, WeaverseElement>

  constructor(params: WeaverseShopifyParams) {
    let { thirdPartyIntegration, elementSchemas, ssrMode, ...coreParams } =
      params
    super(coreParams)
    this.integrations = thirdPartyIntegration || DEFAULT_INTEGRATIONS
    this.elementSchemas = elementSchemas || []
    this.ssrMode = ssrMode || false
    this.registerShopifyElements()
  }

  registerElement(element: WeaverseElement) {
    super.registerElement(element)
  }

  registerShopifyElements = () => {
    Object.values(SHOPIFY_ELEMENTS).forEach((elm) => {
      this.registerElement(elm)
    })
    this.registerThirdPartyElements()
  }

  registerThirdPartyElements = () => {
    this.integrations
      .flatMap(({ elements }) => elements)
      .forEach(({ type, extraData }) => {
        this.registerElement({
          type,
          extraData,
          Component: ThirdPartyElement.default,
          defaultCss: ThirdPartyElement.css,
        })
      })
  }
}
