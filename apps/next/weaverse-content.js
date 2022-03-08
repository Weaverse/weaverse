import {createRootContext, WeaverseRoot} from '@weaverse/react'

export let weaverseContext = createRootContext({projectKey: '1'})

export const WeaverseContent = ({defaultData}) => {
	return <WeaverseRoot context={weaverseContext} defaultData={defaultData}/>
}

export default WeaverseContent
