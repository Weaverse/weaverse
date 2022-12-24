import type { DialogContentProps } from '@radix-ui/react-dialog'
import type { HTMLAttributes } from 'react'
import type * as PhosphorIcons from '~/components/Icons/Phosphor'
export interface ModalContentProps extends DialogContentProps {
  size?: 'auto' | 'fullscreen'
  portal?: boolean
}

export type WeaverseIcon = keyof typeof PhosphorIcons
export interface WeaverseIconProps extends HTMLAttributes<SVGElement> {
  name: WeaverseIcon
}

export interface TooltipProps {
  children: React.ReactNode
}
