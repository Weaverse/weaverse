import React, {FC, useEffect} from 'react'
import {Weaverse, WeaverseItemStore, WeaverseType} from './core'
import Elements from './elements'
import {isBrowser} from './utils'


const createRootContext = (configs: WeaverseType) => {
  const rootContext = new Weaverse(configs)
  // Register the element components
  Object.keys(Elements).forEach(key => {
    // @ts-ignore
    Elements[key]?.configs?.type && rootContext.registerElement(Elements[key].configs.type, Elements[key])
  })

  return rootContext
}

const WeaverseRoot = ({context, defaultData}: { context: Weaverse, defaultData: any }) => {
  let [, setData] = React.useState<any>(context.projectData)
  useEffect(() => {
    let handleUpdate = () => {
      setData(context.projectData)
    }
    context.subscribe(handleUpdate)
    context.updateProjectData()
    context.loadStudio()
    return () => {
      context.unsubscribe(handleUpdate)
    }
  }, [])
  if (!context.projectData?.items?.length && defaultData) {
    context.projectData = defaultData
    context.initItemData()
  }
  return <RenderItem itemId={0} context={context}/>
}

type ItemProps = {
  itemInstance: WeaverseItemStore
  elementInstances: Map<string, FC>
  context: Weaverse
}

const Item = ({itemInstance, elementInstances, context}: ItemProps) => {
  let [data, setData] = React.useState<any>(itemInstance.data)
  let {id, type, childIds, css, className, ...rest} = data
  let ref = itemInstance.ref
  useEffect(() => {
    let handleUpdate = (update: any) => {
      setData({...update})
    }
    itemInstance.subscribe(handleUpdate)
    if (!ref.current && isBrowser) {
      Object.assign(ref, {current: document.querySelector(`[data-wv-id="${id}"]`)})
    }
    console.log('ref', ref)

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
      rest.ref = ref
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

export {createRootContext, WeaverseRoot}
