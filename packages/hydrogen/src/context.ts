import { isBrowser } from '@weaverse/react'
import { createContext } from 'react'
import type { ThemeSettingsStore } from './hooks/use-theme-settings'
import type {
  HydrogenComponent,
  WeaverseHydrogenParams,
  WeaverseLoaderData,
} from './types'
import { WeaverseHydrogen } from './index'

function createCachedWeaverseInstance(
  params: WeaverseHydrogenParams,
  components: HydrogenComponent[],
): WeaverseHydrogen {
  if (isBrowser) {
    window.__weaverses = window.__weaverses || {}
    let weaverse = window.__weaverses[params.pageId]
    if (!weaverse) {
      weaverse = new WeaverseHydrogen(params, components)
      window.__weaverses[params.pageId] = weaverse
    } else if (weaverse.isDesignMode) {
      window.weaverseStudio?.refresh(params)
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
