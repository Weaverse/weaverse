import { WeaverseElementSchema } from '@weaverse/core'
import * as React from 'react'

export const Button = React.forwardRef((props: any, ref: any) => {
  const { buttonType, css, ...rest } = props
  return (
    <button ref={ref} {...rest}>
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
  styles: [
    {
      type: 'dimensions'
    },
    {
      type: 'alignment'
    },
    {
      type: 'border'
    },
    {
      type: 'background'
    },
    {
      type: 'spacing'
    },
  ],
  settings: [
  ],
  toolbar: [],
  data: {
    css: {
      '@desktop': {
        borderRadius: '9999px',
        fontSize: '13px',
        padding: '10px 15px',
      }
    },
  },
}

export default Button
