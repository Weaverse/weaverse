import * as React from 'react'

export const Button = React.forwardRef((props: any, ref) => {
  let [count, setCount] = React.useState(0)
  return <button ref={ref} {...props} onClick={() => setCount(count + 1)}>Test Button {count}</button>
})

Button.defaultProps = {
    style: {
        borderRadius: '9999px',
        fontSize: '13px',
        padding: '10px 15px'
    }
}

export let schema = {
  title: 'Button',
  type: 'button',
  properties: {
    label: {
      type: 'string',
      title: 'Label',
      default: 'Button'
    },
    onClick: {
      type: 'string',
      title: 'On Click',
      default: '() => {}'
    },
    style: {
      type: 'object',
      title: 'Style',
      default: {
        borderRadius: '9999px',
        fontSize: '13px',
        padding: '10px 15px'
      }
    }
  }
}
export default Button