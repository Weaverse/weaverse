import elements from './elements'
import {
  createRootContext,
  WeaverseRoot,
  WeaverseRootPropsType,
  WeaverseType,
} from '@weaverse/react'
import React from 'react'

export * from '@weaverse/react'

let createWeaverseHydrogenContext = (configs: WeaverseType) => {
  let context = createRootContext(configs)

  Object.keys(elements).forEach((key) => {
    context.registerElement(elements[key])
  })
  return context
}

let WeaverseHydrogenRoot = ({ context }: WeaverseRootPropsType) => {
  return <WeaverseRoot context={context} />
}

export { WeaverseHydrogenRoot, createWeaverseHydrogenContext }
