import type { ElementCSS } from '@weaverse/react'
import { Children, forwardRef } from 'react'

import { Components } from '~/components'
import type { ContainerElementProps } from '~/types/components'

let Container = forwardRef<HTMLDivElement, ContainerElementProps>(
  (props, ref) => {
    let { children, ...rest } = props

    return (
      <div ref={ref} {...rest}>
        {Children.count(children) ? (
          children
        ) : (
          <Components.Placeholder element={'Container'}>
            Drop element here
          </Components.Placeholder>
        )}
      </div>
    )
  }
)

export let css: ElementCSS = {
  '@desktop': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
