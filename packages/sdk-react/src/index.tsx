import * as React from 'react'
import {useEffect} from 'react'

// Delete me
export const Thing = () => {
  let [color, setColor] = React.useState('red')
  useEffect(() => {
    window.addEventListener('message', (event) => {
      console.log(event.data)
      if (event.data.type.startsWith('HW')) {
        if (event.data.type === 'HW_SET_COLOR') {
          setColor(event.data.payload)
        }
      }
    })
  }, []);
  return <div style={{color}}>the snozzberries taste like 11111</div>
};
