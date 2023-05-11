import type { WeaverseType } from '@weaverse/react'
import { createRootContext, isBrowser } from '@weaverse/react'
import type { WeaverseComponentsType } from './types'

const createCachedWeaverseContext = (init: WeaverseType) => {
  if (isBrowser && init.pageId) {
    window.__weaverses = window.__weaverses || {}
    if (!window.__weaverses[init.pageId]) {
      window.__weaverses[init.pageId] = createRootContext(init)
    }
    return window.__weaverses[init.pageId]
  }
  return createRootContext(init)
}

export let createWeaverseHydrogenContext = (
  { weaverseData }: any,
  components: WeaverseComponentsType
) => {
  let { pageData = {}, config = {} } = weaverseData || {}
  let weaverse = createCachedWeaverseContext({
    ...config,
    data: pageData,
    pageId: pageData?.id,
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
