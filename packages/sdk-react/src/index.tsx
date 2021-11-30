import * as React from 'react'
import {useEffect} from 'react'
import Element from '@weaverse/elements'

export const Thing = () => {
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
  return <div>
    <Element.Button color={color} setColor={setColor}/>
    <Element.BaseElement tag="button" style={{background: color}}>
      Hello world
    </Element.BaseElement>
  </div>
};
