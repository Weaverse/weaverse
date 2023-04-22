import { createRootContext } from '@weaverse/react'
import type { WeaverseComponentsType } from './types'

export let createWeaverseHydrogenContext = (
  {
    weaverseData: { weaversePageData, weaverseConfig } = {
      weaversePageData: {},
      weaverseConfig: {},
    },
  }: any,
  components: WeaverseComponentsType
) => {
  let weaverse = createRootContext({
    ...weaverseConfig,
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
