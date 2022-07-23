import { TODO } from '@weaverse/core'
import * as React from 'react'

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  TODO
>((props, ref) => {
  const { openInNewTab, target, value, ...rest } = props

  if (target) {
    return (
      <a
        href={target}
        target={openInNewTab ? '_blank' : '_self'}
        rel="noreferrer"
        {...rest}
        ref={ref}
      >
        {value}
      </a>
    )
  }

  return (
    <button ref={ref} {...rest}>
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
