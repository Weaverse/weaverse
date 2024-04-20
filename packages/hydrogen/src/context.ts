import { isBrowser } from '@weaverse/react'
import { createContext } from 'react'
import type {
  HydrogenComponent,
  HydrogenThemeSettings,
  WeaverseHydrogenParams,
  WeaverseLoaderData,
} from './types'
import { WeaverseHydrogen } from './index'
import { defaultComponents } from '~/components'

function registerComponents(components: HydrogenComponent[]) {
  components.forEach((comp) => {
    WeaverseHydrogen.registerElement({
      type: comp?.schema?.type,
      Component: comp?.default,
      schema: comp?.schema,
      loader: comp?.loader,
    })
  })
}

function createCachedWeaverseInstance(
  params: WeaverseHydrogenParams,
): WeaverseHydrogen {
  if (isBrowser) {
    window.__weaverses = window.__weaverses || {}
    let weaverse = window.__weaverses[params.pageId]
    if (!weaverse) {
      weaverse = new WeaverseHydrogen(params)
      window.__weaverses[params.pageId] = weaverse
    }
    if (weaverse?.isDesignMode) {
      weaverse.requestInfo = params.requestInfo
      window.weaverseStudio?.refreshStudio(params)
    }
    return weaverse
  }
  return new WeaverseHydrogen(params)
}

export function createWeaverseInstance(
  weaverseData: WeaverseLoaderData,
  components: HydrogenComponent[],
) {
  let { page, configs, project, pageAssignment } = weaverseData || {}
  registerComponents(components)
  registerComponents(defaultComponents)
  return createCachedWeaverseInstance({
    ...configs,
    data: page || {},
    pageId: page?.id,
    internal: { project, pageAssignment },
  })
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
  CUSTOM: 'CUSTOM',
}

export let ThemeSettingsProvider = createContext<HydrogenThemeSettings | null>(
  null,
)
ThemeSettingsProvider.displayName = 'WeaverseThemeSettingsProvider'
