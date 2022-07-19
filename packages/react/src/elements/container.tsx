import { TODO } from '@weaverse/core'
import React, { forwardRef } from 'react'

let Container = forwardRef<HTMLElement, TODO>((props, ref) => {
  return <div ref={ref} {...props} />
})

Container.defaultProps = {
  css: {
    '@desktop': {
      alignItems: 'flex-start',
      backgroundColor: 'rgba(248,203,203,0.38)',
      display: 'flex',
      flexDirection: 'column',
      gridArea: '1 / 1 / 3 / 6',
      height: 'fit-content',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      textAlign: 'left',
      width: '100%',
    },
  },
}

export default Container
