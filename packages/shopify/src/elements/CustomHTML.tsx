import type { ElementCSS } from '@weaverse/react'
import { SharedComponents, WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import type { CustomHTMLProps } from '~/types'

let Placeholder = SharedComponents.Placeholder

export let CustomHTML = forwardRef<HTMLDivElement, CustomHTMLProps>(
  (props, ref) => {
    let { content, children, ...rest } = props
    let { isDesignMode } = useContext(WeaverseContext)
    let style = {
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

export let css: ElementCSS = {
  '@desktop': {
    minHeight: '100px',
    '& > *': {
      pointerEvents: 'var(--pointer-events, unset)',
    },
  },
}

CustomHTML.defaultProps = {
  content: '',
  type: 'custom.html',
}

export default CustomHTML
