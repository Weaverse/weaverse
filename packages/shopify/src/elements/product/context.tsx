import React, { forwardRef } from 'react'

export let ProductContext = forwardRef<any, any>((props, ref) => {
  console.log('ProductContext', props)
  return <div ref={ref}>Product Context</div>
})
