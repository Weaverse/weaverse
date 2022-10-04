import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef, useContext } from 'react'
import { BlogContext, weaverseShopifyBlogs } from '../context'
import type { ArticleListProps } from '~/types'
import { WeaverseContext } from '@weaverse/react'

let ArticleList = forwardRef<HTMLDivElement, ArticleListProps>((props, ref) => {
  let { blogId, blogHandle, itemsPerSlide, articleNumber, children, ...rest } =
    props
  let articleIds = weaverseShopifyBlogs[blogId] || []
  let styles = {
    ['--items-per-slide']: itemsPerSlide,
  } as React.CSSProperties
  let { ssrMode } = useContext(WeaverseContext)
  if (ssrMode) {
    return (
      <div ref={ref} {...rest} style={styles}>
        {` {% for wv_article in blogs['${blogHandle}'].articles %} `}
        {children}
        {` {% endfor %} `}
      </div>
    )
  }
  return (
    <div ref={ref} {...rest} style={styles}>
      {!blogId
        ? `Select blog`
        : articleIds.slice(0, articleNumber).map((articleId: number) => {
            return (
              <BlogContext.Provider
                key={articleId}
                value={{
                  articleId,
                  blogHandle,
                }}
              >
                {children}
              </BlogContext.Provider>
            )
          })}
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {},
}

ArticleList.defaultProps = {
  blogId: 84781203640,
  blogHandle: 'news',
  articleNumber: 4,
  itemsPerSlide: 4,
}

export let permanentCss: ElementCSS = {
  '@desktop': {
    display: 'grid',
    gridTemplateColumns: 'repeat(var(--items-per-slide), 1fr)',
    gap: 8,
    '& [data-wv-type]:not(:last-child)': {
      marginBottom: 8,
    },
    '& [data-wv-type="article-title"]': {
      flex: 1,
    },
  },
}

export default ArticleList
