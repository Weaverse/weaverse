import type { Weaverse, WeaverseItemStore } from '@weaverse/core'

export interface WeaverseElementProps {
  children?: React.ReactNode
}

export type WeaverseRootPropsType = { context: Weaverse }

export type ItemComponentProps = {
  instance: InstanceType<typeof WeaverseItemStore>
}

// Element types
export type CountdownTimeKey = 'days' | 'hours' | 'minutes' | 'seconds'

export type InstagramMedia = {
  id: string
  media_type: 'IMAGE' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption: string
}
