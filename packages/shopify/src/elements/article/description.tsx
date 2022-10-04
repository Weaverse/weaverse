import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef, useContext } from 'react'
import { WeaverseContext } from '@weaverse/react'
import { ArticleContext } from '~/elements/context'

let ArticleDescription = forwardRef<HTMLDivElement>((props, ref) => {
  let { ...rest } = props

  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  let { article } = useContext(ArticleContext)

  let html = ssrMode ? `{{ wv_article.excerpt }}` : article?.summary_html
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

export default ArticleDescription
