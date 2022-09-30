import React, { forwardRef, useContext } from 'react'
import type { ElementCSS } from '@weaverse/core'
import { WeaverseContext } from '@weaverse/react'
import { ArticleContext } from '~/elements/context'
import type { ArticleImageProps } from '~/types'
let PLACEHOLDER_IMG =
  'https://ucarecdn.com/04c4766e-7ea7-4af5-9941-64f0c9ffa86b/placeholderimagesimage_large.webp'
let ArticleImage = forwardRef<HTMLDivElement, ArticleImageProps>(
  (props, ref) => {
    let { linkArticle, ...rest } = props
    let weaverseContext = useContext(WeaverseContext)
    let { ssrMode } = weaverseContext
    let { article, articleId, blogHandle } = useContext(ArticleContext)
    let src = article?.image?.src || PLACEHOLDER_IMG
    let content = ssrMode ? (
      <img
        src={`{{ article${articleId}.image.src }}`}
        alt={`{{ article${articleId}.image.alt }}`}
      />
    ) : (
      <img src={src} alt={article?.image?.alt} />
    )
    return (
      <div ref={ref} {...rest}>
        {linkArticle ? (
          <a href={`/blogs/${blogHandle}/${article.handle}`}>{content}</a>
        ) : (
          content
        )}
      </div>
    )
  }
)

export let css: ElementCSS = {
  '@desktop': {
    img: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
  },
}

ArticleImage.defaultProps = {
  linkArticle: true,
}

export default ArticleImage
