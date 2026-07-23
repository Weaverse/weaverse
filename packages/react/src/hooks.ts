import { Weaverse, type WeaverseItemStore } from '@weaverse/core'
import { useContext } from 'react'
import { WeaverseContext, WeaverseItemContext } from './context'

// Re-export the data connector utilities
export {
  replaceContentDataConnectors,
  replaceContentDataConnectorsDeep,
} from './utils/data-connector'

/**
 * Returns the active Weaverse runtime from React context.
 *
 * @typeParam T - Runtime subtype expected by the integration.
 */
export function useWeaverse<T = Weaverse>() {
  let weaverse = useContext(WeaverseContext)
  return weaverse as T
}

/**
 * Returns a Weaverse item instance by ID, or the current rendered item when no
 * ID is provided.
 *
 * @param id - Optional item ID to look up.
 * @returns The matching item instance, or `null` when it is unavailable.
 */
export let useItemInstance = (id?: string) => {
  let { id: currentId } = useContext(WeaverseItemContext)
  let instance = Weaverse.itemInstances.get(id || currentId)
  if (!instance) {
    console.log(`Item instance ${id} not found`)
    return null
  }
  return instance as WeaverseItemStore
}

/**
 * Returns the parent instance of the current rendered item.
 *
 * @returns The parent item instance, or `null` at the root or when unavailable.
 */
export let useParentInstance = () => {
  let { parentId } = useContext(WeaverseItemContext)
  return useItemInstance(parentId || '')
}

/**
 * Returns the direct child instances of an item.
 *
 * @param id - Optional parent item ID; defaults to the current rendered item.
 */
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
