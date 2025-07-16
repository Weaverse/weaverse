import type { PlatformTypeEnum } from '@weaverse/react'
import { Weaverse, WeaverseItemStore } from '@weaverse/react'
import * as ThirdPartyElement from '~/elements/third-party'
import type {
  ElementData,
  ElementFlags,
  ElementSchema,
  WeaverseElement,
  WeaverseShopifyParams,
  WeaverseShopifySectionData,
} from '~/types'
import type { ThirdPartyIntegration } from '~/types/shopify'
import { DEFAULT_INTEGRATIONS } from './constant'
import { SHOPIFY_ELEMENTS } from './elements'

export * from './types'
export * from './utils/fetch-project-data'
export * from './WeaverseShopifyRoot'

export let registerThirdPartyElements = () => {
  // biome-ignore lint/complexity/noForEach: <explanation>
  WeaverseShopify.integrations
    ?.flatMap(({ elements }) => elements)
    .forEach(({ type, extraData }) => {
      WeaverseShopify.registerElement({
        type,
        extraData,
        Component: ThirdPartyElement.default,
        defaultCss: ThirdPartyElement.css,
      })
    })
}

export let registerShopifyElements = () => {
  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.values(SHOPIFY_ELEMENTS).forEach((elm) => {
    // @ts-expect-error
    WeaverseShopify.registerElement(elm)
  })
  registerThirdPartyElements()
}
export class WeaverseShopify extends Weaverse {
  platformType: PlatformTypeEnum = 'shopify-section'
  static integrations: ThirdPartyIntegration[]
  elementSchemas: ElementSchema[]
  ssrMode: boolean
  declare ItemConstructor: typeof WeaverseShopifyItem
  declare data: WeaverseShopifySectionData
  declare static itemInstances: Map<string, WeaverseShopifyItem>
  declare static elementRegistry: Map<string, WeaverseElement>

  constructor(params: WeaverseShopifyParams) {
    let { thirdPartyIntegration, elementSchemas, ssrMode, ...coreParams } =
      params
    super({ ...coreParams, platformType: 'shopify-section' })
    this.elementSchemas = elementSchemas || []
    this.ssrMode = ssrMode ?? false
    WeaverseShopify.integrations = thirdPartyIntegration || DEFAULT_INTEGRATIONS
  }
}

export class WeaverseShopifyItem extends WeaverseItemStore {
  declare weaverse: WeaverseShopify

  constructor(initialData: ElementData, weaverse: WeaverseShopify) {
    super(initialData, weaverse)
    // @ts-expect-error
    let defaultData = this.Element?.Component?.defaultProps || {}
    let extraData = this.Element?.extraData
    Object.assign(this._store, defaultData, extraData, initialData)
  }

  get Element(): WeaverseElement {
    return super.Element
  }

  get _flags(): ElementFlags {
    return this.Element?.schema?.flags || {}
  }
}
Weaverse.ItemConstructor = WeaverseShopifyItem
