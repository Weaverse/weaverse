import { createContext } from 'react'
import { ProductContextProps } from '../../type'
export let ProductContext = createContext<ProductContextProps>({})
export let ProductProvider = ProductContext.Provider
export let ProductConsumer = ProductContext.Consumer

// For fast access to window.weaverseShopifyProducts and server-side render , create a proxy version of window.weaverseShopifyProduct
// @ts-ignore
export let weaverseShopifyProducts = new Proxy(
  globalThis?.weaverseShopifyProducts || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseShopifyProducts?.[name]
    },
  }
)

// export let ProductListContext = createContext<ProductContextProps>({})
