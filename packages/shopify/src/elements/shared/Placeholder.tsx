import type { PlaceholderProps } from '@weaverse/react'
import React, { forwardRef } from 'react'

export let Placeholder = forwardRef<HTMLDivElement, PlaceholderProps>(
  (props, ref) => {
    let { element, children, ...rest } = props
    return (
      <div data-wv-placeholder ref={ref} {...rest}>
        <div style={{ fontWeight: 600, marginBottom: '10px' }}>{element}</div>
        <div>{children}</div>
      </div>
    )
  }
)
