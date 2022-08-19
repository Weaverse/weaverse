import React, { forwardRef } from 'react'
import type { ContainerElementProps } from '~/types'

let Container = forwardRef<HTMLDivElement, ContainerElementProps>(
  (props, ref) => {
    let { children, ...rest } = props
    return (
      <div ref={ref} {...rest}>
        {children}
      </div>
    )
  }
)

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
