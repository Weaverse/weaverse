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
  { weaverseData }: { weaverseData?: HydrogenPageData },
  components: Record<string, HydrogenComponent>
) {
  let { page = {}, configs = {} } = weaverseData || {}
  let weaverse = createCachedContext({
    ...configs,
    data: page,
    pageId: page?.id,
    platformType: 'shopify-hydrogen',
  })

  // Clear the element instances from @weaverse/react package to register the new ones from @weaverse/hydrogen only
  weaverse.elementInstances.clear()
  Object.entries(components).forEach(([key, component]) => {
    weaverse.registerElement({
      type: component?.schema?.type || key,
      Component: component?.default,
      // @ts-ignore
      schema: component?.schema,
      // @ts-ignore
      template: component?.template,
    })
  })
  //
  return weaverse
}
