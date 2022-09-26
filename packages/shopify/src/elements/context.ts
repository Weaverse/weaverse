import React, { createContext } from 'react'
import type { ProductContextProps, ProductListContextProps } from '~/types'
import type { TODO } from '@weaverse/core'
export let ProductContext = createContext<ProductContextProps>({})
export let ProductListContext = React.createContext<ProductListContextProps>({})
export let ArticleContext = React.createContext<TODO>({})
export let BlogContext = React.createContext<TODO>({})
/**
 * For fast access to `window.weaverseShopifyProducts` and server-side render
 * create a proxy version of `window.weaverseShopifyProduct`
 */
export let weaverseShopifyProducts = new Proxy(
  // @ts-ignore
  globalThis?.weaverseShopifyProducts || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseShopifyProducts?.[name]
    },
  }
)

export let weaverseShopifyStoreData = new Proxy(
  // @ts-ignore
  globalThis?.weaverseShopifyStoreData || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseShopifyStoreData?.[name]
    },
  }
)

export let weaverseShopifyProductLists = new Proxy(
  // @ts-ignore
  globalThis?.weaverseShopifyProductLists || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseShopifyProductLists?.[name]
    },
  }
)

export let weaverseShopifyArticles = new Proxy(
  // @ts-ignore
  globalThis?.weaverseShopifyArticles || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseShopifyArticles?.[name]
    },
  }
)
