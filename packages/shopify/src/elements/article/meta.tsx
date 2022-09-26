import type { TODO } from '@weaverse/core'
import React, { forwardRef } from 'react'

let ArticleMeta = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  return (
    <div ref={ref} {...props}>
      Article Meta
    </div>
  )
})

export default ArticleMeta
