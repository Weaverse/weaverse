import { Weaverse, isBrowser } from '@weaverse/react'
import type {
  HydrogenComponent,
  HydrogenPageConfigs,
  HydrogenPageData,
  WeaverseHydrogen,
  WeaverseInternal,
  WeaverseLoaderData,
} from './types'

interface WeaverseHydrogenInit extends HydrogenPageConfigs {
  data: HydrogenPageData
  pageId: string
  platformType: 'shopify-hydrogen'
  internal: Partial<WeaverseInternal>
}

function createCachedWeaverseInstance(
  init: WeaverseHydrogenInit,
): WeaverseHydrogen {
  if (isBrowser) {
    window.__weaverses = window.__weaverses || []
    let weaverse = window.__weaverses.find((w) => {
      let { pathname, search } = w.requestInfo
      return (
        pathname === init.requestInfo.pathname &&
        search === init.requestInfo.search
      )
    })
    if (!weaverse) {
      weaverse = new Weaverse(init) as unknown as WeaverseHydrogen
      window.__weaverses.push(weaverse)
    } else {
      weaverse.setProjectData(init.data)
    }
    return weaverse
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
    internal: { project, pageAssignment },
  })

  components.forEach((comp) => {
    weaverse.registerElement({
      type: comp?.schema?.type,
      Component: comp?.default,
      schema: comp?.schema,
      loader: comp?.loader,
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
  NOT_FOUND: 'NOT_FOUND',
  PASSWORD: 'PASSWORD',
  CUSTOM: 'CUSTOM',
}
