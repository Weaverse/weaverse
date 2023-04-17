import type { WeaverseElement, WeaverseType } from '@weaverse/core'
import { Weaverse } from '@weaverse/core'
import { useStudio } from './utils'
import React from 'react'
import type { WeaverseHydrogenConfigs } from './types'
import { WeaverseRoot, createRootContext } from '@weaverse/react'
export * from './utils'
export * from './weaverse-loader'
let createHydrogenRootContext = (
  configs: WeaverseType,
  elements: {
    [key: string]: WeaverseElement
  } = {}
) => {
  let rootContext = createRootContext(configs)
  // Register the element components
  Object.keys(elements).forEach((key) => {
    rootContext.registerElement(elements[key])
  })
  return rootContext
}

export let useWeaverseHydrogen = (
  weaverseHydrogenConfigs: WeaverseHydrogenConfigs,
  data: any
) => {
  let weaversePageData = data?.weaverseData?.weaversePageData
  let { components, ...rest } = weaverseHydrogenConfigs
  let weaverse = createHydrogenRootContext({
    ...rest,
    data: weaversePageData,
    pageId: weaversePageData?.pageId,
    platformType: 'shopify-hydrogen',
  })
  Object.keys(components).forEach((key) => {
    let component = components[key]
    weaverse.registerElement({
      type: components[key]?.schema?.type || key,
      Component: component?.default,
      schema: component?.schema,
      defaultCss: component?.defaultCss,
      permanentCss: component?.permanentCss,
    })
  })
  useStudio(weaverse)
  console.log('weaverse', weaverse)
  return weaverse
}

export let WeaverseHydrogenRoot = ({
  configs,
  data,
}: {
  configs: WeaverseHydrogenConfigs
  data: any
}) => {
  let weaverse = useWeaverseHydrogen(configs, data)
  if (!weaverse?.data) {
    return <div>404</div>
  }
  return <WeaverseRoot context={weaverse} />
}
