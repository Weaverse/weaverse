import { Weaverse, type WeaverseItemStore } from '@weaverse/core'
import { useContext } from 'react'
import { WeaverseContext, WeaverseItemContext } from '~/context'

// Re-export the data context hook and utilities
export {
  createWeaverseDataContext,
  useWeaverseDataContext,
  type WeaverseDataContext,
} from './hooks/use-weaverse-data-context'

// Re-export the data connector utilities
export {
  replaceContentDataConnectors,
  replaceContentDataConnectorsDeep,
} from './utils/data-connector'

export function useWeaverse<T = Weaverse>() {
  let weaverse = useContext(WeaverseContext)
  return weaverse as T
}

export let useItemInstance = (id?: string) => {
  let { id: currentId } = useContext(WeaverseItemContext)
  let instance = Weaverse.itemInstances.get(id || currentId)
  if (!instance) {
    console.log(`Item instance ${id} not found`)
    return null
  }
  return instance as WeaverseItemStore
}

export let useParentInstance = () => {
  let { parentId } = useContext(WeaverseItemContext)
  return useItemInstance(parentId || '')
}

export let useChildInstances = (id?: string) => {
  let currentInstance = useItemInstance(id)
  if (!currentInstance) {
    return []
  }
  let { itemInstances } = Weaverse

  let {
    data: { children },
  } = currentInstance
  return children
    .map(({ id }: { id: string }) => itemInstances.get(id))
    .filter(Boolean) as WeaverseItemStore[]
}
