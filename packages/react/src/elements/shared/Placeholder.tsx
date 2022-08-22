import React, { forwardRef } from 'react'
import type { PlaceholderProps } from '~/types'

const Placeholder = forwardRef<HTMLDivElement, PlaceholderProps>(
  (props, ref) => {
    let { element, children, style: newStyle, ...rest } = props
    let defaultStyle = {
      position: 'absolute',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      color: '#374151',
      backgroundColor: '#F9FAFB',
      backgroundClip: 'content-box',
      padding: 10,
      border: '1px dashed #0F71FF',
      borderRadius: 4,
    } as React.CSSProperties
    const style = { ...defaultStyle, ...newStyle }
    return (
      <div data-wv-type="placeholder" style={style} ref={ref} {...rest}>
        <div style={{ fontWeight: 600, marginBottom: '10px' }}>{element}</div>
        <div>{children}</div>
      </div>
    )
  }
)

export default Placeholder
