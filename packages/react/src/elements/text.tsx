import { WeaverseElementSchema } from '@weaverse/core'
import * as React from 'react'

export const Text = React.forwardRef((props: any, ref) => {
  let { children, value, ...rest } = props
  return <div ref={ref} {...rest} dangerouslySetInnerHTML={{ __html: value }} />
})

Text.defaultProps = {
  value: 'sample text',
}

export let schema: WeaverseElementSchema = {
  type: 'text',
  title: 'Text Settings',
  settings: [
    {
      tab: 'General',
      label: 'Text',
      inspectors: [
        {
          binding: 'data',
          key: 'value',
          type: 'textarea',
        },
        {
          binding: 'style',
          key: 'color',
          type: 'color',
        },
      ],
    },
  ],
  data: {
    css: {
      '@desktop': {
        width: '100%',
        height: 'fit-content',
        padding: 0,
        margin: 0,
        outline: 'none',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whitespace: 'break-spaces',
      },
    },
  },
}
export default Text
