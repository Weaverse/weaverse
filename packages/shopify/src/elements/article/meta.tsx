import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef, useContext } from 'react'
import { WeaverseContext } from '@weaverse/react'
import { ArticleContext } from '~/elements/context'

let ArticleMeta = forwardRef<HTMLDivElement>((props, ref) => {
  let { ...rest } = props

  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  let { article, articleId } = useContext(ArticleContext)
  let date = article?.published_at
    ? new Date(article?.published_at)
        .toDateString()
        .split(' ')
        .slice(1)
        .join(' ')
    : ''
  let html = ssrMode
    ? `by <b>{{ wv_article.author }}</b> on <b>{{ wv_article.published_at | date }}</b>`
    : `by <b>${article?.author}</b> on <b>${date}</b>`
  return (
    <div ref={ref} {...rest}>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {},
}

export default ArticleMeta
