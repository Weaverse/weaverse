import * as React from 'react'
import {useEffect} from 'react'
import {Weaverse} from './base'


const WeaverseRoot = ({context}: { context: Weaverse }) => {
  let [data, setData] = React.useState<any>(context.projectData)
  useEffect(() => {
    let handleUpdate = () => {
      console.log('WeaverseRoot: context changed', context.projectData)
      setData(context.projectData)
    }
    context.subscribe(handleUpdate)
    context.updateProjectData()
    return () => {
      context.unsubscribe(handleUpdate)
    }
  }, [])
  let components: any = {}
  if (Array.isArray(data?.items)) {
    let items = data.items
    items.forEach((item: any) => {
      if (context.elementInstances.get(item.type)) {
        components[item.id] = {
          component: context.elementInstances.get(item.type),
          props: item.props
        }
      }

    })
  }
  console.log('WeaverseRoot: components', components)
  return <div>
    <RenderComponent components={components}/>
  </div>
}
const RenderComponent = ({components}: any) => {
  return <div>
    {Object.keys(components).map((key: string) => {
      console.log('RenderComponent: key', key, components)
      let {component, props} = components[key]
      return React.cloneElement(component, props)
    })}</div>
}

export {Weaverse, WeaverseRoot}
