import Elements from './elements'
import {
  isBrowser,
  Weaverse,
  WeaverseItemStore,
  WeaverseType,
} from '@weaverse/core'
import * as React from 'react'
import type { WeaverseElement } from '@weaverse/core'

export const createRootContext = (configs: WeaverseType) => {
  const rootContext = new Weaverse(configs)
  // Register the element components
  Object.keys(Elements).forEach((key) => {
    rootContext.registerElement(
            Elements[key]
    )
  })
  return rootContext
}

export type WeaverseRootPropsType = { context: Weaverse; defaultData: any }

export const WeaverseRoot = ({
  context,
  defaultData,
}: WeaverseRootPropsType) => {
  let [, setData] = React.useState<any>(context.projectData)
  React.useEffect(() => {
    let handleUpdate = () => {
      setData({ ...context.projectData })
    }
    context.subscribe(handleUpdate)
    context.updateProjectData()
    return () => {
      context.unsubscribe(handleUpdate)
    }
  }, [])
  if (!context.projectData?.items?.length && defaultData) {
    Object.assign(context.projectData, defaultData)
    context.initProjectItemData()
  }
  let handleProps = context?.studioBridge?.handleProps || {}
  return (
    <div className={`weaverse-root`} id={'weaverse-root'} {...handleProps}>
      <RenderItem itemId={context.projectData.rootId || 0} context={context} />
    </div>
  )
}

type ItemProps = {
  itemInstance: WeaverseItemStore
  elementInstances: Map<string, WeaverseElement>
  context: Weaverse
}

const Item = ({ itemInstance, elementInstances, context }: ItemProps) => {
  let [data, setData] = React.useState<any>(itemInstance.data)
  let { id, type, childIds, css, className, ...rest } = data
  React.useEffect(() => {
    let handleUpdate = (update: any) => {
      setData({ ...update })
    }
    itemInstance.subscribe(handleUpdate)
    if (isBrowser && !itemInstance.ref.current) {
      // fallback ref if component is not React.forwardRef
      Object.assign(itemInstance.ref, {
        current: document.querySelector(`[data-wv-id="${id}"]`),
      })
    }

    return () => {
      itemInstance.unsubscribe(handleUpdate)
    }
  }, [])

  let realClassName = className
  if (css) {
    // let stitches create the style from css object and
    // then return the classname, so we can use it in the render
    let selector = context.stitchesInstance.css(css)().className
    realClassName = realClassName ? `${selector} ${realClassName}` : selector
  }
  let element = elementInstances.get(type) || elementInstances.get('base')
  if (element?.Component) {
    let Component = element.Component
    // @ts-ignore
    if (Component.$$typeof === Symbol.for('react.forward_ref')) {
      rest.ref = itemInstance.ref
    }
    return (
      <Component key={id} data-wv-id={id} {...rest} className={realClassName}>
        {Array.isArray(childIds) &&
          childIds.map((childId) => (
            <RenderItem key={childId} itemId={childId} context={context} />
          ))}
      </Component>
    )
  }
  return null
}

const RenderItem = ({
  itemId,
  context,
}: {
  itemId: number | string
  context: any
}): any => {
  let { itemInstances, elementInstances } = context
  let itemInstance = itemInstances.get(itemId)
  if (itemInstance) {
    return (
      <Item
        itemInstance={itemInstance}
        elementInstances={elementInstances}
        context={context}
      />
    )
  }
  return <></>
}
