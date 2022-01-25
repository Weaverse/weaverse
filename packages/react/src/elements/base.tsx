import React from 'react'

export const BaseElement = ({tag, children, ...props}: any) => {
  return React.createElement(tag, {
    ...props
  }, children)
}

BaseElement.defaultProps = {
  type: 'base',
  tag: 'div'
}
export default BaseElement
