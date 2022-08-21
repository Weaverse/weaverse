import React, { useContext } from 'react'
import { WeaverseContext } from '~/context'
import type { WeaverseCSSProperties } from '@weaverse/core'

const ICONS: { [key: string]: WeaverseCSSProperties } = {
  caret: {
    position: 'absolute!important',
    left: '50%',
    width: 0,
    height: 0,
    borderTop: '7px solid transparent',
    borderBottom: '7px solid transparent',
    borderLeft: '7px solid #1F2A37',
  },
  arrow: {
    border: 'solid #1F2A37',
    borderWidth: '0 1px 1px 0',
    display: 'inline-block',
    transform: 'rotate(-45deg) translate(25%, -25%)',
    padding: 4,
  },
  plus: {
    display: 'inline-block',
    top: -5,
    width: 16,
    height: 2,
    backgroundColor: '#1F2A37',
    '&:after': {
      position: 'absolute',
      content: '',
      top: -7,
      left: 7,
      width: 2,
      height: 16,
      backgroundColor: '#1F2A37',
    },
  },
}

interface IconProps {
  name: keyof typeof ICONS
}

function Icon({ name }: IconProps) {
  let { stitchesInstance } = useContext(WeaverseContext)

  const css = ICONS[name]
  const { className } = stitchesInstance.css(css)()
  return <i className={className} />
}

export default Icon
