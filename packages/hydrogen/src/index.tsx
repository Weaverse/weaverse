import elements from './elements'
import type { WeaverseElement, WeaverseType } from '@weaverse/core'
import { Weaverse } from '@weaverse/core'
import React from 'react'
export * from './utils'
export let createHydrogenRootContext = (
  configs: WeaverseType,
  elements: {
    [key: string]: WeaverseElement
  } = {}
) => {
  let rootContext = new Weaverse(configs)
  // Register the element components
  Object.keys(elements).forEach((key) => {
    rootContext.registerElement(elements[key])
  })
  return rootContext
}

export let createWeaverseHydrogenContext = (configs: WeaverseType) => {
  let context = createHydrogenRootContext(configs)

  Object.keys(elements).forEach((key) => {
    context.registerElement(elements[key])
  })
  return context
}

export let WeaverseHydrogenRoot = () => {
  return (
    <div>
      <div>hello world from weaverse hydrogen</div>
    </div>
  )
}
