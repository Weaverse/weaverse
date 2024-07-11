import type { Weaverse } from '@weaverse/core'
import { createContext } from 'react'

export let WeaverseContext = createContext<Weaverse>({} as Weaverse)
export let WeaverseContextProvider = WeaverseContext.Provider
export let WeaverseItemContext = createContext<{
  id: string
  parentId: string
}>({ id: '', parentId: '' })
