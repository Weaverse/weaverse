import * as React from 'react'
import {useEffect} from 'react'
import {Weaverse} from './core'

let stitches = require('@stitches/core')

const WeaverseRoot = ({context, defaultData}: { context: Weaverse, defaultData: any }) => {
  let [, setData] = React.useState<any>(context.projectData)
  useEffect(() => {
    console.log('stitches', stitches, stitches?.createStitches())
    let handleUpdate = () => {
      setData(context.projectData)
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
  return <RenderItem itemId={0} context={context}/>
}


const Item = ({itemInstance, elementInstances, context}: any) => {
  let [data, setData] = React.useState<any>(itemInstance.data)
  let {id, type, childIds, ...rest} = data

  useEffect(() => {
    let handleUpdate = (update: any) => {
      console.log('update', update)
      setData({...update})
    }
    itemInstance.subscribe(handleUpdate)
    return () => {
      itemInstance.unsubscribe(handleUpdate)
    }
  }, [])
  let Component = elementInstances.get(type)
  if (Component) {
    return <Component key={id} data-wv-id={id} {...rest}>
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

export {Weaverse, WeaverseRoot}
