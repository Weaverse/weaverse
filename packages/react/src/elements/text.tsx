import { TODO, WeaverseElementSchema } from '@weaverse/core'
import * as React from 'react'

const Text = React.forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { children, value, ...rest } = props
  return <div ref={ref} {...rest} dangerouslySetInnerHTML={{ __html: value }} />
})

Text.defaultProps = {
  value: 'The quick brown fox jumps over the lazy dog',
}

// export let schema: WeaverseElementSchema = {
//   type: 'text',
//   parentType: 'container',
//   title: 'Text',
//   settings: [],
//   data: {
//     css: {
//       '@desktop': {
//         width: '100%',
//         height: 'fit-content',
//         padding: 0,
//         margin: 0,
//         outline: 'none',
//         wordBreak: 'break-word',
//         overflowWrap: 'break-word',
//         whiteSpace: 'break-spaces',
//       },
//     },
//   },
// }
export default Text
