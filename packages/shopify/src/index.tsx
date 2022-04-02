import elements from './elements'
import {
  createRootContext,
  WeaverseRoot,
  WeaverseRootPropsType,
  WeaverseType,
} from '@weaverse/react'
import React from 'react'

export * from '@weaverse/react'

let createWeaverseShopifyContext = (configs: WeaverseType) => {
  let context = createRootContext(configs)

  Object.keys(elements).forEach((key) => {
    context.registerElement(elements[key])
  })
  return context
}

let ShopifyRoot = ({ context }: WeaverseRootPropsType) => {
  return <WeaverseRoot context={context} />
}

export { ShopifyRoot, createWeaverseShopifyContext }
