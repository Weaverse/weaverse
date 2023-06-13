import type { WeaverseType } from '@weaverse/react'
import { Weaverse, isBrowser } from '@weaverse/react'
import type {
  HydrogenComponent,
  HydrogenPageData,
  WeaverseHydrogen,
} from './types'

function createRootContext(init: WeaverseType) {
  return new Weaverse(init) as unknown as WeaverseHydrogen
}

function createCachedContext(init: WeaverseType): WeaverseHydrogen {
  if (isBrowser && init.pageId) {
    window.__weaverse = window.__weaverse || {}
    if (!window.__weaverse[init.pageId]) {
      window.__weaverse[init.pageId] = createRootContext(init)
    }
    return window.__weaverse[init.pageId]
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
      schema: component?.schema,
    })
  })
  return weaverse
}
