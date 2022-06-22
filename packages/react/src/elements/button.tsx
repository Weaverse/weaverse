import { WeaverseElementSchema } from '@weaverse/core'
import * as React from 'react'

export const Button = React.forwardRef((props: any, ref: any) => {
  const { buttonType, css, openInNewTab = false, target = '', ...rest } = props

  if (target) {
    return <a href={target} target={openInNewTab ? '_blank' : '_self'}>
      <button ref={ref} {...rest}>
        {props.value}
      </button>
    </a>
  }

  return (
    <button ref={ref} {...rest}>
     {props.value}
    </button>
  )
})

Button.defaultProps = {
  value: 'Shop now',
}

export const schema: WeaverseElementSchema = {
  title: 'Button',
  type: 'button',
  parentType: "container",
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
  toolbar: [
    {
      type: 'delete'
    },
    {
      type: 'duplicate'
    },
    {
      type: 'link',
    },
    {
      type: 'color'
    }
  ],
  data: {
    css: {
      '@desktop': {
        borderRadius: '72px',
        border: "none",
        backgroundColor: "#0F71FF",
        color: "#fff",
        fontSize: '13px',
        padding: '10px 20px',
      }
    },
    target: '',
    openInNewTab: false
  },
  flags: {
    draggable: true
  }
}

export default Button
