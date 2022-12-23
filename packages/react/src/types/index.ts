import type { Weaverse, ElementCSS, WeaverseItemStore } from '@weaverse/core'
import type { CSSProperties, ReactElement, ReactNode } from 'react'

export * from './components'

export interface WeaverseElementProps extends ReactElement {
  css?: ElementCSS
  ['data-wv-type']: string
  ['data-wv-id']: string
  children?: ReactElement | ReactElement[] | ReactNode | ReactNode[]
  className?: string
}

export type WeaverseRootPropsType = { context: Weaverse }

export type ItemComponentProps = {
  instance: InstanceType<typeof WeaverseItemStore>
}

//////////// Element types
// Placeholder
export interface PlaceholderProps {
  element: string
  children: ReactElement | ReactElement[] | ReactNode | ReactNode[]
  style?: CSSProperties
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
  objectFit: 'contain' | 'cover'
  objectPosition:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'center'
    | 'center left'
    | 'center right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
  clickAction: 'none' | 'openLightbox' | 'openLink'
  linkTo?: string
  openLinkInNewTab?: boolean
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
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
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
