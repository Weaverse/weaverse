import type { WeaverseType } from '@weaverse/react'
import { createRootContext, isBrowser } from '@weaverse/react'
import type { HydrogenComponent, HydrogenPageData } from './types'

function createCachedContext(init: WeaverseType) {
  if (isBrowser && init.pageId) {
    window.__weaverses = window.__weaverses || {}
    if (!window.__weaverses[init.pageId]) {
      window.__weaverses[init.pageId] = createRootContext(init)
    }
    return window.__weaverses[init.pageId]
  }
  return createRootContext(init)
}

export function createWeaverseHydrogenContext(
  { weaverseData }: { weaverseData: HydrogenPageData },
  components: Record<string, HydrogenComponent>
) {
  let { page = {}, configs = {} } = weaverseData || {}
  let weaverse = createCachedContext({
    ...configs,
    data: page,
    pageId: page?.id,
    platformType: 'shopify-hydrogen',
  })

  Object.entries(components).forEach(([key, component]) => {
    weaverse.registerElement({
      type: component?.schema?.type || key,
      Component: component?.default,
      schema: component?.schema,
      // defaultCss: component?.css,
    })
  })

  return weaverse
}
