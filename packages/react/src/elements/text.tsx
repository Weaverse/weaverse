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
  parentType: "container",
  title: 'Text',
  settings: [

  ],
  data: {
    css: {
      "@desktop": {
        width: "100%",
        height: 'fit-content',
        padding: 0,
        margin: 0,
        outline: 'none',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'break-spaces',
      }
    }
  },
}
export default Text
