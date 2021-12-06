import * as React from 'react'
import {useEffect} from 'react'
import {Weaverse} from './base'


const WeaverseRoot = ({context}: { context: Weaverse }) => {
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
  return <div>
    <RenderItems items={data.items}/>
  </div>
}
const RenderItems = ({items}: any) => {
  console.log('items', items)
  return <>
    hi
  </>
}

export {Weaverse, WeaverseRoot}
