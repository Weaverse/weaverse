import type { ElementSchema } from '@weaverse/react'
import { Weaverse } from '@weaverse/react'
import * as ThirdPartyElement from '~/elements/third-party'
import type { ThirdPartyIntegration } from '~/types/shopify'
import { DEFAULT_INTEGRATIONS } from './constant'
import elements from './elements'
import type { WeaverseShopifyParams } from './types/weaverse-shopify'

export * from '@weaverse/react'
export * from './WeaverseShopifyRoot'
export * from './types'
export * from './utils/fetch-project-data'

export class WeaverseShopify extends Weaverse {
  integrations: ThirdPartyIntegration[]
  elementSchemas: ElementSchema[]
  ssrMode: boolean

  constructor(params: WeaverseShopifyParams) {
    let { thirdPartyIntegration, elementSchemas, ssrMode, ...coreParams } =
      params
    super(coreParams)
    this.integrations = thirdPartyIntegration || DEFAULT_INTEGRATIONS
    this.elementSchemas = elementSchemas || []
    this.ssrMode = ssrMode || false
    this.registerShopifyElements()
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
