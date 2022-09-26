import type { TODO } from '@weaverse/core'
import React, { forwardRef } from 'react'

let ArticleContent = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  return (
    <div ref={ref} {...props}>
      Article Content
    </div>
  )
})

export default ArticleContent
