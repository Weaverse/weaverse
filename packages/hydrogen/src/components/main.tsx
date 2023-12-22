import React, { forwardRef } from 'react'

import type { HydrogenComponentProps, HydrogenComponentSchema } from '~/types'

interface MainProps extends HydrogenComponentProps {
  dangerouslySetInnerHTML: any
}

/*
  Main is the default Weaverse component that is used to render the main content.
  This component wraps all the sections/components inside a Weaverse page.
*/
let Main = forwardRef<HTMLDivElement, MainProps>((props, ref) => {
  let { children, dangerouslySetInnerHTML, ...rest } = props

  return (
    // eslint-disable-next-line react/no-danger-with-children
    <div
      ref={ref}
      {...rest}
      children={children}
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
