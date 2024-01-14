/* eslint-disable react/no-children-prop */
import type { ElementData, WeaverseProjectDataType } from '@weaverse/core'
import { isBrowser } from '@weaverse/core'
import React, { memo, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { WeaverseContextProvider, WeaverseItemContext } from './context'
import type { ItemComponentProps, WeaverseRootPropsType } from './types'
import { generateItemClassName } from './utils/css'

import { useItemInstance, usePixel, useWeaverse } from '~/hooks'

export let WeaverseRoot = memo(({ context }: WeaverseRootPropsType) => {
  let [, setData] = useState<WeaverseProjectDataType | unknown>(context.data)
  let rootRef = useRef<HTMLElement>()
  let renderRoot = () => setData({})

  useEffect(() => {
    context.contentRootElement = rootRef?.current || null
    return context.subscribe(renderRoot)
  }, [context])
  usePixel(context)

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
          <ItemInstance
            id={context.data.rootId || context.projectId}
            parentId={''}
          />
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
    // Need to get rid of this `data` property
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance])

  let Element = elementRegistry.get(type)

  if (Element?.Component) {
    let Component = Element.Component
    if (Component.$$typeof === Symbol.for('react.forward_ref')) {
      rest.ref = instance.ref
    }
    let renderChildren = (
      children?.length
        ? children
        : childIds?.length
          ? childIds.map((cid: string) => ({ id: cid }))
          : []
    ).map((item: { id: string }) => (
      <ItemInstance key={item.id} id={item.id} parentId={id} />
    ))

    let style = rest.style || {}
    if (__hidden) style.display = 'none'

    return (
      <Component
        {...rest}
        key={id}
        data-wv-type={type}
        data-wv-id={id}
        className={clsx(
          platformType !== 'shopify-hydrogen' &&
            generateItemClassName(instance, stitchesInstance),
          rest.data?.className,
        )}
        style={style}
        children={renderChildren.length ? renderChildren : undefined}
      />
    )
  } else {
    console.log(`❌ Unknown element: ${type}`)
    return null
  }
})

let ItemInstance = memo(
  ({ id, parentId }: { id: string; parentId: string }) => {
    let instance = useItemInstance(id)
    if (!instance) {
      return <div style={{ display: 'none' }}>Item instance {id} not found</div>
    }
    return (
      <WeaverseItemContext.Provider value={{ parentId, id }}>
        <ItemComponent key={id} instance={instance} />
      </WeaverseItemContext.Provider>
    )
  },
)
