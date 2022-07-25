import type { ProjectDataType, ElementData } from '@weaverse/core'
import { isBrowser } from '@weaverse/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { WeaverseContext, WeaverseContextProvider } from './context'
import type { ItemComponentProps, WeaverseRootPropsType } from './types'
import { generateItemClass } from './utils'

export let WeaverseRoot = ({ context }: WeaverseRootPropsType) => {
  let [, setData] = useState<ProjectDataType | unknown>(context.projectData)
  let rootRef = useRef<HTMLElement>()

  useEffect(() => {
    let update = () => setData({})
    context.subscribe(update)
    if (context.projectData) {
      setTimeout(update, 110)
    }
    context.contentRootElement = rootRef.current
    return () => {
      context.unsubscribe(update)
    }
  }, [])

  let eventHandlers = context?.studioBridge?.eventHandlers || {}
  let themeClass = context.stitchesInstance.theme.className
  return (
    <div
      className={`weaverse-content-root ${themeClass}`}
      {...eventHandlers}
      ref={rootRef}
    >
      <WeaverseContextProvider value={context}>
        <ItemInstance id={context.projectData.rootId || 0} />
      </WeaverseContextProvider>
    </div>
  )
}

const ItemComponent = ({ instance }: ItemComponentProps) => {
  let { stitchesInstance, elementInstances } = useContext(WeaverseContext)
  let [data, setData] = useState<ElementData>(instance.data)
  let { id, type, childIds = [], css, className, ...rest } = data

  useEffect(() => {
    let update = (data: ElementData) => setData({ ...data })
    instance.subscribe(update)
    if (isBrowser && !instance.ref.current) {
      // fallback `ref` if component is not `forwardRef`
      Object.assign(instance.ref, {
        current: document.querySelector(`[data-wv-id="${id}"]`),
      })
    }
    instance.ref.current?.removeAttribute('css')
    return () => {
      instance.unsubscribe(update)
    }
  }, [])

  let Element = elementInstances.get(type!)
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
        className={generateItemClass(instance, stitchesInstance)}
        {...rest}
      >
        {childIds.map((id) => (
          <ItemInstance key={id} id={id} />
        ))}
      </Component>
    )
  }
  return null
}

let ItemInstance = ({ id }: { id: string | number }) => {
  let context = useContext(WeaverseContext)
  let { itemInstances } = context
  let instance = itemInstances.get(id)
  if (!instance) {
    return <div style={{ display: 'none' }}>Item instance {id} not found</div>
  }
  return <ItemComponent instance={instance} />
}
