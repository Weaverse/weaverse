import elements from './elements'
import type { WeaverseRootPropsType, WeaverseType } from '@weaverse/react'
import { createRootContext, WeaverseRoot } from '@weaverse/react'
import React from 'react'

export * from '@weaverse/react'
export * from './utils'

export type WeaverseRootProps = WeaverseRootPropsType & {
  data?: any
}

export let createWeaverseHydrogenContext = (configs: WeaverseType) => {
  let context = createRootContext(configs)

  Object.keys(elements).forEach((key) => {
    context.registerElement(elements[key])
  })
  return context
}

export let WeaverseHydrogenRoot = ({ context }: WeaverseRootProps) => {
  return context?.projectData?.items ? (
    <WeaverseRoot context={context} />
  ) : (
    <>No Weaverse data found!</>
  )
}
