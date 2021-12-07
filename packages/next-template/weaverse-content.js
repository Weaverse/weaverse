import {Weaverse, WeaverseRoot} from "@weaverse/react";

export let weaverseContext = new Weaverse({projectKey: '1'})

export const WeaverseContent = ({defaultData}) => {

	return <WeaverseRoot context={weaverseContext} defaultData={defaultData}/>
}

export default WeaverseContent
