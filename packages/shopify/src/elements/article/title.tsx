import React, { forwardRef, useContext } from 'react'
import { ArticleContext } from '~/elements/context'
import { WeaverseContext } from '@weaverse/react'
import type { ElementCSS } from '@weaverse/core'
import type { ArticleTitleProps } from '~/types'

let ArticleTitle = forwardRef<HTMLDivElement, ArticleTitleProps>(
  (props, ref) => {
    let { htmlTag, linkArticle, ...rest } = props
    let { ssrMode } = useContext(WeaverseContext)
    let { article, blogHandle } = useContext(ArticleContext)
    let articleHandle = ssrMode
      ? `{{ wv_article.handle }}`
      : `${blogHandle}/${article.handle}`
    let articleLink = `/blogs/${articleHandle}`
    let content = (
      <span>{ssrMode ? `{{ wv_article.title }}` : article.title}</span>
    )
    if (linkArticle && blogHandle) {
      content = (
        <a href={articleLink}>
          {ssrMode ? `{{ wv_article.title }}` : article.title}
        </a>
      )
    }
    return React.createElement(htmlTag, { ref, ...rest }, content)
  }
)

export let css: ElementCSS = {
  '@desktop': {
    fontSize: 20,
    // margin: 0,
    a: {
      all: 'inherit',
      cursor: 'pointer',
    },
  },
}

ArticleTitle.defaultProps = {
  htmlTag: 'h3',
  linkArticle: true,
}

export default ArticleTitle
