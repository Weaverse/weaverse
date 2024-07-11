import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import * as React from 'react'
import { useContext } from 'react'

import type { ButtonElementProps } from '~/types/components'

export let Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonElementProps
>((props, ref) => {
  let { isDesignMode } = useContext(WeaverseContext)
  let { text, clickAction, linkTo, openInNewTab, ...rest } = props

  if (clickAction === 'none') {
    return (
      <button ref={ref as React.MutableRefObject<HTMLButtonElement>} {...rest}>
        {text}
      </button>
    )
  }
  return (
    <a
      ref={ref as React.MutableRefObject<HTMLAnchorElement>}
      href={!isDesignMode ? linkTo : undefined}
      target={openInNewTab ? '_blank' : '_self'}
      rel="noreferrer"
      {...rest}
    >
      {text}
    </a>
  )
})

Button.defaultProps = {
  type: 'button',
  text: 'BUTTON',
  clickAction: 'none',
  linkTo: '',
  openInNewTab: false,
}

export let css: ElementCSS = {
  '@desktop': {
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#3E3F40',
    color: '#fff',
    fontSize: '14px',
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: 'medium',
    padding: '10px 20px',
    height: '42px',
    minWidth: '120px',
    textDecoration: 'none',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: '#1A1B1B',
    },
  },
}

export default Button
