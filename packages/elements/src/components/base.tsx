import React, {useContext} from 'react'
import {ThemeContext} from '../theme'

export const BaseElement = ({tag = 'div', children, ...props}: any) => {
    let {style, ...rest} = props
    let {css} = useContext(ThemeContext)

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
