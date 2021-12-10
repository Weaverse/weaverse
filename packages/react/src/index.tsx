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
    hehe
    <RenderItems context={context}/>
  </ThemeProvider>
}

const RenderItems = ({context}: { context: Weaverse }) => {
  let {itemInstances, elementInstances} = context
  let root = itemInstances.get(0)
  if (root) {
    let {id, type, childIds, ...rest} = root.data
    let Component = elementInstances.get(type)
    if (Component) {
      return <Component data-wv-id={id} {...rest}>
        {renderItem(childIds, context)}
      </Component>
    }
  }
  return null
}

const renderItem = (childIds: number[], context: any) => {
  if (Array.isArray(childIds)) {
    let {itemInstances, elementInstances} = context
    return childIds.map(id => {
      let itemInstance = itemInstances.get(id)
      if (itemInstance) {
        let {id, type, childIds, ...rest} = itemInstance.data
        let Component = elementInstances.get(type)
        if (Component) {
          return <Component key={id} data-wv-id={id} {...rest}>
            {renderItem(childIds, itemInstances)}
          </Component>
        }
      }
      return null
    })
  }
  return null
}

export {Weaverse, WeaverseRoot, ThemeProvider, ThemeContext, stitches}
