import type { Weaverse, WeaverseItemStore } from '@weaverse/core'
import { useContext } from 'react'

import { WeaverseContext, WeaverseItemContext } from '~/context'

export function useWeaverse<T = Weaverse>() {
  let weaverse = useContext(WeaverseContext)
  return weaverse as T
}

export let useItemInstance = (id?: string) => {
  let weaverse = useWeaverse()
  let { id: currentId } = useContext(WeaverseItemContext)
  let { itemInstances } = weaverse
  let instance = itemInstances.get(id || currentId)
  if (!instance) {
    console.warn(`Item instance ${id} not found`)
    return null
  }
  return instance as WeaverseItemStore
}

// get the closest parent item instance
export let useParentInstance = () => {
  let { parentId } = useContext(WeaverseItemContext)
  return useItemInstance(parentId || '')
}

export let useChildInstances = (id?: string) => {
  let weaverse = useWeaverse()
  let currentInstance = useItemInstance(id)
  if (!currentInstance) return []
  let { itemInstances } = weaverse

  let {
    data: { children },
  } = currentInstance
  return children.map(({ id }: { id: string }) => {
    return itemInstances.get(id)
  }) as WeaverseItemStore[]
}
