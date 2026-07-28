import type { ElementCSS, Weaverse, WeaverseItemStore } from '@weaverse/core'
import type { ReactElement, ReactNode } from 'react'

/** Common props accepted by React components rendered by Weaverse. */
export interface WeaverseElementProps extends Partial<ReactElement> {
  /** React content rendered inside the element. */
  children?: ReactElement | ReactElement[] | ReactNode | ReactNode[]
  /** CSS class names applied to the element. */
  className?: string
  /** Responsive CSS values configured for the element. */
  css?: ElementCSS
  /** Weaverse item ID associated with the rendered element. */
  'data-wv-id'?: string
}

/** Props for the root Weaverse React renderer. */
export type WeaverseRootPropsType = {
  /** Weaverse runtime that owns the rendered content tree. */
  context: Weaverse
}

/** Props used to render a registered component from its item store. */
export type ItemComponentProps = {
  /** Store instance containing the item's data and subscriptions. */
  instance: InstanceType<typeof WeaverseItemStore>
}
