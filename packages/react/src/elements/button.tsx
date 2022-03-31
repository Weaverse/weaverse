import * as React from 'react'

export const Button = React.forwardRef((props: any, ref: any) => {
  const { style, buttonType, ...rest } = props
  return <button ref={ref} style={style} {...rest}>{props.value}. Apply Overlay: {props.applyOverlay ? 'true' : 'false'}</button>
})

Button.defaultProps = {
  value: "Click me",
  applyOverlay: false,
  style: {
    borderRadius: '9999px',
    fontSize: '13px',
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
      label: "Spacing",
      inspectors: [
        {
          binding: 'style',
          type: 'spacing'
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
        {
          binding: 'data',
          key: 'buttonType',
          label: 'Button Type',
          type: 'select',
          options: [
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
          ]
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