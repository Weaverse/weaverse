import type { ElementCSS } from '@weaverse/core'
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

export let css: ElementCSS = {
  '@desktop': {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gridArea: '1 / 1 / 3 / 6',
    overflow: 'hidden',
    // minWidth: '300px',
    minHeight: '100px',
  },
  '@mobile': {
    minHeight: '100px',
  },
}

Container.defaultProps = {}

export default Container
