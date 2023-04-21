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
  Object.values(elements).forEach((element) => {
    rootContext.registerElement(element)
  })
  return rootContext
}

export let useWeaverseHydrogen = (
  { components, ...rest }: WeaverseHydrogenConfigs,
  { weaverseData: { weaversePageData } = { weaversePageData: {} } }: any
) => {
  let weaverse = createHydrogenRootContext({
    ...rest,
    data: weaversePageData,
    pageId: weaversePageData?.pageId,
    isDesignMode: true,
    platformType: 'shopify-hydrogen',
  })
  Object.entries(components).forEach(([key, component]) => {
    weaverse.registerElement({
      type: component?.schema?.type || key,
      Component: component?.default,
      schema: component?.schema,
      defaultCss: component?.css,
      permanentCss: component?.permanentCss,
    })
  })

  useStudio(weaverse)
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
