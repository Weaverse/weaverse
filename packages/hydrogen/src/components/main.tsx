import { createSchema, type SchemaType } from '@weaverse/schema'
import type { HTMLAttributes } from 'react'
import type { WeaverseComponentProps } from '../types'

/*
  Main is the default Weaverse component that is used to render the main content.
  This component wraps all the sections/components inside a Weaverse page.
*/
function Main(props: WeaverseComponentProps & HTMLAttributes<HTMLDivElement>) {
  let { children, dangerouslySetInnerHTML, ...rest } = props

  return (
    // oxlint-disable-next-line react/no-danger-with-children -- `dangerouslySetInnerHTML` is dropped whenever `children` is set
    <div
      {...rest}
      // oxlint-disable-next-line react/no-children-prop -- forwards the Weaverse children slot alongside `rest`
      children={children}
      dangerouslySetInnerHTML={children ? undefined : dangerouslySetInnerHTML}
    />
  )
}

export default Main

export let schema: SchemaType = createSchema({
  type: 'main',
  title: 'Main',
})
