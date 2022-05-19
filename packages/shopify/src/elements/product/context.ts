import {createContext} from 'react'
import {ProductContextProps} from '../../type'
export let ProductContext = createContext<ProductContextProps>({})
export let ProductProvider = ProductContext.Provider
export let ProductConsumer = ProductContext.Consumer
// @ts-ignore
export let weaverseShopifyProducts = new Proxy(globalThis?.weaverseShopifyProducts || {}, {
  get: (target, name) => {
    // @ts-ignore
    return target?.[name] || globalThis?.weaverseShopifyProducts?.[name]
  },
})

// export let ProductListContext = createContext<ProductContextProps>({})