import type { TODO } from '@weaverse/core'
import React, { forwardRef, useContext } from 'react'
import { ArticleContext } from '~/elements/context'
import { WeaverseContext } from '@weaverse/react'

let ArticleTitle = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  let { article, articleId } = useContext(ArticleContext)
  return (
    <div ref={ref} {...rest}>
      {ssrMode ? `{{ article_${articleId.title}}` : article.title}
    </div>
  )
})

export default ArticleTitle
