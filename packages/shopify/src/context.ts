import { createContext } from 'react'

import type {
  CollectionContextProps,
  ProductContextType,
  ProductListContextProps,
} from '~/types'

export let ProductContext = createContext<ProductContextType | null>(null)
export let ProductListContext = createContext<ProductListContextProps>({})
export let ArticleContext = createContext<any>({})
export let BlogContext = createContext<any>({})
export let CollectionListContext = createContext<any>({})
export let CollectionContext = createContext<Partial<CollectionContextProps>>(
  {},
)
