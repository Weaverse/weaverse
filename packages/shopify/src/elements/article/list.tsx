import type { TODO } from '@weaverse/core'
import React, { forwardRef } from 'react'
import { BlogContext, weaverseShopifyArticles } from '../context'

let ArticleList = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { blogId, children, ...rest } = props
  let articleIds = weaverseShopifyArticles[blogId]
  return (
    <div ref={ref} {...props}>
      Article List
      {articleIds.map((articleId: number) => {
        return (
          <BlogContext.Provider
            key={articleId}
            value={{
              articleId,
            }}
          >
            {children}
          </BlogContext.Provider>
        )
      })}
    </div>
  )
})

ArticleList.defaultProps = {
  blogId: 7176137277624,
  blogHandle: 'adidas-kids-stan-smith',
}

export default ArticleList
