import * as React from 'react'
import { ButtonElementProps } from '../types'

export let Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonElementProps
>((props, ref) => {
  let { openInNewTab, target, value, ...rest } = props

  if (target) {
    return (
      <a
        href={target}
        target={openInNewTab ? '_blank' : '_self'}
        rel="noreferrer"
        {...rest}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {value}
      </a>
    )
  }

  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} {...rest}>
      {value}
    </button>
  )
})

Button.defaultProps = {
  value: 'Shop now',
  openInNewTab: false,
  target: '',
  type: 'button',
  css: {
    '@desktop': {
      borderRadius: '72px',
      border: 'none',
      backgroundColor: '#0F71FF',
      color: '#fff',
      fontSize: '13px',
      padding: '10px 20px',
    },
  },
}

export default Button
