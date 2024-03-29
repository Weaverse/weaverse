import type { Weaverse, WeaverseItemStore } from '@weaverse/core'
import { useContext, useEffect } from 'react'

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

let fetchingKey = ''

export function usePixel(context: Weaverse) {
  // @ts-expect-error
  let { projectId, pageId, weaverseHost } = context

  useEffect(() => {
    if (!projectId || !pageId || !weaverseHost) return
    let currentKey = `${projectId}-${pageId}-${globalThis.location.pathname}`
    if (fetchingKey === currentKey) return
    fetchingKey = currentKey
    let url = `${weaverseHost}/api/public/px`
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.send(JSON.stringify({ projectId, pageId }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
