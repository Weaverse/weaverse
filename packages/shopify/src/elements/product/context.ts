import { createContext } from 'react'
import type { ProductContextProps } from '../../types'
export let ProductContext = createContext<ProductContextProps>({})
export let ProductProvider = ProductContext.Provider
export let ProductConsumer = ProductContext.Consumer

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
