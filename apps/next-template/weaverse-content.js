import {createRootContext, WeaverseRoot} from '@weaverse/react'
import {useEffect} from 'react'

export let weaverseContext = createRootContext({projectKey: '1'})

export const WeaverseContent = ({defaultData}) => {
	useEffect(() => {
		window.weaverseContext = weaverseContext
	}, [])
	return <WeaverseRoot context={weaverseContext} defaultData={defaultData}/>
}

export default WeaverseContent
