import React, { forwardRef, useContext } from 'react'
import type { WeaverseElementProps } from '@weaverse/react/src/types'
import { WeaverseContext } from '@weaverse/react/src/context'
import Placeholder from '@weaverse/react/src/elements/shared/Placeholder'

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
            Add your custom HTML code.
          </Placeholder>
        </div>
      )
    console.log('CustomHTML', props)
    return (
      <div
        data-prevent-hydration="true"
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
}

export default CustomHTML
