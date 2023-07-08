import type { WeaverseType } from '@weaverse/react'
import { Weaverse, isBrowser } from '@weaverse/react'
import type {
  HydrogenComponent,
  HydrogenPageData,
  WeaverseHydrogen,
} from './types'

function createCachedWeaverseInstance(init: WeaverseType): WeaverseHydrogen {
  if (isBrowser) {
    window.__weaverses = window.__weaverses || {}
    let pathname = window.location.pathname
    if (!window.__weaverses[pathname]) {
      window.__weaverses[pathname] = new Weaverse(init)
    }
    return window.__weaverses[pathname]
  }
  return new Weaverse(init) as unknown as WeaverseHydrogen
}

export function createWeaverseInstance(
  weaverseData: HydrogenPageData,
  components: HydrogenComponent[]
) {
  if (isBrowser) {
    console.log('💿 Weaverse data', weaverseData)
  }
  let { page, configs = {}, project, pageAssignment } = weaverseData || {}
  let weaverse = createCachedWeaverseInstance({
    ...configs,
    data: page || {},
    pageId: page?.id,
    platformType: 'shopify-hydrogen',
  })
  weaverse.internal.project = project
  weaverse.internal.pageAssignment = pageAssignment

  components.forEach((comp) => {
    weaverse.registerElement({
      type: comp?.schema?.type,
      Component: comp?.default,
      schema: comp?.schema,
    })
  })
  return weaverse
}

export const PageType = {
  INDEX: 'INDEX',
  PAGE: 'PAGE',
  COLLECTION: 'COLLECTION',
  PRODUCT: 'PRODUCT',
  ARTICLE: 'ARTICLE',
  NOT_FOUND: 'NOT_FOUND',
  CUSTOM: 'CUSTOM',
}
