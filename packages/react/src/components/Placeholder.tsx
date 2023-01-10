import React, { forwardRef } from 'react'
import type { PlaceholderProps } from '~/types'

const Placeholder = forwardRef<HTMLDivElement, PlaceholderProps>(
  (props, ref) => {
    let { element, className, children, ...rest } = props
    return (
      <div data-wv-placeholder ref={ref} className={className} {...rest}>
        <div style={{ fontWeight: 600, marginBottom: '10px' }}>{element}</div>
        <div>{children}</div>
      </div>
    )
  }
)

export default Placeholder
