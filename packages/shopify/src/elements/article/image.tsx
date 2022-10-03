import React, { forwardRef, useContext } from 'react'
import type { ElementCSS } from '@weaverse/core'
import { WeaverseContext } from '@weaverse/react'
import { ArticleContext } from '~/elements/context'
import type { ArticleImageProps } from '~/types'
let PLACEHOLDER_IMAGE_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 525.5 525.5">
    <path d="M324.5 212.7H203c-1.6 0-2.8 1.3-2.8 2.8V308c0 1.6 1.3 2.8 2.8 2.8h121.6c1.6 0 2.8-1.3 2.8-2.8v-92.5c0-1.6-1.3-2.8-2.9-2.8zm1.1 95.3c0 .6-.5 1.1-1.1 1.1H203c-.6 0-1.1-.5-1.1-1.1v-92.5c0-.6.5-1.1 1.1-1.1h121.6c.6 0 1.1.5 1.1 1.1V308z" />
    <path d="M210.4 299.5H240v.1s.1 0 .2-.1h75.2v-76.2h-105v76.2zm1.8-7.2l20-20c1.6-1.6 3.8-2.5 6.1-2.5s4.5.9 6.1 2.5l1.5 1.5 16.8 16.8c-12.9 3.3-20.7 6.3-22.8 7.2h-27.7v-5.5zm101.5-10.1c-20.1 1.7-36.7 4.8-49.1 7.9l-16.9-16.9 26.3-26.3c1.6-1.6 3.8-2.5 6.1-2.5s4.5.9 6.1 2.5l27.5 27.5v7.8zm-68.9 15.5c9.7-3.5 33.9-10.9 68.9-13.8v13.8h-68.9zm68.9-72.7v46.8l-26.2-26.2c-1.9-1.9-4.5-3-7.3-3s-5.4 1.1-7.3 3l-26.3 26.3-.9-.9c-1.9-1.9-4.5-3-7.3-3s-5.4 1.1-7.3 3l-18.8 18.8V225h101.4z" />
    <path d="M232.8 254c4.6 0 8.3-3.7 8.3-8.3s-3.7-8.3-8.3-8.3-8.3 3.7-8.3 8.3 3.7 8.3 8.3 8.3zm0-14.9c3.6 0 6.6 2.9 6.6 6.6s-2.9 6.6-6.6 6.6-6.6-2.9-6.6-6.6 3-6.6 6.6-6.6z" />
  </svg>
)
let ArticleImage = forwardRef<HTMLDivElement, ArticleImageProps>(
  (props, ref) => {
    let { aspectRatio, linkArticle, ...rest } = props
    let { ssrMode } = useContext(WeaverseContext)
    let { article, blogHandle } = useContext(ArticleContext)
    let src = article?.image?.src
    let articleHandle = ssrMode ? `{{ wv_article.handle }}` : article?.handle
    let articleLink = `/blogs/${blogHandle}/${articleHandle}`
    let styles = {
      ['--aspect-ratio']: aspectRatio,
    } as React.CSSProperties
    let content = ssrMode ? (
      <img
        src={`{{ wv_article.image.src }}`}
        alt={`{{ wv_article.image.alt }}`}
      />
    ) : src ? (
      <img src={src} alt={article?.image?.alt} />
    ) : (
      PLACEHOLDER_IMAGE_SVG
    )

    return (
      <div ref={ref} {...rest} style={styles}>
        {linkArticle ? <a href={articleLink}>{content}</a> : content}
      </div>
    )
  }
)

export let css: ElementCSS = {}

export let permanentCss: ElementCSS = {
  '@desktop': {
    'img, svg': {
      width: '100%',
      aspectRatio: 'var(--aspect-ratio, 4/3)',
      objectFit: 'contain',
    },
  },
}

ArticleImage.defaultProps = {
  linkArticle: true,
  aspectRatio: '4/3',
}

export default ArticleImage
