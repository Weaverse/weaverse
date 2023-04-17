import elements from './elements'
import type { WeaverseElement, WeaverseType } from '@weaverse/core'
import { Weaverse } from '@weaverse/core'
import { useStudio } from './utils'
import React from 'react'
export * from './utils'
export * from './weaverse-loader'
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

export let useWeaverseHydrogen = (configs: WeaverseType) => {
  let weaverse = createWeaverseHydrogenContext(configs)
  useStudio(weaverse)
  return weaverse
}

export let WeaverseHydrogenRoot = ({ configs }: { configs: WeaverseType }) => {
  let weaverse = useWeaverseHydrogen(configs)
  return (
    <div>
      <div id="weaverse-test">hello world from weaverse hydrogen</div>
    </div>
  )
}
