import { createRootContext } from '@weaverse/react'
import type { WeaverseHydrogenConfigs } from './types'

export let createWeaverseHydrogenContext = (
  { components, ...rest }: WeaverseHydrogenConfigs,
  { weaverseData: { weaversePageData } = { weaversePageData: {} } }: any
) => {
  let weaverse = createRootContext({
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

  return weaverse
}
