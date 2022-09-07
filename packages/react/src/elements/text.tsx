import * as React from 'react'
import type { TextElementProps } from '~/types'

const Text = React.forwardRef<HTMLDivElement, TextElementProps>(
  (props, ref) => {
    let { children, value, ...rest } = props
    return (
      <div ref={ref} {...rest} dangerouslySetInnerHTML={{ __html: value }} />
    )
  }
)

Text.defaultProps = {
  value: 'The quick brown fox jumps over the lazy dog',
  css: {
    '@desktop': {
      padding: '10px',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'break-spaces',
    },
  },
}

export default Text
