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
  text: 'Shop now',
  clickAction: 'none',
  linkTo: '',
  openInNewTab: false,
}

export let css: ElementCSS = {
  '@desktop': {
    borderRadius: '72px',
    border: 'none',
    backgroundColor: '#0F71FF',
    color: '#fff',
    fontSize: '13px',
    padding: '10px 20px',
    textDecoration: 'none',
  },
}

export default Button
