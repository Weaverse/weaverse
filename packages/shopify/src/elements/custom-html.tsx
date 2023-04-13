import type { ElementCSS } from '@weaverse/react'
import { Components, WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import type { CustomHTMLProps } from '~/types'

let { Placeholder, NoHydrate } = Components

export let CustomHTML = forwardRef<HTMLDivElement, CustomHTMLProps>(
  (props, ref) => {
    let { content, children, ...rest } = props
    let { isDesignMode } = useContext(WeaverseContext)
    let style = {
      '--pointer-events': isDesignMode ? 'none' : 'auto',
    } as React.CSSProperties

    if (!content) {
      return (
        <div ref={ref} {...rest}>
          <Placeholder element="Custom HTML">
            Click <strong>Add code</strong> to add your custom HTML & Liquid.
          </Placeholder>
        </div>
      )
    }

    return (
      <div ref={ref} {...rest} style={style}>
        {isDesignMode ? content : <NoHydrate getHTML={() => content} />}
      </div>
    )
  }
)

export let css: ElementCSS = {
  '@desktop': {
    minHeight: '100px',
    '> *': {
      pointerEvents: 'var(--pointer-events, unset)',
    },
  },
}

CustomHTML.defaultProps = {
  content: '',
}

export default CustomHTML
