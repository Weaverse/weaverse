import { isBrowser } from '@weaverse/react'
import { createContext } from 'react'
import { WeaverseHydrogen } from '.'
import type { ThemeSettingsStore } from './hooks/use-theme-settings'
import type {
  HydrogenComponent,
  WeaverseHydrogenParams,
  WeaverseLoaderData,
} from './types'

function createCachedWeaverseInstance(
  params: WeaverseHydrogenParams,
  components: HydrogenComponent[],
): WeaverseHydrogen {
  if (isBrowser) {
    window.__weaverses = window.__weaverses || []
    let weaverse = window.__weaverses.find((w) => {
      let { pathname, search } = w.requestInfo
      let { __cachedId } = w.data
      return (
        pathname === params.requestInfo.pathname &&
        search === params.requestInfo.search &&
        __cachedId === params.data.__cachedId
      )
    })

    if (!weaverse) {
      weaverse = new WeaverseHydrogen(params, components)
      window.__weaverses.push(weaverse)
      console.log('💿 Weaverse', weaverse)
    }
    return weaverse
  }
  return new WeaverseHydrogen(params, components)
}

export function createWeaverseInstance(
  weaverseData: WeaverseLoaderData,
  components: HydrogenComponent[],
) {
  let { page, configs, project, pageAssignment } = weaverseData || {}
  let weaverse = createCachedWeaverseInstance(
    {
      ...configs,
      data: page || {},
      pageId: page?.id,
      internal: { project, pageAssignment },
    },
    components,
  )

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

export let ThemeProvider = createContext<ThemeSettingsStore | null>(null)
ThemeProvider.displayName = 'WeaverseThemeProvider'
