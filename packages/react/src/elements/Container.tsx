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
    alignItems: 'flex-start',
    backgroundColor: 'rgba(248,203,203,0.38)',
    display: 'flex !important',
    flexDirection: 'column',
    gridArea: '1 / 1 / 3 / 6',
    height: 'fit-content',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    textAlign: 'left',
    width: '100%',
  },
}

Container.defaultProps = {}

export default Container
