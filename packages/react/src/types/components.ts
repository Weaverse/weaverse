import type { DialogContentProps } from '@radix-ui/react-dialog'
import type { KeenSliderInstance } from 'keen-slider'
import type { CSSProperties, HTMLAttributes } from 'react'
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

export interface SliderProps {
  children: React.ReactNode
  className?: string
  gap?: number
  arrowOffset: number
}

export interface SliderArrowsProps {
  currentSlide: number
  instanceRef: React.MutableRefObject<KeenSliderInstance | null>
  offset: number
  className?: string
}

export interface SliderDotsProps {
  currentSlide: number
  instanceRef: React.MutableRefObject<KeenSliderInstance | null>
  className?: string
}

export interface OverlayProps {
  enableOverlay: boolean
  overlayOpacity: number
  className?: string
}

export interface BackgroundProps {
  backgroundColor?: string
  backgroundImage?: string
  backgroundFit?: CSSProperties['objectFit']
  backgroundPosition?: CSSProperties['objectPosition']
  className?: string
}
