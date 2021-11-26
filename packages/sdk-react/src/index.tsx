import * as React from 'react'
import {useEffect} from 'react'
import {css} from './theme'


export const Thing = () => {
  let [color, setColor] = React.useState('red')
  useEffect(() => {
    window.addEventListener('message', (event) => {
      console.log(event.data)
      if (event.data.type?.startsWith('HW')) {
        if (event.data.type === 'HW_SET_COLOR') {
          setColor(event.data.payload)
        }
      }
    })
  }, [])
  let cssClass = css({
    backgroundColor: color,
    borderRadius: '9999px',
    fontSize: '13px',
    padding: '10px 15px'
  })()
  return <button className={cssClass}>Test Element</button>
};
