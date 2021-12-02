import React from 'react'
import {css} from '../theme'

export const BaseElement = ({tag = 'div', children, ...props}: any) => {
    let {style, ...rest} = props
    let cssClass = css({
        ...style
    })()
    return React.createElement(tag, {
        ...rest,
        className: cssClass
    }, children)
}

BaseElement.configs = {
    type: 'base'
}
export default BaseElement
