import { isBrowser } from '@weaverse/react'
import { createContext } from 'react'
import type { ThemeSettingsStore } from './hooks/use-theme-settings'
import { WeaverseHydrogen } from './index'
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
      return pathname === params.requestInfo.pathname
    })

    if (!weaverse) {
      weaverse = new WeaverseHydrogen(params, components)
      window.__weaverses.push(weaverse)
    } else if (weaverse.isDesignMode) {
      // we might find a proper way to make weaverse as fresh as possible
      // pass new requestInfo so that it will make useStudio effect run again and reinitialize studio
      weaverse.requestInfo = params.requestInfo
      weaverse.setProjectData(params.data)
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
  return createCachedWeaverseInstance(
    {
      ...configs,
      data: page || {},
      pageId: page?.id,
      internal: { project, pageAssignment },
    },
    components,
  )
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
