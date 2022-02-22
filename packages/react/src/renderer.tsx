import * as React from 'react'
import {isBrowser, Weaverse, WeaverseItemStore, WeaverseType} from '@weaverse/core'
import Elements from './elements'


export const createRootContext = (configs: WeaverseType) => {
  const rootContext = new Weaverse(configs)
  // Register the element components
  Object.keys(Elements).forEach(key => {
    // @ts-ignore
    Elements[key]?.defaultProps?.type && rootContext.registerElement(Elements[key].defaultProps.type, Elements[key])
  })
  return rootContext
}


export const WeaverseRoot = ({context, defaultData}: { context: Weaverse, defaultData: any }) => {
  let [, setData] = React.useState<any>(context.projectData)
  React.useEffect(() => {
    let handleUpdate = () => {
      setData({...context.projectData})
    }
    context.subscribe(handleUpdate)
    context.updateProjectData()
    return () => {
      context.unsubscribe(handleUpdate)
    }
  }, [])
  if (!context.projectData?.items?.length && defaultData) {
    context.projectData = defaultData
    context.initItemData()
  }
  let handleProps = context?.studioBridge?.handleProps || {}
  console.log('handleProps', handleProps)
  return <div {...handleProps}>
    <RenderItem itemId={0} context={context}/>
  </div>
}


type ItemProps = {
  itemInstance: WeaverseItemStore
  elementInstances: Map<string, React.FC>
  context: Weaverse
}


const Item = ({itemInstance, elementInstances, context}: ItemProps) => {
  let [data, setData] = React.useState<any>(itemInstance.data)
  let {id, type, childIds, css, className, ...rest} = data
  React.useEffect(() => {
    let handleUpdate = (update: any) => {
      setData({...update})
    }
    itemInstance.subscribe(handleUpdate)
    if (!itemInstance.ref.current && isBrowser) {
      Object.assign(itemInstance.ref, {current: document.querySelector(`[data-wv-id="${id}"]`)})
    }

    return () => {
      itemInstance.unsubscribe(handleUpdate)
    }
  }, [])

  let realClassName = className || ''
  if (css) {

    // let stitches create the style from css object and
    // then return the classname, so we can use it in the render
    let selector = (context.stitchesInstance.css(css)()).className
    realClassName += ' ' + selector
  }
  let Component = elementInstances.get(type)
  if (Component) {
    // @ts-ignore
    if (Component.$$typeof === Symbol.for('react.forward_ref')) {
      rest.ref = itemInstance.ref
    }
    return <Component key={id} data-wv-id={id} {...rest} className={realClassName}>
      {Array.isArray(childIds)
              && childIds.map(childId =>
                      <RenderItem
                              key={childId}
                              itemId={childId}
                              context={context}
                      />
              )}
    </Component>
  }
  return null
}

const RenderItem = ({itemId, context}: { itemId: number, context: any }): any => {
  let {itemInstances, elementInstances} = context
  let itemInstance = itemInstances.get(itemId)
  if (itemInstance) {
    return <Item itemInstance={itemInstance} elementInstances={elementInstances} context={context}/>
  }
  return <></>
}

