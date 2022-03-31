import { WeaverseElementSchema } from '@weaverse/core/src'
import * as React from 'react'

export const Button = React.forwardRef((props: any, ref: any) => {
  const { style, buttonType, css, ...rest } = props
  return (
    <button ref={ref} style={style} {...rest}>
      {props.value}
    </button>
  )
})

Button.defaultProps = {
  value: 'Click me',
}

export const schema: WeaverseElementSchema = {
  title: 'Button',
  type: 'button',
  settings: [
    {
      tab: 'Settings',
      label: 'Alignment',
      inspectors: [
        {
          binding: 'style',
          type: 'alignment',
        },
      ],
    },
    {
      tab: 'Settings',
      label: 'Overlay',
      inspectors: [
        {
          binding: 'data',
          key: 'applyOverlay',
          label: 'Apply Overlay',
          type: 'switch',
        },
        {
          binding: 'data',
          key: 'buttonType',
          label: 'Button Type',
          type: 'select',
          options: [
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
          ],
        },
      ],
    },
    {
      tab: 'Settings',
      label: 'Group 1',
      inspectors: [
        {
          binding: 'data',
          key: 'value',
          type: 'textarea',
          label: '',
          default: '',
        },
        {
          binding: 'style',
          key: 'backgroundColor',
          type: 'color',
        },
      ],
    },
    {
      tab: 'Settings',
      label: 'Group 2',
      inspectors: [
        {
          binding: 'style',
          key: 'color',
          type: 'color',
        },
      ],
    },
  ],
  toolbar: [],
  data: {
    css: {
      '@desktop': {
        borderRadius: '9999px',
        fontSize: '13px',
        padding: '10px 15px',
      },
    },
  },
}

export default Button
