import React from 'react'
import {createRootContext, WeaverseRoot, WeaverseRootPropsType, WeaverseType} from '@weaverse/react'
import elements from './elements'

export * from '@weaverse/react'

let createWeaverseShopifyContext = (configs: WeaverseType) => {
  let context = createRootContext(configs)

  Object.keys(elements).forEach(key => {
    context.registerElement(elements[key])
  })
  return context
}

let ShopifyRoot = ({context, defaultData}: WeaverseRootPropsType) => {
  return <WeaverseRoot context={context} defaultData={defaultData}/>
}

export {ShopifyRoot, createWeaverseShopifyContext}

