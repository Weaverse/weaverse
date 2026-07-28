import type { Weaverse } from '@weaverse/core'
import { createContext } from 'react'

/** Provides the active Weaverse runtime to React components. */
export let WeaverseContext = createContext<Weaverse>({} as Weaverse)

/** Provider component for supplying the active Weaverse runtime. */
export let WeaverseContextProvider = WeaverseContext.Provider

/** Identifies the current rendered item and its parent item. */
export let WeaverseItemContext = createContext<{
  /** ID of the current Weaverse item. */
  id: string
  /** ID of the current item's parent, or an empty string at the root. */
  parentId: string
}>({ id: '', parentId: '' })
