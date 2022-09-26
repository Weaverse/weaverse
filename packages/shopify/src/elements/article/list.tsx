import type { ElementCSS, TODO } from '@weaverse/core'
import React, { forwardRef } from 'react'
import { BlogContext, weaverseShopifyBlogs } from '../context'

let ArticleList = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { blogId, blogHandle, children, ...rest } = props
  let articleIds = weaverseShopifyBlogs[blogId]
  return (
    <div ref={ref} {...props}>
      {!articleIds
        ? `Select blog`
        : articleIds.map((articleId: number) => {
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
}

export let permanentCss: ElementCSS = {
  '@desktop': {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gridGap: '1rem',
  },
}

export default ArticleList
