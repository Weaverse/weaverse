import React from 'react'
import clsx from 'clsx'

import * as PhosphorIcons from './phosphor'

import type { WeaverseIconProps } from '~/types/components'

export function Icon({ name, className, ...props }: WeaverseIconProps) {
  let WeaverseIcon = PhosphorIcons[name]
  let cls = clsx('wv-icon', className)
  return <WeaverseIcon className={cls} {...props} />
}
