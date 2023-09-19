import { Weaverse, isBrowser } from '@weaverse/react'
import type {
  HydrogenComponent,
  WeaverseHydrogen,
  WeaverseHydrogenInit,
  WeaverseLoaderData,
} from './types'
import { createContext } from 'react'

function createCachedWeaverseInstance(
  init: WeaverseHydrogenInit,
): WeaverseHydrogen {
  if (isBrowser) {
    window.__weaverses = window.__weaverses || []
    let weaverse = window.__weaverses.find((w) => {
      let { pathname, search } = w.requestInfo
      let { __cachedId } = w.data
      return (
        pathname === init.requestInfo.pathname &&
        search === init.requestInfo.search &&
        __cachedId === init.data.__cachedId
      )
    })

    if (!weaverse) {
      weaverse = new Weaverse(init) as unknown as WeaverseHydrogen
      window.__weaverses.push(weaverse)
      console.log('💿 Weaverse', weaverse)
    }
    return weaverse
  }
  return new Weaverse(init) as unknown as WeaverseHydrogen
}

export function createWeaverseInstance(
  weaverseData: WeaverseLoaderData,
  components: HydrogenComponent[],
) {
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

export let ThemeProvider = createContext<any>(null)
ThemeProvider.displayName = 'WeaverseThemeProvider'
