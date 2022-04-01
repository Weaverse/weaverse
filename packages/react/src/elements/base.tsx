import { WeaverseElementSchema } from '@weaverse/core/src'
import React from 'react'

export const BaseElement = React.forwardRef(
  ({ tag, children, ...props }: any, ref) => {
    return React.createElement(
      tag,
      {
        ref,
        ...props,
      },
      children
    )
  }
)

BaseElement.defaultProps = {
  tag: 'div',
  style: {},
}
export let schema: WeaverseElementSchema = {
  type: 'base',
  title: 'Base',
  settings: [],
}
export default BaseElement
