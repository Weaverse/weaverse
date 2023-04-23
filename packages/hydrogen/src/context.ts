import { createRootContext } from '@weaverse/react'
import type { WeaverseComponentsType } from './types'

export let createWeaverseHydrogenContext = (
  {
    weaverseData: { pageData, config } = {
      pageData: {},
      config: {},
    },
  }: any,
  components: WeaverseComponentsType
) => {
  let weaverse = createRootContext({
    ...config,
    data: pageData,
    pageId: pageData?.pageId,
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
