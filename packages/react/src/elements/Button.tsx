import * as React from 'react'
import type { ButtonElementProps } from '~/types'
import type { ElementCSS } from '@weaverse/core'
import { useContext } from 'react'
import { WeaverseContext } from '~/context'

export let Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonElementProps
>((props, ref) => {
  let { isDesignMode } = useContext(WeaverseContext)
  let { text, clickAction, linkTo, openInNewTab, ...rest } = props

  if (clickAction && linkTo) {
    return (
      <a
        href={!isDesignMode ? linkTo : undefined}
        target={openInNewTab ? '_blank' : '_self'}
        rel="noreferrer"
        {...rest}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {text}
      </a>
    )
  }

  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} {...rest}>
      {text}
    </button>
  )
})

Button.defaultProps = {
  type: 'button',
  text: 'Button',
  clickAction: 'none',
  linkTo: '',
  openInNewTab: false,
}

export let css: ElementCSS = {
  '@desktop': {
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#393e46',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'medium',
    padding: '10px 20px',
    height: '42px',
    minWidth: '120px',
    textDecoration: 'none',
    ':hover': {
      backgroundColor: '#222831',
    },
  },
}

export default Button
