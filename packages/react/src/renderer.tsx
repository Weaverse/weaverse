/* eslint-disable react/no-children-prop */
import type {
  ElementData,
  Weaverse,
  WeaverseProjectDataType,
} from '@weaverse/core'
import { isBrowser } from '@weaverse/core'
import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { WeaverseContext, WeaverseContextProvider } from './context'
import type { ItemComponentProps, WeaverseRootPropsType } from './types'
import { generateItemClassName } from './utils/css'
import clsx from 'clsx'

export let WeaverseRoot = memo(({ context }: WeaverseRootPropsType) => {
  let [, setData] = useState<WeaverseProjectDataType | unknown>(context.data)
  let rootRef = useRef<HTMLElement>()
  let renderRoot = () => setData({})

  useEffect(() => {
    context.contentRootElement = rootRef?.current || null
    return context.subscribe(renderRoot)
  }, [context])

  let eventHandlers = context?.studioBridge?.eventHandlers || {}
  let themeClass = context.stitchesInstance.theme.className

  if (context.projectId) {
    return (
      <div
        className={`weaverse-content-root ${themeClass}`}
        {...eventHandlers}
        ref={rootRef}
        data-weaverse-project-id={context.projectId}
      >
        <WeaverseContextProvider value={context}>
          <ItemInstance id={context.data.rootId || context.projectId} />
        </WeaverseContextProvider>
      </div>
    )
  }
  return null
})

const ItemComponent = memo(({ instance }: ItemComponentProps) => {
  let context = useWeaverse()
  let { stitchesInstance, elementRegistry, platformType } = context
  let [data, setData] = useState<ElementData>(instance.data)
  let {
    id,
    type,
    childIds = [],
    children = [],
    parentId,
    createdAt,
    updatedAt,
    deletedAt,
    css,
    __hidden,
    data: _,
    ...rest
  } = data

  useEffect(() => {
    let render = (data: ElementData) => setData({ ...data })

    if (isBrowser && !instance.ref.current) {
      // Fallback `ref` if the element isn't created by `React.forwardRef`
      Object.assign(instance.ref, {
        current: document.querySelector(`[data-wv-id="${id}"]`),
      })
    }
    return instance.subscribe(render)
  }, [instance])

  let Element = elementRegistry.get(type)

  if (Element?.Component) {
    let Component = Element.Component
    if (Component.$$typeof === Symbol.for('react.forward_ref')) {
      rest.ref = instance.ref
    }
    let renderChildren = (
      children.length
        ? children
        : childIds.length
        ? childIds.map((cid: string) => ({ id: cid }))
        : []
    ).map((item: { id: string }) => <ItemInstance key={item.id} id={item.id} />)

    let style = rest.style || {}
    if (__hidden) style.display = 'none'

    return (
      <Component
        key={id}
        data-wv-type={type}
        data-wv-id={id}
        className={clsx(
          platformType !== 'shopify-hydrogen' &&
            generateItemClassName(instance, stitchesInstance),
          rest?.data?.className,
        )}
        style={style}
        {...rest}
        children={renderChildren}
      />
    )
  } else {
    console.log(`❌ Unknown element: ${type}`)
    return null
  }
})

export function useWeaverse<T = Weaverse>() {
  let weaverse = useContext(WeaverseContext)
  return weaverse as T
}

export let useItemInstance = (id: string) => {
  let weaverse = useWeaverse()
  let { itemInstances } = weaverse
  let instance = itemInstances.get(id)
  if (!instance) {
    console.warn(`Item instance ${id} not found`)
    return null
  }
  return instance
}

let ItemInstance = memo(({ id }: { id: string }) => {
  let instance = useItemInstance(id)
  if (!instance) {
    return <div style={{ display: 'none' }}>Item instance {id} not found</div>
  }
  return <ItemComponent key={id} instance={instance} />
})
