import type { Weaverse, WeaverseItemStore } from '@weaverse/core'

export interface WeaverseElementProps {
  children?: React.ReactNode
}

export type WeaverseRootPropsType = { context: Weaverse }

export type CountdownTimeKey = 'days' | 'hours' | 'minutes' | 'seconds'

export type ItemComponentProps = {
  instance: InstanceType<typeof WeaverseItemStore>
}
