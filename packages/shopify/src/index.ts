import type {
  ElementSchema,
  PlatformTypeEnum,
  WeaverseElement,
  WeaverseItemStore,
} from '@weaverse/react'
import { Weaverse } from '@weaverse/react'
import * as ThirdPartyElement from '~/elements/third-party'
import type { ThirdPartyIntegration } from '~/types/shopify'
import { DEFAULT_INTEGRATIONS } from './constant'
import elements from './elements'
import type {
  WeaverseShopifyParams,
  WeaverseShopifySectionData,
} from './types/weaverse-shopify'

export * from '@weaverse/react'
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
    Object.values(elements).forEach((elm) => {
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
