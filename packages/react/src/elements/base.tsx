import React from 'react'

export const BaseElement = React.forwardRef((({tag, children, ...props}: any, ref) => {
  return React.createElement(tag, {
    ref,
    ...props
  }, children)
}))

BaseElement.defaultProps = {
  type: 'base',
  tag: 'div',
  style: {}
}
export default BaseElement
