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
