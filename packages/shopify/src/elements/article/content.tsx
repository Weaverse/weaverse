import type { ElementCSS, TODO } from '@weaverse/core'
import React, { forwardRef, useContext } from 'react'
import { WeaverseContext } from '@weaverse/react'
import { ArticleContext } from '~/elements/context'

let ArticleContent = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props

  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  let { article, articleId } = useContext(ArticleContext)

  let html = ssrMode
    ? `{{ article_${articleId}.content }}`
    : article?.summary_html
  return (
    <div ref={ref} {...rest}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    overflow: 'hidden',
  },
}

export default ArticleContent
