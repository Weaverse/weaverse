import { Weaverse, type WeaverseItemStore } from '@weaverse/core'
import { useContext, useEffect } from 'react'
import { WeaverseContext, WeaverseItemContext } from '~/context'

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
  if (!currentInstance) return []
  let { itemInstances } = Weaverse

  let {
    data: { children },
  } = currentInstance
  return children.map(({ id }: { id: string }) => {
    return itemInstances.get(id)
  }) as WeaverseItemStore[]
}

let fetchingKey = ''

export function usePixel(context: Weaverse) {
  // @ts-expect-error - ignore
  let { projectId, pageId, weaverseHost, isDesignMode } = context

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!projectId || !pageId || !weaverseHost || isDesignMode) return
    let currentKey = `${projectId}-${pageId}-${globalThis.location.pathname}`
    if (fetchingKey === currentKey) return
    fetchingKey = currentKey
    let url = `${weaverseHost}/api/public/px`
    let img = new Image()
    img.onload = () => {}
    img.src = `${url}?projectId=${projectId}&pageId=${pageId}`
  }, [])
}
