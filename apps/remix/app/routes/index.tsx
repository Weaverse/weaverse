import {LoaderFunction, useLoaderData} from 'remix'
import {WeaverseContent, weaverseContext} from '~/weaverse-content'

export let loader: LoaderFunction = async () => {
  return await weaverseContext.fetchProjectData()
}
export default function Index() {
  let data = useLoaderData()
  return (
          <div style={{fontFamily: 'system-ui, sans-serif', lineHeight: '1.4'}}>
            <h1>Welcome to Remix</h1>
            <WeaverseContent defaultData={data}/>
          </div>
  )
}
