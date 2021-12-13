import * as React from 'react'
import {useEffect} from 'react'
import {Weaverse} from './core'
import {stitches, ThemeContext, ThemeProvider} from '@weaverse/elements'

const WeaverseRoot = ({context, defaultData}: { context: Weaverse, defaultData: any }) => {
  let [data, setData] = React.useState<any>(context.projectData)
  useEffect(() => {
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
  return <ThemeProvider theme={{
    token: {
      colors: {
        gray500: 'hsl(206,10%,76%)',
        blue500: 'hsl(206,100%,50%)',
        purple500: 'hsl(252,78%,60%)',
        green500: 'hsl(148,60%,60%)',
        red500: 'hsl(352,100%,62%)'
      }
    }
  }}>
    <RenderItem itemId={0} context={context}/>
  </ThemeProvider>
}


const Item = ({itemInstance, elementInstances, context}: any) => {
  let {id, type, childIds, ...rest} = itemInstance.data
  let {useSubscription} = itemInstance
  useSubscription((update: any) => {
    console.log('update', update)
  })
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

export {Weaverse, WeaverseRoot, ThemeProvider, ThemeContext, stitches}
