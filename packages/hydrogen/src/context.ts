import { Weaverse, isBrowser } from '@weaverse/react'
import type {
  HydrogenComponent,
  WeaverseLoaderData,
  WeaverseHydrogen,
  HydrogenPageData,
  HydrogenPageConfigs,
} from './types'

interface WeaverseHydrogenInit extends HydrogenPageConfigs {
  data: HydrogenPageData
  pageId: string
  platformType: 'shopify-hydrogen'
}

function createCachedWeaverseInstance(
  init: WeaverseHydrogenInit,
): WeaverseHydrogen {
  if (isBrowser) {
    window.__weaverses = window.__weaverses || {}
    let { pathname } = init.requestInfo
    if (!window.__weaverses[pathname]) {
      window.__weaverses[pathname] = new Weaverse(init)
    }
    return window.__weaverses[pathname]
  }
  return new Weaverse(init) as unknown as WeaverseHydrogen
}

export function createWeaverseInstance(
  weaverseData: WeaverseLoaderData,
  components: HydrogenComponent[],
) {
  if (isBrowser) {
    console.log('💿 Weaverse data', weaverseData)
  }
  let { page, configs, project, pageAssignment } = weaverseData || {}
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

export let STORE_PAGES = {
  INDEX: 'INDEX',
  PRODUCT: 'PRODUCT',
  ALL_PRODUCTS: 'ALL_PRODUCTS',
  COLLECTION: 'COLLECTION',
  COLLECTION_LIST: 'COLLECTION_LIST',
  PAGE: 'PAGE',
  BLOG: 'BLOG',
  ARTICLE: 'ARTICLE',
  CART: 'CART',
  CUSTOMER: 'CUSTOMER',
  SEARCH: 'SEARCH',
  // NOT_FOUND: 'NOT_FOUND',
  // PASSWORD: 'PASSWORD',
  // CUSTOM: 'CUSTOM',
}
