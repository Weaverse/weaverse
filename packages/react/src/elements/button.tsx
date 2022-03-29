import * as React from 'react'

export const Button = React.forwardRef((props: any, ref: any) => {
  const { style, ...rest } = props
  return <button ref={ref} style={style} {...rest}>{props.value}</button>
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
      tab: "Settings",
      label: "Alignment",
      inspectors: [
        {
          binding: 'style',
          type: 'alignment'
        },
      ]
    },
    {
      tab: "Settings",
      label: "Overlay",
      inspectors: [
        {
          binding: 'data',
          key: 'applyOverlay',
          label: 'Apply Overlay',
          type: 'switch'
        },
      ]
    },
    {
      tab: "Settings",
      label: "Group 1",
      inspectors: [
        {
          binding: 'data',
          key: 'value',
          type: 'textarea',
          label: '',
          default: ''
        },
        {
          binding: 'style',
          key: 'backgroundColor',
          type: 'color'
        },
      ]
    },
    {
      tab: "Settings",
      label: "Group 2",
      inspectors: [
        {
          binding: 'style',
          key: 'color',
          type: 'color'
        },
      ]
    },
  ],
  toolbar: []
}

export default Button