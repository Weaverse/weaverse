import React, { forwardRef, useContext } from 'react'
import type { WeaverseElementProps } from '~/types'
import { WeaverseContext } from '~/context'
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

    if (!content)
      return (
        <div ref={ref} {...rest}>
          <Placeholder element="Custom HTML">
            Please add your custom HTML codes.
          </Placeholder>
        </div>
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
