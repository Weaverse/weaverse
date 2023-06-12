import React, { forwardRef } from 'react'
import type { PlaceholderProps } from '~/types'

const Placeholder = forwardRef<HTMLDivElement, PlaceholderProps>(
  (props, ref) => {
    let { element, className, children, ...rest } = props
    return (
      <div data-wv-placeholder ref={ref} className={className} {...rest}>
        <div
          style={{ fontWeight: 600, margin: '10px 0 5px', padding: '0 10px' }}
        >
          {element}
        </div>
        <div
          style={{
            margin: '5px 0 10px',
            textAlign: 'center',
            padding: '0 10px',
          }}
        >
          {children}
        </div>
      </div>
    )
  }
)

export default Placeholder
