import type { DialogContentProps } from '@radix-ui/react-dialog'
import type { WeaverseElementProps, WeaverseImage } from '@weaverse/react'
import type { KeenSliderInstance } from 'keen-slider'
import type {
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react'
import type * as PhosphorIcons from '~/components/icons/phosphor'

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
  slidesPerView: number
}

export interface SliderArrowsProps {
  currentSlide: number
  instanceRef: React.MutableRefObject<KeenSliderInstance | null>
  offset: number
  icon: 'caret' | 'arrow'
  className?: string
}

export interface SliderDotsProps {
  currentSlide: number
  instanceRef: React.MutableRefObject<KeenSliderInstance | null>
  className?: string
  absolute?: boolean
  position?: 'top' | 'bottom' | 'left' | 'right'
  color: 'light' | 'dark'
}

export interface OverlayProps {
  enableOverlay: boolean
  overlayOpacity: number
  className?: string
}

export interface BackgroundProps {
  backgroundColor?: string
  backgroundImage?: string | WeaverseImage
  backgroundFit?: CSSProperties['objectFit']
  backgroundPosition?: CSSProperties['objectPosition']
  className?: string
}

//////////// Element types
// Placeholder
export interface PlaceholderProps {
  element: string
  children: ReactElement | ReactElement[] | ReactNode | ReactNode[]
  style?: CSSProperties
  className?: string
}

// Button
export interface ButtonElementProps extends WeaverseElementProps {
  type: 'button' | 'submit' | 'reset'
  text: string
  clickAction: 'none' | 'openLink'
  linkTo: string
  openInNewTab: boolean
}

// Container
export interface ContainerElementProps extends WeaverseElementProps {
  [key: string]: any
}

// Image
export interface ImageElementProps extends WeaverseElementProps {
  src: string
  alt: string
  objectFit: CSSProperties['objectFit']
  objectPosition: CSSProperties['objectPosition']
  clickAction: 'none' | 'openLightbox' | 'openLink'
  linkTo?: string
  openInNewTab?: boolean
}

// GridContentElement
export interface GridContentElementProps extends WeaverseElementProps {
  rows: number
  columns: number
  gap: number
  rowSize: number
}

interface BackgroundDataProps {
  backgroundColor?: string
  backgroundImage?: string
  objectFit?: CSSProperties['objectFit']
  objectPosition?: CSSProperties['objectPosition']
  /** @deprecated no more use but still reserved for old element */
  backgroundPosition?: CSSProperties['backgroundPosition']
  /** @deprecated no more use but still reserved for old element */
  backgroundFit?: CSSProperties['objectFit']
}

// Layout
export interface LayoutElementProps
  extends BackgroundDataProps,
    WeaverseElementProps {
  contentSize: number
  gridSize: number
  rows: number
  columns: number
  gap: number
  rowSize: number
  enableOverlay: boolean
  overlayOpacity: number
}

export interface LayoutBackgroundProps {
  imgUrl?: string
  bgColor?: string
  objectFit?: CSSProperties['objectFit']
  objectPosition?: CSSProperties['objectPosition']
}

// Map
export interface MapElementProps extends WeaverseElementProps {
  place: string
  zoom: number
}

// Text
export interface TextElementProps extends WeaverseElementProps {
  value: string
}

export interface ScrollingTextElementProps extends WeaverseElementProps {
  value: string
  gap: number
  speed: number
  pauseOnHover: boolean
}

export interface VideoCommonProps {
  src: string
  type?: string
  poster: string
  loop: boolean
  controls: boolean
  autoPlay: boolean
  muted: boolean
}

// Video
export type VideoElementProps = VideoCommonProps & WeaverseElementProps

export interface YoutubeElementProps extends VideoCommonProps {
  youtubeId: string
}

export interface VimeoElementProps extends VideoCommonProps {
  vimeoId: string
}

// Countdown
export type CountdownTimeKey = 'days' | 'hours' | 'minutes' | 'seconds'

export type CountdownTimerType = 'fixed-time' | 'evergreen'

export interface CountdownElementProps extends WeaverseElementProps {
  timerType: CountdownTimerType
  startTime: number
  endTime: number
  periods: number
  redirectWhenTimerStops: boolean
  redirectUrl: string
  openInNewTab: boolean
  showLabel: boolean
  showColon: boolean
}

export type TimerBlockProps = {
  label: string
  value: string | number
}

// Instagram
export interface InstagramElementProps extends WeaverseElementProps {
  token: string
  username: string
  numberOfImages: number
  imagesPerRow: number
  gap: number
}

export type InstagramMedia = {
  id: string
  media_type: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO'
  media_url: string
  permalink: string
  caption: string
  thumbnail_url: string
}

export interface SlideshowProps extends WeaverseElementProps {
  animation: 'slide' | 'fade'
  slidesPerView: number
  spacing: number
  showArrows: boolean
  showArrowsOnHover: boolean
  arrowIcon: 'caret' | 'arrow'
  arrowsColor: 'light' | 'dark'
  showDots: boolean
  dotsPosition: 'top' | 'bottom' | 'left' | 'right'
  dotsColor: 'light' | 'dark'
  loop: boolean
  autoRotate: boolean
  changeSlidesEvery: number
}

export interface SlideProps
  extends WeaverseElementProps,
    BackgroundDataProps,
    OverlayProps {
  contentPosition: string
  children: ReactElement[]
}
