import {createContext} from 'react'
import {ProductContextProps} from '../../type'
export let ProductContext = createContext<ProductContextProps>({})
export let ProductProvider = ProductContext.Provider
export let ProductConsumer = ProductContext.Consumer


// export let ProductListContext = createContext<ProductContextProps>({})