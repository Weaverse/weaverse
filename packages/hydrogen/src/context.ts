import type { WeaverseType } from '@weaverse/react'
import { Weaverse, isBrowser } from '@weaverse/react'
import type {
  HydrogenComponent,
  HydrogenPageData,
  WeaverseHydrogen,
  WeaverseHydrogenLoaderData,
} from './types'

function createRootContext(init: WeaverseType) {
  return new Weaverse(init) as unknown as WeaverseHydrogen
}

function createCachedContext(init: WeaverseType): WeaverseHydrogen {
  if (isBrowser) {
    window.__weaverses = window.__weaverses || {}
    let pathname = window.location.pathname
    if (!window.__weaverses[pathname]) {
      window.__weaverses[pathname] = createRootContext(init)
    }
    return window.__weaverses[pathname]
  }
  return createRootContext(init)
}

export function createWeaverseHydrogenContext(
  data: WeaverseHydrogenLoaderData,
  components: Record<string, HydrogenComponent>
) {
  let weaverseData = (data?.weaverseData || {}) as HydrogenPageData
  let { page = {}, configs = {}, project, pageTemplate } = weaverseData
  let weaverse = createCachedContext({
    ...configs,
    data: page,
    pageId: page?.id,
    platformType: 'shopify-hydrogen',
  })
  weaverse.internal.project = project
  weaverse.internal.pageTemplate = pageTemplate

  Object.entries(components).forEach(([key, component]) => {
    weaverse.registerElement({
      type: component?.schema?.type || key,
      Component: component?.default,
      schema: component?.schema,
    })
  })
  return weaverse
}
