import * as React from 'react'
import {useEffect} from 'react'
import Elements from '@weaverse/elements'


export class WeaverseSDK {
  elementInstances = new Map<string, any>()

  constructor() {
    this.init()
  }

  registerElement = (name: string, element: any) => {
    this.elementInstances.set(name, element)
  }

  init() {
    Object.keys(Elements).forEach(key => {
      // @ts-ignore
      Elements[key]?.configs?.type && this.registerElement(Elements[key].configs.type, Elements[key])
    })
    console.log('WeaverseSDK initialized', this.elementInstances)
  }
}

export const Thing = ({sdk}: { sdk: WeaverseSDK }) => {
  let [color, setColor] = React.useState('red')
  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data.type?.startsWith('HW')) {
        if (event.data.type === 'HW_SET_COLOR') {
          setColor(event.data.payload)
        }
      }
    })
  }, [])
  let Button = sdk.elementInstances.get('button')
  let Base = sdk.elementInstances.get('base')
  return <div>
    <Button color={color} setColor={setColor}/>
    <Base tag="button" style={{background: color}}>
      Hello world
    </Base>
  </div>
}
