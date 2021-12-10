import {Weaverse, WeaverseRoot} from "@weaverse/react";
import {useEffect} from "react";

export let weaverseContext = new Weaverse({projectKey: '1'})

export const WeaverseContent = ({defaultData}) => {
	useEffect(() => {
		window.weaverseContext = weaverseContext
	}, [])
	return <WeaverseRoot context={weaverseContext} defaultData={defaultData}/>
}

export default WeaverseContent
