/* eslint-disable react/no-children-prop */
import type { ElementData, WeaverseProjectDataType } from '@weaverse/core'
import { isBrowser } from '@weaverse/core'
import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { initUploadCareAdaptiveDelivery } from '~/utils/uploadcare'
import { WeaverseContext, WeaverseContextProvider } from './context'
import type { ItemComponentProps, WeaverseRootPropsType } from './types'
import { generateItemClassName } from './utils/css'
import clsx from 'clsx'

export let WeaverseRoot = memo(({ context }: WeaverseRootPropsType) => {
  let [, setData] = useState<WeaverseProjectDataType | unknown>(context.data)
  let rootRef = useRef<HTMLElement>()
  let renderRoot = () => setData({})

  useEffect(() => {
    context.subscribe(renderRoot)
    context.contentRootElement = rootRef.current
    initUploadCareAdaptiveDelivery(context.weaverseHost)
    return () => {
      context.unsubscribe(renderRoot)
    }
  }, [])

  let eventHandlers = context?.studioBridge?.eventHandlers || {}
  let themeClass = context.stitchesInstance.theme.className

  if (context.data?.rootId) {
    return (
      <div
        className={`weaverse-content-root ${themeClass}`}
        {...eventHandlers}
        ref={rootRef}
      >
        <WeaverseContextProvider value={context}>
          <ItemInstance id={context.data.rootId} />
        </WeaverseContextProvider>
      </div>
    )
  }
  return null
})

const ItemComponent = memo(({ instance }: ItemComponentProps) => {
  let context = useContext(WeaverseContext)
  let { stitchesInstance, elementInstances } = context
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
    tailwindClasses,
    css,
    ...rest
  } = data

  useEffect(() => {
    let render = (data: ElementData) => setData({ ...data })
    instance.subscribe(render)
    if (isBrowser && !instance.ref.current) {
      // Fallback `ref` if the element isn't created by `React.forwardRef`
      Object.assign(instance.ref, {
        current: document.querySelector(`[data-wv-id="${id}"]`),
      })
    }
    return () => instance.unsubscribe(render)
  }, [])

  let Element = elementInstances.get(type)

  if (Element?.Component) {
    let Component = Element.Component
    if (Component.$$typeof === Symbol.for('react.forward_ref')) {
      rest.ref = instance.ref
    }
    return (
      <Component
        key={id}
        data-wv-type={type}
        data-wv-id={id}
        className={clsx(
          generateItemClassName(instance, stitchesInstance),
          rest?.data?.className
        )}
        {...rest}
      >
        {/* // TODO: refactor this, migrate to `children` prop */}
        {childIds.map((cid) => (
          <ItemInstance key={cid} id={cid} />
        ))}
        {children.map((item: any) => (
          <ItemInstance key={item.id} id={item.id} />
        ))}
      </Component>
    )
  } else {
    console.log(`❌ Unknown element: ${type}`)
    return null
  }
})

let ItemInstance = memo(({ id }: { id: string | number }) => {
  let context = useContext(WeaverseContext)
  let { itemInstances } = context
  let instance = itemInstances.get(id)
  if (!instance) {
    console.warn(`Item instance ${id} not found`)
    return <div style={{ display: 'none' }}>Item instance {id} not found</div>
  }
  return <ItemComponent key={id} instance={instance} />
})
