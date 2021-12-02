import {Weaverse, WeaverseRoot} from "@weaverse/sdk-react";

export let weaverseContext = new Weaverse({projectKey: '1'})
console.log('weaverseContext', weaverseContext)
export const WeaverseContent = () => {
	return <WeaverseRoot context={weaverseContext}/>
}

export default WeaverseContent
