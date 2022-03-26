import * as React from 'react'

export const Button = React.forwardRef((props: any, ref) => {
  return <button ref={ref} {...props}>{props.value}</button>
})

Button.defaultProps = {
  value: "Click me",
  style: {
    borderRadius: '9999px',
    fontSize: '13px',
    padding: '10px 15px'
  }
}

export const schema = {
  title: 'Button',
  type: 'button',
  settings: [
    {
      tab: "header",
      label: "Group 1",
      inspectors: [
        {
          binding: 'data',
          key: 'value',
          componentType: 'textarea'
        },
        {
          binding: 'style',
          key: 'backgroundColor',
          componentType: 'color'
        },
      ]
    },
    {
      tab: "header",
      label: "Group 2",
      inspectors: [
        {
          binding: 'style',
          key: 'color',
          componentType: 'color'
        },
      ]
    },
  ],
}

export default Button