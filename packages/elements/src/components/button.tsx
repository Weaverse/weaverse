import * as React from 'react'
import {css} from '../theme'

export const Button = ({color, setColor, style}: any) => {
    let [count, setCount] = React.useState(0)
    let cssClass = css({
        ...style,
        backgroundColor: color
    })()
    return <button className={cssClass} onClick={() => setCount(count + 1)}>Test Button {count}</button>
}

Button.defaultProps = {
    style: {
        backgroundColor: 'green',
        borderRadius: '9999px',
        fontSize: '13px',
        padding: '10px 15px'
    },
    type: 'button',
    tag: 'button'
}
Button.configs = {
    type: 'button'
}

export default Button