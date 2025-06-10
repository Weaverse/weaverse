import { createSchema, type SchemaType } from '@weaverse/schema'
import type { HTMLAttributes } from 'react'
import type { HydrogenComponentProps } from '~/types'

/*
  Main is the default Weaverse component that is used to render the main content.
  This component wraps all the sections/components inside a Weaverse page.
*/
function Main(props: HydrogenComponentProps & HTMLAttributes<HTMLDivElement>) {
  let { children, dangerouslySetInnerHTML, ...rest } = props

  return (
    <div
      {...rest}
      // biome-ignore lint/correctness/noChildrenProp: <explanation>
      children={children}
      // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: <explanation>
      dangerouslySetInnerHTML={children ? undefined : dangerouslySetInnerHTML}
    />
  )
}

export default Main

export let schema: SchemaType = createSchema({
  type: 'main',
  title: 'Main',
})
