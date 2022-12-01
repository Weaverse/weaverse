import React from 'react'
import type { WeaverseIconProps } from '~/types'
import * as PhosphorIcons from './Phosphor'
import clsx from 'clsx'

export function Icon({ name, className, ...props }: WeaverseIconProps) {
  let WeaverseIcon = PhosphorIcons[name]
  let cls = clsx('wv-icon', className)
  return <WeaverseIcon className={cls} {...props} />
}
