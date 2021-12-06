import {Weaverse, WeaverseRoot} from "@weaverse/sdk-react";

let weaverseContext = new Weaverse({projectKey: '1'})

export const WeaverseContent = () => {

	return <WeaverseRoot context={weaverseContext}/>
}

export default WeaverseContent
