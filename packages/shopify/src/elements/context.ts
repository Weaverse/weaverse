import React, { createContext } from 'react'
import type {
  CollectionContextProps,
  ProductContextProps,
  ProductListContextProps,
} from '~/types'
export let ProductContext = createContext<Partial<ProductContextProps>>({})
export let ProductListContext = React.createContext<ProductListContextProps>({})
export let ArticleContext = React.createContext<any>({})
export let BlogContext = React.createContext<any>({})
export let CollectionListContext = createContext<any>({})
export let CollectionContext = createContext<Partial<CollectionContextProps>>(
  {}
)

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

export let weaverseShopifyCollections = new Proxy(
  // @ts-ignore
  globalThis?.weaverseShopifyCollections || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseShopifyCollections?.[name]
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
export let weaverseShopifyBlogs = new Proxy(
  // @ts-ignore
  globalThis?.weaverseShopifyBlogs || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseShopifyBlogs?.[name]
    },
  }
)

export let weaverseSwatchesSettings = new Proxy(
  // @ts-ignore
  globalThis?.weaverseSwatchesSettings || [],
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseSwatchesSettings?.[name]
    },
  }
)

export let weaversePresetsSettings = new Proxy(
  // @ts-ignore
  globalThis?.weaversePresetsSettings || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaversePresetsSettings?.[name]
    },
  }
)
