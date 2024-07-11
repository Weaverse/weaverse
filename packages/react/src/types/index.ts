import type { ElementCSS, Weaverse, WeaverseItemStore } from '@weaverse/core'
import type { ReactElement, ReactNode } from 'react'

export interface WeaverseElementProps extends Partial<ReactElement> {
  css?: ElementCSS
  children?: ReactElement | ReactElement[] | ReactNode | ReactNode[]
  className?: string
  'data-wv-id'?: string
}

export type WeaverseRootPropsType = { context: Weaverse }

export type ItemComponentProps = {
  instance: InstanceType<typeof WeaverseItemStore>
}
