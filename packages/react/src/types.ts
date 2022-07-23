import type {
  Weaverse,
  WeaverseElementCSS,
  WeaverseItemStore,
} from '@weaverse/core'
import { ReactElement, ReactNode } from 'react'

export interface WeaverseElementProps extends ReactElement {
  css?: WeaverseElementCSS
  children?: ReactElement | ReactElement[] | ReactNode | ReactNode[]
}

export type WeaverseRootPropsType = { context: Weaverse }

export type ItemComponentProps = {
  instance: InstanceType<typeof WeaverseItemStore>
}

//////////// Element types
// Button
export interface ButtonElementProps extends WeaverseElementProps {
  value: string
  openInNewTab: boolean
  target: string
  type: 'button' | 'submit' | 'reset'
}

// Container
export interface ContainerElementProps extends WeaverseElementProps {
  TODO?: any
}

// Image
export interface ImageElementProps extends WeaverseElementProps {
  src: string
  alt: string
}

// Layout
export interface LayoutElementProps extends WeaverseElementProps {
  gridSize: number
  rows: number
  columns: number
  gap: number
  rowSize: number
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

// Video
export interface VideoElementProps extends WeaverseElementProps {
  src: string
  poster: string
  loop: boolean
  type: string
  controls: boolean
  autoPlay: boolean
  muted: boolean
}

// Countdown
export type CountdownTimeKey = 'days' | 'hours' | 'minutes' | 'seconds'

export interface CountdownElementProps extends WeaverseElementProps {
  timerType: 'fixed-time' | 'evergreen'
  startTime: number
  endTime: number
  periods: number
  redirectUrl: string
  openInNewTab: boolean
  showLabel: boolean
  showColon: boolean
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
  media_type: 'IMAGE' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption: string
}
