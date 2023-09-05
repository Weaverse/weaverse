import elements from './elements'
import type { WeaverseRootPropsType, WeaverseType } from '@weaverse/react'
import { Weaverse, WeaverseRoot } from '@weaverse/react'
import React from 'react'
import { useStudio } from './hooks/use-studio'
import { registerThirdPartyElement } from '~/utils/register-integration'
import type { ThirdPartyIntegration } from '~/types/shopify'

export * from '@weaverse/react'
export * from './types'
export * from './types/configs'
export * from './types/shopify'
export * from './utils/fetch-project-data'

let createRootContext = (configs: WeaverseType) => new Weaverse(configs)

class ShopifyWeaverse extends Weaverse {
  thirdPartyIntegration = [] as ThirdPartyIntegration[]

  constructor() {
    super()
  }
}

interface ShopifyWeaverseType extends WeaverseType {
  thirdPartyIntegration?: ThirdPartyIntegration[]
}

function createWeaverseShopifyContext(configs: ShopifyWeaverseType) {
  let context = createRootContext(configs) as ShopifyWeaverse
  Object.keys(elements).forEach((key) => {
    context.registerElement(elements[key])
  })

  registerThirdPartyElement(context, configs)

  return context
}

function ShopifyRoot({ context }: WeaverseRootPropsType) {
  // @ts-ignore
  useStudio(context)
  return <WeaverseRoot context={context} />
}

export {
  ShopifyRoot,
  createWeaverseShopifyContext,
  ShopifyWeaverse,
  ShopifyWeaverseType,
}
