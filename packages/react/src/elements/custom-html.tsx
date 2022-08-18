import React, { forwardRef, useContext } from 'react'
import type { WeaverseElementProps } from '../types'
import { WeaverseContext } from '../context'
import Placeholder from './shared/Placeholder'

interface CustomHTMLProps extends WeaverseElementProps {
  content: string
}

export const CustomHTML = forwardRef<HTMLDivElement, CustomHTMLProps>(
  (props, ref) => {
    const { content, children, ...rest } = props
    const { isDesignMode } = useContext(WeaverseContext)
    const style = {
      '--pointer-events': isDesignMode ? 'none' : 'auto',
    } as React.CSSProperties
    const placeholderStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    } as React.CSSProperties

    if (!content)
      return (
        <Placeholder
          ref={ref}
          {...rest}
          style={placeholderStyle}
          element="Custom HTML"
        >
          Please add your custom HTML codes.
        </Placeholder>
      )
    return (
      <div
        ref={ref}
        {...rest}
        style={style}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }
)

CustomHTML.defaultProps = {
  content: '',
  type: 'custom.html',
  css: {
    '@desktop': {
      '& > *': {
        pointerEvents: 'var(--pointer-events, unset)',
      },
    },
  },
}

export default CustomHTML
