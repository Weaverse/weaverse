import Elements from './elements'
import { shortCssObject } from './utils/css'
import type { WeaverseElement } from '@weaverse/core'
import { isBrowser, Weaverse, WeaverseItemStore, WeaverseType } from '@weaverse/core'
import React, { createContext, useContext, useEffect, useState } from 'react'

export const createRootContext = (configs: WeaverseType) => {
  const rootContext = new Weaverse(configs)
  // Register the element components
  Object.keys(Elements).forEach((key) => {
    rootContext.registerElement(Elements[key])
  })
  return rootContext
}

export let WeaverseContext = createContext<Weaverse>({} as Weaverse)
export let WeaverseContextProvider = WeaverseContext.Provider
export let WeaverseContextConsumer = WeaverseContext.Consumer

export type WeaverseRootPropsType = { context: Weaverse }

export const WeaverseRoot = ({ context }: WeaverseRootPropsType) => {
  let [, setData] = useState<any>(context.projectData)
  useEffect(() => {
    let handleUpdate = () => {
      setData({})
    }
    context.subscribe(handleUpdate)
    if (context.projectData) {
      setTimeout(handleUpdate, 110)
    }
    return () => {
      context.unsubscribe(handleUpdate)
    }
  }, [])
  // if (!context.projectData?.items?.length && defaultData) {
  //   Object.assign(context.projectData, defaultData)
  //   context.initProjectItemData()
  // }
  let eventHandlers = context?.studioBridge?.eventHandlers || {}
  let themeClass = context.stitchesInstance.theme.className
  return (
          <div className={`weaverse-content-root ${themeClass}`} {...eventHandlers}>
            <WeaverseContextProvider value={context}>
              <RenderItem itemId={context.projectData.rootId || 0} />
            </WeaverseContextProvider>
          </div>
  )
}

type ItemProps = {
  itemInstance: WeaverseItemStore
  elementInstances: Map<string, WeaverseElement>
}

const Item = ({ itemInstance, elementInstances }: ItemProps) => {
  let [data, setData] = useState<any>(itemInstance.data)
  let { id, type, childIds, css, className: cls = '', ...rest } = data
  useEffect(() => {
    let handleUpdate = (update: any) => {
      setData({ ...update })
    }
    itemInstance.subscribe(handleUpdate)
    if (isBrowser && !itemInstance.ref.current) {
      // fallback ref if component is not forwardRef
      Object.assign(itemInstance.ref, {
        current: document.querySelector(`[data-wv-id="${id}"]`)
      })
    }

    return () => {
      itemInstance.unsubscribe(handleUpdate)
    }
  }, [])
  let context = useContext(WeaverseContext)

  let className = ""
  if (css) {
    // let stitches create the style from css object and
    // then return the classname, so we can use it in the render
    let formattedCss = shortCssObject(css)
    let { className: newClass = '' } = context.stitchesInstance.css(formattedCss)()
    let { stichesClass } = itemInstance
    let otherClass = (itemInstance.ref.current?.className || "")
      .replace(stichesClass, "")
      .replace(cls, "")
      .trim()
    className = `${cls} ${newClass} ${otherClass}`.trim()
    itemInstance.stichesClass = newClass
  }

  let element = elementInstances.get(type) || elementInstances.get('base')
  if (element?.Component) {
    let Component = element.Component
    // @ts-ignore
    if (Component.$$typeof === Symbol.for('react.forward_ref')) {
      rest.ref = itemInstance.ref
    }
    return (
      <Component
        key={id}
        data-wv-type={type}
        data-wv-id={id}
        {...rest}
        className={className}
      >
        {Array.isArray(childIds) &&
          childIds.map((childId) => (
                  <RenderItem key={childId} itemId={childId} />
          ))}
      </Component>
    )
  }
  return null
}

const RenderItem = ({
  itemId,
}: {
  itemId: number | string
}): any => {
  let context = useContext(WeaverseContext)
  let { itemInstances, elementInstances } = context

  let itemInstance = itemInstances.get(itemId)
  if (itemInstance) {
    return (
      <Item
        itemInstance={itemInstance}
        elementInstances={elementInstances}
      />
    )
  }
  console.warn(`Item instance ${itemId} not found`)
  return <></>
}
