import type { CSSProperties, HTMLAttributes } from 'react'
import React, { useContext } from 'react'
import { WeaverseContext } from '~/context'
import type { WeaverseCSSProperties } from '@weaverse/core'

interface IconType {
  [key: string]: {
    animationType: 'rotate90' | 'custom'
    css: WeaverseCSSProperties
  }
}

const ICONS: IconType = {
  caret: {
    animationType: 'rotate90',
    css: {
      position: 'absolute!important',
      left: 5,
      top: 2,
      width: 0,
      height: 0,
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderLeft: '6px solid #1F2A37',
    },
  },
  arrow: {
    animationType: 'rotate90',
    css: {
      border: 'solid #1F2A37',
      borderWidth: '0 1px 1px 0',
      display: 'inline-block',
      transform: 'rotate(-45deg) translate(15%, -15%)',
      padding: 4,
    },
  },
  plus: {
    animationType: 'custom',
    css: {
      display: 'inline-block',
      top: -6,
      width: 15,
      height: 1,
      backgroundColor: '#1F2A37',
      '&:after': {
        position: 'absolute',
        content: '',
        top: -7,
        left: 7,
        width: 1,
        height: 15,
        backgroundColor: '#1F2A37',
        transition: 'all 0.3s ease-in-out 0s',
      },
      '&.active': {
        '&:after': {
          transform: 'rotate(90deg)',
        },
      },
    },
  },
}

let rotateAnimation = {
  transition: 'all 0.3s ease-in-out 0s',
  transform: 'rotate(90deg)',
} as CSSProperties

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: keyof typeof ICONS
  active?: boolean
}

function Icon(props: IconProps) {
  let { name, active = false, style, ...rest } = props
  let { stitchesInstance } = useContext(WeaverseContext)

  const { animationType, css } = ICONS[name]
  if (active && animationType === 'rotate90') {
    style = { ...rotateAnimation, ...style }
  }
  let { className } = stitchesInstance.css(css)()
  if (active) className += ' active'
  return (
    <span style={style} {...rest}>
      <i className={className} />
    </span>
  )
}

export default Icon
