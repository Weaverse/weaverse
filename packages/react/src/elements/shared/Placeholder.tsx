import { TODO } from '@weaverse/core'
import React, { forwardRef } from 'react'

const Placeholder = forwardRef<HTMLElement, TODO>((props, ref) => {
  let { element, children, ...rest } = props
  let style = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#374151',
  }
  return (
    <div style={style} ref={ref} {...rest}>
      <div style={{ fontWeight: 600, marginBottom: '10px' }}>{element}</div>
      <div>{children}</div>
    </div>
  )
})

export default Placeholder
