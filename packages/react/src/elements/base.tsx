import React from 'react'

export const BaseElement = ({tag = 'div', children, ...props}: any) => {
    return React.createElement(tag, {
        ...props
    }, children)
}

BaseElement.configs = {
    type: 'base'
}
export default BaseElement
