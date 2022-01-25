import * as React from 'react'

export const Button = React.forwardRef((props: any, ref) => {
  let [count, setCount] = React.useState(0)
  return <button ref={ref} {...props} onClick={() => setCount(count + 1)}>Test Button {count}</button>
})

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

export default Button