import clsx from 'clsx'
import type { WeaverseIconProps } from '~/types/components'
import * as PhosphorIcons from './phosphor'

export function Icon({ name, className, ...props }: WeaverseIconProps) {
  let WeaverseIcon = PhosphorIcons[name]
  let cls = clsx('wv-icon', className)
  return <WeaverseIcon className={cls} {...props} />
}
