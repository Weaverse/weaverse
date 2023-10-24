import type { PlatformTypeEnum } from '@weaverse/react'
import { Weaverse, WeaverseItemStore } from '@weaverse/react'
import * as ThirdPartyElement from '~/elements/third-party'
import type { ThirdPartyIntegration } from '~/types/shopify'
import { DEFAULT_INTEGRATIONS } from './constant'
import { SHOPIFY_ELEMENTS } from './elements'
import type {
  ElementData,
  ElementFlags,
  ElementSchema,
  WeaverseElement,
  WeaverseShopifyParams,
  WeaverseShopifySectionData,
} from '~/types'

export * from './WeaverseShopifyRoot'
export * from './types'
export * from './utils/fetch-project-data'

export class WeaverseShopify extends Weaverse {
  platformType: PlatformTypeEnum = 'shopify-section'
  integrations: ThirdPartyIntegration[]
  elementSchemas: ElementSchema[]
  ssrMode: boolean
  declare ItemConstructor: typeof WeaverseShopifyItem
  declare data: WeaverseShopifySectionData
  declare static itemInstances: Map<string | number, WeaverseShopifyItem>
  declare static elementRegistry: Map<string, WeaverseElement>

  constructor(params: WeaverseShopifyParams) {
    let { thirdPartyIntegration, elementSchemas, ssrMode, ...coreParams } =
      params
    super({ ...coreParams, ItemConstructor: WeaverseShopifyItem })
    this.integrations = thirdPartyIntegration || DEFAULT_INTEGRATIONS
    this.elementSchemas = elementSchemas || []
    this.ssrMode = ssrMode || false
    this.registerShopifyElements()
  }

  registerShopifyElements = () => {
    Object.values(SHOPIFY_ELEMENTS).forEach((elm) => {
      Weaverse.registerElement(elm)
    })
    this.registerThirdPartyElements()
  }

  registerThirdPartyElements = () => {
    this.integrations
      .flatMap(({ elements }) => elements)
      .forEach(({ type, extraData }) => {
        Weaverse.registerElement({
          type,
          extraData,
          Component: ThirdPartyElement.default,
          defaultCss: ThirdPartyElement.css,
        })
      })
  }
}

export class WeaverseShopifyItem extends WeaverseItemStore {
  declare weaverse: WeaverseShopify

  constructor(initialData: ElementData, weaverse: WeaverseShopify) {
    super(initialData, weaverse)
    this._store = { ...initialData }
  }

  get Element(): WeaverseElement {
    return super.Element
  }

  get _flags(): ElementFlags {
    return this.Element?.schema?.flags || {}
  }

  get data(): ElementData {
    let defaultData = this.Element?.Component?.defaultProps || {}
    let extraData = this.Element?.extraData
    return { ...defaultData, ...extraData, ...super.data }
  }

  set data(update) {
    super.data = update
  }
}
