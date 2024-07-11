import React, { forwardRef, type HTMLAttributes } from 'react'
import type { HydrogenComponentProps, HydrogenComponentSchema } from '~/types'

/*
  Main is the default Weaverse component that is used to render the main content.
  This component wraps all the sections/components inside a Weaverse page.
*/
let Main = forwardRef<
  HTMLDivElement,
  HydrogenComponentProps & HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  let { children, dangerouslySetInnerHTML, ...rest } = props

  return (
    <div
      ref={ref}
      {...rest}
      // biome-ignore lint/correctness/noChildrenProp: <explanation>
      children={children}
      // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: <explanation>
      dangerouslySetInnerHTML={children ? undefined : dangerouslySetInnerHTML}
    />
  )
})

export default Main

export let schema: HydrogenComponentSchema = {
  type: 'main',
  title: 'Main',
  inspector: [],
}
