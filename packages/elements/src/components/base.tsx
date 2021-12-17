import React from 'react'

export const BaseElement = ({tag = 'div', children, ...props}: any) => {
    console.log('props', props)
    return React.createElement(tag, {
        ...props
    }, children)
}

BaseElement.configs = {
    type: 'base'
}
export default BaseElement
